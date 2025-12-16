import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CardsPage from "../pages/CardsPage";
import CardCreatePage from "../pages/CardCreatePage";
import CardEditPage from "../pages/CardEditPage";
import DecksPage from "../pages/DecksPage";
import DeckCreatePage from "../pages/DeckCreatePage";
import DeckDetailPage from "../pages/DeckDetailPage";
import StudyPage from "../pages/StudyPage";
import PostsPage from "../pages/PostsPage";
import PostCreatePage from "../pages/PostCreatePage";
import PostEditPage from "../pages/PostEditPage";
import UserPage from "../pages/UserPage";
import HomePage from "../pages/HomePage";
import ErrorPage from "../components/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "cards", element: <CardsPage /> },
      { path: "cards/create", element: <CardCreatePage /> },
      { path: "cards/:id/edit", element: <CardEditPage /> },
      { path: "decks", element: <DecksPage /> },
      { path: "decks/create", element: <DeckCreatePage /> },
      { path: "decks/:id", element: <DeckDetailPage /> },
      { path: "study", element: <StudyPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "posts/create", element: <PostCreatePage /> },
      { path: "posts/:id/edit", element: <PostEditPage /> },
      { path: "user", element: <UserPage /> },
    ],
  },
]);
