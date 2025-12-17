package com.jpcard.service;

import com.jpcard.controller.dto.DashboardStatsResponse;
import com.jpcard.repository.CardRepository;
import com.jpcard.repository.DeckRepository;
import com.jpcard.repository.PostRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock private CardRepository cardRepository;
    @Mock private DeckRepository deckRepository;
    @Mock private PostRepository postRepository;

    @InjectMocks private StatsService statsService;

    @Test
    void getStats() {
        when(cardRepository.count()).thenReturn(10L);
        when(deckRepository.count()).thenReturn(2L);
        when(postRepository.count()).thenReturn(5L);
        when(cardRepository.findAll()).thenReturn(Collections.emptyList()); // Simplified for memorized count
        when(postRepository.findAll()).thenReturn(Collections.emptyList()); // Simplified for likes count

        DashboardStatsResponse stats = statsService.getDashboardStats();

        assertEquals(10L, stats.totalCards());
        assertEquals(2L, stats.totalDecks());
        assertEquals(5L, stats.totalPosts());
        assertEquals(0L, stats.memorizedCards());
    }
}
