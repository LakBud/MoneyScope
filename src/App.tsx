import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import TransactionDetailPage from "./components/transactions/TransactionDetailPage";
import HomePage from "./components/home/HomePage";
import NavBar from "./components/NavBar";
import TransactionListPage from "./components/transactions/TransactionListPage";
import ModernChartsBg from "./components/AnimatedChartBg";

function App() {
  return (
    <>
      {/* Background gradient div (in HomePage or a global wrapper) should have z-0 */}
      <ModernChartsBg /> {/* z-10, above gradient but below UI */}
      <NavBar /> {/* UI elements with z-20 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionListPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
