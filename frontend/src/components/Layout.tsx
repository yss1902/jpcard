import type { ReactNode } from "react";

import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  subtitle?: string;
}

export default function Layout({ children, pageTitle, subtitle }: LayoutProps) {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/decks", label: "Decks" },
    { to: "/study", label: "Study" },
    { to: "/posts", label: "Posts" },
    { to: "/register", label: "Sign Up" },
    { to: "/user", label: "My Page" },
    { to: "/login", label: "Login" },
  ];

  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="top-nav">
          <div className="brand">
            <span className="brand-dot" /> JP Card Studio
          </div>
          <div className="nav-links">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link"
                style={{
                  borderColor:
                    pathname === link.to ? "rgba(255, 255, 255, 0.25)" : undefined,
                  background:
                    pathname === link.to ? "rgba(255, 255, 255, 0.08)" : undefined,
                  color: pathname === link.to ? "#ffffff" : undefined,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </header>

        {(pageTitle || subtitle) && (
          <div className="glass-card" style={{ marginBottom: 14 }}>
            <div className="card-header">
              <h1 className="card-title">{pageTitle ?? ""}</h1>
              <span className="pill">
                <span className="pill-dot" />
                Modern Black & White
              </span>
            </div>
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
        )}

        <main className="content-area">{children}</main>

        <footer className="footer">
          <span className="status">
            <span className="status-dot" /> Crafted UI with monochrome sheen
          </span>
          <span className="muted">Connected to backend @ localhost:8080/api</span>
        </footer>
      </div>
    </div>
  );
}
