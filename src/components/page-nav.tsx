import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { Toc } from "@/components/toc";
import { enter } from "@/lib/classes";
import type { Heading } from "@/lib/markdown";

// The trail at the top of a post or the Lab: the page it sits under, then
// itself.
export function Breadcrumb({
  label,
  href,
  parent,
  current,
}: {
  label: string;
  href: string;
  parent: string;
  current: string;
}) {
  return (
    <nav aria-label={label} className={enter}>
      <ol className="flex min-w-0 items-center gap-1.5">
        <li className="shrink-0">
          <Link
            href={href}
            className="rounded-sm text-muted-foreground outline-offset-2 transition-[color] duration-150 hover:text-foreground"
          >
            {parent}
          </Link>
        </li>
        <li aria-hidden className="shrink-0 text-muted-foreground">
          <ChevronRightIcon className="size-4" />
        </li>
        <li className="min-w-0 truncate" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  );
}

// The contents: a rail in the margin at xl, a disclosure above the text below
// it. Goes inside a `relative` box around the text, which the rail spans.
export function Contents({
  label,
  headings,
}: {
  label: string;
  headings: Heading[];
}) {
  return (
    <>
      <aside
        className={`${enter} absolute inset-y-0 end-full me-16 hidden w-60 delay-500 xl:block`}
      >
        <nav aria-label={label} className="sticky top-12">
          <p className="font-medium">{label}</p>
          <Toc headings={headings} className="mt-4" />
        </nav>
      </aside>
      <details
        className={`${enter} disclosure group mb-10 rounded-[14px] shadow-[inset_0_0_0_1px_var(--border)] delay-500 xl:hidden`}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-[14px] px-4 py-3 font-medium outline-offset-2 [&::-webkit-details-marker]:hidden">
          {label}
          <ChevronRightIcon className="size-4 text-muted-foreground transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-90" />
        </summary>
        <Toc headings={headings} className="px-4 pb-4" />
      </details>
    </>
  );
}
