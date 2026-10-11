---
title: Arte a partir de uma seed
description: A imagem de cada post, desenhada a partir de um único número
date: 2026-10-08
updated: 2026-10-11
metaTitle: Arte a partir de uma seed: arte generativa em TypeScript
metaDescription: Como a arte de capa de cada post sai de uma seed: um PRNG mulberry32 escolhe a cena, e o WebGL desenha tudo como pontos de meio-tom com dithering de Bayer.
seed: 16
---

Ninguém desenhou a imagem no topo deste post. Cada post tem um número, a seed, e a página monta uma cena a partir dele: o lugar, a hora do dia, o que está ali, até o formato das nuvens.

Ela também reage a você. Passa o ponteiro por cima e uma luzinha vai junto. Toca no céu pra ver uma estrela cadente, ou na água pra fazer uma ondulação. O dado no canto sorteia outra cena, só pra essa visita.

Eu queria que cada post tivesse sua própria imagem, mas sem ter que criar capas e manter tudo atualizado. Uma seed é só um número no frontmatter. Ela nunca fica desatualizada, e nenhum post acaba com a mesma vista de outro.

## Um número, todas as escolhas

A seed vem do frontmatter do post. Se o post não define uma, ela vira um hash do slug. Aí o mulberry32, um gerador de números pseudoaleatórios (PRNG) bem pequeno, transforma ela numa sequência de números entre 0 e 1. Toda decisão que a cena toma pega o próximo número dessa sequência:

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

O lugar é escolhido primeiro, porque ele decide o que mais pode aparecer. Cada lugar lista as horas do dia em que pode ser desenhado e o que pode estar nele, cada um com um peso. Os três próximos números escolhem o lugar, a hora e o marco:

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

Por isso uma rua nunca aparece no pôr do sol, e nada no fundo do mar recebe neve. E como a mesma seed sempre gera a mesma sequência, ela sempre gera a mesma cena. Tem mais uma regra: o marco e o sol ou a lua ficam em lados opostos do quadro, então toda cena já começa com uma composição equilibrada.

## Do que uma cena é feita

São nove lugares, onze horas do dia e onze marcos:

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

Aqui está o mesmo código com seis outras seeds. Passa o ponteiro por cima de uma pra ela se mexer:

```scenes
2 109 103 9 46 58
```

O nome embaixo de cada imagem vem das mesmas escolhas: uma palavra pra hora e outra pro lugar. Essa aqui sorteia uma seed nova toda vez que você aperta o botão:

```roll
44
```

## Sombreando cada célula

Entre a seed e a tela são quatro etapas. As duas primeiras rodam uma vez só, e as duas últimas rodam a cada frame:

```flow
seed | um número | hash | lit
createScene | escolhe cada peça | layers
renderer(cols, rows)
frame(t) | sombreia cada célula | grid
canvas | pontos na GPU | image | lit
```

Um frame é uma grade de células, uma a cada três pixels de largura (menores em telas mais nítidas). Cada célula recebe sua cor completa antes de qualquer coisa ser desenhada.

O céu vai da cor do topo até um horizonte mais claro, com um brilho em volta do sol ou da lua. As nuvens são camadas de ruído, iluminadas do lado virado pra luz e mantidas longe da lua. As montanhas são ruído em cristas. As encostas viradas pra luz recebem ela, as cadeias mais distantes somem no céu, e a névoa se junta na base. Cada crista também ganha uma linha fina de céu atrás, então até uma cadeia escura se destaca de um céu escuro. No alpenglow o sol ainda não nasceu, mas já bate na neve lá no alto, então só as faces viradas pra ele ficam rosadas.

### Água que reflete o que está acima dela

A água é sombreada por último. Pra cada célula abaixo do horizonte, a cena olha pra célula espelhada do outro lado da linha d'água, que já foi sombreada, e desloca ela um pouco pro lado seguindo a ondulação. Essa única consulta já dá o reflexo das montanhas, das nuvens e de cada lâmpada. Por cima, uma trilha de reflexos desce a partir do sol ou da lua.

Cada coluna espelha em torno da própria linha: o horizonte em mar aberto, ou a base do que estiver ali. Um torii num lago reflete a partir dos próprios pilares, e numa rua molhada a luz de uma máquina de venda automática começa na base dela e se estende pela rua.

## Lugares sem horizonte

A maioria das cenas é céu, depois terra, depois água. Duas não são.

### A rua da cidade

A cidade usa perspectiva de um ponto: a rua vai reto até um único ponto no horizonte. Cada coluna do frame olha pra uma parede, e a distância dessa parede depende de quão longe a coluna está do meio. Sabendo a profundidade, o resto é divisão. Simplificando, fica assim:

```ts title="src/lib/scene.ts"
const z = Math.min(end, STREET / Math.abs(x - 1));
const block = blockAt(x - 1, z);
if (y >= horizon + EYE / z) kind[k] = WATER; // the wet street
else if (y < horizon - (block.h - EYE) / z) kind[k] = SKY;
else paint(k, face(z, EYE - (y - horizon) * z, block));
```

As placas são do tipo bandeira, presas perpendiculares à parede, então ficam viradas pro fundo da rua, na nossa direção. Cada uma é um retângulo escalado pela profundidade, com uma borda acesa e katakana feito a partir de bitmaps de cinco por cinco quando tem espaço. Longe o bastante, uma placa vira só alguns pontos de luz. O brilho delas é calculado uma vez e ilumina as paredes, a rua molhada e a chuva que cai na frente delas.

### No fundo do mar

O recife é basicamente o céu de cabeça pra baixo. O gradiente vai da superfície clara até o escuro, o sol vira um clarão no topo com raios de luz se abrindo a partir dele, e as montanhas viram rochas altas nas duas bordas, com coral no topo. Um cardume nada num anel solto que vai mudando de lugar, e cada peixe reluz quando vira de lado pra gente.

## Coisas que se mexem

- **Clima:** as nuvens passam e as estrelas piscam. A chuva cai em linhas inclinadas, iluminada por qualquer neon por perto, e uma tempestade solta um raio a cada poucos segundos, que pisca duas vezes antes de sumir.
- **Luzes:** lanternas de céu sobem em profundidades diferentes (as mais próximas são grandes, baixas e rápidas), e a água reflete as que estão acima dela. Luminárias descem o rio boiando, e o facho do farol gira.
- **Vida:** pétalas caem da cerejeira, uma bandeira tremula no templo, um moinho gira, e uma raia-manta passa deslizando pelo recife, subindo e descendo as asas.

## Da cor aos pontos de meio-tom

Cada célula vira um ponto, em um de três tamanhos ou nenhum, igual a um meio-tom impresso. As células mais claras ganham os maiores pontos. Um dithering ordenado de quatro por quatro, a matriz de Bayer, decide entre tamanhos vizinhos, então um gradiente suave vira uma textura uniforme em vez de faixas marcadas. Simplificando, são três linhas:

```ts title="src/lib/scene.ts" {2}
const level = floor + (1 - floor) * peak ** 0.75;
const dither = bayer[(row & 3) * 4 + (col & 3)];
const step = Math.round(level * 3 + dither);
```

Depois, a cor compensa o que o tamanho não consegue. Um ponto pequeno é desenhado um pouco mais claro e um grande um pouco mais escuro, então a imagem mantém o tom entre os degraus do dithering. A cor de cada ponto também é afastada do próprio cinza, o que mantém coral, neon e flores vivos sem mexer na neve branca nem nas nuvens cinza de tempestade. A terra pode ficar sem ponto nenhum, e é isso que deixa um morro escuro visível contra um céu escuro.

## Sombreando só o que se mexe

A cena desenha quinze frames por segundo. A luz que nunca se mexe, como o gradiente do céu, o brilho em volta da lua, a luz das lâmpadas no ar e a trilha de luz na água, é calculada uma vez só. Uma nuvem recebe o mesmo tratamento quando entra no quadro. Cada frame só sombreia o que sobra: nuvens, estrelas, chuva e água.

Aí a GPU desenha os pontos num shader WebGL. Cada frame sobe como uma textura pequena, um texel por célula, com a cor e o tamanho do ponto. Um único triângulo cobre o canvas, e cada pixel descobre em qual célula está e a que distância está do centro dela. Assim todo ponto sai redondo, com um pixel de borda suave, e um frame custa o mesmo não importa quantos pontos tenha.

Se os frames ficam lentos (oito seguidos acima de 30 milissegundos), as células aumentam pra sobrar menos coisa pra sombrear. Acima de 320 colunas as células crescem em vez de se multiplicar, e sem WebGL os pontos são desenhados num canvas comum, em menor quantidade e maiores.

## Interagindo com ela

- **Ponteiro:** uma pequena luz quente segue o mouse, e a água reflete ela.
- **Toque:** no céu, uma estrela cadente sai de onde você tocou; na água, um anel se espalha e some; no fundo do mar, umas bolhas sobem.
- **Dado:** cada clique joga o dado e sorteia uma seed nova, só pra essa visita. Enquanto ele rola, a cena antiga derrete na nova: as duas se deformam com ruído, e a nova aparece onde o ruído está mais baixo.
- **Repouso:** a cena para de desenhar quando sai da tela, e fica parada se o seu sistema pede movimento reduzido.

Na página inicial, a mesma seed desenha um recorte quadrado da cena dentro do bloco de cada post, centralizado no marco. Ele fica parado até você passar o ponteiro ou focar nele. Quando você abre o post, o bloco cresce até virar a imagem do topo.

![A lista de artigos na página inicial, com o bloco deste post](/writing/art-from-a-seed/home-tile.png "O bloco é a mesma cena, recortada em volta do marco.")

## De onde veio a ideia

O visual vem do [ascii.rest](https://ascii.rest), criado por [bas3line](https://github.com/bas3line/ascii), uma biblioteca de arte em texto animada pra páginas web. Cada cena de lá, como [night coast](https://ascii.rest/night-coast/), [tokyo rain](https://ascii.rest/tokyo-rain/) ou [deep reef](https://ascii.rest/deep-reef/), é um pedaço de código próprio, sombreado em cores célula por célula e desenhado como pontos com dithering. As daqui saem de um número. Abordagem diferente, mesma ideia: uma página pode ter um pouco de movimento e continuar calma.
