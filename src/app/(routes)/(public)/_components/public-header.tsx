import { t } from "@/i18n/generated";
import { ThemeToggle } from "./theme-toggle";

const PublicHeader = () => {
  return (
    <header className="w-full py-2 flex justify-between items-center">
      <span className="text-sm text-muted-foreground">
        {t.app._components.header.title}
      </span>
      <ThemeToggle />
    </header>
  );
};

export { PublicHeader };
