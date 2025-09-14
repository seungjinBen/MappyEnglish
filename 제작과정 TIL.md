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
* PostgreSQL 데이터를 SpringBoot에서 읽어 Json형식으로 보내고, React에서 출력.
  - 1. 의존성 추가 2. DB연결 설정 3. 테이블 예시 4. Entity작성
     5. Repository작성 6. Controller(Rest API)작성
    + 현재 사용하는 CRA(Create React App, 포트 3000)의 대안으로 Vite(포트 5173)가 있음.
* 시큐리티 문제 때문에 react에서 호출시 login으로 경로가 향해짐
  - 일단 시큐리티 제거, 배포전 다시 넣기!!
* 드디어 proxy호출 완료!
  - setupProxy방법은 안됌.
