package com.jpcard.service;

import com.jpcard.domain.card.Card;
import com.jpcard.domain.deck.Deck;
import com.jpcard.repository.CardRepository;
import com.jpcard.repository.DeckRepository;
import com.jpcard.util.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final ObjectMapper objectMapper;
    private final DeckRepository deckRepository;

    @Transactional(readOnly = true)
    public List<Card> search(Long deckId, Boolean memorized, String keyword) {
        return cardRepository.search(deckId, memorized, keyword);
    }

    @Transactional(readOnly = true)
    public List<Card> findAll() {
        return cardRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Card> findByDeckId(Long deckId) {
        return cardRepository.search(deckId, null, null);
    }

    @Transactional
    public Card create(String term, String meaning, Long deckId, Map<String, String> fields) {
        Card card = new Card();
        card.setTerm(term);
        card.setMeaning(meaning);

        if (fields != null) {
            try {
                card.setContentJson(objectMapper.writeValueAsString(fields));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize card fields", e);
            }
        }

        if (deckId != null) {
            Deck deck = deckRepository.findById(deckId)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck not found with id: " + deckId));
            card.setDeck(deck);
        }
        return cardRepository.save(card);
    }

    @Transactional
    public Card create(String term, String meaning) {
        return create(term, meaning, null, null);
    }

    @Transactional(readOnly = true)
    public Card findById(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new com.jpcard.util.ResourceNotFoundException("Card not found with id: " + id));
    }

    @Transactional
    public Card update(Long id, String term, String meaning, Long deckId, Map<String, String> fields) {
        Card card = findById(id);
        card.setTerm(term);
        card.setMeaning(meaning);

        if (fields != null) {
            try {
                card.setContentJson(objectMapper.writeValueAsString(fields));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize card fields", e);
            }
        }

        if (deckId != null) {
            Deck deck = deckRepository.findById(deckId)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck not found with id: " + deckId));
            card.setDeck(deck);
        } else {
            card.setDeck(null);
        }
        return card;
    }

    @Transactional
    public Card update(Long id, String term, String meaning) {
        Card card = findById(id);
        card.setTerm(term);
        card.setMeaning(meaning);
        return card;
    }

    public Map<String, String> parseContent(String json) {
        if (json == null || json.isEmpty()) return Collections.emptyMap();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyMap();
        }
    }

    @Transactional
    public void delete(Long id) {
        cardRepository.deleteById(id);
    }

    @Transactional
    public Card changeMemorizedStatus(Long id, boolean isMemorized) {
        Card card = findById(id);
        card.setMemorized(isMemorized);
        return card;
    }
}
