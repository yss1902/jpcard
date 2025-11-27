import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";

export default function RegisterPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const onRegister = async () => {
    try {
      await api.post("/auth/signup", {
        username: id,
        password: pw,
      });
      setMessage("가입 완료! 이제 로그인하세요.");
    } catch (err) {
      console.error(err);
      setMessage("가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Layout pageTitle="Sign Up" subtitle="간결한 흑백 톤의 신규 회원 등록 양식">
      <section className="glass-card">
        <div className="card-header">
          <div>
            <p className="muted">Create account</p>
            <h2 className="card-title">새로운 ID를 발급하세요</h2>
          </div>
          <span className="pill">
            <span className="pill-dot" /> Secure by default
          </span>
        </div>

        <div className="form-grid">
          <div className="input-field">
            <label htmlFor="signup-id">아이디</label>
            <input
              id="signup-id"
              className="text-input"
              placeholder="아이디를 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="signup-pw">비밀번호</label>
            <input
              id="signup-pw"
              className="text-input"
              type="password"
              placeholder="안전한 비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="primary-btn" onClick={onRegister}>
              회원가입 완료
            </button>
            <button className="secondary-btn" onClick={() => setId("")}>초기화</button>
          </div>
          {message && <p className="muted">{message}</p>}
        </div>
      </section>
    </Layout>
  );
}
