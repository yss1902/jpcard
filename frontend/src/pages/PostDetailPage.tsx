import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { useParams, Link } from "react-router-dom";
import type { Post } from "../types/post";
import type { Comment } from "../types/comment";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = () => {
    api.get<Post>(`/posts/${id}`).then(res => {
        setPost(res.data);
        setLoading(false);
    }).catch(console.error);
  };

  const fetchComments = () => {
    api.get<Comment[]>(`/posts/${id}/comments`).then(res => setComments(res.data)).catch(console.error);
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      const res = await api.post<Post>(`/posts/${id}/like`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/posts/${id}/comments`, { content: newComment });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Layout pageTitle="Loading..."><p>Please wait</p></Layout>;
  if (!post) return <Layout pageTitle="Not Found"><p>Post not found.</p></Layout>;

  return (
    <Layout pageTitle={post.title} subtitle="Post Detail">
      <section className="glass-card">
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, marginBottom: 20 }}>
           {post.content}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
           <button className="secondary-btn" onClick={handleLike}>
              ♥ Like {post.likeCount}
           </button>
           <Link to="/posts" className="muted" style={{ textDecoration: 'underline' }}>Back to List</Link>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: "20px 0" }} />

        <h3 className="item-title" style={{ marginBottom: 15 }}>Comments ({comments.length})</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
           {comments.map(c => (
              <div key={c.id} style={{ background: "rgba(255,255,255,0.05)", padding: 10, borderRadius: 8 }}>
                 {c.content}
              </div>
           ))}
           {comments.length === 0 && <p className="muted">No comments yet.</p>}
        </div>

        <form onSubmit={handleAddComment} style={{ display: "flex", gap: 10 }}>
           <input
             className="input-field"
             style={{ flex: 1 }}
             placeholder="Add a comment..."
             value={newComment}
             onChange={e => setNewComment(e.target.value)}
           />
           <button type="submit" className="primary-btn">Post</button>
        </form>
      </section>
    </Layout>
  );
}
