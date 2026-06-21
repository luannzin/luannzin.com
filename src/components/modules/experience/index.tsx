import { TechItem } from "@/components/client/technologies/tech-item";
import { EXPERIENCES } from "@/lib/config/experiences";

const Experience = () => {
  return (
    <div className="flex flex-col gap-4">
      <span>Experience</span>

      {EXPERIENCES.map((experience) => (
        <div key={experience.company} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">2026</span>
            <span>•</span>
            <h3>{experience.company}</h3>
          </div>

          <div className="flex flex-col gap-4">
            {experience.roles.map((role) => (
              <div key={`${role.role}-${role.from}`}>
                <div>
                  <h4 className="font-medium">{role.role}</h4>

                  <p className="text-sm text-muted-foreground">
                    {role.from} — {role.actual ? "Present" : role.to}
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {role.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {role.technologies.map((tech) => (
                      <TechItem key={tech} technology={tech} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export { Experience };
