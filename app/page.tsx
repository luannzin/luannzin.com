"use client";

import { motion } from "framer-motion";
import Header from "./(components)/Header";
import Projects from "./(components)/Projects";
import Playground from "./(components)/Playground";
import { useEffect, useRef, useState } from "react";
import useMouse from "@react-hook/mouse-position";

import { ref, set } from "firebase/database";
import { FirebaseDatabase } from "./(utils)/firebase";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [uuid, setUuid] = useState("");

  useEffect(() => {
    if (!uuid) {
      if (localStorage.getItem("uuid")) {
        return setUuid(localStorage.getItem("uuid")!);
      }
      const newUuid = uuidv4();
      setUuid(newUuid);
      localStorage.setItem("uuid", newUuid);
    }
  }, [uuid]);

  useEffect(() => {
    setUuid(localStorage.getItem("uuid") || "");
  }, []);

  const divRef = useRef(null);
  const mouse = useMouse(divRef, {
    fps: 1,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      set(ref(FirebaseDatabase, "mouse/" + uuid), {
        x: mouse.x,
        y: mouse.y,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [mouse, uuid]);

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
        ref={divRef}
        key="home"
        className="w-screen h-screen flex"
      >
        <div className="p-8 flex flex-col gap-4 max-w-[32rem]">
          <Header />
          <Projects />
        </div>
      </motion.div>
      <Playground uuid={uuid} />
    </>
  );
}
