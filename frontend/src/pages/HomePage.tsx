import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function HomePage() {
  const actions = [
    {
      title: "Flash Cards",
      description: "카드를 만들고 단어를 빠르게 암기하세요.",
      to: "/cards",
    },
    {
      title: "Community Posts",
      description: "게시글로 경험을 공유하고 업데이트를 확인하세요.",
      to: "/posts",
    },
    {
      title: "Account",
      description: "로그인 후 내 정보를 확인하고 토큰을 관리하세요.",
      to: "/user",
    },
  ];

  return (
    <Layout
      pageTitle="JP Card Studio"
      subtitle="블랙 & 화이트 톤으로 재해석된 카드/게시글 관리 경험"
    >
      <section className="glass-card">
        <div className="card-header">
          <div>
            <p className="muted">Your bilingual companion</p>
            <h2 className="card-title">학습과 커뮤니티를 한 화면에서</h2>
          </div>
          <Link to="/cards" className="primary-btn">
            카드 둘러보기
          </Link>
        </div>
        <div className="two-column">
          <div className="action-card">
            <p className="muted">Cards</p>
            <h3 className="item-title">플래시카드</h3>
            <p className="item-subtitle">
              단어, 문장, 메모를 카드로 정리하고 빠르게 스크롤하며 검토하세요.
            </p>
          </div>
          <div className="action-card">
            <p className="muted">Posts</p>
            <h3 className="item-title">게시글</h3>
            <p className="item-subtitle">
              단정한 흑백 카드 UI에서 팀 소식을 공유하고 피드백을 모읍니다.
            </p>
          </div>
        </div>
      </section>

      <section className="action-grid">
        {actions.map((action) => (
          <Link key={action.to} to={action.to} className="action-card">
            <div className="card-header" style={{ marginBottom: 6 }}>
              <h3 className="item-title" style={{ margin: 0 }}>
                {action.title}
              </h3>
              <span className="pill">
                <span className="pill-dot" /> Go
              </span>
            </div>
            <p className="muted" style={{ margin: 0 }}>{action.description}</p>
          </Link>
        ))}
      </section>
    </Layout>
  );
}
