"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip } from "@/components/ui/tooltip";

const PublicHeader = () => {
  const { setTheme, resolvedTheme: theme } = useTheme();

  const term = theme === "dark" ? "claro" : "escuro";

  return (
    <header className="w-full py-2 flex justify-between items-center">
      <span className="text-sm text-muted-foreground">
        Software developer crafting calm, intuitive interfaces.
      </span>
      <Tooltip
        side="top"
        title={
          <div className="flex items-center gap-2">
            <span>Mudar para tema {term} </span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd> <Kbd>T</Kbd>
            </KbdGroup>
          </div>
        }
      >
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            if (theme === "dark") {
              setTheme("light");
            } else {
              setTheme("dark");
            }
          }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
      </Tooltip>
    </header>
  );
};

export { PublicHeader };
