import { FolderIcon, HomeIcon, RssIcon, SparklesIcon } from "lucide-react";
import { GithubIcon } from "@/components/icons/social/github";
import { LinkedinIcon } from "@/components/icons/social/linkedin";
import { XIcon } from "@/components/icons/social/x";

export const NAV_LINKS = [
  {
    name: "home",
    label: "home",
    url: "/",
    icon: HomeIcon,
  },
  {
    name: "blog",
    label: "blog",
    url: "/blog",
    icon: RssIcon,
  },
  {
    name: "experience",
    label: "experience",
    url: "/experience",
    icon: SparklesIcon,
  },
  {
    name: "projects",
    label: "projects",
    url: "/projects",
    icon: FolderIcon,
  },
];

export const SOCIAL_LINKS = [
  {
    name: "github",
    label: "/luannzin",
    url: "https://github.com/luannzin",
    icon: GithubIcon,
  },
  {
    name: "linkedin",
    label: "/in/luannzin",
    url: "https://www.linkedin.com/in/luannzin/",
    icon: LinkedinIcon,
  },
  {
    name: "x",
    label: "@__luannzin",
    url: "https://x.com/__luannzin",
    icon: XIcon,
  },
];
