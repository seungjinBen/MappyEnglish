package com.study.MappyEnglish.app.dto;

public class ConversationDto {
    private Long id;
    private Long placeId;
    private String englishText;
    private String koreanText;
    private String audioUrl;

    public ConversationDto() {}
    public ConversationDto(Long id, Long placeId, String englishText, String koreanText, String audioUrl) {
        this.id = id;
        this.placeId = placeId;
        this.englishText = englishText;
        this.koreanText = koreanText;
        this.audioUrl = audioUrl;
    }

    public Long getId() { return id; }
    public Long getPlaceId() { return placeId; }
    public String getEnglishText() { return englishText; }
    public String getKoreanText() { return koreanText; }
    public String getAudioUrl() { return audioUrl; }

    public void setId(Long id) { this.id = id; }
    public void setPlaceId(Long placeId) { this.placeId = placeId; }
    public void setEnglishText(String englishText) { this.englishText = englishText; }
    public void setKoreanText(String koreanText) { this.koreanText = koreanText; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
}
