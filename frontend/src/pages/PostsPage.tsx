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
    <Layout pageTitle="Posts">
      <section className="glass-card">
        <div className="card-header">
          <h2 className="card-title">Posts</h2>
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
                <div style={{ flex: 1 }}>
                  <Link to={`/posts/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="item-title">{p.title}</h3>
                  </Link>
                  <p className="item-subtitle" style={{ whiteSpace: "pre-wrap" }}>
                    {p.content}
                  </p>
                  <div style={{ marginTop: 8, display: 'flex', gap: 10, fontSize: '0.85rem', alignItems: 'center' }} className="muted">
                     <button
                       className="secondary-btn"
                       style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                       onClick={() => {
                          api.post(`/posts/${p.id}/like`).then(res => {
                             setPosts(posts.map(post => post.id === p.id ? res.data : post));
                          }).catch(console.error);
                       }}
                     >
                       ♥ {p.likeCount}
                     </button>
                     <Link to={`/posts/${p.id}`} className="muted" style={{ textDecoration: 'underline' }}>View Comments</Link>
                  </div>
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
