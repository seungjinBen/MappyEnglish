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

    private final ConversationRepository conversationRepository;
    private final PlaceRepository placeRepository;

    public ConversationService(ConversationRepository conversationRepository, PlaceRepository placeRepository) {
        this.conversationRepository = conversationRepository;
        this.placeRepository = placeRepository;
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> findAll() {
        return conversationRepository.findAll()
                .stream().map(ConversationMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ConversationDto findById(Long id) {
        Conversation c = conversationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found: " + id));
        return ConversationMapper.toDto(c);
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> findByPlaceId(Long placeId) {
        return conversationRepository.findByPlace_Id(placeId)
                .stream().map(ConversationMapper::toDto).toList();
    }

    @Transactional
    public ConversationDto create(ConversationDto dto) {
        Place place = placeRepository.findById(dto.getPlaceId())
                .orElseThrow(() -> new IllegalArgumentException("Place not found: " + dto.getPlaceId()));
        Conversation saved = conversationRepository.save(ConversationMapper.toEntity(dto, place));
        return ConversationMapper.toDto(saved);
    }

    @Transactional
    public ConversationDto update(Long id, ConversationDto dto) {
        Conversation existing = conversationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found: " + id));

        if (dto.getPlaceId() != null && !dto.getPlaceId().equals(existing.getPlace().getId())) {
            Place place = placeRepository.findById(dto.getPlaceId())
                    .orElseThrow(() -> new IllegalArgumentException("Place not found: " + dto.getPlaceId()));
            existing.setPlace(place);
        }
        if (dto.getEnglishText() != null) existing.setEnglishText(dto.getEnglishText());
        if (dto.getKoreanText() != null)  existing.setKoreanText(dto.getKoreanText());
        existing.setAudioUrl(dto.getAudioUrl());

        return ConversationMapper.toDto(existing);
    }

    @Transactional
    public void delete(Long id) {
        conversationRepository.deleteById(id);
    }
}