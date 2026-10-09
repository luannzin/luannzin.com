"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  LinkedInIcon,
  LinkIcon,
  ShareIcon,
  XIcon,
} from "@/components/icons";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import {
  Menu,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";

type State = "idle" | "copied" | "failed";

// Copies text and reports how it went for two seconds, then settles.
export function useCopy() {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = (text: string) =>
    navigator.clipboard.writeText(text).then(
      () => setState("copied"),
      () => setState("failed"),
    );
  return [state, copy] as const;
}

const icon = { idle: LinkIcon, copied: CheckIcon, failed: CloseIcon };
const announce = { idle: "", copied: "Copied", failed: "Copy failed" };

const segment =
  "flex items-center outline-offset-2 transition-[color] duration-150 hover:text-foreground";

const noop = () => () => {};

// Split button: the main half copies the link, the chevron opens the other
// ways to share it.
export function Share({ title, url }: { title: string; url: string }) {
  const [state, copy] = useCopy();
  const Icon = icon[state];
  const canShare = useSyncExternalStore(
    noop,
    () => "share" in navigator,
    () => false,
  );

  return (
    <div className="flex min-h-8 shrink-0 rounded-[8px] bg-muted text-muted-foreground inset-ring inset-ring-border transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] has-active:scale-[0.96]">
      <button
        type="button"
        onClick={() => copy(url)}
        aria-label="Share, copy link"
        className={`${segment} gap-1.5 whitespace-nowrap rounded-s-[8px] ps-2.5 pe-3`}
      >
        <ActionSwapIcon value={state}>
          <Icon className="size-4" />
        </ActionSwapIcon>
        Share
      </button>
      <span aria-hidden className="w-px bg-border" />
      <Menu>
        <MenuTrigger
          aria-label="More ways to share"
          className={`${segment} rounded-e-[8px] px-2 data-popup-open:text-foreground`}
        >
          <ChevronRightIcon className="size-4 rotate-90 transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] in-data-popup-open:-rotate-90" />
        </MenuTrigger>
        <MenuPopup
          align="end"
          sideOffset={6}
          className="border-0 shadow-none inset-ring inset-ring-border transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] before:hidden data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-[0.96] data-starting-style:opacity-0"
        >
          <MenuLinkItem
            href={`https://x.com/intent/post?${new URLSearchParams({ text: title, url, via: "__luannzin" })}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <XIcon />
            Share on X
          </MenuLinkItem>
          <MenuLinkItem
            href={`https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url })}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
            Share on LinkedIn
          </MenuLinkItem>
          {canShare && (
            <MenuItem
              onClick={() => navigator.share({ title, url }).catch(() => {})}
            >
              <ShareIcon />
              Share on other apps
            </MenuItem>
          )}
        </MenuPopup>
      </Menu>
      <output className="sr-only">{announce[state]}</output>
    </div>
  );
}
