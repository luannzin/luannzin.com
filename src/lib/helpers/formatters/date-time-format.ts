import { getLocale } from "@/i18n/generated";

export const dateTimeFormat = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
) => {
  const locale = getLocale();

  return new Intl.DateTimeFormat(locale, {
    ...options,
  }).format(date);
};
