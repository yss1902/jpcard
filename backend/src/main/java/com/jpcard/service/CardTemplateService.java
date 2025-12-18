package com.jpcard.service;

import com.jpcard.domain.deck.CardTemplate;
import com.jpcard.repository.CardTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardTemplateService implements CommandLineRunner {

    private final CardTemplateRepository templateRepository;

    @Transactional(readOnly = true)
    public List<CardTemplate> findAll() {
        return templateRepository.findAll();
    }

    @Transactional(readOnly = true)
    public CardTemplate findById(Long id) {
        return templateRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Template not found"));
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (templateRepository.count() == 0) {
            // Type 1: Term - Meaning (Basic)
            createTemplate("Basic", "[{\"key\":\"term\",\"label\":\"Term\",\"position\":\"FRONT\"},{\"key\":\"meaning\",\"label\":\"Meaning\",\"position\":\"BACK\"}]");

            // Type 2: Term - Pronunciation - Meaning
            createTemplate("Pronunciation", "[{\"key\":\"term\",\"label\":\"Term\",\"position\":\"FRONT\"},{\"key\":\"pronunciation\",\"label\":\"Pronunciation\",\"position\":\"BACK\"},{\"key\":\"meaning\",\"label\":\"Meaning\",\"position\":\"BACK\"}]");

            // Type 3: Term - Pronunciation - Meaning - Note
            createTemplate("Detailed", "[{\"key\":\"term\",\"label\":\"Term\",\"position\":\"FRONT\"},{\"key\":\"pronunciation\",\"label\":\"Pronunciation\",\"position\":\"BACK\"},{\"key\":\"meaning\",\"label\":\"Meaning\",\"position\":\"BACK\"},{\"key\":\"note\",\"label\":\"Note\",\"position\":\"BACK\"}]");
        }
    }

    private void createTemplate(String name, String structure) {
        CardTemplate t = new CardTemplate();
        t.setName(name);
        t.setStructureJson(structure);
        templateRepository.save(t);
    }
}
