import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiFilter, FiEdit } from "react-icons/fi";
import TransactionForm from "./TransactionForm";
import TransactionList from "../dashboard/list/TransactionList";
import TransactionListFilters from "../dashboard/list/TransactionListFilters";
import { useTransactions } from "../hooks/UseTransactions";

const TransactionListPage = () => {
  const { transactions, setTransactions } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<(typeof transactions)[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  const handleSave = (transaction: (typeof transactions)[0]) => {
    const exists = transactions.find((t) => t.id === transaction.id);
    if (exists) {
      setTransactions(transactions.map((t) => (t.id === transaction.id ? transaction : t)));
    } else {
      setTransactions([...transactions, transaction]);
    }
    setEditingTransaction(null);
  };

  const displayedTransactions = useMemo(() => filteredTransactions, [filteredTransactions]);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-indigo-900 flex items-center gap-2 ">
          <FiPlus className="text-indigo-600 w-8 h-8" /> Transactions
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-indigo-200 text-indigo-800 py-2 px-4 rounded-2xl flex items-center gap-2 hover:bg-indigo-300 hover:text-indigo-900 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <FiFilter /> Filters
          </button>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white py-2 px-4 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <FiPlus /> New Transaction
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <TransactionListFilters
        transactions={transactions}
        setFilteredTransactions={setFilteredTransactions}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Transaction list with animated filtering */}
      <div className="mt-6 grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {displayedTransactions.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-colors duration-300
                ${
                  t.value >= 0
                    ? "bg-green-50 border-l-4 border-green-400 hover:bg-green-100"
                    : "bg-red-50 border-l-4 border-red-400 hover:bg-red-100"
                }`}
            >
              <TransactionList transactions={[t]} linkToPage="/transactions" />

              {/* Edit button */}
              <button
                onClick={() => {
                  setEditingTransaction(t);
                  setShowForm(true);
                }}
                className="absolute top-3 right-3 bg-indigo-600 text-white p-2 rounded-lg shadow hover:bg-indigo-700 hover:shadow-lg transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label={`Edit transaction ${t.title}`}
              >
                <FiEdit />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Transaction Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TransactionForm
              onClose={() => setShowForm(false)}
              onSave={handleSave}
              defaultValues={editingTransaction || undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        className="mt-20 text-indigo-700/80 text-sm sm:text-base text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        &copy; {new Date().getFullYear()} MoneyScope. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default TransactionListPage;
