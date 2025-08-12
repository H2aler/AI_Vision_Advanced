@ai_vision
=========

이 디렉터리는 AI Vision 관련 정적 자산을 모아두기 위한 공간입니다.

구성
- ai_vision_advanced.html: 루트의 `ai_vision_advanced.html`과 동일한 페이지의 자리표시자 사본입니다. 현재는 유지보수를 위해 서버가 루트 파일을 서빙합니다. 실제 사용 시 이 파일로 동기화하세요.

서빙
- Express(`server/src/index.ts`)에서 `/advanced` 라우트가 페이지를 서빙합니다.
- CSP 및 외부 CDN 로드는 서버의 helmet 설정을 따릅니다.

참고
- React(`client/*`)과는 분리되어 있으며, 필요 시 React로 이식하십시오.

