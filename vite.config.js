import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import chatHandler from "./api/chat.js";

function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (request, response) => {
        try {
          request.body = await readRequestBody(request);
          await chatHandler(request, createJsonResponse(response));
        } catch {
          response.statusCode = 500;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({ error: "500: 로컬 API 처리 중 오류가 발생했습니다.", statusCode: 500 }));
        }
      });
    }
  };
}

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString("utf8");
  if (!text.trim()) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function createJsonResponse(response) {
  return {
    setHeader(name, value) {
      response.setHeader(name, value);
    },
    status(statusCode) {
      response.statusCode = statusCode;
      return this;
    },
    json(payload) {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.end(JSON.stringify(payload));
    }
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), localApiPlugin()]
  };
});
