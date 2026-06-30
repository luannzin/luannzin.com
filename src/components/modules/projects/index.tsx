import { t } from "@/i18n/generated";
import { PROJECTS } from "@/lib/config/projects";
import { ProjectCard } from "./project-card";

const Projects = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <span>{t.components.modules.projects.title}</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <ProjectCard project={PROJECTS[0]} />
      </div>
    </div>
  );
};

export { Projects };
