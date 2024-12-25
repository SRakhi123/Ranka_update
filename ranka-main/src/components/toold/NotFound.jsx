import React from "react";
import { motion } from "framer-motion";
import { BiHomeAlt, BiSupport } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full bg-white rounded-3xl shadow-lg p-12 text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 3, -3, 0],
            scale: [1, 1.01, 0.99, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
          className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-8 tracking-tighter"
        >
          404
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto"
        >
          We apologize, but the page you're looking for seems to have vanished into the digital void. Let's help you find your way back.
        </motion.p>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold transition-all duration-200 hover:bg-blue-600 w-full md:w-auto justify-center"
            onClick={() => window.location.href = "/"}
          >
            <BiHomeAlt className="mr-2 text-xl" />
            Return Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-200 w-full md:w-auto justify-center"
          >
            <FaSearch className="mr-2 text-xl" />
            Search Site
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-100 text-gray-600 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8"
        >
          <div className="flex items-center">
            <BiSupport className="text-2xl mr-2 text-blue-500" />
            <span>24/7 Support Available</span>
          </div>
          <button className="text-blue-500 hover:text-blue-600 transition-colors duration-200">
            Contact Help Desk
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;