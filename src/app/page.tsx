import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-20 lg:border-b border-border flex items-center justify-center lg:px-20">
        <div className="h-full max-w-[1440px] w-full lg:border-x border-border"></div>
      </div>
      <div className="w-full h-full lg:px-20 flex items-center justify-center">
        <div className="h-full max-w-[1440px] w-full lg:border-x border-border max-lg:px-8">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col gap-4">
              <Logo />
              <div className="flex flex-col max-sm:gap-1">
                <span className="max-sm:text-xl font-medium">
                  I'm Luan Fabri,
                </span>
                <span className="text-muted-foreground">
                  a brazillian, gifted and handsome frontend developer.
                </span>
              </div>
              <Link
                href="/about"
                className={cn("group text-primary block w-fit max-sm:hidden")}
              >
                <div className="relative flex flex-col">
                  <div className="flex items-center gap-1">
                    <span>About</span>
                    <ArrowRight className="absolute -right-5 size-4 group-hover:-rotate-45 blur-[4px] group-hover:blur-none scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
                  </div>
                  <span className="absolute bottom-[2px] left-0 h-px w-full bg-primary origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
                </div>
              </Link>
              <Link
                href="/about"
                className={cn("sm:hidden text-primary underline")}
              >
                <div className="flex items-center gap-1">
                  <span>About</span>
                  <ArrowRight className="size-4 -rotate-45" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-20 lg:border-t border-border flex items-center justify-center lg:px-20">
        <div className="h-full max-w-[1440px] w-full lg:border-x border-border"></div>
      </div>
    </div>
  );
}
