import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";

export default function CardCreatePage() {
  const [term, setTerm] = useState("");
  const [meaning, setMeaning] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const onCreate = async () => {
    try {
      await api.post("/cards", { term, meaning });
      setStatus("카드를 만들었습니다. 목록에서 확인하세요!");
      setTerm("");
      setMeaning("");
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
        <div className="form-grid">
          <div className="input-field">
            <label htmlFor="card-term">용어</label>
            <input
              id="card-term"
              className="text-input"
              placeholder="예: サンプル / sample"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
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
            />
          </div>
          <button className="primary-btn" onClick={onCreate}>
            카드 생성
          </button>
          {status && <p className="muted">{status}</p>}
        </div>
      </section>
    </Layout>
  );
}
