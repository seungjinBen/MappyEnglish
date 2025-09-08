package com.study.MappyEnglish.app.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Mappy {
    // @Id: 기본 키(primary key)로 사용될 필드임을 나타냄
    // @GeneratedValue: 이 필드의 값을 자동으로 생성하도록 지정
    // strategy = GenerationType.IDENTITY: 데이터베이스의 IDENTITY 컬럼을 사용하여 기본 키 값을 자동 생성
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private Boolean confirm;
}
