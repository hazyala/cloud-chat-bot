// ==================== index.js ====================
console.log("index.js 실행됨");

// DOM이 모두 준비된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // ===== placeholder 제어 =====
  const apiKeyInput = document.getElementById("apiKey");
  if (apiKeyInput) {
    apiKeyInput.addEventListener("focus", () => {
      apiKeyInput.setAttribute("data-placeholder", apiKeyInput.placeholder);
      apiKeyInput.placeholder = "";
    });
    apiKeyInput.addEventListener("blur", () => {
      if (!apiKeyInput.value) {
        apiKeyInput.placeholder = apiKeyInput.getAttribute("data-placeholder") || "";
      }
    });
  }

  // ===== SVG (옵션) =====
  const feImage = document.querySelector("feImage");
  if (feImage) {
    fetch("https://essykings.github.io/JavaScript/map.png")
      .then((response) => response.blob())
      .then((blob) => {
        const objURL = URL.createObjectURL(blob);
        feImage.setAttribute("href", objURL);
      })
      .catch(console.error);
  }

// ===== Start 클릭 이벤트 (패치) =====
const startContent = document.getElementById("startBtn");
const inputContent = document.getElementById("inputContent");
const stage = document.querySelector(".container");

if (startContent && inputContent && stage) {
  startContent.addEventListener("click", () => {
    // ⛑ 첫 클릭에 #inputContent 가려둔 .hidden 제거
    inputContent.classList.remove("hidden");
    inputContent.setAttribute("aria-hidden", "false");
    startContent.setAttribute("aria-hidden", "true");
    startContent.disabled = true; // 중복 클릭 방지(선택)

    stage.classList.add("morphing");

    setTimeout(() => {
      stage.classList.add("show-input");
    }, 200);

    setTimeout(() => {
      stage.classList.add("hide-button");
    }, 800);
  }, { once:true });
}

  // ===== 버튼 클릭 이벤트 =====
  const enterBtn = document.getElementById("enterBtn");
  if (enterBtn) {
    enterBtn.addEventListener("click", async () => {
      const modelEl = document.getElementById("model");
      const errorMsg = document.getElementById("errorMessage");

      const model = modelEl ? modelEl.value : "";
      const apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";

      if (!model || model === "selectmodel") {
        if (errorMsg) errorMsg.textContent = "모델을 선택해주세요.";
        return;
      }
      if (!apiKey) {
        if (errorMsg) errorMsg.textContent = "API Key를 입력해주세요.";
        return;
      }
      if (errorMsg) errorMsg.textContent = "";

      try {
        const res = await fetch("/verify-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey, model })
        });

        const data = await res.json();
        console.log("서버 응답:", data);

        if (res.ok && data?.success !== false) {
          // ✅ 세션 스토리지에 저장 (브라우저/탭 닫으면 자동 소거)
          sessionStorage.setItem("apiKey", apiKey);
          sessionStorage.setItem("model", model);

          // chat.html로 이동
          window.location.href = "chat.html";
        } else {
          if (errorMsg) errorMsg.textContent = data?.message || "API 키 검증 실패";
        }
      } catch (err) {
        console.error(err);
        if (errorMsg) errorMsg.textContent = "오류가 발생했습니다.";
      }
    });
  }
});
