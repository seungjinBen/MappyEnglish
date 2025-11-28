package com.study.MappyEnglish.app.controller;

import com.study.MappyEnglish.app.dto.ConversationDto;
import com.study.MappyEnglish.app.entity.Conversation;
import com.study.MappyEnglish.app.service.ConversationService;
import com.study.MappyEnglish.app.dto.SearchResponseDto; // 기존 DTO 재활용
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService service;

    public ConversationController(ConversationService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<ConversationDto>> listByPlace(@PathVariable Long placeId,
                                                             @RequestParam(defaultValue = "true") boolean includePlace) {
        return ResponseEntity.ok(service.listByPlace(placeId, includePlace));
    }
    // 카테고리별 조회 API
    // GET /api/conversations/category?code=A
    @GetMapping("/category")
    public ResponseEntity<List<SearchResponseDto.ConversationDto>> getByCategory(@RequestParam String code) {

        // ★ Service의 메소드를 호출
        List<Conversation> conversations = service.findByCategory(code);

        // DTO 변환
        List<SearchResponseDto.ConversationDto> dtos = conversations.stream()
                .map(SearchResponseDto.ConversationDto::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
