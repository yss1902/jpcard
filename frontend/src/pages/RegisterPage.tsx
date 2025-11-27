import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";

export default function RegisterPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const onRegister = async () => {
    await api.post("/auth/register", {
      username: id,
      password: pw,
    });
    alert("가입 완료");
  };

  return (
    <Layout>
      <h1>Register</h1>
      <input placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
      <br />
      <input
        type="password"
        placeholder="PW"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <br />
      <button onClick={onRegister}>Register</button>
    </Layout>
  );
}
