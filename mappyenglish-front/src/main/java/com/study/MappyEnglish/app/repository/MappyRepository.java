package com.study.MappyEnglish.app.repository;

import com.study.MappyEnglish.app.entity.Mappy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MappyRepository extends JpaRepository<Mappy, Long> {
}
