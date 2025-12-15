package com.jpcard.service;

import com.jpcard.domain.card.Card;
import com.jpcard.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    @Transactional(readOnly = true)
    public List<Card> findAll() {
        return cardRepository.findAll();
    }

    @Transactional
    public Card create(String term, String meaning) {
        Card card = new Card();
        card.setTerm(term);
        card.setMeaning(meaning);
        return cardRepository.save(card);
    }

    @Transactional(readOnly = true)
    public Card findById(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new com.jpcard.util.ResourceNotFoundException("Card not found with id: " + id));
    }

    @Transactional
    public Card update(Long id, String term, String meaning) {
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
