import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import TransactionDetailPage from "../pages/transaction/TransactionDetailPage";
import HomePage from "../pages/home/HomePage";
import TransactionListPage from "../pages/transaction/TransactionListPage";
import BudgetDetailPage from "../pages/transaction/budget/BudgetDetailPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/transactions" element={<TransactionListPage />} />
    <Route path="/transactions/:id" element={<TransactionDetailPage />} />
    <Route path="/budgets/:id" element={<BudgetDetailPage />} />
  </Routes>
);

export default AppRoutes;
