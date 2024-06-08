"use client";
import Header from "@/app/(components)/Header";
import { AnimatePresence, motion } from "framer-motion";

export default function Terminal() {
  return (
    <AnimatePresence>
      <motion.div
        exit={{
          opacity: 0,
          x: 100,
        }}
        className="p-8 flex flex-col gap-4 max-w-[32rem] text-black dark:text-sky-50"
      >
        <Header />
        <span>terminal</span>
      </motion.div>
    </AnimatePresence>
  );
}
