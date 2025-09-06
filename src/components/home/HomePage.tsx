import { Link } from "react-router-dom";
import { FiCreditCard } from "react-icons/fi";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 overflow-hidden">
      {/* Single subtle floating blob */}
      <motion.div
        className="absolute top-[-5rem] left-[-5rem] w-80 h-80 bg-indigo-300/20 rounded-full filter blur-3xl transform-gpu"
        animate={{ y: [0, 5, 0] }} // very small vertical movement
        transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Header */}
      <motion.header
        className="mb-12 text-center relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiCreditCard className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-600 drop-shadow-md mx-auto" />
        <motion.h1
          className="mt-4 text-5xl sm:text-6xl md:text-7xl font-extrabold text-indigo-900 drop-shadow-lg"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Money Scope
        </motion.h1>
        <motion.p
          className="mt-3 text-lg sm:text-xl md:text-2xl text-indigo-800/90 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Take control of your finances effortlessly — track, plan, and forecast your money with ease.
        </motion.p>
      </motion.header>

      {/* Start Button */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 70 }}
      >
        <Link to="/dashboard">
          <motion.button
            className="px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white text-lg sm:text-xl font-semibold rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-20 text-indigo-700/80 text-sm sm:text-base text-center relative z-10"
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
