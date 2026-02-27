"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full p-4 flex items-center justify-end">
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={"icon"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Toggle theme</span>
            <Kbd>D</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </header>
  );
};

export { Header };
