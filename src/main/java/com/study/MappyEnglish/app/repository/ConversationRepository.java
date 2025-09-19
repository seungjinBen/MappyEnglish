package com.study.MappyEnglish.app.repository;


import com.study.MappyEnglish.app.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByPlace_Id(Long placeId);
}
