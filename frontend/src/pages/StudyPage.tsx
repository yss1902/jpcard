import { useEffect, useState } from "react";
import { api } from "../libs/api";
import { speak } from "../libs/tts";
import Layout from "../components/Layout";
import type { Card } from "../types/card";
import type { Deck } from "../types/deck";
import type { CardTemplate, FieldDefinition } from "../types/template";
import { useSearchParams } from "react-router-dom";
import "../App.css"; // Ensure CSS is available

export default function StudyPage() {
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get("deckId");

  const [cards, setCards] = useState<Card[]>([]);
  const [template, setTemplate] = useState<CardTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchData();
  }, [deckId]);

  const fetchData = async () => {
    setLoading(true);
    try {
        if (deckId) {
            const deckRes = await api.get<Deck>(`/decks/${deckId}`);
            if (deckRes.data.templateId) {
                const tmplRes = await api.get<CardTemplate[]>(`/templates`);
                const tmpl = tmplRes.data.find(t => t.id === deckRes.data.templateId);
                setTemplate(tmpl || null);
            }
        }

        const endpoint = deckId ? `/study/due?deckId=${deckId}` : "/cards";
        const cardsRes = await api.get<Card[]>(endpoint);
        setCards(cardsRes.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  // Helper to get fields
  const getFields = () => template ? JSON.parse(template.structureJson) as FieldDefinition[] : [];
  const frontFields = getFields().filter(f => f.position === "FRONT");
  const backFields = getFields().filter(f => f.position === "BACK");

  const currentCard = cards[currentIndex];

  const handleReview = async (rating: string) => {
    if (!currentCard) return;
    try {
        await api.post("/study/review", { cardId: currentCard.id, rating });
        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Refetch
            fetchData();
            setCurrentIndex(0);
        }
    } catch (err) {
        console.error(err);
    }
  };

  if (loading) return <Layout pageTitle="Study Mode"><p className="muted">Loading cards...</p></Layout>;

  if (cards.length === 0) {
    return (
      <Layout pageTitle="Study Mode">
         <section className="glass-card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <h2 className="card-title">All caught up!</h2>
            <p className="muted">No cards due for review right now.</p>
         </section>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Study Mode">
      <div className="study-container">
        <div
          className={`flash-card ${isFlipped ? "flipped" : ""}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* FRONT */}
          <div className="card-face card-front">
            {frontFields.length > 0 ? (
                frontFields.map((f) => (
                    <div key={f.key} style={{ marginBottom: 10 }}>
                        <span className="card-label">{f.label}</span>
                        <h2>{currentCard.fields?.[f.key] || currentCard.term}</h2>
                        <button
                          className="icon-btn"
                          onClick={(e) => { e.stopPropagation(); speak(currentCard.fields?.[f.key] || currentCard.term); }}
                          style={{ position: 'absolute', top: 16, right: 16 }}
                        >
                          🔊
                        </button>
                    </div>
                ))
            ) : (
                // Fallback
                <>
                    <span className="card-label">TERM</span>
                    <h2>{currentCard.term}</h2>
                    <button
                      className="icon-btn"
                      onClick={(e) => { e.stopPropagation(); speak(currentCard.term); }}
                      style={{ position: 'absolute', top: 16, right: 16 }}
                    >
                      🔊
                    </button>
                </>
            )}
            <p className="click-hint">Click to flip</p>
          </div>

          {/* BACK */}
          <div className="card-face card-back">
             {backFields.length > 0 ? (
                backFields.map((f) => (
                    <div key={f.key} style={{ marginBottom: 15 }}>
                        <span className="card-label">{f.label}</span>
                        <h3 style={{ margin: '5px 0' }}>{currentCard.fields?.[f.key] || (f.key === 'meaning' ? currentCard.meaning : '')}</h3>
                        <button
                          className="icon-btn"
                          onClick={(e) => {
                              e.stopPropagation();
                              speak(currentCard.fields?.[f.key] || (f.key === 'meaning' ? currentCard.meaning : ''), "en-US");
                          }}
                          style={{ marginLeft: 10, fontSize: '0.8rem' }}
                        >
                          🔊
                        </button>
                    </div>
                ))
             ) : (
                // Fallback
                <>
                    <span className="card-label">MEANING</span>
                    <h2>{currentCard.meaning}</h2>
                    <button
                      className="icon-btn"
                      onClick={(e) => { e.stopPropagation(); speak(currentCard.meaning, "en-US"); }}
                      style={{ position: 'absolute', top: 16, right: 16 }}
                    >
                      🔊
                    </button>
                </>
             )}
          </div>
        </div>

        {!isFlipped ? (
            <div className="controls" style={{ marginTop: 20 }}>
               <p className="muted">Tap card to see meaning</p>
            </div>
        ) : (
            <div className="action-row" style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
               <button className="nav-btn" style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }} onClick={() => handleReview("FAIL")}>
                 Again (&lt;1m)
               </button>
               <button className="nav-btn" style={{ borderColor: '#faad14', color: '#faad14' }} onClick={() => handleReview("HARD")}>
                 Hard (12h)
               </button>
               <button className="nav-btn" style={{ borderColor: '#52c41a', color: '#52c41a' }} onClick={() => handleReview("GOOD")}>
                 Good (1d)
               </button>
               <button className="nav-btn" style={{ borderColor: '#1890ff', color: '#1890ff' }} onClick={() => handleReview("EASY")}>
                 Easy (4d)
               </button>
            </div>
        )}
      </div>

      {/* Inline Styles */}
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
      `}</style>
    </Layout>
  );
}
