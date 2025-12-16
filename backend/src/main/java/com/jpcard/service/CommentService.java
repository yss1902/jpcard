package com.jpcard.service;

import com.jpcard.domain.post.Comment;
import com.jpcard.domain.post.Post;
import com.jpcard.repository.CommentRepository;
import com.jpcard.repository.PostRepository;
import com.jpcard.util.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<Comment> findByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    @Transactional
    public Comment addComment(Long postId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
