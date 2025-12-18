package com.jpcard.controller;

import com.jpcard.controller.dto.CardResponse;
import com.jpcard.controller.dto.ReviewRequest;
import com.jpcard.domain.user.User;
import com.jpcard.service.CardService;
import com.jpcard.service.StudyService;
import com.jpcard.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;
    private final UserService userService; // To resolve User ID from Auth
    private final CardService cardService;

    @GetMapping("/due")
    public ResponseEntity<List<CardResponse>> getDueCards(@RequestParam Long deckId, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        User user = userService.findByUsername(authentication.getName()).orElseThrow();

        var cards = studyService.getDueCards(user.getId(), deckId);

        List<CardResponse> responses = cards.stream()
                .map(card -> new CardResponse(card.getId(), card.getTerm(), card.getMeaning(), card.isMemorized(), card.getDeck().getId(), cardService.parseContent(card.getContentJson())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/review")
    public ResponseEntity<Void> reviewCard(@RequestBody ReviewRequest request, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        User user = userService.findByUsername(authentication.getName()).orElseThrow();

        studyService.processReview(user.getId(), request.cardId(), request.rating());
        return ResponseEntity.ok().build();
    }
}
