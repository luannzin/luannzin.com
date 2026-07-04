"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locales } from "@/config/locales";
import "flag-icons/css/flag-icons.min.css";
import { useRouter } from "next/navigation";
import { updateLocale } from "@/i18n/generated";

type PublicFooterProps = {
  locale: string;
};

const PublicFooter = ({ locale }: PublicFooterProps) => {
  const router = useRouter();
  const currentLocale = locales.find((l) => l.code === locale);

  const handleChangeLocale = async (locale: string | null) => {
    if (!locale) return;
    await updateLocale(locale as (typeof locales)[number]["code"]);
    router.refresh();
  };

  return (
    <footer className="w-full py-4 flex justify-end items-center">
      <div>
        <Select
          value={locale}
          onValueChange={(value) => handleChangeLocale(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a language">
              <div className="flex items-center gap-2">
                <span className={`fi fi-${currentLocale?.flag}`} />
                {currentLocale?.name}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {locales.map((locale) => (
              <SelectItem key={locale.code} value={locale.code}>
                {locale.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </footer>
  );
};

export { PublicFooter };
