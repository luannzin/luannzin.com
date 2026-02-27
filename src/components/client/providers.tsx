import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "../ui/tooltip";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider storageKey="@luannzin/theme" defaultTheme="system">
      <TooltipProvider delay={0}>{children}</TooltipProvider>
    </ThemeProvider>
  );
};

export { Providers };
