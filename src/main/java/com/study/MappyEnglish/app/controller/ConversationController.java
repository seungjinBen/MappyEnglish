package com.study.MappyEnglish.app.controller;

import com.study.MappyEnglish.app.dto.ConversationDto;
import com.study.MappyEnglish.app.service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    // 전체 조회
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getAll() {
        return ResponseEntity.ok(conversationService.findAll());
    }

    // 단건 조회
    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(conversationService.findById(id));
    }

    // 특정 place의 대화들 조회
    @GetMapping("/places/{placeId}/conversations")
    public ResponseEntity<List<ConversationDto>> getByPlace(@PathVariable Long placeId) {
        return ResponseEntity.ok(conversationService.findByPlaceId(placeId));
    }

    // 생성
    @PostMapping("/conversations")
    public ResponseEntity<ConversationDto> create(@RequestBody ConversationDto dto) {
        return ResponseEntity.ok(conversationService.create(dto));
    }

    // 수정
    @PutMapping("/conversations/{id}")
    public ResponseEntity<ConversationDto> update(@PathVariable Long id, @RequestBody ConversationDto dto) {
        return ResponseEntity.ok(conversationService.update(id, dto));
    }

    // 삭제
    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        conversationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
