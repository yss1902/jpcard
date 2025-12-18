package com.jpcard.service;

import com.jpcard.domain.deck.Deck;
import com.jpcard.repository.CardTemplateRepository;
import com.jpcard.repository.DeckRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class DeckServiceTest {

    @Mock
    private DeckRepository deckRepository;
    @Mock
    private CardTemplateRepository templateRepository;

    @InjectMocks
    private DeckService deckService;

    @Test
    void createDeck() {
        Deck deck = new Deck();
        deck.setId(1L);
        deck.setName("Test Deck");
        deck.setDescription("Description");

        when(deckRepository.save(any(Deck.class))).thenReturn(deck);
        when(templateRepository.findById(1L)).thenReturn(Optional.empty());

        Deck created = deckService.create("Test Deck", "Description", null);

        assertNotNull(created);
        assertEquals("Test Deck", created.getName());
        verify(deckRepository).save(any(Deck.class));
    }

    @Test
    void updateDeck() {
        Deck deck = new Deck();
        deck.setId(1L);
        deck.setName("Old Name");

        when(deckRepository.findById(1L)).thenReturn(Optional.of(deck));

        Deck updated = deckService.update(1L, "New Name", "New Desc", null);

        assertEquals("New Name", updated.getName());
        verify(deckRepository).findById(1L);
    }
}
