import type { ReactNode } from "react";

import { Link } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/cards">Cards</Link> |{" "}
        <Link to="/posts">Posts</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
