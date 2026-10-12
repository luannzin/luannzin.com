// The CV, on screen and on paper. Facts come from the CV of April 2026, with
// its numbers left out on purpose (user decision); the phone stays off too.
export default {
  meta: {
    description: {
      en: "Luan Fabri’s CV: front-end engineer at Loopscape since 2023, building ERPs and multi-tenant platforms with React and Next.js. Download it as a PDF or print it.",
      pt: "Currículo do Luan Fabri: engenheiro front-end na Loopscape desde 2023, construindo ERPs e plataformas multi-tenant com React e Next.js. Baixe em PDF ou imprima.",
    },
  },
  title: { en: "CV", pt: "Currículo" },
  place: { en: "Jaú, SP, Brazil", pt: "Jaú, SP, Brasil" },
  email: { en: "Email", pt: "E-mail" },
  summary: {
    en: "Front-end engineer at Loopscape, where since 2023 I’ve been building ERPs and multi-tenant platforms with React, Next.js and TypeScript. It’s software people spend their whole workday in, so I pay a lot of attention to the details that make it fast and clear to use. I also work on the back end with Node.js, REST APIs and PostgreSQL, and build open source tools on the side.",
    pt: "Engenheiro front-end na Loopscape, onde desde 2023 construo ERPs e plataformas multi-tenant com React, Next.js e TypeScript. É o tipo de software que as pessoas usam o dia inteiro no trabalho, então eu presto muita atenção nos detalhes que deixam ele rápido e fácil de usar. Também trabalho no back-end com Node.js, APIs REST e PostgreSQL, e fora do trabalho crio ferramentas open source.",
  },
  download: { en: "Download PDF", pt: "Baixar PDF" },
  // what the downloaded file is called
  file: { en: "Luan Fabri - CV.pdf", pt: "Luan Fabri - Currículo.pdf" },
  print: { en: "Print", pt: "Imprimir" },
  present: { en: "present", pt: "atual" },
  timeline: {
    en: "Timeline of roles and study, up to today",
    pt: "Linha do tempo de cargos e estudo, até hoje",
  },
  sections: {
    experience: { en: "Experience", pt: "Experiência" },
    projects: { en: "Projects", pt: "Projetos" },
    openSource: { en: "Open source", pt: "Open source" },
    skills: { en: "Skills", pt: "Habilidades" },
    education: { en: "Education", pt: "Formação" },
    languages: { en: "Languages", pt: "Idiomas" },
  },
  roles: {
    mid: {
      track: { en: "mid-level", pt: "pleno" },
      title: {
        en: "Mid-level front-end developer",
        pt: "Desenvolvedor front-end pleno",
      },
      b1: {
        en: "Build and maintain several front-end apps in production, used by end users and tied directly to revenue.",
        pt: "Desenvolvo e mantenho várias aplicações front-end em produção, usadas por usuários finais e ligadas direto à receita.",
      },
      b2: {
        en: "Cut the application’s build time, which made deploys faster for the whole team.",
        pt: "Reduzi o tempo de build da aplicação, o que deixou os deploys mais rápidos pro time todo.",
      },
      b3: {
        en: "Rebuilt the sales website with a focus on performance, SEO and UX.",
        pt: "Refiz o site de vendas com foco em performance, SEO e UX.",
      },
      b4: {
        en: "Lead the gradual refactoring of legacy code, so it’s more stable and easier to maintain.",
        pt: "Lidero a refatoração aos poucos do código legado, pra ele ficar mais estável e fácil de manter.",
      },
      b5: {
        en: "Set up observability tooling to catch and diagnose errors early.",
        pt: "Implementei ferramentas de observabilidade pra pegar e diagnosticar erros cedo.",
      },
      b6: {
        en: "Make architecture decisions on code organization, rendering strategies and performance.",
        pt: "Tomo decisões de arquitetura sobre organização do código, estratégias de renderização e performance.",
      },
      b7: {
        en: "Work on the back end too (Node.js, AdonisJS), for integrations and automation.",
        pt: "Também trabalho no back-end (Node.js, AdonisJS), em integrações e automações.",
      },
    },
    junior: {
      track: { en: "junior", pt: "júnior" },
      title: {
        en: "Junior front-end developer",
        pt: "Desenvolvedor front-end júnior",
      },
      b1: {
        en: "Migrated a legacy app (Vite and React 16) to a modern stack with TypeScript, making it faster and easier to work on.",
        pt: "Migrei uma aplicação legada (Vite e React 16) pra uma stack moderna com TypeScript, deixando ela mais rápida e mais fácil de trabalhar.",
      },
      b2: {
        en: "Worked on the core product through a period of fast growth.",
        pt: "Trabalhei no produto principal durante uma fase de crescimento rápido.",
      },
      b3: {
        en: "Built the company website from scratch with Next.js, TypeScript and Tailwind CSS, including the blog and internal APIs.",
        pt: "Construí o site da empresa do zero com Next.js, TypeScript e Tailwind CSS, com blog e APIs internas.",
      },
      b4: {
        en: "Wrote a Fastify microservice that generates PDFs automatically, integrated with AdonisJS.",
        pt: "Escrevi um microsserviço em Fastify que gera PDFs automaticamente, integrado com AdonisJS.",
      },
      b5: {
        en: "Built complex forms, validation and REST API integrations across many features.",
        pt: "Fiz formulários complexos, validações e integrações com APIs REST em várias funcionalidades.",
      },
    },
    intern: {
      track: { en: "intern", pt: "estágio" },
      title: { en: "Front-end intern", pt: "Estagiário de front-end" },
      b1: {
        en: "Built an internal task management app with React and Firebase.",
        pt: "Construí uma aplicação interna de gestão de tarefas com React e Firebase.",
      },
      b2: {
        en: "Took on more responsibility before the internship ended.",
        pt: "Assumi mais responsabilidades antes do fim do estágio.",
      },
    },
  },
  projects: {
    comms: {
      title: {
        en: "Multi-tenant communication ERP",
        pt: "ERP de comunicação multi-tenant",
      },
      b1: {
        en: "Architected and built the whole front end in Next.js, on a multi-tenant architecture.",
        pt: "Arquitetei e construí o front-end inteiro em Next.js, numa arquitetura multi-tenant.",
      },
      b2: {
        en: "Set up caching and tenant-level data isolation, so every client’s data stays separate, secure and fast.",
        pt: "Implementei cache e isolamento de dados por tenant, pra os dados de cada cliente ficarem separados, seguros e rápidos.",
      },
      b3: {
        en: "Designed the front end to scale with the same experience for every client.",
        pt: "Desenhei o front-end pra escalar mantendo a mesma experiência em todos os clientes.",
      },
    },
    church: {
      title: {
        en: "Church management ERP",
        pt: "ERP de gestão de igrejas",
      },
      b1: {
        en: "Led front-end development end to end with Next.js, Tailwind CSS and shadcn/ui.",
        pt: "Liderei o desenvolvimento front-end de ponta a ponta com Next.js, Tailwind CSS e shadcn/ui.",
      },
      b2: {
        en: "Built and maintained a large codebase across many modules.",
        pt: "Construí e mantive uma base de código grande, com vários módulos.",
      },
      b3: {
        en: "Built complex business flows, with a focus on usability, performance and a consistent architecture.",
        pt: "Construí fluxos de negócio complexos, com foco em usabilidade, performance e consistência na arquitetura.",
      },
    },
    academic: {
      title: {
        en: "Academic ERP, Unoeste University",
        pt: "ERP acadêmico, Universidade Unoeste",
      },
      b1: {
        en: "Built a full-stack app with Next.js, Tailwind CSS, Drizzle ORM and PostgreSQL.",
        pt: "Construí uma aplicação full-stack com Next.js, Tailwind CSS, Drizzle ORM e PostgreSQL.",
      },
      b2: {
        en: "Implemented complete business flows, from the interface down to the database.",
        pt: "Implementei fluxos de negócio completos, da interface até o banco de dados.",
      },
      b3: {
        en: "Focused on visual consistency, domain rules and data integrity.",
        pt: "Foquei em consistência visual, regras de domínio e integridade dos dados.",
      },
    },
  },
  skills: {
    front: { en: "Front end", pt: "Front-end" },
    frontList: {
      en: "React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, shadcn/ui, Vite, Material UI",
      pt: "React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, shadcn/ui, Vite, Material UI",
    },
    back: { en: "Back end", pt: "Back-end" },
    backList: {
      en: "Node.js, REST APIs, AdonisJS, Fastify, Drizzle ORM, PostgreSQL",
      pt: "Node.js, APIs REST, AdonisJS, Fastify, Drizzle ORM, PostgreSQL",
    },
    architecture: {
      en: "Performance and architecture",
      pt: "Performance e arquitetura",
    },
    architectureList: {
      en: "Build optimization, SSR, SSG, ISR, caching, multi-tenancy",
      pt: "Otimização de build, SSR, SSG, ISR, cache, multi-tenancy",
    },
    tools: { en: "Tools and practices", pt: "Ferramentas e práticas" },
    toolsList: {
      en: "Git, CI/CD, observability, Bun, responsive design, SEO",
      pt: "Git, CI/CD, observabilidade, Bun, design responsivo, SEO",
    },
  },
  education: {
    track: { en: "fatec", pt: "fatec" },
    title: {
      en: "Internet Systems Technology",
      pt: "Sistemas para Internet",
    },
    school: {
      en: "Fatec Jahu (Jahu College of Technology)",
      pt: "Fatec Jahu (Faculdade de Tecnologia de Jahu)",
    },
  },
  languages: {
    en: "Portuguese, native. English, advanced: technical reading, documentation and written communication.",
    pt: "Português, nativo. Inglês, avançado: leitura técnica, documentação e comunicação escrita.",
  },
  // Printed only, for applicant tracking systems that read the PDF.
  keywords: {
    en: "Keywords: Front-end developer, React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Node.js, REST API, performance optimization, build optimization, multi-tenant, ERP, SSR, SSG, Vite, Git, CI/CD, observability, SEO, PostgreSQL, Drizzle ORM, shadcn/ui, responsive design, web development, software engineering",
    pt: "Palavras-chave: Desenvolvedor front-end, React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Node.js, API REST, otimização de performance, otimização de build, multi-tenant, ERP, SSR, SSG, Vite, Git, CI/CD, observabilidade, SEO, PostgreSQL, Drizzle ORM, shadcn/ui, design responsivo, desenvolvimento web, engenharia de software",
  },
};
