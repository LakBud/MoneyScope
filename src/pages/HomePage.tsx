import { Link } from "react-router-dom";
import { FiCreditCard, FiTrendingUp, FiShield, FiPieChart, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import ModernChartsBg from "../components/common/AnimatedChartBg";

const features = [
  {
    icon: <FiTrendingUp className="w-10 h-10 text-indigo-600" />,
    title: "Track Spending",
    description: "Monitor your daily expenses and categorize transactions effortlessly.",
  },
  {
    icon: <FiPieChart className="w-10 h-10 text-indigo-600" />,
    title: "Visual Insights",
    description: "Charts provide clear visual representations of your finances.",
  },
  {
    icon: <FiShield className="w-10 h-10 text-indigo-600" />,
    title: "Secure & Private",
    description: "Your data stays safe locally on your device.",
  },
  {
    icon: <FiUsers className="w-10 h-10 text-indigo-600" />,
    title: "Collaborative",
    description: "Visualize budgets and goals for shared projects or family planning.",
  },
];

const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <ModernChartsBg />

      {/* Hero Section */}
      <motion.header
        className="mt-10 text-center relative z-10 max-w-3xl w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="inline-block relative z-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          whileHover={{ rotate: 15 }}
        >
          <FiCreditCard className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-600 drop-shadow-md mx-auto" />
        </motion.span>

        <motion.h1
          className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-900 drop-shadow-lg leading-tight"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Money Scope
        </motion.h1>
        <motion.p
          className="mt-3 text-md sm:text-lg md:text-xl text-indigo-800/90 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Take control of your finances visually — track, plan, and explore your money with ease.
        </motion.p>

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 70 }}
        >
          <Link to="/dashboard">
            <motion.button
              className="px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white text-lg sm:text-xl font-semibold rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </motion.header>

      {/* Features Section */}
      <section className="mt-16 w-full max-w-6xl relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-900 text-center mb-10">Why Choose Money Scope?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
            >
              {feature.icon}
              <h3 className="mt-4 text-lg sm:text-xl font-semibold text-indigo-900">{feature.title}</h3>
              <p className="mt-2 text-indigo-800/80 text-sm sm:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="mt-16 text-indigo-700/80 text-xs sm:text-sm text-center relative z-10 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        &copy; {new Date().getFullYear()} MoneyScope. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default HomePage;
