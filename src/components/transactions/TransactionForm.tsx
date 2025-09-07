import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import type { TransactionProps } from "../types/types";
import type { Transaction } from "../hooks/UseTransactions";
import { useEffect } from "react";

type TransactionFormData = TransactionProps & {
  recurrence?: "daily" | "weekly" | "monthly" | "yearly";
};

type TransactionFormProps = {
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  defaultValues?: TransactionFormData;
};

const TransactionForm = ({ onClose, onSave, defaultValues }: TransactionFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<TransactionFormData>({
    defaultValues: defaultValues ?? {
      id: crypto.randomUUID(),
      title: "",
      category: "",
      emoji: "",
      color: "#4F46E5",
      value: 0,
      date: new Date().toISOString(),
      recurrence: undefined,
    },
  });

  // Disable body scroll when form is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmit = (data: TransactionFormData) => {
    onSave({
      ...data,
      id: defaultValues?.id ?? crypto.randomUUID(),
      date: defaultValues?.date ?? new Date().toISOString(),
      spent: data.spent ?? 0,
    });
    reset();
    onClose();
  };

  const emojiPattern = /\p{Emoji}/u;
  const emojiValue = watch("emoji");

  const formVariant: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 120 } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/95 border border-indigo-200 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-50"
        variants={formVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-indigo-600 hover:text-indigo-900 transition-transform duration-200 transform hover:scale-110"
          aria-label="Close form"
        >
          <X size={28} />
        </button>

        {/* Header */}
        <header className="mb-6 text-center z-50">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900">
            {defaultValues ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <p className="text-indigo-600 text-sm sm:text-base mt-1">
            {defaultValues ? "Update your transaction details." : "Fill in the details below to record a new transaction."}
          </p>
        </header>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8 z-50">
          {["Details", "Appearance", "Value"].map((step, idx, arr) => (
            <div key={step} className="flex items-center z-50">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold shadow-sm z-50">
                  {idx + 1}
                </div>
                <span className="mt-1 text-xs font-medium text-indigo-700 z-50">{step}</span>
              </div>
              {idx < arr.length - 1 && <div className="w-10 sm:w-16 h-0.5 bg-indigo-200 mx-2 z-50" />}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 z-50">
          {/* Section: Details */}
          <div className="space-y-6 z-50">
            <h3 className="text-indigo-800 font-semibold text-lg z-50">Details</h3>

            {/* Title */}
            <div className="z-50">
              <label className="block text-indigo-900 font-semibold mb-1 z-50">Title</label>
              <motion.input
                type="text"
                {...register("title", { required: "Title is required" })}
                placeholder="Grocery shopping"
                className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5
                           focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900
                           placeholder-indigo-400 shadow-lg transition z-50"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 z-50">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div className="z-50">
              <label className="block text-indigo-900 font-semibold mb-1 z-50">Category</label>
              <motion.input
                type="text"
                {...register("category", { required: "Category is required" })}
                placeholder="Food"
                className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5
                           focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900
                           placeholder-indigo-400 shadow-lg transition z-50"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1 z-50">{errors.category.message}</p>}
            </div>

            {/* Recurrence */}
            <div className="z-50">
              <label className="block text-indigo-900 font-semibold mb-1 z-50">
                Recurrence <span className="text-indigo-400">(Optional)</span>
              </label>
              <select
                {...register("recurrence")}
                className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5
                           focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900
                           shadow-lg transition z-50"
              >
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Section: Appearance */}
          <div className="space-y-6 z-50">
            <h3 className="text-indigo-800 font-semibold text-lg z-50">Appearance</h3>

            {/* Emoji */}
            <div className="z-50">
              <label className="block text-indigo-900 font-semibold mb-1 z-50">
                Logo <span className="text-indigo-400">(Optional)</span>
              </label>
              <motion.div
                className={`w-full flex items-center justify-center rounded-xl px-4 py-3 text-3xl font-bold
              shadow-lg border transition z-50
              ${
                !emojiValue
                  ? "bg-white border-indigo-200 text-indigo-400"
                  : emojiPattern.test(emojiValue)
                  ? "bg-indigo-50 border-indigo-300 text-indigo-900"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
              >
                <input
                  type="text"
                  {...register("emoji", {
                    validate: (value) => !value || emojiPattern.test(value) || "Please enter a valid emoji",
                  })}
                  placeholder="e.g 🛒"
                  className="w-full text-center bg-transparent focus:outline-none placeholder-indigo-300 text-2xl z-50"
                  maxLength={2}
                />
              </motion.div>
            </div>

            {/* Color */}
            <div className="z-50">
              <label className="block text-indigo-900 font-semibold mb-1 z-50">
                Color <span className="text-indigo-400">(Optional)</span>
              </label>
              <motion.input
                type="color"
                {...register("color")}
                className="w-16 h-10 border border-indigo-200 rounded-xl cursor-pointer shadow-md transition duration-200 z-50"
                whileHover={{ scale: 1.05 }}
              />
            </div>
          </div>

          {/* Section: Value */}
          <div className="space-y-6 z-50">
            <h3 className="text-indigo-800 font-semibold text-lg z-50">Value</h3>

            <div className="z-50">
              <label className="block text-indigo-900 font-semibold mb-1 z-50">Value Amount</label>
              <motion.input
                type="number"
                step="0.01"
                placeholder="45.99"
                {...register("value", { required: "Value is required", valueAsNumber: true })}
                className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5
                           focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900
                           placeholder-indigo-400 shadow-lg transition z-50"
                whileFocus={{ scale: 1.01 }}
              />
              {errors.value && <p className="text-red-500 text-xs mt-1 z-50">{errors.value.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <motion.div className="pt-4 z-50">
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800
                     text-white py-3 rounded-xl font-semibold shadow-lg
                     hover:shadow-indigo-500/30 transition-transform duration-200
                     hover:scale-105 hover:cursor-pointer z-50"
              whileTap={{ scale: 0.97 }}
            >
              {defaultValues ? "Update Transaction" : "Save Transaction"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TransactionForm;
