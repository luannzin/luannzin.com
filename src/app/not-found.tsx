import type { Metadata } from "next";
import Link from "next/link";
import { underline } from "@/lib/classes";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 pt-20 pb-24 leading-relaxed sm:pt-28">
      <h1 className="font-medium">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        Nothing lives at this address.{" "}
        <Link
          href="/"
          className="group rounded-sm text-foreground outline-offset-2"
        >
          <span className={underline}>Go home</span>
        </Link>
        .
      </p>
    </main>
  );
}
