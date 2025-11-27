import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import type { Card } from "../types/card";

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    api.get<Card[]>("/cards").then((res) => setCards(res.data));
  }, []);

  return (
    <Layout>
      <h1>Cards</h1>
      <Link to="/cards/create">Create Card</Link>
      <ul>
        {cards.map((c) => (
          <li key={c.id}>
            {c.term} - {c.meaning}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
