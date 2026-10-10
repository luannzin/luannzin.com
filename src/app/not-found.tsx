import type { Metadata } from "next";
import { NotFoundCopy } from "@/components/not-found-copy";
import { translations } from "@/i18n/generated";

// The same in either language, since this page can't know which it is in.
export const metadata: Metadata = { title: "404" };

// This page renders under the root layout, above the language, so it hands
// over the copy in each and the client picks one.
const copy = Object.fromEntries(
  Object.entries(translations).map(([locale, t]) => [locale, t.app.notFound]),
);

export default function NotFound() {
  return <NotFoundCopy copy={copy} />;
}
