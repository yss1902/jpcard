import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function HomePage() {
  const shortcuts = [
    { label: "Decks", to: "/decks" },
    { label: "All Cards", to: "/cards" },
    { label: "Study Mode", to: "/study" },
    { label: "Community", to: "/posts" },
    { label: "Dashboard", to: "/dashboard" },
  ];

  return (
    <Layout pageTitle="Home">
      <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {shortcuts.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="glass-card"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 120,
              textAlign: 'center',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 className="item-title" style={{ margin: 0, fontSize: '1.2rem' }}>{s.label}</h3>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
