import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import type { Post } from "../types/post";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState("게시글을 불러오는 중...");

  useEffect(() => {
    api
      .get<Post[]>("/posts")
      .then((res) => {
        setPosts(res.data);
        setStatus(res.data.length ? "업데이트 완료" : "게시글이 없습니다. 첫 글을 작성하세요.");
      })
      .catch(() => setStatus("게시글을 불러오지 못했습니다. API를 확인하세요."));
  }, []);

  return (
    <Layout pageTitle="Posts" subtitle="모던 흑백 카드로 정리된 커뮤니티 글">
      <section className="glass-card">
        <div className="card-header">
          <div>
            <p className="muted">Team Updates</p>
            <h2 className="card-title">게시글</h2>
          </div>
          <Link to="/posts/create" className="primary-btn">
            새 글 작성
          </Link>
        </div>
        <p className="muted">{status}</p>
        <div className="card-grid" style={{ marginTop: 14 }}>
          {posts.map((p) => (
            <article key={p.id} className="item-tile">
              <h3 className="item-title">{p.title}</h3>
              <p className="item-subtitle">{p.content}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
