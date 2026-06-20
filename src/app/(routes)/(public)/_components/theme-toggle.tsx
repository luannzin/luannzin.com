"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupSeparator,
} from "@/components/ui/toggle-group";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <ToggleGroup
      value={mounted ? [theme ?? "system"] : []}
      variant="outline"
      size="sm"
      onValueChange={(value) => {
        const next = value[0];
        if (next) setTheme(next);
      }}
    >
      <ToggleGroupItem aria-label="Light theme" value="light">
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupSeparator />
      <ToggleGroupItem aria-label="Dark theme" value="dark">
        <MoonIcon />
      </ToggleGroupItem>
      <ToggleGroupSeparator />
      <ToggleGroupItem aria-label="System theme" value="system">
        <MonitorIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export { ThemeToggle };
