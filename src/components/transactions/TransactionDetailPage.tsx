import { useParams, useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/UseTransactions";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiArrowLeft, FiEdit2, FiCreditCard } from "react-icons/fi";
import { useState } from "react";
import TransactionForm from "./TransactionForm";

const TransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { transactions, setTransactions } = useTransactions();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const transaction = transactions.find((t) => t.id === id);

  if (!transaction)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100">
        <header className="flex items-center gap-3 mb-6">
          <FiCreditCard className="w-8 h-8 text-indigo-400 animate-pulse" />
          <h1 className="text-3xl font-bold text-indigo-900">Wallet Wave</h1>
        </header>
        <p className="text-red-500 text-lg font-semibold">Transaction not found!</p>
        <div>
          <button onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back to Previous Page
          </button>
        </div>
      </div>
    );

  const isIncome = transaction.value >= 0;

  // Delete transaction
  const handleDelete = () => {
    setTransactions(transactions.filter((t) => t.id !== id));
    navigate("/dashboard");
  };

  // Save edited transaction
  const handleSave = (updatedTransaction: typeof transaction) => {
    setTransactions(transactions.map((t) => (t.id === transaction.id ? updatedTransaction : t)));

    // Redirect if ID changed
    if (updatedTransaction.id !== transaction.id) {
      navigate(`/transactions/${updatedTransaction.id}`);
    }

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6">
        <button
          onClick={() => navigate(-1)}
          className="self-start flex items-center text-indigo-600 font-medium underline mb-6 hover:text-indigo-800 transition-colors gap-2"
        >
          <FiArrowLeft /> Back to Previous Page
        </button>

        <motion.div
          className={`bg-white shadow-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col items-center gap-4 border-t-8 ${
            isIncome ? "border-green-400" : "border-red-400"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-5xl sm:text-6xl rounded-full mb-3 shadow-inner"
            style={{ backgroundColor: transaction.color + "33" }}
          >
            {transaction.emoji}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 text-center">{transaction.title}</h2>

          <span
            className={`px-3 py-1 rounded-full text-sm sm:text-base font-semibold ${
              isIncome ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {transaction.category}
          </span>

          <p className={`font-extrabold text-2xl sm:text-3xl ${isIncome ? "text-green-600" : "text-red-600"}`}>
            ${transaction.value.toFixed(2)}
          </p>

          <div className="mt-4 w-full flex flex-col sm:flex-row justify-between text-sm sm:text-base text-indigo-500 font-medium">
            <span>ID: {transaction.id}</span>
            <span>Date: {new Date(transaction.date || Date.now()).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-3 mt-6 w-full">
            <motion.button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.97 }}
            >
              <FiEdit2 /> Edit
            </motion.button>

            <motion.button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl shadow-lg hover:bg-red-600 transition-all duration-200"
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
            <TransactionForm
              onClose={() => setIsEditing(false)}
              onSave={handleSave}
              defaultValues={transaction} // Prefill inputs
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-indigo-700/80 text-sm sm:text-base text-center py-4 mt-10 bg-white/40 backdrop-blur-md">
        &copy; {new Date().getFullYear()} Wallet Wave. All rights reserved.
      </footer>
    </div>
  );
};

export default TransactionDetailPage;
