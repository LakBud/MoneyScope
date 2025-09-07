import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiFilter, FiEdit, FiBarChart, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";
import BudgetForm from "./BudgetForm";
import BudgetFilters from "./BudgetFilters";
import { useTransactions } from "../../hooks/UseTransactions";

interface Budget {
  id: string;
  category: string;
  limit: number;
}

const BudgetList = () => {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showBudgets, setShowBudgets] = useState(true);
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>(budgets);
  const { transactions } = useTransactions();

  // Persist budgets
  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  // Update filteredBudgets whenever budgets or filters change
  useEffect(() => {
    setFilteredBudgets(budgets);
  }, [budgets]);

  // Calculate spent per budget
  const getBudgetProgress = (category: string) => {
    const spent = transactions.filter((t: any) => t.category === category).reduce((acc: number, t: any) => acc - t.value, 0); // positive reduces, negative increases
    const budget = budgets.find((b) => b.category === category);
    const limit = budget ? budget.limit : 0;
    return { spent, limit };
  };

  const handleSave = (category: string, limit: number) => {
    if (editingBudget) {
      setBudgets((prev) => prev.map((b) => (b.id === editingBudget.id ? { ...b, category, limit } : b)));
    } else {
      setBudgets((prev) => [...prev, { id: crypto.randomUUID(), category, limit }]);
    }
    setEditingBudget(null);
    setShowForm(false);
  };

  // Dynamic budget display
  const displayedBudgets = useMemo(() => filteredBudgets, [filteredBudgets, transactions]);

  // Total progress
  const totalSpent = useMemo(() => {
    return budgets.reduce((acc, b) => {
      const { spent } = getBudgetProgress(b.category);
      return acc + spent;
    }, 0);
  }, [budgets, transactions]);

  const totalLimit = useMemo(() => budgets.reduce((acc, b) => acc + b.limit, 0), [budgets]);
  const totalPercent = totalLimit > 0 ? Math.min(Math.max((totalSpent / totalLimit) * 100, 0), 100) : 0;
  const totalBarColor = totalPercent >= 100 ? "bg-red-500" : totalPercent >= 80 ? "bg-yellow-500" : "bg-green-500";

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-indigo-900 flex items-center gap-2">
          <FiPlus className="text-indigo-600 w-8 h-8" /> Budgets
          <button
            onClick={() => setShowBudgets((prev) => !prev)}
            className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 ml-2"
            aria-label="Toggle budgets visibility"
          >
            {showBudgets ? <FiMinus className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
          </button>
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-indigo-200 text-indigo-800 py-2 px-4 rounded-2xl flex items-center gap-2 hover:bg-indigo-300 hover:text-indigo-900 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-800 transform duration-300 hover:scale-105"
          >
            <FiFilter /> Filters
          </button>

          <button
            onClick={() => {
              setEditingBudget(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white py-2 px-4 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 transform duration-300 hover:scale-105"
          >
            <FiBarChart className="w-5 h-5" /> Add
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <BudgetFilters
        budgets={budgets}
        setFilteredBudgets={setFilteredBudgets}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Collapsed Summary */}
      <AnimatePresence>
        {!showBudgets && (
          <motion.div
            className="flex flex-col items-center justify-center p-6 mb-4 bg-indigo-50/90 rounded-3xl shadow-inner border border-indigo-200/40 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FiInfo className="w-12 h-12 text-indigo-500 mb-4 animate-pulse" />
            <p className="text-indigo-800/70 italic text-center mb-2">
              Budgets are hidden. Click <span className="font-bold">-</span> to expand.
            </p>

            <div className="w-full bg-white/70 rounded-2xl p-4 shadow-inner border border-indigo-100">
              <p className="text-indigo-900 font-semibold text-center mb-2">Total Budget Usage</p>
              <motion.div
                className="w-full bg-gray-200 rounded-full h-3"
                initial={{ width: 0 }}
                animate={{ width: `${totalPercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className={`h-3 rounded-full ${totalBarColor}`} style={{ width: "100%" }} />
              </motion.div>
              <p className="text-sm text-indigo-800/70 text-center mt-1">
                {totalSpent} / {totalLimit} used ({totalPercent.toFixed(0)}%)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Cards */}
      <motion.div
        animate={{ height: showBudgets ? "auto" : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <motion.div layout className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {displayedBudgets.length === 0 && showBudgets ? (
              <motion.div
                className="col-span-full flex flex-col items-center justify-center p-8 bg-white/80 rounded-3xl shadow-inner border border-indigo-200/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FiInfo className="w-12 h-12 text-indigo-500 mb-4 animate-pulse" />
                <p className="text-indigo-800/70 italic text-center text-lg">
                  No budgets found. Click <span className="font-bold">Add</span> to create one!
                </p>
              </motion.div>
            ) : (
              displayedBudgets.map((b) => {
                const { spent, limit } = getBudgetProgress(b.category);
                const percent = limit > 0 ? Math.min(Math.max((spent / limit) * 100, 0), 100) : 0;
                const bgColor =
                  percent >= 100
                    ? "bg-red-50 border-l-4 border-red-400 hover:bg-red-100"
                    : percent >= 80
                    ? "bg-yellow-50 border-l-4 border-yellow-400 hover:bg-yellow-100"
                    : "bg-green-50 border-l-4 border-green-400 hover:bg-green-100";
                const barColor = percent >= 100 ? "bg-red-500" : percent >= 80 ? "bg-yellow-500" : "bg-green-500";

                return (
                  <Link key={b.id} to={`/budgets/${b.id}`} className="w-full">
                    <motion.div
                      layout
                      layoutId={b.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.4 }}
                      className={`relative rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-colors duration-300 z-2 cursor-pointer ${bgColor}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-indigo-900">{b.category}</h3>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingBudget(b);
                            setShowForm(true);
                          }}
                          className="bg-indigo-600 text-white p-2 rounded-lg shadow hover:bg-indigo-700 hover:shadow-lg transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          aria-label={`Edit budget ${b.category}`}
                        >
                          <FiEdit />
                        </button>
                      </div>
                      <p className="text-sm text-indigo-700 mb-2">
                        {spent} / {limit} used
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Budget Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BudgetForm onClose={() => setShowForm(false)} onSave={handleSave} defaultValues={editingBudget || undefined} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetList;
