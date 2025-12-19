import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("Loading profile...");

  useEffect(() => {
    api
      .get<User>("/users/me")
      .then((res) => {
        // 성공 시 데이터 확인용 로그
        console.log("User Data:", res.data); 
        setUser(res.data);
        setStatus("");
      })
      .catch((err) => {
        // ★ 에러의 진짜 내용을 콘솔과 화면에 출력합니다.
        console.error("API Error Details:", err);
        // 만약 HTML이 반환된다면 Proxy 문제, 403이면 토큰 문제
        setStatus(`Error: ${err.message} (Check Console)`);
      });
  }, []);

  const onLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      navigate("/login");
  };

  return (
    <Layout pageTitle="My Page">
      <section className="glass-card">
        <div className="card-header">
          <h2 className="card-title">My Account</h2>
          <button className="secondary-btn" onClick={onLogout}>Logout</button>
        </div>

        {status && <p className="muted">{status}</p>}

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
          </div>
        )}
      </section>
    </Layout>
  );
}
