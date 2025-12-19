import { useState, useRef } from "react";
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const insertMarkdown = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    setContent(newText);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      if (start === end) {
         // If no selection, place cursor inside the markers
         const cursorPos = start + prefix.length;
         textarea.setSelectionRange(cursorPos, cursorPos);
      } else {
         // If selection, select the wrapped text including markers
         textarea.setSelectionRange(start, start + prefix.length + selection.length + suffix.length);
      }
    }, 0);
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

            {/* Markdown Toolbar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <button type="button" className="secondary-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => insertMarkdown("**", "**")}>Bold</button>
                <button type="button" className="secondary-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => insertMarkdown("*", "*")}>Italic</button>
                <button type="button" className="secondary-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => insertMarkdown("# ", "")}>H1</button>
                <button type="button" className="secondary-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => insertMarkdown("## ", "")}>H2</button>
                <button type="button" className="secondary-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => insertMarkdown("[", "](url)")}>Link</button>
                <button type="button" className="secondary-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => insertMarkdown("`", "`")}>Code</button>
                <button type="button" className="secondary-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => insertMarkdown("> ", "")}>Quote</button>
                <button type="button" className="secondary-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => insertMarkdown("- ", "")}>List</button>
            </div>

            <textarea
              id="post-content"
              ref={textareaRef}
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
