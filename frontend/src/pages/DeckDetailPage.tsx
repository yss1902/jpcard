import { useEffect, useState } from "react";
import { api } from "../libs/api";
import { speak } from "../libs/tts";
import Layout from "../components/Layout";
import { Link, useParams } from "react-router-dom";
import type { Card } from "../types/card";
import type { Deck } from "../types/deck";
import type { CardTemplate } from "../types/template";

export default function DeckDetailPage() {
  const { id } = useParams();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    // Fetch deck info
    api.get<Deck>(`/decks/${id}`).then(res => setDeck(res.data)).catch(console.error);
    // Fetch templates
    api.get<CardTemplate[]>("/templates").then(res => setTemplates(res.data)).catch(console.error);
    // Fetch cards in deck
    api.get<Card[]>(`/cards?deckId=${id}`).then(res => {
        setCards(res.data);
        setStatus(res.data.length ? "" : "No cards in this deck.");
    }).catch(() => setStatus("Failed to load cards."));
  }, [id]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!deck) return;
      const newTemplateId = Number(e.target.value);
      api.put(`/decks/${deck.id}`, { ...deck, templateId: newTemplateId }).then(res => {
          setDeck(res.data);
          alert("Deck template updated. Existing card data is preserved but presentation may change.");
      }).catch(() => alert("Failed to update template"));
  };

  if (!deck) return <Layout><p className="muted">Loading deck...</p></Layout>;

  return (
    <Layout pageTitle={deck.name}>
      <section className="glass-card">
        <div className="card-header">
          <h2 className="card-title">Cards in Deck</h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
             {deck && templates.length > 0 && (
                 <select
                    value={deck.templateId || ""}
                    onChange={handleTemplateChange}
                    className="secondary-btn"
                    style={{ padding: '8px', fontSize: '0.9rem', cursor: 'pointer' }}
                 >
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                 </select>
             )}
             <Link to={`/cards/create?deckId=${id}`} className="primary-btn">
                Add Card
             </Link>
          </div>
        </div>

        {status && <p className="muted" style={{marginTop: 10}}>{status}</p>}

        <div className="card-grid" style={{ marginTop: 14 }}>
          {cards.map((c) => (
            <article key={c.id} className="item-tile">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                     <h3 className="item-title">{c.term}</h3>
                     <button className="icon-btn" onClick={() => speak(c.term)} style={{ fontSize: "0.8rem", padding: "2px 6px" }}>🔊</button>
                  </div>
                  <p className="item-subtitle">{c.meaning}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                   <Link to={`/cards/${c.id}/edit`} className="muted" style={{ fontSize: "0.8rem", textDecoration: "underline" }}>Edit</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
