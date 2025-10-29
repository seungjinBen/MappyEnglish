## SpringBoot + React + PostgreSQL
* 모바일 퍼스트 + 휴대폰 화면 대응
  - viewport-fit=cover로 안전영역 변수가 활성화되어 노치/홈바를 피할 수 있음.
* 반응형 이미지 -> 작은 폰에는 작은 이미지, 큰 폰에는 큰 이미지가 자동 선택
* 구글키 새로발급, .env파일에 저장 후 Google Maps 띄우기 완료.
  - without loading=async 경고 해결 -> 구글이 권장하는 비동기 로딩방식 사용.
    + @googlemaps/js-api-loader
* CRA(포트3000)과 VITE(포트5173)방식이 있음
  - 차이 알아보기 !!!!!!!
* PostgreSQL에 places와 conversations 테이블 생성 후 데이터 삽입완료.
  - https://benn.tistory.com/28
--- 
* PostgreSQL 데이터를 SpringBoot에서 읽어 Json형식으로 보내고, React에서 출력.
  - 1. 의존성 추가 2. DB연결 설정 3. 테이블 예시 4. Entity작성
     5. Repository작성 6. Controller(Rest API)작성
    + 현재 사용하는 CRA(Create React App, 포트 3000)의 대안으로 Vite(포트 5173)가 있음.
* 시큐리티 문제 때문에 react에서 호출시 login으로 경로가 향해짐
  - 일단 시큐리티 제거, 배포전 다시 넣기!!
--- 
* 드디어 proxy호출 완료!
  - setupProxy방법은 안됌.
--- 
* 메인시트 BottomSheet 구현 
  - 마커 클릭시 해당 장소 정보 출력.
  - 기본 시트는 도시에 대한 정보를 보여줌.
* 3단계 스냅(닫힘 -> 반열림 -> 거의 전체)의 시트를 구현하였다.
  - 사용자의 움직임(드래그)을 통해 제어할 수 있음.
--- 
* 컬럼/테이블 이름이 스네이크표기이기에 @Column(name = "english_text")로 매핑해주었다.
  - 자바필드는 카멜케이스
* 응답은 DTO로 만들어 placeId만 노출되도록 한다.
  - FK숫자만 응답함으로써 연관 객체 전체의 과다노출을 방지함
    + 1. 엔티티->DTO(조회): 도시당 장소는 50개이하, 페이징(Pageable)까지는 필요없을듯? 2. DTO->엔티티(생성) 3. DTO->엔티티(수정)
---
* 이미지 파일을 Firebase Cloud Storage 에 저장 후 저장소위치를 DB에 저장하였다.
  - 브라우저에 이미지 잘 출력된다.
* 최대 5개의 이미지파일과 2개의 영상파일이 있어 대표이미지를 제외하고 따로 테이블 구축한다.
*  convervations테이블을 먼저 대화를 거는 사람에 따라 테이블을 두개로 나누었다.
*  이제 장소정보와 이미지를 정리하고 해당 어휘자료를 취합해야한다.
---
*  convervations테이블을 먼저 대화를 거는 사람에 따라 테이블을 두개로 나누었다.
  - 굳이 나눌 필요 없음, 타입을 설정해 타입에 따라 view다르게 제작!
*  conversation 데이터를 모두 수집하였다.
---
* 장소 클릭시 장소id값 반환 후, conversation 정보를 출력하였다.
  - 타입 A나 B에 따라 구별하여 대화창 구현해야함!
* 해당장소의 media 정보 출력해야함!.
