import { useState, useEffect } from "react";
import TransactionForm from "../transactions/TransactionForm";
import TransactionList from "./list/TransactionList";
import Charts from "./charts/Charts";
import {
  FiPieChart,
  FiBarChart,
  FiList,
  FiArrowUpRight,
  FiArrowDownRight,
  FiDollarSign,
  FiCreditCard,
  FiFilter,
} from "react-icons/fi";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import TransactionListFilters from "./list/TransactionListFilters";

import { useTransactions } from "../hooks/UseTransactions";
import { nanoid } from "nanoid";

const Dashboard = () => {
  const { transactions, setTransactions } = useTransactions(); // global context
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const total = transactions.reduce((acc, t) => acc + t.value, 0);
  const income = transactions.filter((t) => t.value > 0).reduce((acc, t) => acc + t.value, 0);
  const expense = transactions.filter((t) => t.value < 0).reduce((acc, t) => acc + t.value, 0);

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.15, type: "spring", stiffness: 120, damping: 12 },
    }),
  };
  const sectionVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const modalVariant = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } };
  const transactionItemVariant: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Save transaction with unique id
  const handleSaveTransaction = (transaction: Omit<(typeof transactions)[0], "id">) => {
    const newTransaction = { ...transaction, id: nanoid() };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100 flex flex-col">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Summary Cards */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" initial="hidden" animate="visible">
            {(() => {
              const forecastPeriods = 10;
              const avgTransaction = transactions.length
                ? transactions.reduce((a, t) => a + t.value, 0) / transactions.length
                : 0;
              const forecastedBalance = total + avgTransaction * forecastPeriods;

              const cards = [
                { icon: FiDollarSign, label: "Total", value: total, gradient: "from-indigo-400 to-blue-400" },
                { icon: FiArrowUpRight, label: "Income", value: income, gradient: "from-green-400 to-blue-400" },
                { icon: FiArrowDownRight, label: "Expenses", value: Math.abs(expense), gradient: "from-red-400 to-pink-400" },
                { icon: FiCreditCard, label: "Forecast", value: forecastedBalance, gradient: "from-indigo-500 to-blue-500" },
              ];

              return cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.06, boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className={`bg-gradient-to-br ${card.gradient} rounded-3xl shadow-lg px-6 py-5 flex flex-col items-center justify-center cursor-pointer`}
                >
                  <card.icon className="w-7 h-7 text-white mb-1" />
                  <span className="text-white font-semibold text-sm md:text-base">{card.label}</span>
                  <motion.span
                    className="text-white font-bold text-lg md:text-xl"
                    animate={{ scale: [0.95, 1.05, 1] }}
                    transition={{ duration: 0.6, repeat: 0 }}
                  >
                    ${card.value.toFixed(2)}
                  </motion.span>
                </motion.div>
              ));
            })()}
          </motion.div>

          {/* Chart Section */}
          <motion.section
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-5 md:p-6 flex flex-col gap-4 hover:scale-[1.02] hover:shadow-2xl transition-transform duration-300"
            variants={sectionVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-2 mb-2">
              <FiPieChart className="text-indigo-600 w-6 h-6 animate-pulse" />
              <h2 className="text-xl md:text-2xl font-bold text-indigo-800">Overview</h2>
            </div>
            <div className="w-full flex-1 flex items-center justify-center min-h-[24rem] md:min-h-[32rem] lg:min-h-[36rem]">
              {transactions.length === 0 ? (
                <p className="text-blue-700/80 italic text-center px-4 animate-fade-in">
                  No transactions yet. Add some transactions to see the chart update in real-time!
                </p>
              ) : (
                <Charts transactions={transactions} />
              )}
            </div>
          </motion.section>
        </div>

        {/* Right Column */}
        <motion.aside
          className="w-full lg:w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-4 sm:p-5 md:p-6 flex flex-col gap-4 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl relative"
          variants={sectionVariant}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FiList className="text-indigo-600 w-6 h-6 animate-pulse" />
              <h2 className="text-xl md:text-2xl font-bold text-indigo-800">Transactions</h2>
            </div>

            <motion.button
              onClick={() => setIsFiltersOpen((prev) => !prev)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <FiFilter />
              Filters
            </motion.button>
          </div>

          {/* Filters Panel */}
          <TransactionListFilters
            transactions={transactions}
            setFilteredTransactions={setFilteredTransactions}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />

          {/* Add Button */}
          <motion.button
            onClick={() => setShowForm(true)}
            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white rounded-xl shadow flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.04, boxShadow: "0 12px 28px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.97 }}
          >
            <FiBarChart className="w-5 h-5" />
            Add
          </motion.button>

          {/* Transaction List Section with Links */}
          {/* Transaction List Section */}
          <motion.div
            className="flex-1 overflow-y-auto mt-3 border border-indigo-300/30 rounded-2xl p-3 md:p-4 backdrop-blur-md shadow-inner scrollbar-thin scrollbar-thumb-indigo-400/60 scrollbar-track-indigo-50/30 flex flex-col gap-3"
            initial="hidden"
            animate="visible"
            layout
          >
            <AnimatePresence>
              {filteredTransactions.length === 0 ? (
                <motion.p
                  className="text-indigo-800/70 italic text-center mt-4"
                  variants={transactionItemVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  No transactions match the filter. Click <span className="font-bold">Add</span> to create one!
                </motion.p>
              ) : (
                <TransactionList transactions={filteredTransactions} linkToPage="/transactions" />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.aside>
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4 sm:px-6"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <TransactionForm onClose={() => setShowForm(false)} onSave={handleSaveTransaction} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer
        className="mt-20 text-indigo-700/80 text-sm sm:text-base text-center relative z-10 mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        &copy; {new Date().getFullYear()} MoneyScope. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default Dashboard;
