import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";

export default function PostCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const onCreate = async () => {
    try {
      await api.post("/posts", { title, content });
      setStatus("게시글을 발행했습니다. 목록에서 확인하세요!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setStatus("게시글 작성 실패. API 연결 상태를 확인하세요.");
    }
  };

  return (
    <Layout pageTitle="Write Post" subtitle="담백한 흑백 카드에 이야기를 남기세요">
      <section className="glass-card">
        <div className="card-header">
          <div>
            <p className="muted">Community Note</p>
            <h2 className="card-title">새 글 작성</h2>
          </div>
          <button className="secondary-btn" onClick={() => { setTitle(""); setContent(""); }}>
            비우기
          </button>
        </div>
        <div className="form-grid">
          <div className="input-field">
            <label htmlFor="post-title">제목</label>
            <input
              id="post-title"
              className="text-input"
              placeholder="제목을 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="post-content">내용</label>
            <textarea
              id="post-content"
              className="text-area"
              placeholder="내용을 입력"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button className="primary-btn" onClick={onCreate}>
            게시글 발행
          </button>
          {status && <p className="muted">{status}</p>}
        </div>
      </section>
    </Layout>
  );
}
