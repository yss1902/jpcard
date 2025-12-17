package com.jpcard.service;

import com.jpcard.domain.card.Card;
import com.jpcard.domain.study.StudyStatus;
import com.jpcard.domain.study.UserCardProgress;
import com.jpcard.domain.user.User;
import com.jpcard.repository.CardRepository;
import com.jpcard.repository.UserCardProgressRepository;
import com.jpcard.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class StudyServiceTest {

    @Mock private UserCardProgressRepository progressRepository;
    @Mock private CardRepository cardRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private StudyService studyService;

    @Test
    void processReview_NewFail() {
        User user = new User(); user.setId(1L);
        Card card = new Card(); card.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cardRepository.findById(1L)).thenReturn(Optional.of(card));
        when(progressRepository.findByUserIdAndCardId(1L, 1L)).thenReturn(Optional.empty());

        studyService.processReview(1L, 1L, "FAIL");

        verify(progressRepository).save(argThat(p ->
            p.getStatus() == StudyStatus.LEARNING &&
            p.getIntervalMinutes() == 1 &&
            p.getRepetitions() == 0
        ));
    }

    @Test
    void processReview_LearningGood() {
        User user = new User(); user.setId(1L);
        Card card = new Card(); card.setId(1L);
        UserCardProgress progress = new UserCardProgress();
        progress.setUser(user);
        progress.setCard(card);
        progress.setStatus(StudyStatus.LEARNING);
        progress.setEase(2.5);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cardRepository.findById(1L)).thenReturn(Optional.of(card));
        when(progressRepository.findByUserIdAndCardId(1L, 1L)).thenReturn(Optional.of(progress));

        studyService.processReview(1L, 1L, "GOOD");

        verify(progressRepository).save(argThat(p ->
            p.getStatus() == StudyStatus.REVIEW &&
            p.getIntervalMinutes() >= 1440 && // Min 1 day
            p.getRepetitions() == 1
        ));
    }
}
