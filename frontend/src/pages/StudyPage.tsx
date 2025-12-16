import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import type { Card } from "../types/card";
import "../App.css"; // Ensure CSS is available

export default function StudyPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAll, setShowAll] = useState(true); // Toggle between "All" and "Pending"

  useEffect(() => {
    fetchCards();
  }, []);

  const filteredCards = showAll ? cards : cards.filter((c) => !c.isMemorized);
  const currentCard = filteredCards[currentIndex];

  // Fix: Clamp currentIndex if it goes out of bounds when list shrinks
  useEffect(() => {
    if (filteredCards.length > 0 && currentIndex >= filteredCards.length) {
      setCurrentIndex(Math.max(0, filteredCards.length - 1));
    }
  }, [filteredCards.length, currentIndex]);

  const fetchCards = () => {
    setLoading(true);
    api
      .get<Card[]>("/cards")
      .then((res) => {
        setCards(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 200);
  };

  const toggleMemorized = async () => {
    if (!currentCard) return;
    const newStatus = !currentCard.isMemorized;
    try {
      // PATCH expects boolean body, usually JSON or text.
      // Spring @RequestBody boolean often requires "true" or "false" as raw body with Content-Type application/json
      await api.patch(`/cards/${currentCard.id}/memorized`, newStatus, {
        headers: { "Content-Type": "application/json" }
      });

      // Update local state
      const updatedCards = cards.map(c => c.id === currentCard.id ? { ...c, isMemorized: newStatus } : c);
      setCards(updatedCards);
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  if (loading) return <Layout pageTitle="Study Mode"><p className="muted">Loading cards...</p></Layout>;

  if (filteredCards.length === 0) {
    return (
      <Layout pageTitle="Study Mode">
         <section className="glass-card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <h2 className="card-title">No cards to study!</h2>
            <p className="muted">{showAll ? "Create some cards first." : "All cards are memorized! Good job."}</p>
            {!showAll && (
              <button className="primary-btn" onClick={() => setShowAll(true)} style={{ marginTop: 20 }}>
                Review All Cards
              </button>
            )}
         </section>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Study Mode" subtitle="Flip cards and test your memory">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
         <label className="muted" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem" }}>
            <input type="checkbox" checked={!showAll} onChange={() => { setShowAll(!showAll); setCurrentIndex(0); setIsFlipped(false); }} />
            Hide Memorized
         </label>
      </div>

      <div className="study-container">
        <div
          className={`flash-card ${isFlipped ? "flipped" : ""}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="card-face card-front">
            <span className="card-label">TERM</span>
            <h2>{currentCard.term}</h2>
            <p className="click-hint">Click to flip</p>
          </div>
          <div className="card-face card-back">
            <span className="card-label">MEANING</span>
            <h2>{currentCard.meaning}</h2>
          </div>
        </div>

        <div className="controls">
           <button className="nav-btn" onClick={handlePrev}>&larr; Prev</button>
           <div className="status-display">
              {currentIndex + 1} / {filteredCards.length}
           </div>
           <button className="nav-btn" onClick={handleNext}>Next &rarr;</button>
        </div>

        <div className="action-row">
           <button
             className={`memorize-btn ${currentCard.isMemorized ? "active" : ""}`}
             onClick={(e) => { e.stopPropagation(); toggleMemorized(); }}
           >
             {currentCard.isMemorized ? "Mark as Forgotten" : "Mark as Memorized"}
           </button>
        </div>
      </div>

      {/* Inline Styles for this page specifically, or add to App.css */}
      <style>{`
        .study-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .flash-card {
          width: 100%;
          max-width: 400px;
          height: 250px;
          position: relative;
          perspective: 1000px;
          cursor: pointer;
        }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          transition: transform 0.6s;
          background: rgba(20, 20, 20, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }
        .card-front {
          transform: rotateY(0deg);
        }
        .flipped .card-front {
          transform: rotateY(180deg);
        }
        .card-back {
          transform: rotateY(180deg);
        }
        .flipped .card-back {
          transform: rotateY(0deg);
        }
        .card-label {
          position: absolute;
          top: 16px;
          left: 16px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .click-hint {
          position: absolute;
          bottom: 16px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
        }
        .controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        .status-display {
          color: rgba(255,255,255,0.6);
          font-variant-numeric: tabular-nums;
        }
        .memorize-btn {
           background: rgba(255, 255, 255, 0.05);
           border: 1px solid rgba(255, 255, 255, 0.2);
           color: #aaa;
           padding: 10px 24px;
           border-radius: 8px;
           cursor: pointer;
           font-size: 0.9rem;
           transition: all 0.3s;
        }
        .memorize-btn:hover {
           background: rgba(255, 255, 255, 0.1);
           color: white;
        }
        .memorize-btn.active {
           background: #fff;
           color: #000;
           border-color: #fff;
           font-weight: 600;
        }
      `}</style>
    </Layout>
  );
}
