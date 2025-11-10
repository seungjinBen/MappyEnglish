package com.study.MappyEnglish.app.controller;

import com.study.MappyEnglish.app.dto.MediaDto;
import com.study.MappyEnglish.app.service.MediaReadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/media")
public class MediaController {
    @GetMapping("/ping")
    public String ping() { return "ok"; }
}
public class MediaController {

    private final MediaReadService service;

    public MediaController(MediaReadService service) {
        this.service = service;
    }

    // GET /api/media/{id}
    @GetMapping("/{id}")
    public ResponseEntity<MediaDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // GET /api/media?placeId=12  (includePlace=true면 Place 요약 포함)
    @GetMapping
    public ResponseEntity<List<MediaDto>> listByPlace(
            @RequestParam Long placeId,
            @RequestParam(defaultValue = "true") boolean includePlace
    ) {
        return ResponseEntity.ok(service.listByPlace(placeId, includePlace));
    }
}
