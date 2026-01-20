import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppContextProvider } from "./context/AppContext";
import { AdminProvider } from "./context/AdminContext";


createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AppContextProvider>
      <AdminProvider>
        <App />
      </AdminProvider>
    </AppContextProvider>

  </StrictMode>
);
