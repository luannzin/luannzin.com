import type { Metadata } from "next";
import Link from "next/link";
import { setLocale, t } from "@/i18n/generated";
import { underline } from "@/lib/classes";

export async function generateMetadata(): Promise<Metadata> {
  await setLocale();
  return { title: t.app.notFound.title };
}

export default function NotFound() {
  const copy = t.app.notFound;
  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-20 pb-24 leading-relaxed sm:pt-28">
      <h1 className="font-medium">{copy.title}</h1>
      <p className="mt-4 text-muted-foreground">
        {copy.body}{" "}
        <Link
          href="/"
          className="group rounded-sm text-foreground outline-offset-2"
        >
          <span className={underline}>{copy.home}</span>
        </Link>
        .
      </p>
    </main>
  );
}
