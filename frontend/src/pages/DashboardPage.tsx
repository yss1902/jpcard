import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalCards: number;
  memorizedCards: number;
  learningCards: number;
  newCards: number;
  totalDecks: number;
  totalPosts: number;
  totalLikes: number;
  dueCards: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardStats>("/stats/dashboard")
       .then(res => setStats(res.data))
       .catch(console.error)
       .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout pageTitle="Dashboard"><p className="muted">Loading stats...</p></Layout>;
  if (!stats) return <Layout pageTitle="Dashboard"><p>Could not load statistics.</p></Layout>;

  // Chart Logic
  const total = stats.totalCards || 1; // Prevent div by zero
  const pMemorized = Math.round((stats.memorizedCards / total) * 100);
  const pLearning = Math.round((stats.learningCards / total) * 100);
  const pNew = 100 - pMemorized - pLearning; // Remaining

  // Angles for conic-gradient
  const aMemorized = Math.round((stats.memorizedCards / total) * 360);
  const aLearning = Math.round((stats.learningCards / total) * 360);

  const gradient = `conic-gradient(
      #52c41a 0deg ${aMemorized}deg,
      #faad14 ${aMemorized}deg ${aMemorized + aLearning}deg,
      #444 ${aMemorized + aLearning}deg 360deg
  )`;

  return (
    <Layout pageTitle="Dashboard">
      <div className="glass-card" style={{ marginBottom: 20 }}>
         <h2 className="card-title">Learning Distribution</h2>

         <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 20, flexWrap: 'wrap' }}>
            <div style={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: gradient,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: 110,
                    height: 110,
                    background: '#141414', // Match card bg roughly
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalCards}</span>
                    <span style={{ fontSize: '0.7rem', color: '#888' }}>Total</span>
                </div>
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, background: '#52c41a', borderRadius: '50%' }}></span>
                        Memorized
                    </span>
                    <span>{stats.memorizedCards} ({pMemorized}%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, background: '#faad14', borderRadius: '50%' }}></span>
                        Learning
                    </span>
                    <span>{stats.learningCards} ({pLearning}%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, background: '#444', borderRadius: '50%' }}></span>
                        New / Unseen
                    </span>
                    <span>{stats.newCards} ({pNew}%)</span>
                </div>
            </div>
         </div>
      </div>

      <div className="card-grid">
         <div className="item-tile" style={{ textAlign: 'center', background: 'rgba(24, 144, 255, 0.15)', borderColor: 'rgba(24, 144, 255, 0.3)' }}>
            <h3 className="item-title" style={{ fontSize: '2rem', color: '#40a9ff' }}>{stats.dueCards}</h3>
            <p className="item-subtitle" style={{ color: '#bae7ff' }}>Cards Due Today</p>
            <Link to="/study" style={{ marginTop: 10, display: 'inline-block', fontSize: '0.8rem', textDecoration: 'underline', color: 'inherit' }}>Start Review</Link>
         </div>
         <div className="item-tile" style={{ textAlign: 'center' }}>
            <h3 className="item-title" style={{ fontSize: '2rem' }}>{stats.totalDecks}</h3>
            <p className="item-subtitle">Decks Created</p>
            <Link to="/decks" style={{ marginTop: 10, display: 'inline-block', fontSize: '0.8rem', textDecoration: 'underline', color: 'inherit' }}>Manage Decks</Link>
         </div>
         <div className="item-tile" style={{ textAlign: 'center' }}>
            <h3 className="item-title" style={{ fontSize: '2rem' }}>{stats.totalPosts}</h3>
            <p className="item-subtitle">Posts Shared</p>
            <Link to="/posts" style={{ marginTop: 10, display: 'inline-block', fontSize: '0.8rem', textDecoration: 'underline', color: 'inherit' }}>View Community</Link>
         </div>
         <div className="item-tile" style={{ textAlign: 'center' }}>
            <h3 className="item-title" style={{ fontSize: '2rem' }}>{stats.totalLikes}</h3>
            <p className="item-subtitle">Community Likes</p>
         </div>
      </div>
    </Layout>
  );
}
