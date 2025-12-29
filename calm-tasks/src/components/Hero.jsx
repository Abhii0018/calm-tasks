import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const { scrollY } = useScroll();

  // Smooth value-mapped motion
  const titleY = useTransform(scrollY, [0, 300], [40, 0]);
  const titleOpacity = useTransform(scrollY, [0, 200], [0.6, 1]);

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 min-h-[70vh]">
      <motion.h2
        style={{ y: titleY, opacity: titleOpacity }}
        className="text-4xl md:text-5xl font-light max-w-3xl leading-tight mb-6"
      >
        A gentle way to organize your day
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-6 text-gray-600 max-w-xl"
      >
        Plan tasks, set priorities, and move at your own pace.
        CalmTasks helps you stay focused without the pressure.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 px-12 py-4 rounded-full bg-black text-white text-sm"
      >
        Get Started
      </motion.button>
    </section>
  );
}
