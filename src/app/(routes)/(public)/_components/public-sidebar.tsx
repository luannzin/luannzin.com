"use client";

import { ArrowRightIcon, ArrowRightLeftIcon, FileIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/config/nav";
import { cn } from "@/lib/utils";

const PublicSidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_LINKS.map((link, idx) => {
        const Icon = link.icon;
        const is = {
          active: pathname === link.url,
        };

        return (
          <div
            key={link.name}
            className={cn(
              "grid transition-[grid-template-rows,opacity,transform] duration-150 ease-out",
              is.active
                ? "grid-rows-[0fr] opacity-0 -translate-x-1 pointer-events-none"
                : "grid-rows-[1fr] opacity-100 translate-x-0",
            )}
            // style={{ transitionDelay: isActive ? "0ms" : `${idx * 30}ms` }}
          >
            <div className="min-h-0 overflow-hidden">
              <Button
                key={link.name}
                render={
                  // biome-ignore lint/a11y/useAnchorContent: we don't need to add content to the anchor tag
                  <Link href={link.url as Route} />
                }
                variant="ghost"
                className="justify-between w-48 group"
                size="sm"
              >
                <Icon
                  className="size-3 text-muted-foreground"
                  width={12}
                  height={12}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {link.label}
                  </span>
                  {/* <ArrowRightLeftIcon className="size-0 blur-[2px] group-hover:blur-none group-hover:size-3 transition-all duration-150 ease-in" /> */}
                </div>
              </Button>
            </div>
          </div>
        );
      })}

      <Separator className="my-2 w-4! mx-auto" />

      {SOCIAL_LINKS.map((link) => {
        const Icon = link.icon;

        return (
          <Button
            key={link.name}
            render={
              // biome-ignore lint/a11y/useAnchorContent: we don't need to add content to the anchor tag
              <a href={link.url} target="_blank" rel="noopener noreferrer" />
            }
            variant="ghost"
            className="justify-between w-48 group"
            size="sm"
          >
            <Icon
              className="size-3 fill-muted-foreground"
              width={12}
              height={12}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {link.label}
              </span>
              <ArrowRightIcon className="-rotate-45 size-0 blur-[2px] group-hover:blur-none group-hover:size-3 transition-all duration-150 ease-in" />
            </div>
          </Button>
        );
      })}

      <Button
        render={
          // biome-ignore lint/a11y/useAnchorContent: we don't need to add content to the anchor tag
          <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" />
        }
        variant="ghost"
        className="justify-between w-48 group"
        size="sm"
      >
        <FileIcon className="size-3 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">CV</span>
          <ArrowRightIcon className="-rotate-45 size-0 blur-[2px] group-hover:blur-none group-hover:size-3 transition-all duration-150 ease-in" />
        </div>
      </Button>
    </nav>
  );
};

export { PublicSidebar };
