# cloud-chat-bot

## 실행 방법

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`에 `GEMINI_API_KEY`를 입력한 뒤 브라우저에서 `http://127.0.0.1:5173`으로 접속합니다.

## 빌드 확인

```bash
npm run lint
npm run build
```

`dist/assets/index-*.js`는 `npm run build`가 생성하는 Vite 번들 파일입니다. 파일명 해시는 캐시 갱신용이라 빌드마다 달라질 수 있으며, 소스 코드는 `src/`와 `shared/`를 기준으로 관리합니다.
