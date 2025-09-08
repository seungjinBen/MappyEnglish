package com.study.MappyEnglish.app.service;

import com.study.MappyEnglish.app.entity.Mappy;
import com.study.MappyEnglish.app.repository.MappyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MappyService {
    private final MappyRepository mappyRepository;

    @Autowired
    public MappyService(MappyRepository mappyRepository){
        this.mappyRepository = mappyRepository;
    }


    public Mappy createMappyRecord(){
        Mappy mappy = new Mappy();
        mappy.setConfirm(true);
        return mappyRepository.save(mappy);
    }

}
