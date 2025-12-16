import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import type { Post } from "../types/post";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState("Loading...");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);

    api
      .get<Post[]>(`/posts?${params.toString()}`)
      .then((res) => {
        setPosts(res.data);
        setStatus(res.data.length ? "" : "No posts found.");
      })
      .catch(() => setStatus("Failed to load posts."));
  }, [query]);

  return (
    <Layout pageTitle="Posts" subtitle="Community updates">
      <section className="glass-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Posts</h2>
          </div>
          <Link to="/posts/create" className="primary-btn">
            New Post
          </Link>
        </div>

        {/* Search Bar */}
        <div style={{ margin: "20px 0" }}>
           <input
             className="input-field"
             style={{ width: "100%" }}
             placeholder="Search posts..."
             value={query}
             onChange={(e) => setQuery(e.target.value)}
           />
        </div>

        <p className="muted">{status}</p>
        <div className="card-grid">
          {posts.map((p) => (
            <article key={p.id} className="item-tile">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 className="item-title">{p.title}</h3>
                  <p className="item-subtitle" style={{ whiteSpace: "pre-wrap" }}>
                    {p.content}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/posts/${p.id}/edit`} className="muted" style={{ fontSize: "0.8rem", textDecoration: "underline" }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if(window.confirm("Delete post?")) {
                        api.delete(`/posts/${p.id}`).then(() => {
                           setPosts(posts.filter(post => post.id !== p.id));
                        }).catch(() => alert("Failed to delete"));
                      }
                    }}
                    className="muted"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline", padding: 0 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
