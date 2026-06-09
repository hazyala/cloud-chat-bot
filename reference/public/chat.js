// ==================== chat.js  ====================
// 선택한 모델과 API 키는 index.html에서 sessionStorage에 저장됨
// sessionStorage를 사용하여 브라우저 세션이 종료되면 데이터가 자동으로 삭제

document.addEventListener("DOMContentLoaded", () => {
  // --- 세션 읽기 ---
  const selectedModel = sessionStorage.getItem("model") || "";
  const apiKey        = sessionStorage.getItem("apiKey") || "";

  // 요소 참조
  const chatEl      = document.getElementById("chat");
  const formEl      = document.getElementById("composer");
  const textareaEl  = document.getElementById("message");
  const sendBtn     = document.getElementById("send-btn");
  const clearBtn    = document.getElementById("clear-btn");
  const modelBadge  = document.getElementById("model-badge");
  const servedBadge = document.getElementById("served-model"); 

  // 세션 없으면 index로 돌아감
  if (!selectedModel || !apiKey) {
    alert("세션이 없습니다. index에서 모델과 API 키를 먼저 입력해주세요.");
    window.location.href = "index.html";
    return;
  }

  // 모델 배지 표시
  if (modelBadge) modelBadge.textContent = `model: ${selectedModel}`;

  // 페이지 로딩 시 선택된 모델 표시
    document.addEventListener("DOMContentLoaded", () => {
      const model = localStorage.getItem("model") || "-";
      document.getElementById("model-badge").textContent = `model: ${model}`;
    });

  // 상태
  let controller = null;
  let sending = false;                 
  let isComposing = false;           
  let messages = [
    { role: "system", content: "You are a helpful assistant." }
  ];

  // --- 말풍선 렌더링 ---
  function addBubble({ role, content }) {
    const wrap = document.createElement("div");
    wrap.className = `bubble ${role === "user" ? "user" : "assistant"}`;

    const inner = document.createElement("div");
    inner.className = "bubble-inner";
    inner.textContent = content;

    wrap.appendChild(inner);
    chatEl.appendChild(wrap);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function addThinking() {
    const wrap = document.createElement("div");
    wrap.className = "bubble assistant thinking";
    wrap.innerHTML = `<div class="bubble-inner"> ★ ★ ★ </div>`;
    chatEl.appendChild(wrap);
    chatEl.scrollTop = chatEl.scrollHeight;
    return wrap;
  }

  // --- textarea 자동 높이 ---
  function autoresize() {
    textareaEl.style.height = "auto";
    textareaEl.style.height = Math.min(textareaEl.scrollHeight, 200) + "px";
  }
  textareaEl.addEventListener("input", autoresize);
  autoresize();

  // --- 대화 초기화 ---
  clearBtn?.addEventListener("click", () => {
    messages = [{ role: "system", content: "You are a helpful assistant." }];
    chatEl.innerHTML = "";
    textareaEl.value = "";
    autoresize();
    textareaEl.focus();
  });

  // --- 한글 중복 전송 방지 ---
  textareaEl.addEventListener("compositionstart", () => { isComposing = true; });
  textareaEl.addEventListener("compositionend",   () => { isComposing = false; });

  // --- Enter 전송, Shift+Enter 줄바꿈 ---
  textareaEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (isComposing) return;                 
      e.preventDefault();
      if (formEl && typeof formEl.requestSubmit === "function") {
        formEl.requestSubmit();                
      } else {
        formEl.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    }
  });

  // --- 제출 핸들러 ---
  formEl.addEventListener("submit", handleChatSubmit);

  async function handleChatSubmit(e) {
    e.preventDefault();
    if (sending) return;                       

    // 마지막 글자 중복 방지
    const raw  = textareaEl.value ?? "";
    const content = raw.replace(/\r?\n$/, "").trim();
    if (!content) return;

    sending = true;
    controller = new AbortController();
    if (sendBtn) sendBtn.disabled = true;

    // 사용자 메시지 표시/저장
    addBubble({ role: "user", content });
    messages.push({ role: "user", content });

    // 입력 초기화
    textareaEl.value = "";
    autoresize();

    const thinkingEl = addThinking();

    try {
      const resp = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
          messages: messages.filter(m => m.role !== "system")
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `HTTP ${resp.status}`);
      }

      const data = await resp.json();

      // 서버 응답 본문 파싱
      const reply = data?.choices?.[0]?.message?.content
                 || data?.reply
                 || "(null)";

      thinkingEl.remove();
      addBubble({ role: "assistant", content: reply });
      messages.push({ role: "assistant", content: reply });

      // 실제 서빙된 모델 확인
      const served = data?.model || data?.servedModel;
      if (served && servedBadge) servedBadge.textContent = `served: ${served}`;
    } catch (err) {
      thinkingEl.remove();
      addBubble({
        role: "assistant",
        content: `Error: ${err.message}`
      });
    } finally {
      sending = false;
      controller = null;
      if (sendBtn) sendBtn.disabled = false;
      textareaEl.focus();
    }
  }
});
