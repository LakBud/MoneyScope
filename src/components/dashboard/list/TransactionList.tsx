import { motion, AnimatePresence, type Variants } from "framer-motion";
import { type TransactionProps } from "../../types/types";
import { Link } from "react-router-dom";

type TransactionListProps = {
  transactions: TransactionProps[];
  linkToPage?: string;
};

const TransactionList = ({ transactions, linkToPage = "/transactions" }: TransactionListProps) => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.08, type: "spring", stiffness: 120, damping: 12 },
    }),
    hover: { scale: 1.03, boxShadow: "0 12px 25px rgba(0,0,0,0.15)" },
  };

  return (
    <div className="w-full grid gap-4 auto-rows-fr" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
      <AnimatePresence>
        {transactions.map((t, i) => {
          const progressPercent = t.budgetTotal && t.budgetTotal > 0 ? Math.min(100, (t.value / t.budgetTotal) * 100) : 0;

          return (
            <Link key={t.id} to={`${linkToPage}/${t.id}`}>
              <motion.div
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                className="flex flex-col justify-between rounded-3xl p-5 md:p-6 shadow-lg cursor-pointer backdrop-blur-sm border border-indigo-200/40 transition-colors duration-200 bg-white"
              >
                {/* Top: Emoji + Title + Category */}
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full shadow-inner"
                    style={{ backgroundColor: t.color + "33" }}
                  >
                    <span className="text-2xl md:text-3xl">{t.emoji}</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-indigo-900 text-base md:text-lg truncate">{t.title}</p>
                    <span
                      className={`mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                        t.category.toLowerCase() === "income" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                      }`}
                    >
                      {t.category}
                    </span>
                  </div>
                </div>

                {/* Middle: Budget + Recurrence + Progress */}
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex justify-between items-center text-sm md:text-base text-indigo-700/80">
                    {t.budget && <span className="px-2 py-0.5 bg-indigo-100 rounded-xl">{t.budget}</span>}
                    {t.recurrence && <span className="px-2 py-0.5 bg-indigo-100 rounded-xl capitalize">{t.recurrence}</span>}
                  </div>
                  {t.budget && t.budgetTotal && (
                    <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden mt-1">
                      <motion.div
                        className="h-full bg-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom: Value */}
                <div className="text-right">
                  <motion.span
                    style={{ color: t.color }}
                    className="font-bold text-lg md:text-2xl"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                  >
                    ${t.value.toFixed(2)}
                  </motion.span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
