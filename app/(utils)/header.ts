export type NavItemType = {
  name: string;
  url: string;
  target: string;
  alert?: boolean;
};

export type NavType = NavItemType[];

export const nav: NavType = [
  {
    name: "luannzin",
    url: "/",
    target: "_self",
  },
  {
    name: "github",
    url: "https://github.com/luannzin",
    target: "_blank",
  },
  {
    name: "terminal",
    url: "/terminal",
    target: "_self",
    // alert: true,
  },
];
