package com.jpcard.repository;

import com.jpcard.domain.deck.CardTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardTemplateRepository extends JpaRepository<CardTemplate, Long> {
}
