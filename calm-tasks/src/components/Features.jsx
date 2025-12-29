import { motion } from "framer-motion";

const features = [
  {
    title: "Clear priorities",
    desc: "Mark important tasks and focus on what truly matters.",
  },
  {
    title: "Calm productivity",
    desc: "Designed to feel peaceful, not overwhelming.",
  },
  {
    title: "Private & secure",
    desc: "Your tasks stay personal and protected.",
  },
];

export default function Features() {
  return (
    <section className="mt-20 px-10 pb-32 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-medium mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
