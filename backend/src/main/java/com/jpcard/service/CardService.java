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
}
