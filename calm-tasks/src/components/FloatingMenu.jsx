import { motion } from "framer-motion";

export default function FloatingMenu() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-xl px-8 py-3 rounded-full shadow-md flex gap-6 text-sm"
    >
      {["Home", "Search", "Add"].map((item) => (
        <motion.span
          key={item}
          whileHover={{ scale: 1.1 }}
          className="cursor-pointer"
        >
          {item}
        </motion.span>
      ))}
    </motion.div>
  );
}
