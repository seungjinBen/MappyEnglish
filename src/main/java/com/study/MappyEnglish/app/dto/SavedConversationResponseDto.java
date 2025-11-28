package com.study.MappyEnglish.app.dto;

import com.study.MappyEnglish.app.entity.SavedConversation;
import lombok.Getter;

@Getter
public class SavedConversationResponseDto {
    private Long savedId;
    private Long conversationId;
    private String placeName;
    private String type;

    // 텍스트 1~5번 모두 추가
    private String englishText1;
    private String koreanText1;
    private String englishText2;
    private String koreanText2;
    private String englishText3;
    private String koreanText3;
    private String englishText4;
    private String koreanText4;
    private String englishText5;
    private String koreanText5;

    public SavedConversationResponseDto(SavedConversation entity) {
        this.savedId = entity.getId();
        this.conversationId = entity.getConversation().getId();
        this.placeName = entity.getConversation().getPlace().getName(); // (구조에 따라 다름)
        this.type = String.valueOf(entity.getConversation().getType());

        // 1번
        this.englishText1 = entity.getConversation().getEnglishText1();
        this.koreanText1 = entity.getConversation().getKoreanText1();

        // 2~5번 매핑 (데이터가 없으면 null이 들어감)
        this.englishText2 = entity.getConversation().getEnglishText2();
        this.koreanText2 = entity.getConversation().getKoreanText2();
        this.englishText3 = entity.getConversation().getEnglishText3();
        this.koreanText3 = entity.getConversation().getKoreanText3();
        this.englishText4 = entity.getConversation().getEnglishText4();
        this.koreanText4 = entity.getConversation().getKoreanText4();
        this.englishText5 = entity.getConversation().getEnglishText5();
        this.koreanText5 = entity.getConversation().getKoreanText5();
    }
}
