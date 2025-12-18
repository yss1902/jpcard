import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import type { Card } from "../types/card";
import type { Deck } from "../types/deck";
import type { CardTemplate, FieldDefinition } from "../types/template";

export default function CardEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [term, setTerm] = useState("");
  const [meaning, setMeaning] = useState("");
  const [deckId, setDeckId] = useState<string>("");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get<Deck[]>("/decks").then(res => setDecks(res.data)).catch(console.error);
    api.get<CardTemplate[]>("/templates").then(res => setTemplates(res.data)).catch(console.error);

    api
      .get<Card>(`/cards/${id}`)
      .then((res) => {
        setTerm(res.data.term);
        setMeaning(res.data.meaning);
        setDeckId(res.data.deckId ? String(res.data.deckId) : "");
        if (res.data.fields) setFields(res.data.fields);
      })
      .catch((err) => {
        console.error(err);
        setStatus("Card not found.");
      });
  }, [id]);

  // Determine current template fields
  const selectedDeck = decks.find(d => String(d.id) === deckId);
  const currentTemplate = selectedDeck && templates.find(t => t.id === selectedDeck.templateId);

  const templateFields: FieldDefinition[] = currentTemplate
      ? JSON.parse(currentTemplate.structureJson)
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payloadTerm = templateFields.length > 0 ? (fields["term"] || "") : term;
      const payloadMeaning = templateFields.length > 0 ? (fields["meaning"] || "") : meaning;

      await api.put(`/cards/${id}`, {
          term: payloadTerm,
          meaning: payloadMeaning,
          deckId: deckId ? Number(deckId) : null,
          fields: fields
      });
      if (deckId) {
          navigate(`/decks/${deckId}`);
      } else {
          navigate("/cards");
      }
    } catch (err) {
      console.error(err);
      setStatus("Update failed.");
    }
  };

  return (
    <Layout pageTitle="Edit Card">
      <section className="glass-card">
        <h2 className="card-title">Edit Card</h2>
        {status && <p className="muted">{status}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          <div className="input-group">
             <label htmlFor="card-deck" className="input-label">Deck</label>
             <select
               id="card-deck"
               className="input-field"
               value={deckId}
               onChange={e => setDeckId(e.target.value)}
               style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: "12px 16px" }}
             >
                <option value="">No Deck</option>
                {decks.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                ))}
             </select>
          </div>

          {templateFields.length > 0 ? (
                // Dynamic Fields
                templateFields.map(field => (
                    <div className="input-group" key={field.key}>
                      <label htmlFor={`field-${field.key}`} className="input-label">{field.label}</label>
                      {field.key === 'meaning' || field.key === 'note' ? (
                          <textarea
                            id={`field-${field.key}`}
                            className="input-field"
                            rows={3}
                            value={fields[field.key] || ""}
                            onChange={(e) => setFields({...fields, [field.key]: e.target.value})}
                            style={{ resize: "vertical" }}
                          />
                      ) : (
                          <input
                            id={`field-${field.key}`}
                            className="input-field"
                            value={fields[field.key] || ""}
                            onChange={(e) => setFields({...fields, [field.key]: e.target.value})}
                            style={{ padding: "12px 16px", fontSize: "1.1rem" }}
                          />
                      )}
                    </div>
                ))
            ) : (
                // Fallback
                <>
                  <div className="input-group">
                    <label htmlFor="card-term" className="input-label">Term / Word</label>
                    <input
                      id="card-term"
                      className="input-field"
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
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      required
                      style={{ resize: "vertical" }}
                    />
                  </div>
                </>
            )}

          <button type="submit" className="primary-btn" style={{ marginTop: 8, padding: "14px", fontSize: "1.1rem" }}>
            Save Changes
          </button>
        </form>

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
      </section>
    </Layout>
  );
}
