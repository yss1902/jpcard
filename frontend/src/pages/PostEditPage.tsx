import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import type { Post } from "../types/post";

// Assuming Post type exists or I need to infer it.
// Let's check `frontend/src/types` to be sure, but I'll write it assuming standard shape.
// Actually I should verify if types/post.ts exists.

export default function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    api
      .get<Post>(`/posts/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch((err) => {
        console.error(err);
        setStatus("게시글을 찾을 수 없습니다.");
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/posts/${id}`, { title, content });
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setStatus("수정에 실패했습니다.");
    }
  };

  return (
    <Layout pageTitle="Edit Post" subtitle="게시글 수정">
      <section className="glass-card">
        <h2 className="card-title">게시글 수정</h2>
        {status && <p className="muted">{status}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label htmlFor="post-title" style={{ display: "block", marginBottom: 4 }} className="muted">
              제목 (Title)
            </label>
            <input
              id="post-title"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="post-content" style={{ display: "block", marginBottom: 4 }} className="muted">
              내용 (Content)
            </label>
            <textarea
              id="post-content"
              className="input-field"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary-btn" style={{ marginTop: 8 }}>
            수정 완료
          </button>
        </form>
      </section>
    </Layout>
  );
}
