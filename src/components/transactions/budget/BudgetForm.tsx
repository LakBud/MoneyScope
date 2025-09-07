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

  // Update form state if defaultValues change (when editing)
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
      className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-lg relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label="Close budget form"
      >
        <FiX className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-bold text-indigo-900 mb-6">{defaultValues ? "Edit Budget" : "Add Budget"}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="category" className="text-indigo-800 font-medium mb-1">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Food, Transport"
            className="border border-indigo-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="limit" className="text-indigo-800 font-medium mb-1">
            Budget Limit
          </label>
          <input
            id="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            placeholder="e.g., 500"
            className="border border-indigo-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            min={1}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white py-2 px-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {defaultValues ? "Save Changes" : "Add Budget"}
        </button>
      </form>
    </motion.div>
  );
};

export default BudgetForm;
