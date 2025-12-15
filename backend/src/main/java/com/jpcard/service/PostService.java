package com.jpcard.service;

import com.jpcard.domain.post.Post;
import com.jpcard.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<Post> findAll() {
        return postRepository.findAll();
    }

    @Transactional
    public Post create(String title, String content) {
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        return postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public Post findById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new com.jpcard.util.ResourceNotFoundException("Post not found with id: " + id));
    }

    @Transactional
    public Post update(Long id, String title, String content) {
        Post post = findById(id);
        post.setTitle(title);
        post.setContent(content);
        return post;
    }

    @Transactional
    public void delete(Long id) {
        postRepository.deleteById(id);
    }
}
