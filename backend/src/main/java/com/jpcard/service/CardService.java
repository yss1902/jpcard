package com.jpcard.service;

import com.jpcard.domain.card.Card;
import com.jpcard.domain.deck.Deck;
import com.jpcard.repository.CardRepository;
import com.jpcard.repository.DeckRepository;
import com.jpcard.util.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final DeckRepository deckRepository;

    @Transactional(readOnly = true)
    public List<Card> findAll() {
        return cardRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Card> findByDeckId(Long deckId) {
        // I need to add findByDeckId to CardRepository first, or use simple filtering if list is small.
        // Better to add method to Repo.
        // For now, let's defer adding to repo and assume findAll filter, OR simpler:
        // Actually, I can't filter findAll() efficiently if I want pagination later.
        // Let's modify CardRepository in next step. For now I'll leave this unimplemented or use stream filter (inefficient but works for small app).
        // Wait, I can't use stream filter on Lazy loaded deck... well I can if I fetch all.
        // Ideally: return cardRepository.findAll().stream().filter(c -> c.getDeck() != null && c.getDeck().getId().equals(deckId)).toList();
        // But better to add method.
        return cardRepository.findAll().stream()
                .filter(c -> c.getDeck() != null && c.getDeck().getId().equals(deckId))
                .toList();
    }

    @Transactional
    public Card create(String term, String meaning, Long deckId) {
        Card card = new Card();
        card.setTerm(term);
        card.setMeaning(meaning);
        if (deckId != null) {
            Deck deck = deckRepository.findById(deckId)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck not found with id: " + deckId));
            card.setDeck(deck);
        }
        return cardRepository.save(card);
    }

    // Overload for backward compatibility if needed, or just replace usage
    @Transactional
    public Card create(String term, String meaning) {
        return create(term, meaning, null);
    }

    @Transactional(readOnly = true)
    public Card findById(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new com.jpcard.util.ResourceNotFoundException("Card not found with id: " + id));
    }

    @Transactional
    public Card update(Long id, String term, String meaning, Long deckId) {
        Card card = findById(id);
        card.setTerm(term);
        card.setMeaning(meaning);
        if (deckId != null) {
            Deck deck = deckRepository.findById(deckId)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck not found with id: " + deckId));
            card.setDeck(deck);
        } else {
            card.setDeck(null); // Optional: allow unassigning
        }
        return card;
    }

    @Transactional
    public Card update(Long id, String term, String meaning) {
        // Preserve existing deck if not specified? Or clear it?
        // For "Edit Card" page, we usually send all data.
        // If I keep this old method, I should probably not touch the deck.
        Card card = findById(id);
        card.setTerm(term);
        card.setMeaning(meaning);
        return card;
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
