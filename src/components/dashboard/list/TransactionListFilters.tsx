import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiTag, FiDollarSign } from "react-icons/fi";
import type { TransactionProps } from "../../types/types";

interface FiltersProps {
  transactions: (TransactionProps & { budget?: string; recurrence?: string })[];
  setFilteredTransactions: React.Dispatch<React.SetStateAction<(TransactionProps & { budget?: string; recurrence?: string })[]>>;
  isOpen: boolean;
  onClose?: () => void;
}

const TransactionListFilters = ({ transactions, setFilteredTransactions, isOpen }: FiltersProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [budget, setBudget] = useState("all");
  const [recurrence, setRecurrence] = useState("all");
  const [minValue, setMinValue] = useState<number | "">("");
  const [maxValue, setMaxValue] = useState<number | "">("");

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setBudget("all");
    setRecurrence("all");
    setMinValue("");
    setMaxValue("");
    setFilteredTransactions(transactions);
  };

  useEffect(() => {
    let filtered = [...transactions];

    if (search.trim() !== "") filtered = filtered.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

    if (category !== "all") filtered = filtered.filter((t) => t.category === category);

    if (budget !== "all") filtered = filtered.filter((t) => (t.budget ?? "") === budget);

    if (recurrence !== "all") filtered = filtered.filter((t) => (t.recurrence ?? "") === recurrence);

    if (minValue !== "") filtered = filtered.filter((t) => t.value >= minValue);

    if (maxValue !== "") filtered = filtered.filter((t) => t.value <= maxValue);

    setFilteredTransactions(filtered);
  }, [search, category, budget, recurrence, minValue, maxValue, transactions, setFilteredTransactions]);

  const categories = Array.from(new Set(transactions.map((t) => t.category)));
  const budgets = Array.from(new Set(transactions.map((t) => t.budget ?? "").filter(Boolean)));
  const recurrences = Array.from(new Set(transactions.map((t) => t.recurrence ?? "").filter(Boolean)));

  const panelVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-indigo-50 p-5 rounded-2xl shadow-lg flex flex-col gap-4 md:gap-3 w-full z-50 relative"
        >
          {/* Search + Category + Budget */}
          <div className="flex flex-col md:flex-row md:gap-3 gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute top-3 left-3 text-indigo-400" />
              <input
                type="text"
                placeholder="Search title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-3 w-full border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              />
            </div>

            <div className="flex-1 relative">
              <FiTag className="absolute top-3 left-3 text-indigo-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-10 pr-3 py-3 w-full border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 relative">
              <FiTag className="absolute top-3 left-3 text-indigo-400" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="pl-10 pr-3 py-3 w-full border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              >
                <option value="all">All Budgets</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 relative">
              <FiTag className="absolute top-3 left-3 text-indigo-400" />
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="pl-10 pr-3 py-3 w-full border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              >
                <option value="all">All Recurrences</option>
                {recurrences.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Min + Max Value */}
          <div className="flex flex-col md:flex-row md:gap-3 gap-3">
            <div className="flex-1 relative">
              <FiDollarSign className="absolute top-3 left-3 text-indigo-400" />
              <input
                type="number"
                placeholder="Min value"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value === "" ? "" : Number(e.target.value))}
                className="pl-10 pr-3 py-3 w-full border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              />
            </div>

            <div className="flex-1 relative">
              <FiDollarSign className="absolute top-3 left-3 text-indigo-400" />
              <input
                type="number"
                placeholder="Max value"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value === "" ? "" : Number(e.target.value))}
                className="pl-10 pr-3 py-3 w-full border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              />
            </div>
          </div>

          <motion.button
            onClick={handleReset}
            className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          >
            Reset Filters
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionListFilters;
