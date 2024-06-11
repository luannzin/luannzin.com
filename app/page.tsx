"use client";

import { motion } from "framer-motion";
import Header from "./(components)/Header";
import Projects from "./(components)/Projects";
import Playground from "./(components)/Playground";
import { useRef } from "react";
import useMouse from "@react-hook/mouse-position";

export default function Home() {
  const ref = useRef(null);
  const mouse = useMouse(ref, {
    fps: 12,
  });

  return (
    <>
      <motion.div
        initial={{
          filter: "blur(6px)",
        }}
        animate={{
          filter: "blur(0px)",
        }}
        transition={{
          delay: 0.15,
        }}
        ref={ref}
        key="home"
        className="w-screen h-screen flex"
      >
        <div className="p-8 flex flex-col gap-4 max-w-[32rem]">
          <Header />
          <Projects />
        </div>
      </motion.div>
      <Playground />
    </>
  );
}
