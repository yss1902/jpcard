import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const onCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      }

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowSuccess(true);
      setTimeout(() => navigate("/posts"), 1500);
    } catch (err) {
      console.error(err);
      setStatus("게시글 작성 실패. API 연결 상태를 확인하세요.");
    }
  };

  return (
    <Layout pageTitle="Write Post">
      <SuccessModal
        isOpen={showSuccess}
        message="Post Published!"
        onClose={() => navigate("/posts")}
      />
      <section className="glass-card">
        <div className="card-header">
          <h2 className="card-title">New Post</h2>
          <button className="secondary-btn" onClick={() => { setTitle(""); setContent(""); }}>
            Clear
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
              placeholder="내용을 입력 (Markdown 지원)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="post-files">첨부 파일</label>
            <input
              id="post-files"
              type="file"
              multiple
              className="text-input"
              onChange={(e) => setFiles(e.target.files)}
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
