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
      setStatus("Failed to create card.");
    }
  };

  return (
    <Layout pageTitle="Create Card">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <section className="glass-card" style={{ padding: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
             <h2 className="card-title" style={{ margin: 0 }}>New Flash Card</h2>
             <button className="secondary-btn" onClick={() => { setTerm(""); setMeaning(""); }} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
               Clear
             </button>
          </div>

          <form onSubmit={onCreate} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="input-group">
              <label htmlFor="card-term" className="input-label">Term / Word</label>
              <input
                id="card-term"
                className="input-field"
                placeholder="e.g., 勉強 (Study)"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                required
                style={{ padding: "12px 16px", fontSize: "1.1rem" }}
              />
            </div>

            <div className="input-group">
              <label htmlFor="card-meaning" className="input-label">Meaning / Definition</label>
              <textarea
                id="card-meaning"
                className="input-field"
                rows={3}
                placeholder="e.g., The act of acquiring knowledge"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="input-group">
               <label htmlFor="card-deck" className="input-label">Assign to Deck</label>
               <select
                 id="card-deck"
                 className="input-field"
                 value={deckId}
                 onChange={e => setDeckId(e.target.value)}
                 style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: "12px 16px" }}
               >
                  <option value="">No Deck (Unassigned)</option>
                  {decks.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
               </select>
            </div>

            <button type="submit" className="primary-btn" style={{ marginTop: 10, padding: "14px", fontSize: "1.1rem" }}>
              Add Card
            </button>
            {status && <p className="muted" style={{ textAlign: "center" }}>{status}</p>}
          </form>
        </section>
      </div>
      <style>{`
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .input-field:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </Layout>
  );
}
