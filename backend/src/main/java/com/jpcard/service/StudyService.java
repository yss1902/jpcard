package com.jpcard.service;

import com.jpcard.domain.card.Card;
import com.jpcard.domain.study.StudyStatus;
import com.jpcard.domain.study.UserCardProgress;
import com.jpcard.domain.user.User;
import com.jpcard.repository.CardRepository;
import com.jpcard.repository.UserCardProgressRepository;
import com.jpcard.repository.UserRepository;
import com.jpcard.util.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final UserCardProgressRepository progressRepository;
    private final CardRepository cardRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Card> getDueCards(Long userId, Long deckId) {
        // 1. Get existing progress that is due
        List<UserCardProgress> dueProgress = progressRepository.findDueCards(userId, deckId, LocalDateTime.now());
        List<Card> dueCards = dueProgress.stream().map(UserCardProgress::getCard).collect(Collectors.toList());

        // 2. Get NEW cards (cards in deck that have NO progress record for this user)
        // Ideally limit this count (e.g. 10 new cards per day). For now, fetch all or a batch.
        // This query finds cards in deck NOT IN (progress for user)
        // Optimized: cardRepository.findNewCards(deckId, userId) -> needs custom query
        List<Card> newCards = cardRepository.findNewCards(deckId, userId);

        dueCards.addAll(newCards);
        return dueCards;
    }

    @Transactional
    public void processReview(Long userId, Long cardId, String rating) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        UserCardProgress progress = progressRepository.findByUserIdAndCardId(userId, cardId)
                .orElse(new UserCardProgress());

        if (progress.getId() == null) {
            progress.setUser(user);
            progress.setCard(card);
            progress.setStatus(StudyStatus.NEW);
        }

        applyAlgorithm(progress, rating);
        progressRepository.save(progress);
    }

    private void applyAlgorithm(UserCardProgress p, String rating) {
        // Algorithm based on prompt:
        // Fail: < 1 min
        // Hard: 10 min ~ 12 hours
        // Good: 1 ~ 3 days
        // Easy: > 30 days

        LocalDateTime now = LocalDateTime.now();

        switch (rating.toUpperCase()) {
            case "FAIL": // Again
                p.setStatus(StudyStatus.LEARNING);
                p.setIntervalMinutes(1); // < 1 min (re-queue immediately)
                p.setNextReview(now.plusMinutes(1));
                p.setRepetitions(0);
                p.setEase(Math.max(1.3, p.getEase() - 0.2));
                break;

            case "HARD":
                p.setStatus(StudyStatus.LEARNING);
                p.setIntervalMinutes(12 * 60); // 12 hours (simplified)
                p.setNextReview(now.plusHours(12));
                p.setRepetitions(0);
                p.setEase(Math.max(1.3, p.getEase() - 0.15));
                break;

            case "GOOD":
                p.setStatus(StudyStatus.REVIEW);
                int goodInterval = 1 * 24 * 60; // 1 day
                if (p.getRepetitions() > 0) {
                    // Standard SM-2 growth
                    goodInterval = (int) (p.getIntervalMinutes() * p.getEase());
                }
                p.setIntervalMinutes(Math.max(24 * 60, goodInterval)); // Min 1 day
                p.setNextReview(now.plusMinutes(p.getIntervalMinutes()));
                p.setRepetitions(p.getRepetitions() + 1);
                break;

            case "EASY":
                p.setStatus(StudyStatus.REVIEW);
                p.setIntervalMinutes(30 * 24 * 60); // 30 days
                p.setNextReview(now.plusDays(30));
                p.setRepetitions(p.getRepetitions() + 1);
                p.setEase(p.getEase() + 0.15);
                break;
        }
    }
}
