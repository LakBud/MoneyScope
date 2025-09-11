import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

type BudgetFormProps = {
  onClose: () => void;
  onSave: (category: string, limit: number) => void;
  defaultValues?: { category: string; limit: number };
};

const BudgetForm = ({ onClose, onSave, defaultValues }: BudgetFormProps) => {
  const [category, setCategory] = useState(defaultValues?.category || "");
  const [limit, setLimit] = useState<number | "">(defaultValues?.limit ?? "");

  useEffect(() => {
    if (defaultValues) {
      setCategory(defaultValues.category);
      setLimit(defaultValues.limit);
    }
  }, [defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || limit === "" || limit <= 0) return;
    onSave(category, Number(limit));
    setCategory("");
    setLimit("");
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Close budget form"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-6 text-center">
          {defaultValues ? "Edit Budget" : "Add Budget"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label htmlFor="category" className="text-indigo-800 font-medium mb-2">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Food, Transport"
              className="border border-indigo-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-lg"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="limit" className="text-indigo-800 font-medium mb-2">
              Budget Limit
            </label>
            <input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              placeholder="e.g., 500"
              className="border border-indigo-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-lg"
              min={1}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white py-3 px-6 rounded-2xl flex justify-center items-center gap-2 text-lg font-semibold hover:from-indigo-600 hover:via-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {defaultValues ? "Save Changes" : "Add Budget"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BudgetForm;
