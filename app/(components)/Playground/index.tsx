import { cursors } from "@/app/(utils)/cursors";
import { FirebaseDatabase } from "@/app/(utils)/firebase";
import { onValue, ref } from "firebase/database";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const Playground = ({ uuid }: { uuid: string }) => {
  const allMousesRef = ref(FirebaseDatabase, "mouse/");

  const [allMouses, setAllMouses] = useState([]);

  useEffect(() => {
    const renderMouses = () => {
      onValue(allMousesRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return setAllMouses([]);

        if (localStorage.getItem("uuid")) {
          delete data[localStorage.getItem("uuid")!];
        } else {
          delete data[uuid];
        }

        setAllMouses(data);
      });
    };

    const timeout = setTimeout(() => {
      renderMouses();
    }, 20);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{
        zIndex: 100,
        opacity: 1,
        scale: 3,
      }}
      animate={{
        zIndex: -1,
        scale: 1,
        opacity: 0.5,
      }}
      transition={{
        delay: 0.1,
        duration: 0.45,
        type: "tween",
      }}
      className="w-screen h-screen bg-sky-50 dark:bg-black fixed top-0 left-0 flex items-center justify-center"
    >
      {Object.values(allMouses).length > 0 &&
        Object.values(allMouses).map(
          (
            mouse: {
              x: number;
              y: number;
              username: string;
            },
            index
          ) => (
            <AnimatePresence key={index}>
              <div>
                <motion.div
                  key={index}
                  style={{
                    x: mouse?.x ?? 0,
                    y: mouse?.y ?? 0,
                    transition: "all 0.1s ease",
                  }}
                  className="fixed top-0 left-0 w-8 h-8 rounded-full flex flex-col items-center justify-center"
                >
                  <div>
                    <span className="text-[10px] text-nowrap">
                      {mouse?.username || "Anonymous"}
                    </span>
                  </div>
                  <Image
                    src={cursors[index % Object.keys(cursors).length]}
                    alt="Mouse"
                    className="w-full h-full object-cover"
                    width={32}
                    height={32}
                  />
                </motion.div>
              </div>
            </AnimatePresence>
          )
        )}
    </motion.div>
  );
};

export default Playground;
