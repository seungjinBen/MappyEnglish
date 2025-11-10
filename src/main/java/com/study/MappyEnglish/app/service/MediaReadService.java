package com.study.MappyEnglish.app.service;

import com.study.MappyEnglish.app.dto.MediaDto;
import com.study.MappyEnglish.app.entity.Media;
import com.study.MappyEnglish.app.dto.MediaMapper;
import com.study.MappyEnglish.app.repository.MediaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MediaReadService {

    private final MediaRepository repo;

    public MediaReadService(MediaRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public MediaDto getById(Long id) {
        Media e = repo.findByIdWithPlace(id)
                .orElseThrow(() -> new IllegalArgumentException("Media not found: " + id));
        return MediaMapper.toDto(e);
    }

    @Transactional(readOnly = true)
    public List<MediaDto> listByPlace(Long placeId, boolean includePlace) {
        List<Media> list = includePlace
                ? repo.findAllByPlaceIdWithPlace(placeId)
                : repo.findAllByPlace_IdOrderByIdAsc(placeId);
        return list.stream().map(MediaMapper::toDto).toList();
    }
}

