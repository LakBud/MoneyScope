import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TransactionsProvider } from "./components/hooks/UseTransactions.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TransactionsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TransactionsProvider>
  </StrictMode>
);
