  // ===== Start 클릭 이벤트 =====
 const startBtn = document.getElementById("startBtn");
const glassBox = document.getElementById("glassBox");
const formContent = document.getElementById("formContent");

startBtn.addEventListener("click", () => {
  glassBox.classList.add("expanded");

  setTimeout(() => {
    startBtn.style.display = "none";
    formContent.classList.remove("hidden");
  }, 600); // 애니메이션 시간 맞춤
});