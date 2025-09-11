import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiDollarSign, FiX } from "react-icons/fi";

type Budget = {
  id: string;
  category: string;
  limit: number;
};

interface BudgetFiltersProps {
  budgets: Budget[];
  setFilteredBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  isOpen: boolean;
  onClose?: () => void;
}

const BudgetFilters = ({ budgets, setFilteredBudgets, isOpen, onClose }: BudgetFiltersProps) => {
  const [search, setSearch] = useState("");
  const [minLimit, setMinLimit] = useState<number | "">("");
  const [maxLimit, setMaxLimit] = useState<number | "">("");

  const handleReset = () => {
    setSearch("");
    setMinLimit("");
    setMaxLimit("");
    setFilteredBudgets(budgets);
  };

  useEffect(() => {
    let filtered = [...budgets];

    if (search.trim() !== "") {
      filtered = filtered.filter((b) => b.category.toLowerCase().includes(search.toLowerCase()));
    }

    if (minLimit !== "") filtered = filtered.filter((b) => b.limit >= minLimit);
    if (maxLimit !== "") filtered = filtered.filter((b) => b.limit <= maxLimit);

    setFilteredBudgets(filtered);
  }, [search, minLimit, maxLimit, budgets, setFilteredBudgets]);

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
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex flex-col gap-6 w-full z-3 relative border border-indigo-100 mb-5"
        >
          {/* Header with close button */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-indigo-900">Budget Filters</h3>
            {onClose && (
              <button onClick={onClose} className="text-indigo-700 hover:text-indigo-900">
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search by Category */}
          <div className="flex-1 relative">
            <FiSearch className="absolute top-3.5 left-3.5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-3 w-full border border-indigo-200 rounded-2xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>

          {/* Min + Max Limit */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiDollarSign className="absolute top-3.5 left-3.5 text-indigo-400" />
              <input
                type="number"
                placeholder="Min limit"
                value={minLimit}
                onChange={(e) => setMinLimit(e.target.value === "" ? "" : Number(e.target.value))}
                className="pl-10 pr-3 py-3 w-full border border-indigo-200 rounded-2xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>

            <div className="flex-1 relative">
              <FiDollarSign className="absolute top-3.5 left-3.5 text-indigo-400" />
              <input
                type="number"
                placeholder="Max limit"
                value={maxLimit}
                onChange={(e) => setMaxLimit(e.target.value === "" ? "" : Number(e.target.value))}
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

export default BudgetFilters;
