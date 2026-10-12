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
    en: "Most of the motion here is over in a second or two, too fast to see what it’s actually doing. These are the same pieces the site runs, not recordings of them, hooked to a timing sheet: replay them, slow them to a tenth, or step through a frame at a time.",
    pt: "Quase todo movimento aqui acaba em um ou dois segundos, rápido demais pra ver o que ele tá fazendo de verdade. Essas são as mesmas peças que o site roda, não gravações delas, ligadas a uma folha de tempo: dá pra repetir, deixar em um décimo da velocidade ou avançar frame a frame.",
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
      en: "Every post here has a picture nobody drew. One number, the seed, picks the place, the time of day and the landmark, then every cloud, star and window after them. Type a number or any word and a scene grows from it, or let the die pick one.",
      pt: "Todo post aqui tem uma imagem que ninguém desenhou. Um número, a seed, escolhe o lugar, a hora do dia e o marco, e depois cada nuvem, estrela e janela. Digita um número ou qualquer palavra e uma cena nasce dela, ou deixa o dado escolher.",
    },
    p2: {
      en: "When the seed changes, the picture doesn’t just cut to the next one. The old scene melts into it: a WebGL layer holds a snapshot of the old frame and the live canvas of the new one, warps both through a field of noise, and lets the new scene break through where the noise is lowest. The whole story is in ",
      pt: "Quando a seed muda, a imagem não troca de uma vez. A cena antiga derrete na nova: uma camada WebGL guarda uma foto do frame antigo e o canvas ao vivo do novo, deforma os dois com um campo de ruído e deixa a cena nova aparecer onde o ruído é mais baixo. A história completa tá em ",
    },
  },
  die: {
    title: { en: "The die", pt: "O dado" },
    p1: {
      en: "The die isn’t an icon or a 3D model. Every frame, a cube is turned and projected by hand into two SVG paths: one for the edges, and one for the pips, small discs that flatten as their face turns away. Only the faces turned toward you get drawn, and the stroke stays a pixel wide at any size.",
      pt: "O dado não é um ícone nem um modelo 3D. A cada frame, um cubo é girado e projetado na mão em dois paths SVG: um pras arestas e outro pros pontos, discos pequenos que achatam conforme a face vira. Só as faces voltadas pra você são desenhadas, e o traço continua com um pixel de largura em qualquer tamanho.",
    },
    p2: {
      en: "A throw hops, tumbles at least a full turn on each axis, and lands on the face its seed picks, so the die and the scene always agree. Pause it halfway and step through: the frames it just passed stay behind as faint outlines.",
      pt: "Cada jogada dá um pulo, gira pelo menos uma volta inteira em cada eixo e para na face que a seed escolhe, então o dado e a cena sempre batem. Pausa no meio e avança frame a frame: os frames que acabaram de passar ficam pra trás como contornos fracos.",
    },
  },
  hint: {
    title: { en: "A hand-drawn arrow", pt: "Uma seta desenhada à mão" },
    p1: {
      en: "The first time you open a post, an arrow draws itself to the die: the line swoops and loops once, then the head gets outlined and hatched stroke by stroke. After that your browser remembers, and the arrow doesn’t come back.",
      pt: "Na primeira vez que você abre um post, uma seta se desenha até o dado: a linha faz uma curva e uma volta, depois a ponta é contornada e hachurada traço por traço. Depois disso o navegador lembra, e a seta não aparece de novo.",
    },
    p2: {
      en: "Each stroke is one dash as long as its own path, slid into place with stroke-dashoffset. Under the strokes runs a thicker copy in the page’s own black, so the part that crosses the picture still reads.",
      pt: "Cada traço é um único tracejado do tamanho do próprio path, que desliza pro lugar com stroke-dashoffset. Embaixo dos traços corre uma cópia mais grossa no preto da página, pra parte que cruza a imagem continuar legível.",
    },
  },
  reveal: {
    title: { en: "Text reveal", pt: "Texto que se revela" },
    p1: {
      en: "The name at the top of the home page arrives one word at a time. Each word rises a fifth of its height out of a 6px blur over 800ms, 50ms after the one before it, and the role starts 150ms behind the name.",
      pt: "O nome no topo da página inicial chega uma palavra por vez. Cada palavra sobe um quinto da própria altura saindo de um desfoque de 6px em 800ms, 50ms depois da anterior, e o cargo começa 150ms depois do nome.",
    },
    p2: {
      en: "It’s all CSS, so the words are in the HTML from the start and anything that reads the page gets them; only the animation’s first frame hides them from view. With reduced motion on, they just fade in.",
      pt: "É tudo CSS, então as palavras tão no HTML desde o começo e qualquer coisa que lê a página recebe elas; só o primeiro frame da animação esconde elas da tela. Com movimento reduzido ligado, elas só aparecem com um fade.",
    },
  },
};
