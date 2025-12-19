package com.jpcard.controller;

import com.jpcard.controller.dto.UserInfoResponse;
import com.jpcard.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {

        // 1. 인증 정보가 없거나 올바르지 않은 경우 방어
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Invalid authentication principal");
        }

        // 2. 안전하게 캐스팅
        User user = (User) auth.getPrincipal();

        // 3. roles가 null일 경우 방어 로직 추가
        Set<String> roles = (user.getRoles() != null)
                ? user.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
                : Collections.emptySet();

        return ResponseEntity.ok(
                new UserInfoResponse(user.getId(), user.getUsername(), roles)
        );
    }
}