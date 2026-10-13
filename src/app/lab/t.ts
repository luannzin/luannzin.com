export default {
  meta: {
    description: {
      en: "The motion on this site, slowed down: the seeded scenes, the die, a hand-drawn arrow and the text reveal, each running live over a timing sheet you can replay, slow down and step through.",
      pt: "O movimento deste site em câmera lenta: as cenas feitas a partir de uma seed, o dado, uma seta desenhada à mão e o texto que se revela, cada um rodando ao vivo sobre uma folha de tempo pra repetir, desacelerar e ver frame a frame.",
    },
  },
  title: { en: "Lab", pt: "Lab" },
  subtitle: {
    en: "The motion on this site, slowed down",
    pt: "O movimento deste site, em câmera lenta",
  },
  intro: {
    en: "Most of the motion on this site is over in a second or two. Too fast to see what it’s actually doing. So I hooked the real pieces, not recordings of them, to a timing sheet: replay them, slow them to a tenth, or step through a frame at a time.",
    pt: "Quase todo movimento deste site acaba em um ou dois segundos. Rápido demais pra ver o que ele tá fazendo de verdade. Então liguei as peças de verdade (não é gravação) numa folha de tempo: dá pra repetir, deixar em um décimo da velocidade ou avançar frame a frame.",
  },
  // The home page's row that leads here.
  row: {
    en: "Motion, frame by frame",
    pt: "Movimento, frame a frame",
  },
  rowDescription: {
    en: "The scenes, the die and the rest of the motion, slowed down",
    pt: "As cenas, o dado e o resto do movimento, em câmera lenta",
  },
  controls: {
    replay: { en: "Replay", pt: "Repetir" },
    play: { en: "Play", pt: "Reproduzir" },
    pause: { en: "Pause", pt: "Pausar" },
    previous: { en: "Previous frame", pt: "Frame anterior" },
    next: { en: "Next frame", pt: "Próximo frame" },
    speed: { en: "Speed", pt: "Velocidade" },
    playhead: { en: "Playhead", pt: "Tempo" },
    frame: { en: "frame", pt: "frame" },
    of: { en: "of", pt: "de" },
  },
  // Track names on the timing sheets.
  tracks: {
    melt: { en: "melt", pt: "derrete" },
    hop: { en: "hop", pt: "pula" },
    tumble: { en: "tumble", pt: "gira" },
    line: { en: "line", pt: "linha" },
    head: { en: "head", pt: "ponta" },
    hatch: { en: "hatch", pt: "hachura" },
    avatar: { en: "avatar", pt: "avatar" },
  },
  seed: {
    label: { en: "Seed", pt: "Seed" },
    placeholder: { en: "A number or a word", pt: "Um número ou uma palavra" },
    random: { en: "Draw a random seed", pt: "Sortear uma seed" },
  },
  scenes: {
    title: { en: "Seeded scenes", pt: "Cenas a partir de uma seed" },
    p1: {
      en: "Nobody drew the picture on top of each post. I didn’t want to make covers and keep them up to date, so every post gets a number instead, its seed, and the page builds a scene from it: the place, the time of day, the landmark, then every cloud, star and window. Type a number or any word and a scene grows from it, or let the die pick one.",
      pt: "Ninguém desenhou a imagem do topo dos posts. Eu não queria criar capa e ficar mantendo tudo atualizado, então cada post ganha um número, a seed, e a página monta uma cena a partir dele: o lugar, a hora do dia, o marco, depois cada nuvem, estrela e janela. Digita um número ou qualquer palavra e uma cena nasce dela, ou deixa o dado escolher.",
    },
    p2: {
      en: "When the seed changes, the picture doesn’t just cut. The old scene melts into the new one: a WebGL layer holds a snapshot of the old frame and the live canvas of the new one, warps both through noise, and lets the new scene break through where the noise is lowest. It started as the melt from React Bits’ Morph Slider, rewritten for one canvas and no dependencies. The whole story is in ",
      pt: "Quando a seed muda, a imagem não só troca. A cena antiga derrete na nova: uma camada WebGL guarda uma foto do frame antigo e o canvas ao vivo do novo, deforma os dois com ruído e deixa a cena nova aparecer onde o ruído é mais baixo. Começou como o melt do Morph Slider do React Bits, reescrito pra um canvas só e sem NENHUMA dependência. A história completa tá em ",
    },
  },
  die: {
    title: { en: "The die", pt: "O dado" },
    p1: {
      en: "The die isn’t an icon or a 3D model. I draw it by hand: every frame, a cube is turned and projected into two SVG paths, one for the edges and one for the pips, which flatten as their face turns away. That way every line stays a crisp 1px vector however it turns, at any size.",
      pt: "O dado não é ícone nem modelo 3D. Eu desenho ele na mão: a cada frame, um cubo é girado e projetado em dois paths SVG, um pras arestas e outro pros pontos, que achatam conforme a face vira. Assim cada linha continua um vetor de 1px, nítido, girando do jeito que for e em qualquer tamanho.",
    },
    p2: {
      en: "A throw hops, tumbles at least a full turn on each axis, and lands on the face its seed picks, so the die and the scene always agree. Pause it halfway and step through: the frames it just passed stay behind as faint outlines.",
      pt: "Cada jogada dá um pulo, gira pelo menos uma volta inteira em cada eixo e para na face que a seed escolhe, então o dado e a cena sempre batem. Pausa no meio e avança frame a frame: os frames que acabaram de passar ficam pra trás como contornos fracos.",
    },
  },
  hint: {
    title: { en: "A hand-drawn arrow", pt: "Uma seta desenhada à mão" },
    p1: {
      en: "A die in the corner of a picture is easy to miss. So the first time you open a post, an arrow draws itself to it: the line swoops and loops once, then the head gets outlined and hatched stroke by stroke. After that your browser remembers, and you don’t see it again.",
      pt: "Um dado no canto da imagem passa batido fácil. Então na primeira vez que você abre um post, uma seta se desenha até ele: a linha faz uma curva e uma volta, depois a ponta é contornada e hachurada traço por traço. Depois disso o navegador lembra, e ela não aparece de novo.",
    },
    p2: {
      en: "Each stroke is one dash as long as its own path, slid into place with stroke-dashoffset. Under the strokes runs a thicker copy in the page’s own black, so the part that crosses the picture still reads.",
      pt: "Cada traço é um único tracejado do tamanho do próprio path, que desliza pro lugar com stroke-dashoffset. Embaixo dos traços corre uma cópia mais grossa no preto da página, pra parte que cruza a imagem continuar legível.",
    },
  },
  // Bug hunt, the platformer at /lab/bug-hunt
  game: {
    meta: {
      description: {
        en: "A pixel art platformer where I'm the main character and the bugs are actual bugs. Punch them, throw a keyboard at them, and when you've fixed enough, open the laptop. Every level is new, grown from a seed.",
        pt: "Um jogo de plataforma em pixel art em que eu sou o personagem principal e os bugs são bugs de verdade. Dá soco neles, joga um teclado neles e, quando já tiver resolvido bastante, abre o notebook. Cada fase é nova, gerada a partir de uma seed.",
      },
    },
    title: { en: "Bug hunt", pt: "Caça aos bugs" },
    subtitle: {
      en: "A platformer where the bugs are actual bugs",
      pt: "Um jogo de plataforma em que os bugs são bugs de verdade",
    },
    intro: {
      en: "I’m the one in the black hoodie. Every level is a server room full of bugs, and I fix them by punching them, or by throwing a mouse, a keyboard or my headphones at them. Fix enough of them and the laptop comes out: a few lines of code, then a rosé beam takes out everything in front of me. Once the room is clean, the exit opens to the next one.",
      pt: "Eu sou o de moletom preto. Cada fase é uma sala de servidores cheia de bug, e eu resolvo eles no soco, ou jogando um mouse, um teclado ou o meu fone neles. Depois de resolver uns quantos, sai o notebook: umas linhas de código e um raio rosé leva tudo que tiver na minha frente. Com a sala limpa, a saída abre pra próxima.",
    },
    row: { en: "Bug hunt", pt: "Caça aos bugs" },
    rowDescription: {
      en: "A platformer where I fix bugs by punching them",
      pt: "Um jogo de plataforma em que eu resolvo bug no soco",
    },
    canvas: {
      en: "Bug hunt: a pixel art platformer",
      pt: "Caça aos bugs: um jogo de plataforma em pixel art",
    },
    play: { en: "Play", pt: "Jogar" },
    resume: { en: "Resume", pt: "Continuar" },
    pause: { en: "Pause", pt: "Pausar" },
    restart: { en: "Start over", pt: "Recomeçar" },
    again: { en: "Play again", pt: "Jogar de novo" },
    paused: { en: "Paused", pt: "Pausado" },
    loading: { en: "Loading", pt: "Carregando" },
    over: { en: "The bugs won", pt: "Os bugs venceram" },
    level: { en: "Level", pt: "Fase" },
    fixed: { en: "bugs fixed", pt: "bugs resolvidos" },
    open: {
      en: "Every bug fixed. The exit is open.",
      pt: "Todos os bugs resolvidos. A saída tá aberta.",
    },
    // the keys, under the game
    keys: {
      label: { en: "Controls", pt: "Controles" },
      move: { en: "move", pt: "anda" },
      jump: { en: "jump", pt: "pula" },
      drop: { en: "drop through", pt: "desce da plataforma" },
      punch: { en: "punch", pt: "soco" },
      throw: { en: "throw", pt: "arremessa" },
      special: { en: "special", pt: "especial" },
    },
    // the buttons on a touch screen
    pad: {
      left: { en: "Left", pt: "Esquerda" },
      right: { en: "Right", pt: "Direita" },
      down: { en: "Down", pt: "Baixo" },
      jump: { en: "Jump", pt: "Pula" },
      punch: { en: "Punch", pt: "Soco" },
      throw: { en: "Throw", pt: "Joga" },
      special: { en: "Special", pt: "Especial" },
    },
    made: {
      title: { en: "How it’s made", pt: "Como foi feito" },
      p1: {
        en: "There’s no sprite editor behind any of this. A Python script with Pillow draws every pixel from a few rules: it’s all line art on black, every shape closed by a 1px line in its own colour, and anything that needs texture or has to fade, like the curls, the bugs’ shells or the bricks sinking into the dark, is ordered dither instead of a gradient. Me included: the curly hair, the black hoodie, the cargo pants and the earbud are a pose and a handful of shapes, drawn like everything else.",
        pt: "Não tem editor de sprite por trás disso. Um script em Python com Pillow desenha cada pixel a partir de poucas regras: é tudo line art no preto, cada forma fechada por uma linha de 1px na própria cor, e o que precisa de textura ou de sumir aos poucos, tipo os cachos, a casca dos bugs ou os tijolos afundando no escuro, é dither ordenado em vez de degradê. Inclusive eu: o cabelo cacheado, o moletom preto, a calça cargo e o fone são uma pose e um punhado de formas, desenhados igual a todo o resto.",
      },
      p2: {
        en: "The levels come from a seed, a new one each run: the floor, the gaps, the platforms and where every bug starts. Since nobody designed them, nobody played them either, so a script grows a few thousand and checks that every gap can be jumped and every bug can be reached.",
        pt: "As fases saem de uma seed, uma nova a cada partida: o chão, os buracos, as plataformas e onde cada bug começa. Como ninguém desenhou elas, ninguém jogou elas também, então um script gera alguns milhares e confere se dá pra pular cada buraco e chegar em cada bug.",
      },
      p3: {
        en: "And since it lives in the Lab, it slows down like everything else here. At 0.1× you can watch every frame of a punch.",
        pt: "E como ele mora no Lab, ele desacelera igual a todo o resto aqui. Em 0.1× dá pra ver cada frame de um soco.",
      },
    },
  },
  reveal: {
    title: { en: "Text reveal", pt: "Texto que se revela" },
    p1: {
      en: "The name at the top of the home page arrives one word at a time. Each word rises a fifth of its height out of a 6px blur over 800ms, 50ms after the one before it, and the role starts 150ms behind the name.",
      pt: "O nome no topo da página inicial chega uma palavra por vez. Cada palavra sobe um quinto da própria altura saindo de um desfoque de 6px em 800ms, 50ms depois da anterior, e o cargo começa 150ms depois do nome.",
    },
    p2: {
      en: "It’s all CSS, no JavaScript and no animation library. The words are in the HTML from the start, so anything that reads the page gets them, and only the animation’s first frame hides them. With reduced motion on, they just fade in.",
      pt: "É tudo CSS, sem JavaScript e sem biblioteca de animação. As palavras tão no HTML desde o começo, então qualquer coisa que lê a página recebe elas, e só o primeiro frame da animação esconde elas. Com movimento reduzido ligado, elas só aparecem com um fade.",
    },
  },
};
