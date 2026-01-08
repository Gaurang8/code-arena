import HomePage from "@/pages/HomePage";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./path";
import LoginPage from "@/pages/LoginPage";
import AuthGuard from "./AuthGuard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <AuthGuard>
            <HomePage />
          </AuthGuard>
        }
      />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    </Routes>
  );
}
