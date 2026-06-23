import { EXPERIENCES } from "@/lib/config/experiences";

const Experience = () => {
  return (
    <div className="flex flex-col gap-4">
      <span>Education</span>

      {EXPERIENCES.map((experience) => (
        <div key={experience.company} className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">2026 - Present</span>
            <span>•</span>
            <h3>{experience.company}</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            From <span className="font-medium">Intern</span> to{" "}
            <span className="font-medium">Mid-Level Frontend Developer</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export { Experience };
