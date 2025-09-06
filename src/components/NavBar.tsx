import { Link, NavLink } from "react-router-dom";
import { FiHome, FiGrid, FiList, FiCreditCard } from "react-icons/fi";
import { motion, type Variants } from "framer-motion";

const NavBar = () => {
  const links = [
    { to: "/", label: "Home", icon: <FiHome size={20} /> },
    { to: "/dashboard", label: "Dashboard", icon: <FiGrid size={20} /> },
    { to: "/transactions", label: "Transactions", icon: <FiList size={20} /> },
  ];

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 12 } },
  };

  return (
    <motion.nav
      className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <motion.h1
            className="flex items-center gap-3 text-xl sm:text-3xl font-extrabold text-indigo-900"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
          >
            <motion.span
              className="inline-block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              whileHover={{ rotate: 15 }}
            >
              <FiCreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 drop-shadow-lg" />
            </motion.span>
            <span className="text-indigo-700">Money Scope</span>
          </motion.h1>
        </Link>

        {/* Links */}
        <ul className="flex gap-3 sm:gap-6">
          {links.map((link) => (
            <motion.li key={link.to} variants={linkVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.1 }}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white shadow-lg"
                      : "text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900"
                  }`
                }
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};

export default NavBar;
