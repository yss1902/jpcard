import { useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";

export default function PostCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onCreate = async () => {
    await api.post("/posts", { title, content });
    alert("게시글 작성 완료");
  };

  return (
    <Layout>
      <h1>Create Post</h1>
      <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
      <br />
      <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
      <br />
      <button onClick={onCreate}>Create</button>
    </Layout>
  );
}
