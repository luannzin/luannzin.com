"use client";

import { nav } from "@/app/(utils)/header";
import Link from "next/link";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="flex gap-2">
      {nav.map((item, index) => {
        return (
          <motion.div
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: index * 0.15,
              type: "spring",
            }}
            key={item.name}
            className="flex gap-2 max-w-fit"
          >
            <Link
              href={item.url}
              target={item.target}
              rel="noopener noreferrer"
            >
              <span className="text-blue-700 dark:text-sky-400 font-bold underline">
                {item.name}
              </span>
              {item.alert && (
                <span className="animate-ping absolute inline-flex h-1 w-1 rounded-full bg-sky-400 opacity-75"></span>
              )}
            </Link>
            {index !== nav.length - 1 && (
              <span className="font-bold text-black dark:text-sky-50">/</span>
            )}
          </motion.div>
        );
      })}
    </header>
  );
};

export default Header;
