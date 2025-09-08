package com.study.MappyEnglish.app.controller;

import com.study.MappyEnglish.app.entity.Mappy;
import com.study.MappyEnglish.app.service.MappyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// 웹 요청을 처리하는 컨트롤러 클래스
@RestController
public class MappyController {

    private final MappyService mappyService;

    // MappyService를 주입받는 생성자
    @Autowired
    public MappyController(MappyService mappyService) {
        this.mappyService = mappyService;
    }

    // HTTP GET 요청을 처리하는 메서드
    @GetMapping("/mappy")
    // Temp 엔티티를 생성하고 저장한 후 반환
    public Mappy createMapp() {
        return mappyService.createMappyRecord();
    }
}
