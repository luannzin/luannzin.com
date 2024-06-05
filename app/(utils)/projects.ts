export type ProjectType = {
  name: string;
  url: string;
  description: string;
  status?: string;
};

export type ProjectsType = ProjectType[];

export const projects: ProjectsType = [
  {
    name: "pegasu",
    url: "https://github.com/pegasu-app",
    description: "pegasu is a inventory management solution",
    status: "in development",
  },
  {
    name: "cpf.social",
    url: "https://www.cpf.social/",
    description: "common tools for brazilian CPF",
  },
];
