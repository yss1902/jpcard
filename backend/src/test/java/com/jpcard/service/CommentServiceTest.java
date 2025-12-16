package com.jpcard.service;

import com.jpcard.domain.post.Comment;
import com.jpcard.domain.post.Post;
import com.jpcard.repository.CommentRepository;
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
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;
    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    void addComment() {
        Post post = new Post();
        post.setId(1L);

        Comment comment = new Comment();
        comment.setId(1L);
        comment.setContent("Nice post");
        comment.setPost(post);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        Comment created = commentService.addComment(1L, "Nice post");

        assertEquals("Nice post", created.getContent());
        verify(commentRepository).save(any(Comment.class));
    }
}
