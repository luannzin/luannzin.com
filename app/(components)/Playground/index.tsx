import { motion } from "framer-motion";

const Playground = () => {
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
    </motion.div>
  );
};

export default Playground;
