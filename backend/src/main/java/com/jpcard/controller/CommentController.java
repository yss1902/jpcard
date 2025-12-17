package com.jpcard.controller;

import com.jpcard.controller.dto.CommentRequest;
import com.jpcard.controller.dto.CommentResponse;
import com.jpcard.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> list(@PathVariable Long postId) {
        List<CommentResponse> responses = commentService.findByPostId(postId).stream()
                .map(c -> new CommentResponse(c.getId(), c.getContent(), c.getPost().getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> create(@PathVariable Long postId, @RequestBody CommentRequest request) {
        var c = commentService.addComment(postId, request.content());
        return ResponseEntity.ok(new CommentResponse(c.getId(), c.getContent(), c.getPost().getId()));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
