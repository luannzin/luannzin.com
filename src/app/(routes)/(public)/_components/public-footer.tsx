import "flag-icons/css/flag-icons.min.css";

import { t } from "@/i18n/generated";
import { LanguageSelect } from "./language-select";

type PublicFooterProps = {
  locale: string;
};

const PublicFooter = ({ locale }: PublicFooterProps) => {
  return (
    <footer className="w-full py-4 flex justify-between gap-4 items-center">
      <span className="text-sm text-muted-foreground">
        {t.app._components.footer.description}
      </span>
      <div>
        <LanguageSelect locale={locale} />
      </div>
    </footer>
  );
};

export { PublicFooter };
