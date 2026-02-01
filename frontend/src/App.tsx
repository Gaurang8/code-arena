import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch } from "./app/hooks";
import { loadUser } from "./features/auth/authThunks";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
