import { useAppSelector } from "@/app/hooks";
import { LoginForm } from "@/components/LoginForm";
import { GalleryVerticalEnd } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { user, loading } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  // If already logged in, redirect to home page
  if (loading.me) {
    return <div>Loading...</div>;
  }
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Code Arena
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
