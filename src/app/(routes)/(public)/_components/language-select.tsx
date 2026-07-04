"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locales } from "@/config/locales";
import { updateLocale } from "@/i18n/generated";

type LanguageSelectProps = {
  locale: string;
};

const LanguageSelect = ({ locale }: LanguageSelectProps) => {
  const router = useRouter();
  const currentLocale = locales.find((l) => l.code === locale);

  const handleChangeLocale = async (locale: string | null) => {
    if (!locale) return;
    await updateLocale(locale as (typeof locales)[number]["code"]);
    router.refresh();
  };

  return (
    <Select value={locale} onValueChange={(value) => handleChangeLocale(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Select a language">
          <div className="flex items-center gap-2">
            <span className={`fi fi-${currentLocale?.flag}`} />
            {currentLocale?.name}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {locales.map((locale) => (
          <SelectItem key={locale.code} value={locale.code}>
            <div className="flex items-center gap-2">
              <span className={`fi fi-${locale.flag}`} /> {locale.name}
            </div>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
};

export { LanguageSelect };
