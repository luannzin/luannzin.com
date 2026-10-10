"use client";

import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import intl from "../../intl.config";

// The root layout sits above the [lang] segment, so only the route knows the
// language; this stamps it on <html>, in the prerendered HTML and again on a
// switch. Pages outside it (a 404 for an unknown address) are in the default.
export function Html(props: ComponentProps<"html">) {
  const { lang } = useParams<{ lang?: string }>();
  return <html {...props} lang={lang ?? intl.defaultLocale} />;
}
