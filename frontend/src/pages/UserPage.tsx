import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import type { User } from "../types/user";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("내 정보를 불러오는 중...");

  useEffect(() => {
    api
      .get<User>("/users/me")
      .then((res) => {
        setUser(res.data);
        setStatus("성공적으로 불러왔습니다.");
      })
      .catch(() => setStatus("사용자 정보를 불러올 수 없습니다. 로그인 상태를 확인하세요."));
  }, []);

  return (
    <Layout pageTitle="My Page" subtitle="토큰 기반으로 백엔드에서 불러온 사용자 정보">
      <section className="glass-card">
        <div className="card-header">
          <div>
            <p className="muted">Profile</p>
            <h2 className="card-title">내 계정</h2>
          </div>
          <span className="pill">
            <span className="pill-dot" /> JWT 보호됨
          </span>
        </div>
        <p className="muted">{status}</p>
        {user && (
          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="action-card">
              <p className="muted">Username</p>
              <h3 className="item-title">{user.username}</h3>
            </div>
            <div className="action-card">
              <p className="muted">Roles</p>
              <div className="badge-grid">
                {user.roles.map((r) => (
                  <span key={r} className="pill">
                    <span className="pill-dot" />
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <div className="action-card">
              <p className="muted">저장된 토큰</p>
              <p className="item-subtitle">
                accessToken: {localStorage.getItem("token") ? "있음" : "없음"} · refreshToken: {" "}
                {localStorage.getItem("refreshToken") ? "있음" : "없음"}
              </p>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
