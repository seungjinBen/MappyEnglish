package com.study.MappyEnglish.app.controller;
import com.study.MappyEnglish.app.entity.Place;
import com.study.MappyEnglish.app.repository.PlaceRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/places")
public class PlaceController {
    private final PlaceRepository repo;

    public PlaceController(PlaceRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Place> findAll() {
        return repo.findAll();  // pgAdmin4에 있던 데이터가 JSON으로 그대로 나감
    }

    @GetMapping("/{id}")
    public Place findOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    // 필요시 카테고리별
    // @GetMapping("/category/{cat}")
    // public List<Place> byCategory(@PathVariable String cat){ return repo.findByCategory(cat); }
}
