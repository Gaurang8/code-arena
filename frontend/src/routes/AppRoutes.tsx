import HomePage from "@/pages/HomePage";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./path";
import LoginPage from "@/pages/LoginPage";
import AuthGuard from "./AuthGuard";
import AdminLayout from "@/pages/AdminLayout";
import TaskPage from "@/pages/TaskPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <AuthGuard>
            <AdminLayout>
              <HomePage />
            </AdminLayout>
          </AuthGuard>
        }
      />
      <Route
        path={ROUTES.TASKS}
        element={
          <AuthGuard>
            <AdminLayout>
              <TaskPage />
            </AdminLayout>
          </AuthGuard>
        }
      />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    </Routes>
  );
}
