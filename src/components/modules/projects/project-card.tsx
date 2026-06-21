import { LockIcon } from "lucide-react";
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
          <span>{project.name}</span>
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
