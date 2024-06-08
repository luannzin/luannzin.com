"use client";
import CMD from "@/app/(components)/CMD";
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
        className="p-8 flex flex-col gap-4 max-w-[32rem]"
      >
        <Header />
        <CMD />
      </motion.div>
    </AnimatePresence>
  );
}
