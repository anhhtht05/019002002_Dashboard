import React from "react";
import { motion } from "framer-motion";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200000] flex items-center justify-center">
      <motion.div
        className="w-12 h-12 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-400"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;
