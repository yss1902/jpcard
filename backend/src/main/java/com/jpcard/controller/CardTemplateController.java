package com.jpcard.controller;

import com.jpcard.controller.dto.TemplateResponse;
import com.jpcard.service.CardTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class CardTemplateController {

    private final CardTemplateService templateService;

    @GetMapping
    public ResponseEntity<List<TemplateResponse>> list() {
        List<TemplateResponse> responses = templateService.findAll().stream()
                .map(t -> new TemplateResponse(t.getId(), t.getName(), t.getStructureJson()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
