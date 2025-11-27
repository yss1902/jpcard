import { useEffect, useState } from "react";
import { api } from "../libs/api";
import Layout from "../components/Layout";
import type { User } from "../types/user";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.get<User>("/users/me").then((res) => setUser(res.data));
  }, []);

  return (
    <Layout>
      <h1>User Info</h1>
      {user && (
        <div>
          <p>ID: {user.username}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </Layout>
  );
}
