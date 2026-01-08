import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import type { JSX } from "react";
import { ROUTES } from "./path";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { user, loading } = useAppSelector((s) => s.auth);
  if (loading.me) return <div>Loading...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  return children;
}
