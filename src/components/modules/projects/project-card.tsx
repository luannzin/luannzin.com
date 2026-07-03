import { ArrowUpRightIcon, LockIcon } from "lucide-react";

import type { PROJECTS } from "@/lib/config/projects";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: (typeof PROJECTS)[number];
  paid?: boolean;
};

const ProjectCard = ({ project, paid = false }: ProjectCardProps) => {
  return (
    <div
      className={cn(
        "border border-border p-4",
        paid && "opacity-50 cursor-not-allowed",
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <a
            href={project.url}
            target="_blank"
            className="group hover:text-primary transition-all duration-150"
          >
            <div className="flex items-center gap-1">
              <span>{project.name}</span>
              <ArrowUpRightIcon className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:blur-none transition-all duration-150 blur-xs size-4 group-hover:ml-0" />
            </div>
            <div />
          </a>
          {paid && <LockIcon className="size-4 text-muted-foreground" />}
        </div>
        <span className="text-sm text-muted-foreground">
          {project.description}
        </span>
      </div>
    </div>
  );
};

export { ProjectCard };
