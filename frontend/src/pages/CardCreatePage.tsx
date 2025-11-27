import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";

export default function CardCreatePage() {
  const [term, setTerm] = useState("");
  const [meaning, setMeaning] = useState("");

  const onCreate = async () => {
    await api.post("/cards", { term, meaning });
    alert("카드 생성 완료");
  };

  return (
    <Layout>
      <h1>Create Card</h1>
      <input placeholder="용어" value={term} onChange={(e) => setTerm(e.target.value)} />
      <br />
      <input placeholder="뜻" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
      <br />
      <button onClick={onCreate}>Create</button>
    </Layout>
  );
}
