import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Deck } from "../types/deck";

export default function CardCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedDeckId = searchParams.get("deckId");

  const [term, setTerm] = useState("");
  const [meaning, setMeaning] = useState("");
  const [deckId, setDeckId] = useState(preSelectedDeckId || "");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    api.get<Deck[]>("/decks").then(res => setDecks(res.data)).catch(console.error);
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/cards", { term, meaning, deckId: deckId ? Number(deckId) : null });
      if (deckId) {
          navigate(`/decks/${deckId}`);
      } else {
          navigate("/cards");
      }
    } catch (err) {
      console.error(err);
      setStatus("카드 생성 실패. API 연결을 다시 확인해주세요.");
    }
  };

  return (
    <Layout pageTitle="Create Card" subtitle="단어와 의미를 모노톤 카드로 추가합니다">
      <section className="glass-card">
        <div className="card-header">
          <div>
            <p className="muted">Flash Card Composer</p>
            <h2 className="card-title">새로운 카드 만들기</h2>
          </div>
          <button className="secondary-btn" onClick={() => { setTerm(""); setMeaning(""); }}>
            내용 지우기
          </button>
        </div>
        <form onSubmit={onCreate} className="form-grid">
          <div className="input-field">
            <label htmlFor="card-term">용어</label>
            <input
              id="card-term"
              className="text-input"
              placeholder="예: サンプル / sample"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="card-meaning">뜻/메모</label>
            <input
              id="card-meaning"
              className="text-input"
              placeholder="간단한 뜻을 입력"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
             <label htmlFor="card-deck">Deck (Optional)</label>
             <select
               id="card-deck"
               className="text-input"
               value={deckId}
               onChange={e => setDeckId(e.target.value)}
               style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}
             >
                <option value="">No Deck</option>
                {decks.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                ))}
             </select>
          </div>
          <button type="submit" className="primary-btn">
            카드 생성
          </button>
          {status && <p className="muted">{status}</p>}
        </form>
      </section>
    </Layout>
  );
}
