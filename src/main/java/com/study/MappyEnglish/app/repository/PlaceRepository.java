package com.study.MappyEnglish.app.repository;

import com.study.MappyEnglish.app.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    // 필요하면 쿼리 메서드 추가: List<Place> findByCategory(String category);
}
