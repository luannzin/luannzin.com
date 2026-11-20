import Link from "next/link";
import { Die } from "@/components/die";
import { ArrowRightIcon } from "@/components/icons";
import type { t } from "@/i18n/generated";
import { bezel, underline } from "@/lib/classes";
import { cn } from "@/lib/utils";

// The Lab's pieces as rows, like the posts: on the home page and on the Lab.
export function LabRows({
  labels,
  className,
}: {
  labels: typeof t.app.lab;
  className?: string;
}) {
  // Each piece gets an icon on the Tile Grey.
  const pieces = [
    {
      href: "/lab/motion",
      title: labels.motion.title,
      description: labels.motion.rowDescription,
      tile: <Die seed={4} className="size-6 overflow-visible" />,
    },
  ];
  return (
    <ul className={cn("grid gap-6", className)}>
      {pieces.map(({ href, title, description, tile }) => (
        <li key={href}>
          <Link
            href={href}
            prefetch
            className="group flex items-center gap-4 rounded-[14px] outline-offset-4"
          >
            <span className={bezel}>
              <span className="grid size-11 place-items-center overflow-hidden rounded-[10px] bg-muted text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[color] duration-150 group-hover:text-foreground">
                {tile}
              </span>
            </span>
            <span className="leading-snug">
              <span className="flex items-center gap-1 text-foreground">
                <span className={underline}>{title}</span>
                <ArrowRightIcon className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
              <span className="block text-muted-foreground">{description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
