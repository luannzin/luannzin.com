import { getLocale } from "@/i18n/generated";

export const formatToLocaleString = (
  value: number,
  options: Intl.NumberFormatOptions,
) => {
  const locale = getLocale();

  return value.toLocaleString(locale, {
    ...options,
  });
};
