---
title: Frame a frame
description: Como o Lab segura o movimento do site
date: 2026-10-12
metaTitle: Frame a frame: animações reais de CSS, SVG e WebGL numa linha do tempo
metaDescription: Como o Lab roda o movimento de verdade deste site num relógio que dá pra pausar e arrastar: funções puras do tempo, animações CSS seguras com getAnimations() e um melt em WebGL em qualquer ponto.
seed: 98
---

Quase todo movimento deste site acaba antes de dar tempo de olhar direito. O dado gira por 1,1 segundo. A seta que aponta pra ele termina em 2,26, e o nome na página inicial chega em menos de um. Então eu fiz o [Lab](/lab/motion): cada peça numa folha de tempo, onde dá pra repetir, deixar em um décimo da velocidade ou avançar frame a frame.

Nada ali é gravação. Uma gravação ia mostrar sempre a mesma jogada, e o dado de verdade cai numa face diferente toda vez que você repete, do mesmo jeito que as cenas nascem do que você digitar. Então o Lab roda o mesmo código do resto do site, e esse post é sobre como esse código para no milissegundo que você pedir.

![Uma jogada do dado desenhada a cada 100 milissegundos, de 0 a 1100](/writing/frame-by-frame/die-frames.png "Uma jogada do dado, um frame a cada 100 milissegundos.")

## Um relógio

Cada peça do Lab tem um relógio, e o relógio é só um número: quantos milissegundos você tá dentro da peça. Quem guarda ele é o `useTimeline`. Tocar soma o tempo desde o último frame, vezes a velocidade. Um passo anda um frame a 60fps, uns 16,7 milissegundos. Arrastar a folha define o número direto.

```ts title="src/components/lab/timeline.tsx"
let last = performance.now();
let frame = requestAnimationFrame(function tick(at) {
  now.current = Math.min(duration, now.current + (at - last) * speed);
  last = at;
  setTime(now.current);
  if (now.current < duration) frame = requestAnimationFrame(tick);
  else setPlaying(false);
});
```

Nada ali sabe o que é dado ou seta. O relógio anda, e cada peça se desenha no tempo que ele mostra. Então toda peça tem que responder a mesma pergunta: como você tá aos 412 milissegundos?

O movimento deste site é feito de quatro jeitos diferentes, e cada um responde de um jeito:

| Peça | No site | No Lab |
| --- | --- | --- |
| Giro do dado | O `requestAnimationFrame` chama o `angleAt` | O `angleAt` com o tempo da folha |
| Pulo do dado | `element.animate()` | A mesma animação, pausada, `currentTime` definido |
| Seta, texto que se revela | Keyframes em CSS | `getAnimations()`, pausadas, `currentTime` definido |
| Melt | Um loop próprio de `requestAnimationFrame` | `draw(progress)`, chamado na mão |

## Uma função do tempo

O dado foi o fácil. Uma jogada são quatro números, o ângulo em que ela começa e o ângulo em que ela para em cada eixo, e o `angleAt` diz onde o dado tá depois de tantos milissegundos:

```ts title="src/lib/die.ts"
export const settle = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

export function angleAt([x0, y0, x1, y1]: Throw, ms: number): [number, number] {
  const k = settle(ms / TUMBLE_MS);
  return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
}
```

Depois o `drawDie(x, y)` gira o cubo até esse ângulo e projeta ele em dois paths SVG, um pras arestas e outro pros pontos. Nenhuma das duas funções guarda nada de um frame pro outro. Num post, o dado chama elas a cada frame com o tempo desde que você clicou. No Lab, uma cópia do componente do dado chama elas com o que a folha disser. Mesmas funções, outro relógio.

Isso também quer dizer que qualquer frame tá a uma chamada de distância, então o Lab consegue mostrar mais de um ao mesmo tempo. Quando você pausa no meio de uma jogada, ele desenha o dado de novo 2, 4, 6 e 8 frames atrás, como contornos que vão sumindo. Pausa esse aqui no meio e avança frame a frame:

```lab
die
```

O pulo é diferente. Ele não é conta num loop, são keyframes: sobe e cresce um pouco, aterrissa de leve e para, tocados com `element.animate()`. O Lab cria essa mesma animação uma vez por jogada, pausa na hora e coloca o `currentTime` dela no tempo da folha:

```ts title="src/components/lab/specimens.tsx"
if (lift.current?.turn !== turn) {
  lift.current?.animation.cancel();
  const animation = el.animate(HOP, { duration: HOP_MS, fill: "both" });
  animation.pause();
  lift.current = { turn, animation };
}
lift.current.animation.currentTime = Math.min(t, HOP_MS);
```

Uma animação pausada com o tempo definido na mão é o truque inteiro da próxima parte também.

## Segurando o CSS

A seta e o texto que se revela não têm JavaScript nenhum. São keyframes no `globals.css`, e os componentes só colocam as classes certas nos elementos certos. O Lab usa eles do jeito que são.

Isso funciona porque o navegador já trata toda animação CSS como um objeto `Animation`, o mesmo tipo que o `element.animate()` devolve. O `getAnimations({ subtree: true })` lista todas que tão dentro de um elemento, então o `useSeekCss` pausa todas e dá pra elas o tempo da folha:

```ts title="src/components/lab/timeline.tsx" {4}
for (const animation of host.current?.getAnimations({ subtree: true }) ?? []) {
  const end = Number(animation.effect?.getComputedTiming().endTime ?? 0);
  animation.pause();
  animation.currentTime = Math.min(t, end - 1);
}
```

Cada palavra do texto é uma animação separada, com o próprio `animation-delay`. O delay conta como parte do tempo da animação, então dar o mesmo `currentTime` pra todas mantém o atraso entre uma e outra: aos 100 milissegundos a primeira palavra tá em 100, a segunda em 50, e a terceira nem começou.

O `end - 1` tá ali de propósito. Levar uma animação até o fim faz ela disparar o `animationend`, mesmo pausada. Num post, esse é o evento que a seta usa pra avisar que terminou, e é quando o dado aparece no canto e o navegador lembra que você já viu a dica. Então o Lab nunca deixa uma animação chegar lá. Ele para um milissegundo antes, e pra página nada nunca terminou.

Pra repetir, o Lab dá uma `key` nova pra peça. O React monta elementos novos, as animações deles começam do zero, e o mesmo loop pausa elas antes de qualquer coisa ser pintada. Aqui tá a seta parada em seis desses tempos:

![A seta desenhada à mão parada em seis pontos da animação, de 1100 a 2259 milissegundos](/writing/frame-by-frame/arrow-frames.png "A seta, parada em seis tempos pelo mesmo loop.")

E aqui o texto que se revela, uma barra pra cada palavra:

```lab
reveal
```

## Um shader que dá pra parar

O melt foi o que eu tive que mudar. Num post, jogar o dado coloca um canvas WebGL por cima da arte por 1,1 segundo e derrete a cena antiga na nova. Antes era uma função só: preparava o WebGL e rodava o próprio loop de `requestAnimationFrame` do começo ao fim. Nada de fora conseguia segurar ele em 40%.

Então eu separei em dois. O `meltLayer` prepara o canvas, o shader e as duas texturas, e devolve um `draw(progress)`, que desenha o melt em qualquer ponto de 0 a 1. O `melt` agora é só o loop que chama ele, pra capa. O Lab chama o `draw` direto:

```ts title="src/components/lab/specimens.tsx"
layer.current ??= meltLayer(host, from.current, live, seed, still);
layer.current?.draw(ease(t / MELT_MS));
```

A cena antiga que ele derrete é uma cópia. Antes de uma seed nova entrar, o Lab copia o frame da tela pra um canvas comum, então dá pra repetir o melt a partir da mesma imagem quantas vezes você quiser, muito depois daquela cena ter ido embora. Mas só o melt tá no relógio. A cena embaixo continua se desenhando nos próprios 15 frames por segundo, igual num post.

Digita um número ou uma palavra, ou deixa o dado escolher:

```lab
scenes
```

## Desenhando a folha

Cada linha de uma folha é uma faixa: um nome, quando começa, quando termina e a curva dela, o valor que ela percorre de 0 a 1. A barra desenha a curva como uma linha fina, acende a parte que já tocou e recorta uma cópia mais forte da linha até o playhead.

Pro dado e pro melt, a folha lê os números do mesmo código que toca eles: `HOP_MS`, `TUMBLE_MS`, `settle`, `MELT_MS`, `ease`. As peças em CSS são a exceção. Os tempos delas moram no `globals.css`, então a folha tem eles anotados na mão. É o único lugar em que o Lab copia o site em vez de rodar ele.

Copiar uma curva de CSS ainda quer dizer desenhar ela. O `cubic-bezier()` não te dá o y de um x direto: os dois saem de um terceiro valor que anda pela curva. Mas o x só sobe, então dá pra achar ele dividindo o intervalo ao meio, e 24 divisões chegam mais perto do que qualquer barra conseguiria mostrar:

```ts title="src/components/lab/timeline.tsx"
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, k: number) =>
    ((1 - 3 * b + 3 * a) * k + (3 * b - 6 * a)) * k * k + 3 * a * k;
  return (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (at(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return at(y1, y2, (lo + hi) / 2);
  };
}
```

A curva do pulo é montada a partir dos keyframes do mesmo jeito: sobe até o topo em 36%, afunda um pouquinho abaixo da linha em 80%, depois fica reta.

## O resto

- **Toca sozinho uma vez.** Cada peça se apresenta na primeira vez que fica 60% visível, e nunca se o seu sistema pede movimento reduzido.
- **O play sempre tem o que tocar.** Apertar play numa peça que nunca rodou começa uma rodada nova, em vez de tocar o nada.
- **A digitação assenta primeiro.** O campo da seed espera 400 milissegundos depois da última tecla, então digitar 4096 rápido dá um melt só, não quatro.
- **Dá pra fazer tudo pelo teclado.** As barras são um slider só: as setas andam um frame, Page Up e Page Down andam dez, Home e End vão pras pontas, e Espaço toca ou pausa. Um leitor de tela ouve o tempo e o frame, tipo “412 ms, frame 25 de 66”.

Fazer o Lab mexeu muito pouco no resto do site. A geometria do dado foi pra um arquivo próprio pro Lab conseguir importar, a seta saiu da capa e virou um componente separado, e o melt foi dividido em dois. Nenhum deles se comporta diferente num post.
