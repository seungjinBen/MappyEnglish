package com.study.MappyEnglish.app.dto;

import com.study.MappyEnglish.app.entity.Media;
import com.study.MappyEnglish.app.entity.Place;

import java.util.ArrayList;
import java.util.List;

public class MediaMapper {

    public static MediaDto toDto(Media e) {
        if (e == null) return null;

        MediaDto dto = new MediaDto();
        dto.setId(e.getId());

        Place p = e.getPlace(); // LAZY: 접근 시 fetch join을 쓰면 N+1 방지 가능
        if (p != null) {
            dto.setPlace(new MediaDto.PlaceBriefDto(
                    p.getId(), p.getName(), p.getLat(), p.getLng()
            ));
        }

        List<String> imgs = new ArrayList<>();
        addIfPresent(imgs, e.getImgUrl1());
        addIfPresent(imgs, e.getImgUrl2());
        addIfPresent(imgs, e.getImgUrl3());
        addIfPresent(imgs, e.getImgUrl4());
        addIfPresent(imgs, e.getImgUrl5());
        dto.setImages(imgs);

        List<String> vids = new ArrayList<>();
        addIfPresent(vids, e.getVideoUrl1());
        addIfPresent(vids, e.getVideoUrl2());
        dto.setVideos(vids);

        return dto;
    }

    private static void addIfPresent(List<String> list, String url) {
        if (url != null && !url.trim().isEmpty()) list.add(url);
    }
}
