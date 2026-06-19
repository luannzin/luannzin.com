import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./_components/theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="@luannzin/theme"
    >
      <TooltipProvider delay={0}>{children}</TooltipProvider>
    </ThemeProvider>
  );
};

export { Providers };
