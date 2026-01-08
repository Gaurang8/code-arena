import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch } from "./app/hooks";
import { initCSRF } from "./services/csrf";
import { loadUser } from "./features/auth/authThunks";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initCSRF().then(() => {
      dispatch(loadUser());
    });
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
