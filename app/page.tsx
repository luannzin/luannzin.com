"use client";

import { AnimatePresence, motion } from "framer-motion";
import Header from "./(components)/Header";
import Projects from "./(components)/Projects";
import Playground from "./(components)/Playground";
import { useEffect, useRef, useState } from "react";
import useMouse from "@react-hook/mouse-position";

import { ref, set } from "firebase/database";
import { FirebaseDatabase } from "./(utils)/firebase";
import { v4 as uuidv4 } from "uuid";
import SettingsIcon from "./(icons)/Settings";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import SunIcon from "./(icons)/Sun";
import MoonIcon from "./(icons)/Moon";

export default function Home() {
  const { toast } = useToast();
  const [uuid, setUuid] = useState("");
  const document = typeof window !== "undefined" ? window.document : null;

  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (!localStorage.getItem("username")) return;

    setUsername(localStorage.getItem("username") ?? "");
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    }
    setTheme(localStorage.getItem("theme") ?? "");
    if (document) {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("uuid")) return;
    if (!uuid) {
      const newUuid = uuidv4();
      setUuid(newUuid);
      localStorage.setItem("uuid", newUuid);
    }
  }, [uuid]);

  useEffect(() => {
    setUuid(localStorage.getItem("uuid") ?? "");
  }, []);

  const divRef = useRef(null);
  const mouse = useMouse(divRef, {
    fps: 60,
  });

  useEffect(() => {
    if (!mouse) return;
    set(ref(FirebaseDatabase, "mouse/" + uuid), {
      x: mouse.x,
      y: mouse.y,
      ...(mouse.x && mouse.y ? { username } : {}),
    });

    // return () => clearTimeout(timeout);
  }, [mouse, uuid, username]);

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
        className="w-screen h-screen flex text-black dark:text-sky-50"
      >
        <div className="h-full flex flex-col justify-between p-8">
          <div className="flex flex-col gap-4 max-w-[32rem]">
            <Header />
            <Projects />
          </div>
          <Dialog>
            <DialogTrigger className="max-w-fit">
              <motion.div
                whileHover={{
                  cursor: "pointer",
                  backgroundColor: "rgb(240 249 255 / 0.05)",
                }}
                className="max-w-fit rounded-md"
              >
                <motion.div
                  whileHover={{
                    rotate: "12deg",
                  }}
                  className="max-w-fit p-2"
                >
                  <SettingsIcon className="w-6 h-6 stroke-black dark:stroke-white" />
                </motion.div>
              </motion.div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="border border-zinc-800 w-full" />
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                  <span>Username</span>
                  <div className="flex gap-2">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        localStorage.setItem("username", username);
                        return toast({
                          title: "Changes made with sucess!",
                          description: `Username: ${
                            username ?? localStorage.getItem("username")
                          }`,
                        });
                      }}
                    >
                      <strong>Salvar</strong>
                    </Button>
                  </div>
                </label>
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span>Tema</span>
                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {theme === "light" ? (
                        <motion.div
                          key={"sun"}
                          initial={{
                            y: -10,
                            opacity: 0,
                          }}
                          animate={{
                            y: 0,
                            opacity: 1,
                          }}
                        >
                          <SunIcon className="w-6 h-6 stroke-black dark:stroke-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key={"moon"}
                          initial={{
                            y: -10,
                            opacity: 0,
                          }}
                          animate={{
                            y: 0,
                            opacity: 1,
                          }}
                        >
                          <MoonIcon className="w-6 h-6 fill-black dark:fill-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Switch
                      className="h-6"
                      checked={theme === "dark"}
                      onCheckedChange={(value) => {
                        setTheme(value ? "dark" : "light");
                        localStorage.setItem("theme", value ? "dark" : "light");
                        document!.documentElement.classList.toggle("dark");
                      }}
                    />
                  </div>
                </label>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <Playground uuid={uuid} />
    </>
  );
}
