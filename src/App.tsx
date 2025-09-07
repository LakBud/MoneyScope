import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import TransactionDetailPage from "./components/transactions/TransactionDetailPage";
import HomePage from "./components/home/HomePage";
import NavBar from "./components/NavBar";
import TransactionListPage from "./components/transactions/TransactionListPage";
import BudgetDetailPage from "./components/transactions/budget/BudgetDetailPage";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionListPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        <Route path="/budgets/:id" element={<BudgetDetailPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
