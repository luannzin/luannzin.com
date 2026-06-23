import { EXPERIENCES } from "@/lib/config/experiences";
import { formatToLocalDate } from "@/lib/helpers/formatters/format-to-local-date";

const Experience = () => {
  return (
    <div className="flex flex-col gap-4">
      <span>Professional</span>

      {EXPERIENCES.map((experience) => {
        const role = {
          first: experience.roles[0],
          last: experience.roles[experience.roles.length - 1],
        };

        const from = formatToLocalDate(role.last.from);
        const to = role.first.to ? formatToLocalDate(role.first.to) : undefined;

        return (
          <div key={experience.company} className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {new Intl.DateTimeFormat(undefined, {
                  month: "short",
                  year: "numeric",
                }).format(from)}{" "}
                -{" "}
                {to
                  ? new Intl.DateTimeFormat(undefined, {
                      month: "short",
                      year: "numeric",
                    }).format(to)
                  : "Present"}
              </span>
              <span>•</span>
              <h3>{experience.company}</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              from <span className="font-medium">{role.last.role}</span> to{" "}
              <span className="font-medium">{role.first.role}</span>
            </span>

            {/* <div className="flex flex-col gap-4">
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
          </div> */}
          </div>
        );
      })}
    </div>
  );
};

export { Experience };
