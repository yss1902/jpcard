import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import type { Card } from "../types/card";

export default function CardEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [meaning, setMeaning] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    api
      .get<Card>(`/cards/${id}`)
      .then((res) => {
        setTerm(res.data.term);
        setMeaning(res.data.meaning);
      })
      .catch((err) => {
        console.error(err);
        setStatus("카드를 찾을 수 없습니다.");
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/cards/${id}`, { term, meaning });
      navigate("/cards");
    } catch (err) {
      console.error(err);
      setStatus("수정에 실패했습니다.");
    }
  };

  return (
    <Layout pageTitle="Edit Card" subtitle="카드 내용 수정">
      <section className="glass-card">
        <h2 className="card-title">카드 수정</h2>
        {status && <p className="muted">{status}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label htmlFor="card-term" style={{ display: "block", marginBottom: 4 }} className="muted">
              단어 (Term)
            </label>
            <input
              id="card-term"
              className="input-field"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="card-meaning" style={{ display: "block", marginBottom: 4 }} className="muted">
              의미 (Meaning)
            </label>
            <textarea
              id="card-meaning"
              className="input-field"
              rows={3}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary-btn" style={{ marginTop: 8 }}>
            수정 완료
          </button>
        </form>
      </section>
    </Layout>
  );
}
