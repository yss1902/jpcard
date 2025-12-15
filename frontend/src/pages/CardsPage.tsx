import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import type { Card } from "../types/card";

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [status, setStatus] = useState("카드를 불러오는 중...");

  useEffect(() => {
    api
      .get<Card[]>("/cards")
      .then((res) => {
        setCards(res.data);
        setStatus(res.data.length ? "불러오기 완료" : "아직 카드가 없습니다. 새로 만들어보세요.");
      })
      .catch(() => setStatus("카드를 불러오지 못했습니다. API를 확인하세요."));
  }, []);

  return (
    <Layout pageTitle="Flash Cards" subtitle="블랙 앤 화이트로 정돈된 단어 카드 목록">
      <section className="glass-card">
        <div className="card-header">
          <div>
            <p className="muted">Vocabulary Deck</p>
            <h2 className="card-title">학습 카드</h2>
          </div>
          <Link to="/cards/create" className="primary-btn">
            새 카드 작성
          </Link>
        </div>
        <p className="muted">{status}</p>
        <div className="card-grid" style={{ marginTop: 14 }}>
          {cards.map((c) => (
            <article key={c.id} className="item-tile">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 className="item-title">{c.term}</h3>
                  <p className="item-subtitle">{c.meaning}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/cards/${c.id}/edit`} className="muted" style={{ fontSize: "0.8rem", textDecoration: "underline" }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if(window.confirm("정말 삭제하시겠습니까?")) {
                        api.delete(`/cards/${c.id}`).then(() => {
                           setCards(cards.filter(card => card.id !== c.id));
                        }).catch(() => alert("삭제 실패"));
                      }
                    }}
                    className="muted"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline", padding: 0 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
