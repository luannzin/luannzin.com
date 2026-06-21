import { Badge } from "@/components/ui/badge";
import { TECHNOLOGIES_ICON } from "@/lib/config/technologies-icon";

type TechItemProps = {
  technology: keyof typeof TECHNOLOGIES_ICON;
};

const TechItem = ({ technology }: TechItemProps) => {
  const Icon = TECHNOLOGIES_ICON[technology];

  return (
    <Badge size="lg" variant="outline" className="cursor-default select-none">
      {/* {Icon && (
        <svg viewBox="0 0 24 24" width={12} height={12} fill={`#${Icon.hex}`}>
          <title>{Icon.title}</title>
          <path d={Icon.path} />
        </svg>
      )} */}
      <span className="text-sm">{technology}</span>
    </Badge>
  );
};

export { TechItem };
