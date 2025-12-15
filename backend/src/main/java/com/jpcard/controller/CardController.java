package com.jpcard.controller;

import com.jpcard.controller.dto.CardRequest;
import com.jpcard.controller.dto.CardResponse;
import com.jpcard.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping
    public ResponseEntity<List<CardResponse>> list() {
        List<CardResponse> responses = cardService.findAll().stream()
                .map(card -> new CardResponse(card.getId(), card.getTerm(), card.getMeaning(), card.isMemorized()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponse> get(@PathVariable Long id) {
        var card = cardService.findById(id);
        return ResponseEntity.ok(new CardResponse(card.getId(), card.getTerm(), card.getMeaning(), card.isMemorized()));
    }

    @PostMapping
    public ResponseEntity<CardResponse> create(@RequestBody CardRequest request) {
        var card = cardService.create(request.term(), request.meaning());
        return ResponseEntity.ok(new CardResponse(card.getId(), card.getTerm(), card.getMeaning(), card.isMemorized()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardResponse> update(@PathVariable Long id, @RequestBody CardRequest request) {
        var card = cardService.update(id, request.term(), request.meaning());
        return ResponseEntity.ok(new CardResponse(card.getId(), card.getTerm(), card.getMeaning(), card.isMemorized()));
    }

    @PatchMapping("/{id}/memorized")
    public ResponseEntity<CardResponse> updateMemorizedStatus(@PathVariable Long id, @RequestBody boolean isMemorized) {
        var card = cardService.changeMemorizedStatus(id, isMemorized);
        return ResponseEntity.ok(new CardResponse(card.getId(), card.getTerm(), card.getMeaning(), card.isMemorized()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
