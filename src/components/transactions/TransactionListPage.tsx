import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiFilter, FiEdit, FiBarChart, FiInfo, FiMinus } from "react-icons/fi";
import TransactionForm from "./TransactionForm";
import TransactionList from "../dashboard/list/TransactionList";
import TransactionListFilters from "../dashboard/list/TransactionListFilters";
import { useTransactions, type Transaction } from "../hooks/UseTransactions";
import BudgetList from "./budget/BudgetList";

const TransactionListPage = () => {
  const { transactions, setTransactions } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTransactions, setShowTransactions] = useState(true);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

  // Sync filtered transactions whenever transactions change
  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  // Handle saving a transaction (new or edited)
  const handleSave = (transaction: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: transaction.id || crypto.randomUUID(),
      title: transaction.title || "Untitled",
      value: transaction.value ?? 0,
      category: transaction.category || "General",
      date: transaction.date || new Date().toISOString(),
      emoji: transaction.emoji || "💰",
      color: transaction.color || "#6366f1",
      limit: transaction.limit ?? 0,
      spent: transaction.spent ?? 0,
    };

    setTransactions((prev) => {
      const exists = prev.find((t) => t.id === newTransaction.id);
      return exists ? prev.map((t) => (t.id === newTransaction.id ? newTransaction : t)) : [...prev, newTransaction];
    });

    setEditingTransaction(null);
    setShowForm(false);
  };

  const displayedTransactions = useMemo(() => filteredTransactions, [filteredTransactions]);
  const totalSpent = useMemo(() => transactions.reduce((t, acc) => t - acc.value, 0), [transactions]);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-indigo-900 flex items-center gap-2">
          <FiPlus className="text-indigo-600 w-8 h-8" /> Transactions
          <button
            onClick={() => setShowTransactions((prev) => !prev)}
            className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 ml-2"
            aria-label="Toggle transactions visibility"
          >
            {showTransactions ? <FiMinus className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
          </button>
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-indigo-200 text-indigo-800 py-2 px-4 rounded-2xl flex items-center gap-2 hover:bg-indigo-300 hover:text-indigo-900 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-800 transform duration-300 hover:scale-105"
          >
            <FiFilter /> Filters
          </button>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white py-2 px-4 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 transform duration-300 hover:scale-105"
          >
            <FiBarChart className="w-5 h-5" /> Add
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

      {/* Collapsed Summary */}
      <AnimatePresence>
        {!showTransactions && (
          <motion.div
            className="flex flex-col items-center justify-center mt-3 p-6 mb-4 bg-indigo-50/90 rounded-3xl shadow-inner border border-indigo-200/40 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FiInfo className="w-12 h-12 text-indigo-500 mb-4 animate-pulse" />
            <p className="text-indigo-800/70 italic text-center mb-2">
              Transactions are hidden. Click <span className="font-bold">-</span> to expand.
            </p>

            <div className="w-full bg-white/70 rounded-2xl p-4 shadow-inner border border-indigo-100">
              <p className="text-indigo-900 font-semibold text-center mb-2">Total Balance</p>
              <motion.div
                className="w-full bg-gray-200 rounded-full h-3"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div
                  className={`h-3 rounded-full ${totalSpent <= 0 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: "100%" }}
                />
              </motion.div>
              <p className="text-sm text-indigo-800/70 text-center mt-1">Total: {(totalSpent * -1).toFixed(2)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Cards */}
      <motion.div
        animate={{ height: showTransactions ? "auto" : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <motion.div layout className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-2 mt-5">
          <AnimatePresence>
            {displayedTransactions.length === 0 && showTransactions ? (
              <motion.div
                className="col-span-full flex flex-col items-center justify-center p-8 bg-white/80 rounded-3xl shadow-inner border border-indigo-200/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FiInfo className="w-12 h-12 text-indigo-500 mb-4 animate-pulse" />
                <p className="text-indigo-800/70 italic text-center text-lg">
                  No transactions found. Click <span className="font-bold">Add</span> to create one!
                </p>
              </motion.div>
            ) : (
              displayedTransactions.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  layoutId={t.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                  className={`relative rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-colors duration-300 z-2 ${
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
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Budgets section */}
      <div className="mt-12">
        <BudgetList />
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
