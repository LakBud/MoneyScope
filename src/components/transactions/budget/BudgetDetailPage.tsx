import { useParams, useNavigate, Link } from "react-router-dom";
import { useTransactions, type Transaction } from "../../hooks/UseTransactions";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiArrowLeft, FiEdit2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState, useEffect } from "react";
import BudgetForm from "./BudgetForm";

interface Budget {
  id: string;
  category: string;
  limit: number;
}

interface BudgetDetailPageProps {
  budgets?: Budget[];
  setBudgets?: React.Dispatch<React.SetStateAction<Budget[]>>;
}

const BudgetDetailPage = ({ budgets: propsBudgets, setBudgets: propsSetBudgets }: BudgetDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions } = useTransactions();

  const [budgets, setBudgets] = useState<Budget[] | null>(propsBudgets ?? null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTransactions, setShowTransactions] = useState(true);

  // Load budgets if not passed via props
  useEffect(() => {
    if (!propsBudgets) {
      const saved = localStorage.getItem("budgets");
      setBudgets(saved ? JSON.parse(saved) : []);
    }
  }, [propsBudgets]);

  // Helper to update budgets and persist
  const updateBudgets = (updated: Budget[]) => {
    if (propsSetBudgets) {
      propsSetBudgets(updated);
    } else {
      setBudgets(updated);
      localStorage.setItem("budgets", JSON.stringify(updated));
    }
  };

  if (!budgets) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100">
        <p className="text-indigo-800 mt-12 text-center text-lg">Loading budgets...</p>
      </div>
    );
  }

  // Find the budget safely
  const budget = budgets.find((b) => b.id.toString() === id);

  if (!budget) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100">
        <p className="text-red-500 text-lg font-semibold">Budget not found!</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center gap-2 text-indigo-600 font-medium underline hover:text-indigo-800 transition-colors"
        >
          <FiArrowLeft /> Back to Previous Page
        </button>
      </div>
    );
  }

  const budgetTransactions: Transaction[] = transactions.filter((t) => t.category === budget.category);
  const totalSpent = budgetTransactions.reduce((acc, t) => acc - t.value, 0);
  const percent = budget.limit > 0 ? Math.min(Math.max((totalSpent / budget.limit) * 100, 0), 100) : 0;
  const barColor = percent >= 100 ? "bg-red-500" : percent >= 80 ? "bg-yellow-500" : "bg-green-500";

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the budget "${budget.category}"?`)) {
      updateBudgets(budgets.filter((b) => b.id !== budget.id));
      navigate(-1);
    }
  };

  const handleSave = (category: string, limit: number) => {
    updateBudgets(budgets.map((b) => (b.id === budget.id ? { ...b, category, limit } : b)));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100">
      {/* Header */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 z-2">
        <button
          onClick={() => navigate(-1)}
          className="self-start flex items-center gap-2 text-indigo-600 font-medium underline mb-6 hover:text-indigo-800 transition-colors hover:cursor-pointer"
        >
          <FiArrowLeft /> Back to Previous Page
        </button>

        {/* Budget Card */}
        <motion.div
          className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col gap-4 border-t-4 border-indigo-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Budget Info */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900">{budget.category}</h2>
            <span className="text-indigo-800 font-medium text-sm sm:text-base">Budget Limit: ${budget.limit.toFixed(2)}</span>

            {/* Progress Bar */}
            <div className="relative w-full h-5 bg-gray-200 rounded-full shadow-inner mt-2 overflow-hidden">
              <motion.div
                className={`absolute left-0 top-0 h-5 rounded-full ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              <span className="absolute right-3 top-0 text-sm font-semibold text-indigo-900">{percent.toFixed(0)}%</span>
            </div>

            <div className="flex justify-between text-sm text-indigo-700 mt-1">
              <p>Spent: ${totalSpent.toFixed(2)}</p>
            </div>
          </div>

          {/* Transactions Section */}
          <div
            className="flex justify-between items-center mt-4 cursor-pointer"
            onClick={() => setShowTransactions((prev) => !prev)}
          >
            <h3 className="text-xl font-semibold text-indigo-900">Transactions</h3>
            {showTransactions ? <FiChevronUp /> : <FiChevronDown />}
          </div>

          <AnimatePresence>
            {showTransactions && (
              <motion.div
                className="flex flex-col gap-2 mt-2 max-h-78 overflow-y-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                {budgetTransactions.length === 0 ? (
                  <p className="text-indigo-800/70 italic text-center py-4 bg-white/80 rounded-2xl shadow border border-indigo-100">
                    No transactions for this budget yet.
                  </p>
                ) : (
                  budgetTransactions.map((t) => (
                    <Link key={t.id} to={`/transactions/${t.id}`}>
                      <motion.div
                        layout
                        whileHover={{ scale: 1.02, backgroundColor: "#eef2ff" }}
                        className="p-3 bg-white/80 rounded-2xl shadow flex justify-between items-center border border-indigo-100 transition cursor-pointer m-1"
                      >
                        <div className="flex items-center gap-3">
                          {t.emoji && t.color && (
                            <div
                              className="w-10 h-10 flex items-center justify-center rounded-full text-xl"
                              style={{ backgroundColor: t.color }}
                            >
                              {t.emoji}
                            </div>
                          )}

                          <div className="flex flex-col">
                            <span className="text-indigo-900 font-medium">{t.title}</span>
                            <span className="text-sm text-indigo-600">{t.category}</span>
                          </div>
                        </div>
                        <span className={`font-semibold ${t.value >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {t.value >= 0 ? `+$${t.value.toFixed(2)}` : `-$${Math.abs(t.value).toFixed(2)}`}
                        </span>
                      </motion.div>
                    </Link>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 w-full">
            <motion.button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 hover:cursor-pointer"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.97 }}
            >
              <FiEdit2 /> Edit
            </motion.button>

            <motion.button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl shadow-lg hover:bg-red-600 transition-all duration-200 hover:cursor-pointer"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(255,0,0,0.3)" }}
              whileTap={{ scale: 0.97 }}
            >
              <FiTrash2 /> Delete
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BudgetForm
              onClose={() => setIsEditing(false)}
              onSave={(category, limit) => handleSave(category, limit)}
              defaultValues={{ category: budget.category, limit: budget.limit }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-indigo-700/80 text-sm sm:text-base text-center py-4 mt-10 bg-white/40 backdrop-blur-md">
        &copy; {new Date().getFullYear()} MoneyScope. All rights reserved.
      </footer>
    </div>
  );
};

export default BudgetDetailPage;
