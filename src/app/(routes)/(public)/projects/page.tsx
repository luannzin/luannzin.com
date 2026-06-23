import { ProjectCard } from "@/components/modules/projects/project-card";
import { PAID_PROJECTS, PROJECTS } from "@/lib/config/projects";

export default async function ProjectsPage() {
  return (
    <div className="flex flex-col gap-4">
      <span>Own Projects</span>
      <div className="grid grid-cols-1 gap-4">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <span>Freelance Projects</span>
      <div className="grid grid-cols-1 gap-4">
        {PAID_PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} paid />
        ))}
      </div>
    </div>
  );
}
