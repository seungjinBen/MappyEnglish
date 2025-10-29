package com.study.MappyEnglish.app.repository;


import com.study.MappyEnglish.app.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // 단건 조회 시 Place까지 한 번에
    @Query("""
           select c from Conversation c
           join fetch c.place
           where c.id = :id
           """)
    Optional<Conversation> findByIdWithPlace(@Param("id") Long id);

    // 특정 placeId의 대화 목록 (Place를 함께 가져와도 되고, 안 가져와도 됨)
    @Query("""
           select c from Conversation c
           where c.place.id = :placeId
           """)
    List<Conversation> findAllByPlaceId(@Param("placeId") Long placeId);

    // 목록에서도 Place까지 필요하면 아래처럼 fetch join 버전 사용
    @Query("""
           select c from Conversation c
           join fetch c.place
           where c.place.id = :placeId
           """)
    List<Conversation> findAllByPlaceIdWithPlace(@Param("placeId") Long placeId);
}
