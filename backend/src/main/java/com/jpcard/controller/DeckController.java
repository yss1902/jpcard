package com.jpcard.controller;

import com.jpcard.controller.dto.DeckRequest;
import com.jpcard.controller.dto.DeckResponse;
import com.jpcard.service.DeckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/decks")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;

    @GetMapping
    public ResponseEntity<List<DeckResponse>> list() {
        List<DeckResponse> responses = deckService.findAll().stream()
                .map(d -> new DeckResponse(d.getId(), d.getName(), d.getDescription()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeckResponse> get(@PathVariable Long id) {
        var d = deckService.findById(id);
        return ResponseEntity.ok(new DeckResponse(d.getId(), d.getName(), d.getDescription()));
    }

    @PostMapping
    public ResponseEntity<DeckResponse> create(@RequestBody DeckRequest request) {
        var d = deckService.create(request.name(), request.description());
        return ResponseEntity.ok(new DeckResponse(d.getId(), d.getName(), d.getDescription()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeckResponse> update(@PathVariable Long id, @RequestBody DeckRequest request) {
        var d = deckService.update(id, request.name(), request.description());
        return ResponseEntity.ok(new DeckResponse(d.getId(), d.getName(), d.getDescription()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deckService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
