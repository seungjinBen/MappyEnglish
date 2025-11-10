package com.study.MappyEnglish.app.repository;

import com.study.MappyEnglish.app.entity.Media;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Long> {

    // 단건: Place까지 한 번에 가져오기 (N+1 회피)
    @Query("""
           select m from Media m
           join fetch m.place
           where m.id = :id
           """)
    Optional<Media> findByIdWithPlace(@Param("id") Long id);

    // placeId 기준 목록 (Place 요약 필요 없으면 fetch join 제거 버전 써도 됨)
    @Query("""
           select m from Media m
           join fetch m.place p
           where p.id = :placeId
           order by m.id asc
           """)
    List<Media> findAllByPlaceIdWithPlace(@Param("placeId") Long placeId);

    // 필요 시 placeId만으로(Place 미포함)
    List<Media> findAllByPlace_IdOrderByIdAsc(Long placeId);
}
