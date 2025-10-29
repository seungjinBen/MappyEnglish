package com.study.MappyEnglish.app.controller;

import com.study.MappyEnglish.app.dto.ConversationDto;
import com.study.MappyEnglish.app.service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
}
