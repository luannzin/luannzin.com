"use client";

import { projects } from "@/app/(utils)/projects";
import Link from "next/link";
import { motion } from "framer-motion";

const Projects = () => {
  return (
    <main className="flex flex-col gap-4 text-black dark:text-sky-50">
      <motion.h2>Projects</motion.h2>
      {projects.map((item) => {
        return (
          <div key={item.name} className="flex flex-col">
            <Link
              href={item.url}
              target={"_blank"}
              rel="noopener noreferrer"
              className="max-w-fit flex items-start gap-2"
            >
              <motion.span className="text-blue-700 dark:text-sky-400 font-bold underline">
                {item.name}
              </motion.span>
              {item.status && (
                <motion.span
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                  }}
                >
                  <span className="mr-2">-</span>
                  <span className="text-sm underline">{item.status}</span>
                </motion.span>
              )}
            </Link>
            <motion.span>{item.description}</motion.span>
          </div>
        );
      })}
    </main>
  );
};

export default Projects;
