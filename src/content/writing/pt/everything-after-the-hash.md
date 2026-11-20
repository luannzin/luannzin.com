---
title: Tudo depois do #
description: Como o Sightline compartilha uma tela como um link, sem servidor meu
date: 2026-11-20
metaTitle: "Tudo depois do #: compartilhar a tela por WebRTC sem servidor"
metaDescription: Como o Sightline compartilha a tela pelo navegador como um link: um segredo no fragmento da URL, sinalização pelos relays públicos do Nostr com o Trystero, WebRTC direto entre navegadores, e bichinhos em pixel art desenhados a partir de uma seed de 32 bits.
seed: 123
---

O Discord parou de me deixar compartilhar a tela pelo app, e o jeito que todo mundo usa pra contornar é abrir um Google Meet. Uma reunião inteira, com sala de espera e pedido de câmera, pra "olha isso aqui". Então eu fiz só a parte que eu queria. Você compartilha a tela e ganha um link, e quem abrir assiste ao vivo, no navegador, com som. Não tem servidor meu no meio, porque não tem servidor meu nenhum: o site é uma página estática.

O [PartyLine e o Deskline](/writing/a-code-nobody-types#onde-comecou) já conectam dois computadores sem servidor meu, mas eles são apps que você instala, e fazem isso com o iroh. Um link tem que funcionar em qualquer navegador que abrir ele, então o Sightline faz a mesma coisa com o que os navegadores já têm: WebRTC.

## Um link que carrega o próprio segredo

Um link de compartilhamento é assim: `https://sightline.luannzin.com/#<segredo>~<id do host>`. As duas partes têm 22 caracteres, e as duas vêm depois do `#`. O navegador nunca manda o que vem depois do `#` pro servidor, então o site que hospeda a página só recebe um pedido de `/`.

O segredo são 22 caracteres de um alfabeto de 62, tirados de bytes aleatórios:

```ts title="src/lib/link.ts" {5}
export function newSecret(): string {
  let out = "";
  while (out.length < 22) {
    for (const byte of crypto.getRandomValues(new Uint8Array(32))) {
      if (byte < 248 && out.length < 22) out += BASE62[byte % 62];
    }
  }
  return out;
}
```

O `248` tá ali de propósito. Um byte tem 256 valores e são 62 caracteres, então só o `byte % 62` ia escolher os oito primeiros caracteres um pouco mais que os outros. 248 é quatro vezes 62, então jogar fora os bytes acima disso deixa todo caractere com a mesma chance, e 22 deles carregam 131 bits.

O segredo é a senha da sala e, com hash, o nome dela. Então ele nunca sai dos navegadores que têm o link. Esse aqui seu navegador acabou de criar, com o que cada lado recebe:

```line
link
```

O id do host é a outra metade. Cada compartilhamento ganha uma identidade nova, e quem assiste só aceita vídeo vindo dela. Outra pessoa com o link não consegue se passar por você, e não dá pra ligar dois compartilhamentos seus um ao outro por ela.

## Se achando pelo Nostr

Dois navegadores não conversam até trocar uns detalhes: o que cada um consegue mandar, e os endereços onde dá pra achar cada um. Alguma coisa tem que levar esse primeiro oi, e o Sightline usa relays públicos do Nostr, pelo [Trystero](https://github.com/dmotz/trystero). Os detalhes vão criptografados com uma chave derivada do segredo, e a sala tem o hash como nome, então os relays não veem nenhum dos dois. O que eles veem é que dois IPs se encontraram.

Depois que se acham, a imagem e o som vão de um navegador pro outro por WebRTC, criptografados com DTLS-SRTP. Todo mundo que participa, e o que cada um recebe:

| Quem | O que recebe |
| --- | --- |
| O servidor do site | Um pedido de `/`, como qualquer um que abre a página |
| Os relays do Nostr | O hash da sala, os detalhes de conexão criptografados, dois IPs |
| Servidores STUN públicos | Uma pergunta de cada navegador: qual é meu endereço público? |
| Quem abre o link | A imagem e o som, e o seu IP |

Os servidores STUN públicos dão conta da maioria das redes de casa e de escritório. Algumas redes não deixam ter caminho direto, tipo operadora de celular que coloca vários aparelhos atrás de um endereço só, ou firewall corporativo rígido. Aí a solução é um relay TURN, que repassa o vídeo, e o Sightline não vem com um, porque um relay compartilhado é exatamente o servidor no meio que isso tudo era pra evitar. Dá pra colocar o seu em Network settings, e o vídeo continua criptografado passando por ele.

## Text ou Motion

Text e Motion são dois jeitos de gastar os mesmos bits. O Text deixa cada pixel nítido e deixa os frames por segundo caírem, pra código e documento. O Motion segura 60 frames por segundo e deixa a resolução ceder, pra vídeo e jogo:

```ts title="src/lib/tuning.ts"
export const MODES: Record<Mode, { hint: string; fps: number; bitrate: number }> = {
  // text and code: keep every pixel, frames can wait
  sharp: { hint: "detail", fps: 30, bitrate: 6_000_000 },
  // video and games: keep the motion, resolution can give
  smooth: { hint: "motion", fps: 60, bitrate: 8_000_000 },
};
```

O `hint` vai na faixa de vídeo como `contentHint`, que diz pro encoder do navegador do que abrir mão primeiro quando os bits acabam. Os outros dois são limites por pessoa assistindo. O controle de congestionamento do próprio navegador continua se ajustando abaixo deles.

O codec é escolhido no computador que compartilha. O Sightline pergunta pro navegador quais entre AV1, VP9 e H.264 ele codifica em hardware a 1080p e 60 frames por segundo, e usa o melhor deles. Sem nenhum, fica com o VP9, porque o AV1 custa muito mais CPU e o navegador codifica o vídeo uma vez pra cada pessoa assistindo.

O som tem um passo a mais. Os navegadores negociam voz em mono por padrão, e um encoder só manda estéreo quando a descrição do outro lado diz `stereo=1`. Então o Sightline reescreve toda descrição que um navegador recebe pra pedir Opus estéreo a 128 kbps, e captura com o processamento de som do navegador desligado, pra música e jogo chegarem do jeito que são.

## Bichinhos a partir de uma seed

Todo mundo num compartilhamento ganha um nome inventado e um bichinho em pixel art na primeira vez, então ninguém precisa digitar nada pra assistir. O bichinho nasce de um número de 32 bits, do mesmo jeito que as capas deste site em [Arte a partir de uma seed](/writing/art-from-a-seed): o mulberry32 transforma a seed numa sequência de números, e cada escolha pega o próximo. A seed é a única coisa que viaja, e todo navegador desenha o mesmo bichinho a partir dela.

Um bichinho começa como meio corpo, espelhado:

```ts title="src/lib/avatar.ts"
// Half a body, outer column first, mirrored at the centre: 0 never, 1 maybe, 2 always.
const HALF = [
  "000011",
  "000112",
  "001122",
  "011222",
  "012222",
  "112222",
  "112222",
  "012222",
  "011222",
  "011122",
  "010011",
  "010010",
];
```

Cada 1 é cara ou coroa. Depois vêm os olhos: um par, ou uma vez a cada quatro um olho grande só, igual ao da marca. Alguns pares vêm fechados, e 40% dos bichinhos ganham boca. Um flood fill a partir do rosto guarda só o que encosta nele, então nenhum pixel fica solto. O corpo pega duas ou três cores vizinhas do crepúsculo, com dither Bayer de cima pra baixo, dentro de um contorno escuro. Sorteia uns:

```line
critters
```

Os nomes são um adjetivo e um animal em inglês, 24 de cada, então são 576, de Amber Moth a Cozy Quokka. Clica no seu no Sightline pra trocar qualquer um dos dois, até no meio de um compartilhamento, e todo mundo vê na hora.

## O resto

- **O som depende do navegador.** Chrome e Edge no Windows capturam o som de uma tela inteira, uma janela ou uma aba. Firefox e Safari não capturam som nenhum. O Chrome no Linux só captura o som de uma aba, e o README tem um jeito de contornar com duas linhas de `pactl`.
- **Quem assiste espera você.** Se sua conexão cair sem você parar, quem tá assistindo fica com a última imagem e espera até um minuto você voltar.
- **Tirar alguém.** O mesmo link não deixa a pessoa voltar daquele navegador. Uma janela anônima contorna isso, então pra alguém que não pode assistir mesmo, para e compartilha de novo: o link novo é uma sala nova.
- **Cada pessoa assistindo custa.** Seu navegador codifica o vídeo uma vez por pessoa, então umas poucas pessoas é o que fica confortável.
- **O medidor do link.** Cada conexão é desenhada como o [medidor do link do Deskline](/writing/a-code-nobody-types#o-crepusculo), a partir do mesmo caminho e da mesma ida e volta.
- **Ainda não medido.** O atraso da sua tela até a deles, e com que frequência uma conexão precisa de relay.

A página é um build estático do Vite, e o céu com dither atrás dela vem do rodapé deste site.
