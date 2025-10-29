package com.study.MappyEnglish.app.dto;

import com.study.MappyEnglish.app.entity.Conversation;
import com.study.MappyEnglish.app.entity.Place;

public class ConversationMapper {
    public static ConversationDto toDto(Conversation c) {
        return new ConversationDto(
                c.getId(),
                c.getPlace().getId(),
                c.getEnglishText(),
                c.getKoreanText(),
                c.getAudioUrl()
        );
    }

    public static Conversation toEntity(ConversationDto dto, Place place) {
        Conversation c = new Conversation();
        c.setId(dto.getId());
        c.setPlace(place);
        c.setEnglishText(dto.getEnglishText());
        c.setKoreanText(dto.getKoreanText());
        c.setAudioUrl(dto.getAudioUrl());
        return c;
    }
}