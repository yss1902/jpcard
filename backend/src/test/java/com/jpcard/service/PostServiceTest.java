package com.jpcard.service;

import com.jpcard.domain.post.Post;
import com.jpcard.repository.PostRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostService postService;

    @Test
    void createPost() {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Title");
        post.setContent("Content");
        post.setAuthorName("User");
        post.setIpAddress("127.0.0.1");

        when(postRepository.save(any(Post.class))).thenReturn(post);

        Post created = postService.create("Title", "Content", "User", "127.0.0.1");

        assertNotNull(created);
        assertEquals("Title", created.getTitle());
        assertEquals("User", created.getAuthorName());
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void updatePost() {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Old");
        post.setContent("Old Content");

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        Post updated = postService.update(1L, "New", "New Content");

        assertEquals("New", updated.getTitle());
        assertEquals("New Content", updated.getContent());
        verify(postRepository).findById(1L);
    }

    @Test
    void deletePost() {
        doNothing().when(postRepository).deleteById(1L);

        postService.delete(1L);

        verify(postRepository).deleteById(1L);
    }
}
