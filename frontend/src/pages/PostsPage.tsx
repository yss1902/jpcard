import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import type { Post } from "../types/post";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api.get<Post[]>("/posts").then((res) => setPosts(res.data));
  }, []);

  return (
    <Layout>
      <h1>Posts</h1>
      <Link to="/posts/create">Write Post</Link>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </Layout>
  );
}
