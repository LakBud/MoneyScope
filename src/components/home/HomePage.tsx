import { Link } from "react-router-dom";
import { FiCreditCard } from "react-icons/fi";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 overflow-hidden">
      {/* Animated floating blobs */}
      <motion.div
        className="absolute top-[-5rem] left-[-5rem] w-72 h-72 bg-indigo-300/40 rounded-full filter blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[10rem] right-[-6rem] w-96 h-96 bg-blue-300/30 rounded-full filter blur-2xl"
        animate={{ y: [0, -15, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8rem] left-[20%] w-80 h-80 bg-indigo-200/30 rounded-full filter blur-3xl"
        animate={{ y: [0, 25, 0], x: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Header */}
      <motion.header
        className="mb-12 text-center relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mx-auto w-fit"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        >
          <FiCreditCard className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-600 drop-shadow-md" />
        </motion.div>
        <motion.h1
          className="mt-4 text-5xl sm:text-6xl md:text-7xl font-extrabold text-indigo-900 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Money Scope
        </motion.h1>
        <motion.p
          className="mt-3 text-lg sm:text-xl md:text-2xl text-indigo-800/90 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Take control of your finances effortlessly — track, plan, and forecast your money with ease.
        </motion.p>
      </motion.header>

      {/* Start Button */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.6, type: "spring", stiffness: 120 }}
      >
        <Link to="/dashboard">
          <motion.button
            className="px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white text-lg sm:text-xl font-semibold rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
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
        transition={{ delay: 1, duration: 0.8 }}
      >
        &copy; {new Date().getFullYear()} MoneyScope. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default HomePage;
