"use client";

import { AnimatePresence, motion } from "framer-motion";
import Header from "./(components)/Header";
import Projects from "./(components)/Projects";

export default function Home() {
  return (
    <AnimatePresence>
      <motion.div
        key="home"
        exit={{
          opacity: 0,
          x: -100,
        }}
        className="p-8 flex flex-col gap-4 max-w-[32rem]"
      >
        <Header />
        <Projects />
      </motion.div>
    </AnimatePresence>
  );
}
