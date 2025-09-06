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
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex flex-col gap-6 w-full z-50 relative border border-indigo-100"
        >
          {/* Search + Filters Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute top-3.5 left-3.5 text-indigo-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-3 w-full border border-indigo-200 rounded-2xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>

            {/* Category */}
            <div className="flex-1 relative">
              <FiTag className="absolute top-3.5 left-3.5 text-indigo-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-10 pr-3 py-3 w-full border border-indigo-200 rounded-2xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Recurrence */}
            <div className="flex-1 relative">
              <FiTag className="absolute top-3.5 left-3.5 text-indigo-400" />
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="pl-10 pr-3 py-3 w-full border border-indigo-200 rounded-2xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiDollarSign className="absolute top-3.5 left-3.5 text-indigo-400" />
              <input
                type="number"
                placeholder="Min value"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value === "" ? "" : Number(e.target.value))}
                className="pl-10 pr-3 py-3 w-full border border-indigo-200 rounded-2xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>

            <div className="flex-1 relative">
              <FiDollarSign className="absolute top-3.5 left-3.5 text-indigo-400" />
              <input
                type="number"
                placeholder="Max value"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value === "" ? "" : Number(e.target.value))}
                className="pl-10 pr-3 py-3 w-full border border-indigo-200 rounded-2xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          {/* Reset Button */}
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 via-indigo-700 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all hover:cursor-pointer"
          >
            Reset Filters
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionListFilters;
