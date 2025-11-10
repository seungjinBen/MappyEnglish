package com.study.MappyEnglish.app.entity;

import com.example.place.entity.Place;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@Entity
@Table(name = "media")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK: media.place_id → places.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @Column(name = "img_url1") private String imgUrl1;
    @Column(name = "img_url2") private String imgUrl2;
    @Column(name = "img_url3") private String imgUrl3;
    @Column(name = "img_url4") private String imgUrl4;
    @Column(name = "img_url5") private String imgUrl5;

    @Column(name = "video_url1") private String videoUrl1;
    @Column(name = "video_url2") private String videoUrl2;
}
