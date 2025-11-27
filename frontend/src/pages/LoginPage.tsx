import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const onLogin = async () => {
    try {
      const res = await api.post("/auth/login", { username: id, password: pw });
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("token", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      setStatus("로그인 성공! 새 액세스 토큰을 저장했습니다.");
    } catch (err) {
      console.error(err);
      setStatus("로그인에 실패했습니다. 입력값을 확인하세요.");
    }
  };

  return (
    <Layout
      pageTitle="Login"
      subtitle="액세스 · 리프레시 토큰을 저장하여 API와 연결합니다"
    >
      <section className="glass-card">
        <div className="card-header">
          <div>
            <p className="muted">Secure Session</p>
            <h2 className="card-title">아이디와 비밀번호를 입력하세요</h2>
          </div>
          <button className="secondary-btn" onClick={() => setId("demo")}>빠른 입력</button>
        </div>
        <div className="form-grid">
          <div className="input-field">
            <label htmlFor="login-id">아이디</label>
            <input
              id="login-id"
              className="text-input"
              placeholder="username"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="login-pw">비밀번호</label>
            <input
              id="login-pw"
              className="text-input"
              type="password"
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <button className="primary-btn" onClick={onLogin}>
            로그인 및 토큰 저장
          </button>
          {status && <p className="muted">{status}</p>}
        </div>
      </section>
    </Layout>
  );
}
