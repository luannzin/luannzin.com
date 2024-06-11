import { FirebaseDatabase } from "@/app/(utils)/firebase";
import { onValue, ref, set } from "firebase/database";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { use, useEffect, useState } from "react";

const cursors: {
  [key: number]: string;
} = {
  0: "http://www.rw-designer.com/cursor-view/1293.png",
  1: "http://www.rw-designer.com/cursor-view/1285.png",
  2: "http://www.rw-designer.com/cursor-view/1286.png",
  3: "http://www.rw-designer.com/cursor-view/1287.png",
  4: "http://www.rw-designer.com/cursor-view/1288.png",
  5: "http://www.rw-designer.com/cursor-view/1289.png",
  6: "http://www.rw-designer.com/cursor-view/1290.png",
  7: "http://www.rw-designer.com/cursor-view/1291.png",
  8: "http://www.rw-designer.com/cursor-view/1292.png",
};

const Playground = ({ uuid }: { uuid: string }) => {
  const allMousesRef = ref(FirebaseDatabase, "mouse/");

  const [allMouses, setAllMouses] = useState([]);

  useEffect(() => {
    const renderMouses = () => {
      onValue(allMousesRef, (snapshot) => {
        const data = snapshot.val();

        if (data?.[uuid]) delete data[uuid];
        if (!data) return setAllMouses([]);
        setAllMouses(Object.values(data));
      });
    };

    const timeout = setTimeout(() => {
      renderMouses();
    }, 500);

    return () => clearTimeout(timeout);
  });

  return (
    <motion.div
      initial={{
        zIndex: 100,
        backgroundColor: "#000",
        opacity: 1,
        scale: 3,
      }}
      animate={{
        zIndex: -1,
        backgroundColor: "rgb(4 4 4)",
        scale: 1,
        opacity: 0.15,
      }}
      transition={{
        delay: 0.1,
        duration: 0.45,
        type: "tween",
      }}
      className="w-screen h-screen bg-black fixed top-0 left-0 flex items-center justify-center"
    >
      <motion.div
        initial={{
          opacity: 1,
        }}
        animate={{
          opacity: 0,
        }}
        transition={{
          delay: 0.1,
          duration: 0.5,
          type: "tween",
        }}
        className="text-sky-50 text-bold text-xs"
      >
        luannzin.com
      </motion.div>
      {Object.values(allMouses).some((mouse) => mouse !== null) &&
        allMouses.length > 0 &&
        allMouses.map(
          (
            mouse: {
              x: number;
              y: number;
            },
            index
          ) => (
            <AnimatePresence key={index}>
              <motion.div
                key={index}
                initial={{
                  x: mouse.x,
                  y: mouse.y,
                }}
                animate={{
                  x: mouse.x,
                  y: mouse.y,
                }}
                exit={{
                  filter: "blur(6px)",
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  mass: 0.05,
                  stiffness: 0.05,
                  damping: 0.05,
                  restDelta: 0.5,
                  restSpeed: 0.1,
                }}
                className="fixed top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center"
              >
                <Image
                  src={cursors[index % Object.keys(cursors).length]}
                  alt="Mouse"
                  className="w-full h-full object-cover"
                  width={32}
                  height={32}
                />
              </motion.div>
            </AnimatePresence>
          )
        )}
    </motion.div>
  );
};

export default Playground;
