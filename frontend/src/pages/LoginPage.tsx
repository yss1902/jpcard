import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const onLogin = async () => {
    const res = await api.post("/auth/login", { username: id, password: pw });
    localStorage.setItem("token", res.data.token);
    alert("로그인 완료");
  };

  return (
    <Layout>
      <h1>Login</h1>
      <input placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
      <br />
      <input
        type="password"
        placeholder="PW"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <br />
      <button onClick={onLogin}>Login</button>
    </Layout>
  );
}
