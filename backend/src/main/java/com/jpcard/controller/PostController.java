package com.jpcard.controller;

import com.jpcard.controller.dto.PostRequest;
import com.jpcard.controller.dto.PostResponse;
import com.jpcard.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> list() {
        List<PostResponse> responses = postService.findAll().stream()
                .map(post -> new PostResponse(post.getId(), post.getTitle(), post.getContent()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<PostResponse> create(@RequestBody PostRequest request) {
        var post = postService.create(request.title(), request.content());
        return ResponseEntity.ok(new PostResponse(post.getId(), post.getTitle(), post.getContent()));
    }
}
