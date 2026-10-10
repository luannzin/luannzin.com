"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { underline } from "@/lib/classes";
import intl from "../../intl.config";

type Copy = { title: string; body: string; home: string };

const noop = () => () => {};
const storedLocale = () =>
  document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${intl.storage.key}=`))
    ?.slice(intl.storage.key.length + 1);

// A 404 for an unknown post reads the language from its route. One for an
// address no route matches has none, so it reads the visitor's choice, which
// only the browser can (its prerendered HTML is in the default language).
export function NotFoundCopy({ copy }: { copy: Record<string, Copy> }) {
  const { lang } = useParams<{ lang?: string }>();
  const stored = useSyncExternalStore(noop, storedLocale, () => undefined);
  const locale =
    [lang, stored].find((l) => l && l in copy) ?? intl.defaultLocale;
  const { title, body, home } = copy[locale];

  return (
    <main
      lang={locale}
      className="mx-auto w-full max-w-xl px-6 pt-20 pb-24 leading-relaxed sm:pt-28"
    >
      <h1 className="font-medium">{title}</h1>
      <p className="mt-4 text-muted-foreground">
        {body}{" "}
        <Link
          href="/"
          className="group rounded-sm text-foreground outline-offset-2"
        >
          <span className={underline}>{home}</span>
        </Link>
        .
      </p>
    </main>
  );
}
