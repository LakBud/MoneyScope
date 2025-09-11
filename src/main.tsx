import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./main.css";
import { BrowserRouter } from "react-router-dom";
import { TransactionsProvider } from "./hooks/UseTransactions.tsx";
import { BudgetsProvider } from "./hooks/UseBudgets.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TransactionsProvider>
      <BudgetsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BudgetsProvider>
    </TransactionsProvider>
  </StrictMode>
);
