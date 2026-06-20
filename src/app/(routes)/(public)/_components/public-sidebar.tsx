import { ArrowRightIcon, DownloadIcon, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/lib/config/social-links";

const PublicSidebar = () => {
  return (
    <nav className="flex flex-col gap-1">
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
