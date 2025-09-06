import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import type { TransactionProps } from "../types/types";

type TransactionFormData = TransactionProps & {
  recurrence?: "daily" | "weekly" | "monthly" | "yearly";
  budget?: string;
};

type TransactionFormProps = {
  onClose: () => void;
  onSave: (transaction: TransactionFormData) => void;
  defaultValues?: TransactionFormData;
  availableBudgets?: string[];
};

const TransactionForm = ({
  onClose,
  onSave,
  defaultValues,
  availableBudgets = ["Food", "Transport", "Income", "Shopping", "Work", "Personal", "Other"],
}: TransactionFormProps) => {
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
      budget: "",
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    onSave({
      ...data,
      id: defaultValues?.id ?? crypto.randomUUID(),
      date: defaultValues?.date ?? new Date().toISOString(),
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
      className="bg-white/95 border border-indigo-200 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-lg mx-auto relative"
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
        className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-900 transition-transform duration-200 transform hover:scale-110"
        aria-label="Close form"
      >
        <X size={28} />
      </button>

      <header className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900">
          {defaultValues ? "Edit Transaction" : "Add Transaction"}
        </h2>
        <p className="text-indigo-600 text-sm sm:text-base mt-1">
          {defaultValues ? "Update your transaction details." : "Fill in the details below to record a new transaction."}
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-indigo-900 font-semibold mb-1">Title</label>
          <motion.input
            type="text"
            {...register("title", { required: "Title is required" })}
            placeholder="Grocery shopping"
            className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900 placeholder-indigo-400 shadow-sm transition duration-200"
            whileFocus={{ scale: 1.01 }}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-indigo-900 font-semibold mb-1">Category</label>
          <motion.input
            type="text"
            {...register("category", { required: "Category is required" })}
            placeholder="Food"
            className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900 placeholder-indigo-400 shadow-sm transition duration-200"
            whileFocus={{ scale: 1.01 }}
          />
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        {/* Budget */}
        <div>
          <label className="block text-indigo-900 font-semibold mb-1">Budget</label>
          <select
            {...register("budget")}
            className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900 shadow-sm transition duration-200"
          >
            <option value="">Select Budget</option>
            {availableBudgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Recurrence */}
        <div>
          <label className="block text-indigo-900 font-semibold mb-1">Recurrence</label>
          <select
            {...register("recurrence")}
            className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900 shadow-sm transition duration-200"
          >
            <option value="">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Emoji */}
        <div className="text-center">
          <label className="block text-indigo-900 font-semibold mb-1">Logo</label>
          <motion.div
            className={`w-full flex items-center justify-center rounded-xl px-4 py-3 text-3xl font-bold shadow-sm border ${
              emojiValue && emojiPattern.test(emojiValue)
                ? "bg-indigo-50 border-indigo-300 text-indigo-900"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            <input
              type="text"
              {...register("emoji", {
                required: "Logo is required",
                validate: (value) =>
                  typeof value === "string" && emojiPattern.test(value) ? true : "Please enter a valid emoji",
              })}
              placeholder="⚙️"
              className="w-full text-center bg-transparent focus:outline-none placeholder-indigo-300 text-2xl"
              maxLength={2}
            />
          </motion.div>
          {errors.emoji && <p className="text-red-500 text-xs mt-1">{errors.emoji.message}</p>}
        </div>

        {/* Color */}
        <div>
          <label className="block text-indigo-900 font-semibold mb-1">Color</label>
          <motion.input
            type="color"
            {...register("color")}
            className="w-16 h-10 border border-indigo-200 rounded-xl cursor-pointer shadow-sm transition duration-200"
            whileHover={{ scale: 1.05 }}
          />
        </div>

        {/* Value */}
        <div>
          <label className="block text-indigo-900 font-semibold mb-1">Value Amount</label>
          <motion.input
            type="number"
            step="0.01"
            placeholder="45.99"
            {...register("value", { required: "Value is required", valueAsNumber: true })}
            className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900 placeholder-indigo-400 shadow-sm transition duration-200"
            whileFocus={{ scale: 1.01 }}
          />
          {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>}
        </div>

        {/* Submit */}
        <motion.div className="pt-4">
          <motion.button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-transform duration-200 transform hover:scale-105"
            whileTap={{ scale: 0.97 }}
          >
            {defaultValues ? "Update Transaction" : "Save Transaction"}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default TransactionForm;
