package com.study.MappyEnglish.app.service;


import com.study.MappyEnglish.app.dto.ConversationDto;
import com.study.MappyEnglish.app.dto.ConversationMapper;
import com.study.MappyEnglish.app.entity.Conversation;
import com.study.MappyEnglish.app.entity.Place;
import com.study.MappyEnglish.app.repository.ConversationRepository;
import com.study.MappyEnglish.app.repository.PlaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class ConversationService {

    private final ConversationRepository repo;

    public ConversationService(ConversationRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public ConversationDto getById(Long id) {
        Conversation e = repo.findByIdWithPlace(id)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found: " + id));
        return ConversationMapper.toDto(e);
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> listByPlace(Long placeId, boolean includePlace) {
        List<Conversation> list = includePlace
                ? repo.findAllByPlaceIdWithPlace(placeId)
                : repo.findAllByPlaceId(placeId);
        return list.stream().map(ConversationMapper::toDto).toList();
    }
}