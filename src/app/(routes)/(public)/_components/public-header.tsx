import { ThemeToggle } from "./theme-toggle";

const PublicHeader = () => {
  return (
    <header className="w-full py-2 flex justify-between items-center">
      <span className="text-sm text-muted-foreground">
        frontend developer crafting calm, intuitive interfaces.
      </span>
      <ThemeToggle />
    </header>
  );
};

export { PublicHeader };
