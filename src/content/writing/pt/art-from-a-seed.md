---
title: Arte a partir de uma semente
description: A imagem de cada post, nascida de um único número
date: 2026-10-08
updated: 2026-10-10
metaTitle: Arte a partir de uma semente: arte generativa com seed em TypeScript
metaDescription: Como a arte de capa de cada post nasce de uma seed: um PRNG mulberry32 escolhe a cena, e o WebGL a desenha como pontos de meio-tom com dithering de Bayer.
seed: 16
---

Todo post deste site abre com uma cena que ninguém pintou. Cada post carrega um número, sua semente (seed), e a página faz crescer um pequeno mundo a partir dele: o lugar, a hora do dia, o que está de pé ali, o formato de cada nuvem. Passe o ponteiro sobre a de cima e você leva uma pequena luz por ela; toque no céu para ver uma estrela cadente, ou na água para uma ondulação. O dado no canto sorteia outra para você, só nesta visita.

Eu queria que as imagens pertencessem aos posts sem precisar criar capas que eu teria que manter. Uma semente não custa nada para guardar, nunca fica desatualizada e dá a cada post uma vista que nenhum outro tem.

## Um número, todas as escolhas

A semente vem do frontmatter do post, ou de um hash do slug quando o post não a define. Um pequeno gerador de números pseudoaleatórios (PRNG) com semente, o mulberry32, a transforma em uma sequência de números entre 0 e 1, e cada decisão que a cena toma lê o próximo número dessa sequência:

```ts title="src/lib/scene.ts"
function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

O lugar vem primeiro, porque o lugar decide o que mais pode acontecer ali. Cada um lista as horas do dia em que é desenhado e o que pode estar nele, cada item com um peso, e os três próximos números da sequência escolhem um de cada:

```ts title="src/lib/scene.ts" {15-17}
const PLACES = {
  city: {
    words: ["alley", "crossing", "street", "district"],
    times: { rain: 3, night: 2, twilight: 1.5, storm: 1 },
    landmarks: { walker: 2, vending: 1 },
  },
  reef: {
    words: ["reef", "shoal", "lagoon", "atoll"],
    times: { deep: 1 },
    landmarks: { wreck: 1, manta: 1 },
  },
  // and seven more
};

const place = weighted(random, PLACE_WEIGHTS);
const time = TIMES[weighted(random, PLACES[place].times)];
const landmark = weighted(random, PLACES[place].landmarks);
```

Assim, uma rua nunca é desenhada com o sol se pondo nela, e nada no fundo do mar recebe neve. Como a sequência é sempre a mesma para a mesma semente, tudo o que sai dela também é. O marco e o sol ou a lua ficam em lados opostos do quadro, então toda cena começa de uma composição que se sustenta.

## Um pequeno mundo de peças

São nove lugares, onze horas do dia e onze coisas para colocar neles:

| Lugar | Desenhado em | O que está nele |
| --- | --- | --- |
| Costa | Noite, crepúsculo, entardecer, amanhecer, aurora, tempestade | Um farol ou uma cabana |
| Fiorde | Noite, crepúsculo, amanhecer, aurora, alpenglow, tempestade | Uma cabana ou um veleiro |
| Lago | Noite, crepúsculo, entardecer, amanhecer, aurora, alpenglow, lanternas | Um veleiro ou uma cabana |
| Vale | Noite, crepúsculo, entardecer, amanhecer, aurora, alpenglow, tempestade, lanternas | Um moinho ou uma cabana |
| Dunas | Noite, crepúsculo, entardecer, amanhecer, tempestade | Só o céu |
| Jardim | Entardecer ameixa, entardecer, crepúsculo, noite, amanhecer, lanternas | Um pagode ou um torii, sob uma cerejeira |
| Rio | Entardecer, amanhecer, crepúsculo, noite, lanternas | Um templo sobre degraus que descem até a água |
| Cidade | Chuva, noite, crepúsculo, tempestade | Alguém sob um guarda-chuva, ou uma máquina de venda automática |
| Recife | Águas profundas | Um naufrágio, ou uma raia-manta |

O mesmo código, seis outras sementes. Passe o ponteiro sobre uma para colocá-la em movimento:

```scenes
2 109 103 9 46 58
```

O nome embaixo de cada imagem vem das mesmas escolhas: uma palavra para a hora e uma para o lugar, como a de cima. Ou continue sorteando; cada clique escolhe uma nova semente:

```roll
44
```

## Sombreando cada célula

Da semente até a tela, uma cena passa por quatro etapas. As duas primeiras rodam uma vez; as duas últimas rodam a cada quadro:

```flow
seed | um número | hash | lit
createScene | escolhe cada peça | layers
renderer(cols, rows)
frame(t) | sombreia cada célula | grid
canvas | pontos na GPU | image | lit
```

O quadro é uma grade de células, uma a cada três pixels de largura, ou mais fina em uma tela mais nítida, e cada célula é sombreada em cores antes de qualquer coisa ser desenhada.

O céu vai da cor do topo até um horizonte mais claro, com um brilho em volta do sol ou da lua. As nuvens são camadas de ruído, iluminadas no lado voltado para a luz e mantidas longe da face da lua. As montanhas são ruído em cristas: as encostas voltadas para a luz a recebem, as cadeias distantes se dissolvem no céu, a névoa se acumula aos seus pés, e o topo de cada uma pega uma linha do céu por trás, então até uma cadeia escura se destaca de um céu escuro. No alpenglow o sol ainda não nasceu, mas a neve nos picos mais altos já o vê, então só as faces voltadas para ele ficam rosadas.

### Água que reflete o que está acima dela

A água é sombreada por último. Para cada célula abaixo do horizonte, a cena olha para cima, para a célula espelhada pela linha d'água, que já foi sombreada, e a desloca para o lado de acordo com a ondulação. O reflexo das montanhas, das nuvens e de cada lâmpada sai dessa única consulta. Por cima, uma estrada de reflexos desce a partir do sol ou da lua.

Cada coluna espelha em torno da própria linha: o horizonte em mar aberto, ou a base do que estiver de pé nela. Um torii dentro de um lago reflete a partir dos próprios pilares, e em uma rua molhada a luz de uma máquina de venda automática começa na própria base e se estende pela rua.

## Lugares sem horizonte

A maioria das cenas é um céu sobre terra sobre água. Duas não são.

### Uma rua que foge

A cidade é desenhada em perspectiva de um ponto: a rua se afasta de nós em linha reta até um ponto no horizonte. Cada coluna do quadro olha para uma parede, e a distância dessa parede depende de quão longe a coluna está do centro. Sabendo a profundidade, o resto é divisão. Resumido, fica assim:

```ts title="src/lib/scene.ts"
const z = Math.min(end, STREET / Math.abs(x - 1));
const block = blockAt(x - 1, z);
if (y >= horizon + EYE / z) kind[k] = WATER; // the wet street
else if (y < horizon - (block.h - EYE) / z) kind[k] = SKY;
else paint(k, face(z, EYE - (y - horizon) * z, block));
```

As placas são do tipo bandeira, presas perpendiculares à parede, o que significa que ficam de frente para o fundo da rua, para nós. Cada uma é um retângulo encolhido pela profundidade, com uma borda acesa e katakana desenhado a partir de bitmaps de cinco por cinco quando há espaço para eles; longe demais, uma placa vira um punhado de luz. O brilho delas é calculado uma vez e ilumina as paredes, a rua molhada e a chuva que cai na frente delas.

### No fundo do mar

O recife é o céu de cabeça para baixo. O gradiente vai da superfície clara até o escuro, o sol é um clarão no topo com feixes de luz se abrindo a partir dele, e as montanhas viram rocha alta nas duas bordas com coral ao longo da crista. Um cardume gira em um anel que vagueia, e cada peixe reluz quando vira o flanco para nós.

## Coisas que se movem

- **Clima:** as nuvens passam e as estrelas cintilam. A chuva cai em faixas inclinadas, iluminada por qualquer neon por perto, e uma tempestade solta um raio a cada poucos segundos, que pisca duas vezes antes de sumir.
- **Luzes:** lanternas de céu sobem cada uma na sua profundidade, as próximas grandes, baixas e rápidas, e a água espelha as que estão acima dela. Luminárias descem o rio flutuando, e o farol gira seu facho.
- **Vida:** pétalas caem da cerejeira, uma bandeira tremula no templo, um moinho gira, e uma raia-manta desliza pelo recife, as asas subindo e descendo.

## Da cor aos pontos de meio-tom

Cada célula vira um ponto, em um de três tamanhos ou nenhum, do jeito que um meio-tom impresso faz. As células mais claras recebem os maiores pontos. Um dithering ordenado de quatro por quatro, a matriz de Bayer, decide entre tamanhos vizinhos, então um gradiente suave vira uma textura uniforme em vez de faixas duras. Resumido, são três linhas:

```ts title="src/lib/scene.ts" {2}
const level = floor + (1 - floor) * peak ** 0.75;
const dither = bayer[(row & 3) * 4 + (col & 3)];
const step = Math.round(level * 3 + dither);
```

Depois, a cor compensa o que o tamanho não conseguiu: um ponto pequeno é desenhado um pouco mais claro e um grande um pouco mais escuro, então a imagem mantém o tom ao longo dos degraus do dithering. A cor de cada ponto também é afastada do seu próprio cinza, então coral, neon e flores continuam vivos enquanto a neve branca e a nuvem cinza de tempestade ficam como estão. A terra pode ficar sem ponto nenhum, e é isso que faz um morro escuro se destacar contra um céu escuro.

## Sombreando só o que se move

A cena desenha quinze quadros por segundo. A luz que nunca se move, como o gradiente do céu, o brilho em volta da lua, a luz das lâmpadas no ar e a estrada de luz na água, é calculada uma vez, e uma nuvem só quando ela entra no quadro. Cada quadro sombreia o que sobra: nuvens, estrelas, chuva e água.

Então a GPU desenha os pontos, em um shader WebGL. O quadro sobe como uma textura pequena, um texel por célula, com sua cor e o tamanho do ponto. Um único triângulo cobre o canvas, e cada pixel descobre em qual célula cai e a que distância está do centro, então cada ponto sai redondo, com um pixel de borda suave, e um quadro custa o mesmo não importa quantos pontos existam.

Se os quadros começarem a ficar lentos, oito seguidos acima de 30 milissegundos, as células crescem e sobram menos para sombrear. Acima de 320 colunas elas crescem em vez de se multiplicar, e sem WebGL os pontos são preenchidos em um canvas comum, em menor número e maiores.

## Tocando nela

- **Ponteiro:** uma pequena luz quente segue o mouse, e a água a reflete.
- **Toque:** no céu, uma estrela cadente parte de onde você tocou; na água, um anel se espalha e some; no fundo do mar, algumas bolhas sobem.
- **Dado:** cada clique joga o dado e sorteia uma nova semente, só nesta visita. Enquanto ele rola, a cena antiga se derrete na nova: as duas se deformam pelo ruído, e a nova aparece onde o ruído está mais baixo.
- **Repouso:** a cena para de desenhar quando sai da tela, e fica parada se o seu sistema pede movimento reduzido.

Na página inicial, a mesma semente desenha um recorte quadrado da cena dentro do bloco de cada post, em volta do seu marco, parado até você passar o ponteiro ou focar nele. Abra o post e o bloco cresce até virar a imagem no topo.

![A lista de artigos na página inicial, com o bloco deste post](/writing/art-from-a-seed/home-tile.png "O bloco é a mesma cena, recortada bem perto do seu marco.")

## De onde vem

O visual é emprestado do [ascii.rest](https://ascii.rest), de [bas3line](https://github.com/bas3line/ascii), uma biblioteca de arte em texto animada para páginas web. Cada uma das cenas de lá, como [night coast](https://ascii.rest/night-coast/), [tokyo rain](https://ascii.rest/tokyo-rain/) ou [deep reef](https://ascii.rest/deep-reef/), é seu próprio pedaço de código, sombreado em cores célula por célula e desenhado como pontos com dithering. As daqui nascem de um número. As duas são a mesma aposta: uma página pode se mover um pouco sem deixar de ser calma.
