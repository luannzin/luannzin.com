import { PROJECTS } from "@/lib/config/projects";
import { ProjectCard } from "./project-card";

const Projects = () => {
  return (
    <div className="flex flex-col gap-4">
      <span>Projects</span>
      <div className="grid grid-cols-1 gap-4">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
};

export { Projects };
