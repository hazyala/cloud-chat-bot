export function RuntimeStatus({ activeModel }) {
  return (
    <div className="runtime-card">
      <span>현재 모델</span>
      <strong>{activeModel.name}</strong>
      <p>API 키는 서버 환경 변수에서만 사용됩니다.</p>
    </div>
  );
}
