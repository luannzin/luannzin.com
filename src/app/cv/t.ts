// The CV, on screen and on paper. Facts come from the CV of November 2026 in
// his CV vault, with its numbers left out on purpose (user decision); the
// phone stays off too.
export default {
  meta: {
    description: {
      en: "Luan Fabri’s CV: front-end developer at Loopscape since 2023, working across the stack with React, Next.js, Node.js and Rust, plus open-source apps that need only a code or a link. Download it as a PDF or print it.",
      pt: "Currículo do Luan Fabri: desenvolvedor front-end na Loopscape desde 2023, trabalhando no stack inteiro com React, Next.js, Node.js e Rust, e criador de apps open source que só precisam de um código ou de um link. Baixe em PDF ou imprima.",
    },
  },
  title: { en: "CV", pt: "Currículo" },
  place: { en: "Jaú, SP, Brazil", pt: "Jaú, SP, Brasil" },
  email: { en: "Email", pt: "E-mail" },
  summary: {
    en: "Front-end developer by title, full-stack in practice. At Loopscape since 2023, working on Loopvet, a SaaS for veterinary clinics, with React, Next.js and TypeScript on the client and Node.js, PostgreSQL, MongoDB and Rust on the server.",
    pt: "Desenvolvedor front-end no cargo, full-stack na prática. Na Loopscape desde 2023, trabalho no Loopvet, um SaaS para clínicas veterinárias, com React, Next.js e TypeScript no front-end e Node.js, PostgreSQL, MongoDB e Rust no back-end.",
  },
  summaryMore: {
    en: "Much of the work removes bottlenecks for other teams, from customer data imports to catching production bugs before customers call support. Also built the front end of a church management SaaS from a sister company and led its first front-end team. Outside work, created open-source apps in Rust and TypeScript that need only a code or a link, with no account and no server to run.",
    pt: "Boa parte do trabalho tira gargalos de outras áreas, da importação de dados de clientes a bugs de produção que chegam ao time antes de o cliente ligar para o suporte. Também construí o front-end de um SaaS de gestão de igrejas de uma empresa irmã e liderei seu primeiro time de front-end. Fora do trabalho, criei apps open source em Rust e TypeScript que só precisam de um código ou de um link, sem conta e sem servidor para rodar.",
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
  // in page order; the contents list follows it
  sections: {
    experience: { en: "Experience", pt: "Experiência" },
    openSource: { en: "Open source", pt: "Open source" },
    projects: { en: "Other projects", pt: "Outros projetos" },
    skills: { en: "Skills", pt: "Habilidades" },
    education: { en: "Education", pt: "Formação" },
    languages: { en: "Languages", pt: "Idiomas" },
  },
  products: {
    en: "Loopvet, a SaaS for veterinary clinics, and a church management SaaS from a sister company",
    pt: "Loopvet, SaaS para clínicas veterinárias, e um SaaS de gestão de igrejas de uma empresa irmã",
  },
  roles: {
    mid: {
      track: { en: "mid-level", pt: "pleno" },
      title: {
        en: "Mid-level front-end developer",
        pt: "Desenvolvedor front-end pleno",
      },
    },
    junior: {
      track: { en: "junior", pt: "júnior" },
      title: {
        en: "Junior front-end developer",
        pt: "Desenvolvedor front-end júnior",
      },
    },
    intern: {
      track: { en: "intern", pt: "estágio" },
      title: { en: "Front-end intern", pt: "Estagiário de front-end" },
    },
  },
  // the work across all three roles, by area
  groups: {
    tools: {
      title: { en: "Internal tools", pt: "Ferramentas internas" },
      b1: {
        en: "Created a web app that converts the data clinics export from their previous systems into Loopvet’s import format, work that used to fall to a senior back-end engineer. Started it as a script and wrote the conversion core; a junior developer built most of the interface.",
        pt: "Criei uma aplicação web que converte os dados exportados pelas clínicas dos sistemas anteriores para o formato de importação do Loopvet, um trabalho que antes ficava com um desenvolvedor back-end sênior. Comecei com um script e escrevi o núcleo da conversão; um desenvolvedor júnior construiu a maior parte da interface.",
      },
      b2: {
        en: "Developed an audit tool for every API request stored in MongoDB: search, grouping, counts, response times, slow queries, errors and database state.",
        pt: "Desenvolvi uma ferramenta de auditoria de todas as requisições da API salvas no MongoDB: busca, agrupamento, contagem, tempo de resposta, queries lentas, erros e estado do banco.",
      },
      b3: {
        en: "Trained an open-source model (PyTorch) on those requests to flag attacks, request loops, stuck users and performance problems. It runs continuously as a Rust terminal UI on a TV and posts alerts and a morning digest to Discord, so the team fixes bugs before customers call support.",
        pt: "Treinei um modelo open source (PyTorch) com essas requisições para identificar ataques, loops de requisição, usuários travados e problemas de performance. Roda sem parar como uma TUI em Rust numa TV e envia alertas e um resumo matinal ao Discord. Com isso, o time corrige bugs antes de o cliente ligar para o suporte.",
      },
      b4: {
        en: "Shipped a sales tool that shows which leads need a call and which have not replied yet.",
        pt: "Entreguei ao time de vendas uma ferramenta que mostra quais leads precisam de contato e quais ainda não responderam.",
      },
    },
    product: {
      title: { en: "Product (Loopvet)", pt: "Produto (Loopvet)" },
      b1: {
        en: "Implemented the user onboarding and an interactive product tour system, later packaged as a React library. Tours are written as steps in plain language (“Click New client”) and find each element on the live screen with no ids in the code, so anyone on the team can publish one without a developer.",
        pt: "Implementei o onboarding e um sistema de tours interativos, depois empacotado como biblioteca React. O tour é escrito em passos de linguagem natural (“Clique em Novo Cliente”) e localiza cada elemento na tela, sem ids no código, então qualquer pessoa do time publica um tour sem depender de desenvolvedor.",
      },
      b2: {
        en: "Wrote the PDF microservice in Fastify for the AdonisJS back end, then rewrote it in Rust with Typst embedded as the layout engine: a single binary that renders one document per core.",
        pt: "Escrevi o microsserviço de PDF em Fastify para o back-end em AdonisJS e depois o reescrevi em Rust com o Typst como motor de layout: um binário único que renderiza um documento por núcleo.",
      },
      b3: {
        en: "Integrated payment terminals, WhatsApp and digital signatures into the product, and launched a public site for validating digital prescriptions.",
        pt: "Integrei terminais de pagamento, WhatsApp e assinatura digital ao produto, e lancei um site público para validação de receitas digitais.",
      },
      b4: {
        en: "Rebuilt the sales website in Next.js for performance and SEO, including the landing pages for campaigns.",
        pt: "Reconstruí em Next.js o site de vendas e as landing pages de campanhas, com foco em performance e SEO.",
      },
      b5: {
        en: "Drove several refactors of legacy code, including the migration from React 16 to a modern TypeScript stack, and cut the main app’s build time.",
        pt: "Conduzi várias refatorações de código legado, incluindo a migração de React 16 para uma stack moderna com TypeScript, e reduzi o tempo de build da aplicação principal.",
      },
    },
    church: {
      title: {
        en: "Church management SaaS",
        pt: "SaaS de gestão de igrejas",
      },
      b1: {
        en: "Built the front end from scratch: the management dashboard and the PWA, both multi-tenant (Next.js, Tailwind CSS, shadcn/ui).",
        pt: "Construí o front-end do zero: o painel de gestão e o app PWA, ambos multi-tenant (Next.js, Tailwind CSS, shadcn/ui).",
      },
      b2: {
        en: "Led the first front-end team and helped hire its developers.",
        pt: "Liderei o primeiro time de front-end e participei da contratação dos desenvolvedores.",
      },
    },
  },
  open: {
    deskline: {
      en: "remote desktop with no server to run, in Rust (egui, iroh). Connects with a code and an accept prompt, and supports file transfer, sound, chat and up to 4K at 240 fps with GPU encoding. Made to replace AnyDesk when helping family and friends.",
      pt: "acesso remoto sem servidor para rodar, em Rust (egui, iroh). Conecta com um código e um pedido de aceite, e tem transferência de arquivos, som, chat e até 4K a 240 fps com encode na GPU. Criado para substituir o AnyDesk ao ajudar família e amigos.",
    },
    sightline: {
      en: "screen sharing as a link, live in the browser with sound. React and WebRTC, signalled over public Nostr relays: a static site with no server in the middle.",
      pt: "compartilhamento de tela por link, ao vivo no navegador e com som. React e WebRTC, com sinalização por relays públicos do Nostr: um site estático, sem servidor no meio.",
    },
    hostline: {
      en: "localhost shared as a link. A Rust CLI prints a link and a QR code, and the visitor’s browser loads the port directly from the host’s machine over a WebRTC data channel, hot reload included.",
      pt: "compartilhamento do localhost por link. Uma CLI em Rust gera um link e um QR code, e o navegador de quem abre carrega a porta direto da máquina de quem compartilha, por um data channel WebRTC, com hot reload.",
    },
    partyline: {
      en: "party game show in the terminal, in Rust (ratatui, iroh). Players join a room by invite code over the LAN or the internet.",
      pt: "game show no terminal para jogar com os amigos, em Rust (ratatui, iroh). Os jogadores entram numa sala por código de convite, na rede local ou pela internet.",
    },
    echo: {
      en: "note-taking app that picks out deadlines, tasks and recurring words from each line. Real Postgres, compiled to WebAssembly, runs in the browser, and no feature requires an AI API key.",
      pt: "app de notas que identifica prazos, tarefas e palavras recorrentes em cada linha. Postgres de verdade, compilado para WebAssembly, roda no navegador, e nenhum recurso exige chave de API de IA.",
    },
    betterIntl: {
      en: "typed, file-based i18n for Next.js, used by this site in English and Portuguese.",
      pt: "i18n tipado e baseado em arquivos para Next.js, usado por este site em inglês e português.",
    },
  },
  projects: {
    comms: {
      title: {
        en: "Multi-tenant communication ERP",
        pt: "ERP de comunicação multi-tenant",
      },
      text: {
        en: "front-end architecture in Next.js, with tenant-level data isolation and caching.",
        pt: "arquitetura do front-end em Next.js, com cache e dados isolados por tenant.",
      },
    },
    academic: {
      title: {
        en: "Academic ERP for Unoeste University",
        pt: "ERP acadêmico para a Unoeste",
      },
      text: {
        en: "full-stack app with Next.js, Drizzle ORM and PostgreSQL.",
        pt: "aplicação full-stack com Next.js, Drizzle ORM e PostgreSQL.",
      },
    },
  },
  skills: {
    languages: { en: "Languages", pt: "Linguagens" },
    languagesList: {
      en: "TypeScript, JavaScript, Rust, Python, SQL",
      pt: "TypeScript, JavaScript, Rust, Python, SQL",
    },
    front: { en: "Front end", pt: "Front-end" },
    frontList: {
      en: "React, Next.js, Vite, Tailwind CSS, shadcn/ui, Base UI, PWAs",
      pt: "React, Next.js, Vite, Tailwind CSS, shadcn/ui, Base UI, PWA",
    },
    back: { en: "Back end", pt: "Back-end" },
    backList: {
      en: "Node.js, AdonisJS, Fastify, REST APIs",
      pt: "Node.js, AdonisJS, Fastify, APIs REST",
    },
    data: { en: "Data", pt: "Dados" },
    dataList: {
      en: "PostgreSQL, MongoDB, Drizzle ORM",
      pt: "PostgreSQL, MongoDB, Drizzle ORM",
    },
    native: { en: "Native and networking", pt: "Nativo e redes" },
    nativeList: {
      en: "Rust (egui, ratatui), WebRTC, peer-to-peer (iroh, Nostr), Typst",
      pt: "Rust (egui, ratatui), WebRTC, peer-to-peer (iroh, Nostr), Typst",
    },
    ai: { en: "AI", pt: "IA" },
    aiList: {
      en: "LLM features in production, training open-source models (PyTorch)",
      pt: "funcionalidades com LLM em produção, treino de modelos open source (PyTorch)",
    },
    other: { en: "Other", pt: "Outros" },
    otherList: {
      en: "multi-tenant architecture, observability, performance, CI/CD, Git, Bun",
      pt: "arquitetura multi-tenant, observabilidade, performance, CI/CD, Git, Bun",
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
    en: "Portuguese (native), English (fluent)",
    pt: "Português (nativo), inglês (fluente)",
  },
  // Printed only, for applicant tracking systems that read the PDF.
  keywords: {
    en: "Keywords: Full-stack engineer, product engineer, software engineer, front-end engineer, React, Next.js, TypeScript, JavaScript, Node.js, Rust, Python, PostgreSQL, MongoDB, REST API, AdonisJS, Fastify, SaaS, multi-tenant, PWA, WebRTC, peer-to-peer, PDF generation, Typst, performance optimization, observability, LLM, AI, PyTorch, internal tools, data migration, payments integration, onboarding, refactoring, open source, Tailwind CSS, CI/CD, team leadership, hiring",
    pt: "Palavras-chave: Desenvolvedor full-stack, engenheiro de software, desenvolvedor front-end, React, Next.js, TypeScript, JavaScript, Node.js, Rust, Python, PostgreSQL, MongoDB, API REST, AdonisJS, Fastify, SaaS, multi-tenant, PWA, WebRTC, peer-to-peer, geração de PDF, Typst, performance, observabilidade, LLM, IA, PyTorch, ferramentas internas, migração de dados, integração de pagamentos, onboarding, refatoração, open source, Tailwind CSS, CI/CD, liderança técnica, contratação",
  },
};
