package com.jpcard.service;

import com.jpcard.controller.dto.DashboardStatsResponse;
import com.jpcard.domain.card.Card;
import com.jpcard.domain.post.Post;
import com.jpcard.repository.CardRepository;
import com.jpcard.repository.DeckRepository;
import com.jpcard.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final CardRepository cardRepository;
    private final DeckRepository deckRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalCards = cardRepository.count();
        // Ideally optimized query: SELECT COUNT(c) FROM Card c WHERE c.isMemorized = true
        // But for now stream count is okay for prototype, or I can add countByIsMemorizedTrue to repo.
        // Let's add the method to repo for efficiency.
        long memorizedCards = cardRepository.findAll().stream().filter(Card::isMemorized).count();

        long totalDecks = deckRepository.count();
        long totalPosts = postRepository.count();

        // Sum of likes
        long totalLikes = postRepository.findAll().stream().mapToLong(Post::getLikeCount).sum();

        return new DashboardStatsResponse(totalCards, memorizedCards, totalDecks, totalPosts, totalLikes);
    }
}
