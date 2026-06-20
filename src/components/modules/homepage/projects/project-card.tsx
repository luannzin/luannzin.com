import type { PROJECTS } from "@/lib/config/projects";

type ProjectCardProps = {
  project: (typeof PROJECTS)[number];
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="border border-border p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span>{project.name}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {project.description}
        </span>
      </div>
    </div>
  );
};

export { ProjectCard };
