import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import type { CardTemplate } from "../types/template";

export default function DeckCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get<CardTemplate[]>("/templates").then(res => {
        setTemplates(res.data);
        if (res.data.length > 0) setTemplateId(String(res.data[0].id));
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/decks", { name, description, templateId: Number(templateId) });
      navigate("/decks");
    } catch (err) {
      console.error(err);
      setStatus("Failed to create deck.");
    }
  };

  return (
    <Layout pageTitle="Create Deck">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <section className="glass-card" style={{ padding: 40 }}>
          <h2 className="card-title" style={{ textAlign: "center", marginBottom: 30 }}>Design Your Deck</h2>
          {status && <p className="muted" style={{ textAlign: "center" }}>{status}</p>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="input-group">
              <label htmlFor="deck-name" className="input-label">
                Deck Name
              </label>
              <input
                id="deck-name"
                className="input-field"
                placeholder="e.g., JLPT N5 Vocabulary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ padding: "12px 16px", fontSize: "1.1rem" }}
              />
            </div>
            <div className="input-group">
              <label htmlFor="deck-template" className="input-label">
                Card Type (Template)
              </label>
              <select
                id="deck-template"
                className="input-field"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                style={{ padding: "12px 16px", fontSize: "1.1rem", background: 'rgba(255,255,255,0.05)', color: 'white' }}
              >
                {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="deck-desc" className="input-label">
                Description <span className="muted">(Optional)</span>
              </label>
              <textarea
                id="deck-desc"
                className="input-field"
                rows={4}
                placeholder="What is this deck about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
            <button type="submit" className="primary-btn" style={{ marginTop: 10, padding: "14px", fontSize: "1.1rem" }}>
              Create Deck
            </button>
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
