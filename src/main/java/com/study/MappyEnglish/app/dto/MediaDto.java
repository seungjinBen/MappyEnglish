package com.study.MappyEnglish.app.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class MediaDto implements Serializable {

    private Long id;
    private PlaceBriefDto place;       // place 요약(원하면 placeId로만 바꿔도 됨)
    private List<String> images = new ArrayList<>();
    private List<String> videos = new ArrayList<>();

    public MediaDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PlaceBriefDto getPlace() { return place; }
    public void setPlace(PlaceBriefDto place) { this.place = place; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = (images != null) ? images : new ArrayList<>(); }

    public List<String> getVideos() { return videos; }
    public void setVideos(List<String> videos) { this.videos = (videos != null) ? videos : new ArrayList<>(); }

    // --- nested ---
    public static class PlaceBriefDto implements Serializable {
        private Long id;
        private String name;
        private Double lat;
        private Double lng;

        public PlaceBriefDto() {}
        public PlaceBriefDto(Long id, String name, Double lat, Double lng) {
            this.id = id; this.name = name; this.lat = lat; this.lng = lng;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Double getLat() { return lat; }
        public void setLat(Double lat) { this.lat = lat; }
        public Double getLng() { return lng; }
        public void setLng(Double lng) { this.lng = lng; }
    }
}

