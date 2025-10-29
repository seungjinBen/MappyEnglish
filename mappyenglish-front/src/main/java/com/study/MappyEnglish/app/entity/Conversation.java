package com.study.MappyEnglish.app.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK: conversation.place_id -> place.id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @Column(name = "english_text", nullable = false, columnDefinition = "text")
    private String englishText;

    @Column(name = "korean_text", nullable = false, columnDefinition = "text")
    private String koreanText;

    @Column(name = "audio_url")
    private String audioUrl;

    public Long getId() { return id; }
    public Place getPlace() { return place; }
    public String getEnglishText() { return englishText; }
    public String getKoreanText() { return koreanText; }
    public String getAudioUrl() { return audioUrl; }

    public void setId(Long id) { this.id = id; }
    public void setPlace(Place place) { this.place = place; }
    public void setEnglishText(String englishText) { this.englishText = englishText; }
    public void setKoreanText(String koreanText) { this.koreanText = koreanText; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
}
