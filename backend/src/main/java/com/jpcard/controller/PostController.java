package com.jpcard.controller;

import com.jpcard.controller.dto.PostRequest;
import com.jpcard.controller.dto.PostResponse;
import com.jpcard.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.jpcard.domain.post.Post;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> list(@RequestParam(required = false) String q) {
        List<Post> posts = postService.search(q);
        List<PostResponse> responses = posts.stream()
                .map(post -> new PostResponse(post.getId(), post.getTitle(), post.getContent()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> get(@PathVariable Long id) {
        var post = postService.findById(id);
        return ResponseEntity.ok(new PostResponse(post.getId(), post.getTitle(), post.getContent()));
    }

    @PostMapping
    public ResponseEntity<PostResponse> create(@RequestBody PostRequest request) {
        var post = postService.create(request.title(), request.content());
        return ResponseEntity.ok(new PostResponse(post.getId(), post.getTitle(), post.getContent()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> update(@PathVariable Long id, @RequestBody PostRequest request) {
        var post = postService.update(id, request.title(), request.content());
        return ResponseEntity.ok(new PostResponse(post.getId(), post.getTitle(), post.getContent()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
