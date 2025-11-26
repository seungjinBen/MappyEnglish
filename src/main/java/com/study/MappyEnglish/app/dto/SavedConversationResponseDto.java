package com.study.MappyEnglish.app.dto;

import com.study.MappyEnglish.app.entity.SavedConversation;
import lombok.Getter;

@Getter
public class SavedConversationResponseDto {
    private Long savedId;        // 저장 기록의 고유 ID (삭제 시 사용)
    private Long conversationId; // 대화 원본 ID
    private String placeName;    // 장소 이름 (Conversation -> Place 참조 필요)
    private String type;
    private String englishText1;
    private String koreanText1;
    // ... 필요한 텍스트 필드 추가 ...

    public SavedConversationResponseDto(SavedConversation entity) {
        this.savedId = entity.getId();
        this.conversationId = entity.getConversation().getId();
        // Conversation 엔티티 구조에 따라 get 메서드 호출
        this.type = String.valueOf(entity.getConversation().getType());
        this.englishText1 = entity.getConversation().getEnglishText1();
        this.koreanText1 = entity.getConversation().getKoreanText1();
        // this.placeName = entity.getConversation().getPlace().getName(); // 예시
    }
}
