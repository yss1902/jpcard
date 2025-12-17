import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function DeckCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/decks", { name, description });
      navigate("/decks");
    } catch (err) {
      console.error(err);
      setStatus("Failed to create deck.");
    }
  };

  return (
    <Layout pageTitle="Create Deck" subtitle="New collection of cards">
      <section className="glass-card">
        <h2 className="card-title">New Deck</h2>
        {status && <p className="muted">{status}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label htmlFor="deck-name" style={{ display: "block", marginBottom: 4 }} className="muted">
              Name
            </label>
            <input
              id="deck-name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="deck-desc" style={{ display: "block", marginBottom: 4 }} className="muted">
              Description
            </label>
            <textarea
              id="deck-desc"
              className="input-field"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="primary-btn" style={{ marginTop: 8 }}>
            Create Deck
          </button>
        </form>
      </section>
    </Layout>
  );
}
