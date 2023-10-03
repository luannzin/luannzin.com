type Role = {
  name: string;
  label: string[];
  description: string;
};

const roles: Role[] = [
  {
    name: "front end engineer",
    label: ["primary"],
    description:
      "using stacks like next.js or vite, typescript and tailwind css, i can build awesome applications for web",
  },
  {
    name: "ux designer",
    label: ["additional"],
    description:
      "with my experience in big applications, i leaned how to grant the best user experience",
  },
];

export default roles;
