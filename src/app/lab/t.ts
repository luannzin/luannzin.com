export default {
  meta: {
    description: {
      en: "The motion on this site, slowed down: the seeded scenes, the die, a hand-drawn arrow and two small animations, each with a timing sheet to replay, slow down and step through.",
      pt: "O movimento deste site em câmera lenta: as cenas feitas a partir de uma seed, o dado, uma seta desenhada à mão e duas animações pequenas, cada uma com uma folha de tempo pra repetir, desacelerar e ver quadro a quadro.",
    },
  },
  title: { en: "Lab", pt: "Lab" },
  subtitle: {
    en: "The motion on this site, slowed down",
    pt: "O movimento deste site, em câmera lenta",
  },
  intro: {
    en: "Everything here is the code this site runs, not a recording of it. Replay any piece, slow it down, or step through it a frame at a time.",
    pt: "Tudo aqui é o código que o site roda, não uma gravação dele. Repita qualquer peça, deixe mais lenta ou avance quadro a quadro.",
  },
  // The home page's row that leads here.
  row: {
    en: "Motion, frame by frame",
    pt: "Movimento, quadro a quadro",
  },
  rowDescription: {
    en: "The scenes, the die and the small animations, slowed down",
    pt: "As cenas, o dado e as animações pequenas, em câmera lenta",
  },
  controls: {
    replay: { en: "Replay", pt: "Repetir" },
    play: { en: "Play", pt: "Tocar" },
    pause: { en: "Pause", pt: "Pausar" },
    previous: { en: "Previous frame", pt: "Quadro anterior" },
    next: { en: "Next frame", pt: "Próximo quadro" },
    speed: { en: "Speed", pt: "Velocidade" },
    playhead: { en: "Playhead", pt: "Tempo" },
    frame: { en: "frame", pt: "quadro" },
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
    out: { en: "out", pt: "sai" },
    in: { en: "in", pt: "entra" },
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
      en: "Every post here has a picture nobody drew. One number, its seed, picks the place, the time of day and the landmark, then every cloud, star and window after them. Type a number or any word and the scene grows from it, or let the die pick one.",
      pt: "Todo post aqui tem uma imagem que ninguém desenhou. Um número, a seed, escolhe o lugar, a hora do dia e o marco, e depois cada nuvem, estrela e janela. Digite um número ou qualquer palavra e a cena nasce dela, ou deixe o dado escolher.",
    },
    p2: {
      en: "When the seed changes, the old scene melts into the new one. A WebGL layer holds a snapshot of the old frame and the live canvas of the new one, warps both through a field of noise, and lets the new scene break through where the noise is lowest. The whole story is in ",
      pt: "Quando a seed muda, a cena antiga derrete na nova. Uma camada WebGL guarda uma foto do frame antigo e o canvas ao vivo do novo, deforma os dois com um campo de ruído e deixa a cena nova aparecer onde o ruído está mais baixo. A história completa está em ",
    },
  },
  die: {
    title: { en: "The die", pt: "O dado" },
    p1: {
      en: "The die isn’t an icon or a 3D model. On every frame, a cube is turned and projected by hand into two SVG paths: one for its edges, and one for its pips, drawn as small discs that flatten as their face turns away. Only the faces turned toward you are drawn, and the stroke stays a pixel wide at any size.",
      pt: "O dado não é um ícone nem um modelo 3D. A cada frame, um cubo é girado e projetado à mão em dois paths SVG: um pras arestas e outro pros pontos, desenhados como discos pequenos que achatam conforme a face vira. Só as faces voltadas pra você são desenhadas, e o traço continua com um pixel de largura em qualquer tamanho.",
    },
    p2: {
      en: "A throw hops, tumbles at least a full turn on each axis, and lands on the face its seed decides. Pause it halfway and step through: the frames it just passed stay behind as faint outlines.",
      pt: "Cada jogada dá um pulo, gira pelo menos uma volta inteira em cada eixo e para na face que a seed decide. Pause no meio e avance quadro a quadro: os frames que acabaram de passar ficam pra trás como contornos fracos.",
    },
  },
  hint: {
    title: { en: "A hand-drawn arrow", pt: "Uma seta desenhada à mão" },
    p1: {
      en: "The first time someone opens a post, an arrow draws itself to the die: the line swoops and loops once, then the head is outlined and hatched stroke by stroke. Once it has been seen, the site remembers and doesn’t draw it again.",
      pt: "Na primeira vez que alguém abre um post, uma seta se desenha até o dado: a linha faz uma curva e uma volta, depois a ponta é contornada e hachurada traço por traço. Depois de vista, o site lembra e não desenha de novo.",
    },
    p2: {
      en: "Each stroke is a single dash as long as its path, slid into place with stroke-dashoffset. Under the strokes runs a thicker copy in the page’s own black, so the part that crosses the picture stays readable.",
      pt: "Cada traço é um único tracejado do tamanho do próprio path, que desliza pro lugar com stroke-dashoffset. Embaixo dos traços corre uma cópia mais grossa no preto da página, pra parte que cruza a imagem continuar legível.",
    },
  },
  swap: {
    title: { en: "Icon swap", pt: "Troca de ícone" },
    p1: {
      en: "Copying a link or a block of code swaps its icon in place. The old icon shrinks to a quarter of its size and blurs out while the new one grows in from the same spot.",
      pt: "Copiar um link ou um bloco de código troca o ícone no mesmo lugar. O antigo encolhe pra um quarto do tamanho e desfoca enquanto o novo cresce do mesmo ponto.",
    },
    p2: {
      en: "Both ride a spring with no bounce, sampled into CSS linear(), so the site ships no animation library for it. It’s adapted from beUI’s Action Swap.",
      pt: "Os dois seguem uma mola sem quique, amostrada num linear() do CSS, então o site não carrega nenhuma biblioteca de animação pra isso. É uma adaptação do Action Swap do beUI.",
    },
  },
  reveal: {
    title: { en: "Text reveal", pt: "Texto que se revela" },
    p1: {
      en: "The name at the top of the home page arrives a word at a time. Each word rises a fifth of its height out of a 6px blur over 800ms, 50ms after the one before it, and the role starts 150ms behind the name.",
      pt: "O nome no topo da página inicial chega uma palavra por vez. Cada palavra sobe um quinto da própria altura saindo de um desfoque de 6px em 800ms, 50ms depois da anterior, e o cargo começa 150ms depois do nome.",
    },
    p2: {
      en: "It’s all CSS, so the words are in the HTML from the start and only the animation’s first frame hides them. With reduced motion on, they fade in instead.",
      pt: "É tudo CSS, então as palavras estão no HTML desde o começo e só o primeiro frame da animação esconde elas. Com movimento reduzido ligado, elas só aparecem com um fade.",
    },
  },
};
