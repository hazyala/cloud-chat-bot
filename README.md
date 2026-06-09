# cloud-chat-bot

Gemini API를 사용하는 Vite + React 기반 챗봇입니다. 프론트엔드는 `src/`, 서버리스 API는 `api/`, 공용 모델 설정은 `shared/`에서 관리합니다.

## 실행 방법

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`에 `GEMINI_API_KEY`를 입력한 뒤 브라우저에서 `http://127.0.0.1:5173`으로 접속합니다.

## 프로젝트 구조

```text
api/       Vercel 서버리스 API 및 로컬 Vite API 미들웨어에서 공유하는 채팅 핸들러
public/    Vite가 그대로 서빙하는 정적 이미지
shared/    프론트엔드와 API가 함께 쓰는 Gemini 모델 설정
src/       React 앱 소스
```

## 빌드 확인

```bash
npm run lint
npm run build
```

`dist/assets/index-*.js`는 `npm run build`가 생성하는 Vite 번들 파일입니다. 파일명 해시는 캐시 갱신용이라 빌드마다 달라질 수 있으며, 소스 코드는 `src/`와 `shared/`를 기준으로 관리합니다.
