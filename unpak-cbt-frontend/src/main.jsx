import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/global.css";
import { AuthProvider } from "./context/authContext.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
