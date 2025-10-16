import { cn } from "@/lib/utils";

type LogoProps = React.HTMLAttributes<HTMLSpanElement>;

const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <span className={cn("text-3xl tracking-tight", className)} {...props}>
      l<span className="text-primary">’</span>
    </span>
  );
};

export { Logo };
