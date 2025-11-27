import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CardsPage from "../pages/CardsPage";
import CardCreatePage from "../pages/CardCreatePage";
import PostsPage from "../pages/PostsPage";
import PostCreatePage from "../pages/PostCreatePage";
import UserPage from "../pages/UserPage";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/cards", element: <CardsPage /> },
  { path: "/cards/create", element: <CardCreatePage /> },
  { path: "/posts", element: <PostsPage /> },
  { path: "/posts/create", element: <PostCreatePage /> },
  { path: "/user", element: <UserPage /> },
  { path: "/", element: <HomePage /> }, 
]);
