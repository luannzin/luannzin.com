import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { underline } from "@/lib/classes";

// The end of a post or the Lab: a rule with a diamond at its centre, then the
// home header's identity as one link back home, and `children` (Share) at the
// row's end.
export function AuthorFooter({
  role,
  children,
}: {
  role: string;
  children: ReactNode;
}) {
  return (
    <footer className="mt-20">
      <div
        aria-hidden
        className="relative h-px bg-border before:absolute before:top-1/2 before:left-1/2 before:size-1.5 before:-translate-1/2 before:rotate-45 before:bg-muted-foreground before:shadow-[0_0_0_4px_var(--background)]"
      />
      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-[14px] leading-snug outline-offset-4"
        >
          <Image
            src="/avatar.jpg"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full outline -outline-offset-1 outline-black/10 dark:outline-white/10"
          />
          <span>
            <span className={`${underline} font-medium`}>Luan Fabri</span>
            <span className="block text-muted-foreground">{role}</span>
          </span>
        </Link>
        {children}
      </div>
    </footer>
  );
}
