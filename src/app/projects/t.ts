export default {
  // Seeded scenes, the engine behind every post's picture, to play with, at
  // /projects/seeded-scenes
  scenes: {
    meta: {
      description: {
        en: "Play with the engine that draws every post’s picture: type a number and a scene grows from it, replay its change frame by frame, pick a place, and blow the dots up until the halftone shows.",
        pt: "Brinca com o código que desenha a imagem de cada post: digita um número e uma cena nasce dele, repete a troca frame a frame, escolhe um lugar e aumenta os pontos até dar pra ver o meio-tom.",
      },
    },
    title: { en: "Seeded scenes", pt: "Geração procedural de arte" },
    subtitle: {
      en: "The engine behind every post’s picture",
      pt: "O que desenha a imagem de cada post",
    },
    // its row in the home page's projects
    rowDescription: {
      en: "Type a number and a picture grows from it",
      pt: "Digita um número e uma imagem nasce dele",
    },
    intro: {
      en: "Nobody drew the picture on top of my posts. I wanted each one to have its own, but I didn’t want to make covers and keep them up to date. So every post gets a number, its seed, and this engine grows a scene from it: the place, the time of day, what’s standing there, down to the shape of the clouds. Type any number or word in the field, or let the die pick one.",
      pt: "Ninguém desenhou a imagem no topo dos meus posts. Eu queria que cada um tivesse a sua, mas NÃO queria criar capa e ficar mantendo tudo atualizado. Então cada post ganha um número, a seed, e esse código monta uma cena a partir dele: o lugar, a hora do dia, o que tá ali, até o formato das nuvens. Digita qualquer número ou palavra no campo, ou deixa o dado escolher.",
    },
    melt: {
      en: "When the seed changes, the old scene doesn’t just cut to the new one. It melts into it while the die tumbles to the face the new seed picks, and the sheet under the scene runs both: replay them, slow them to a tenth or step through a frame at a time. The scene reacts to you too. Move your pointer over it and a small light follows, or tap the sky for a shooting star.",
      pt: "Quando a seed muda, a cena antiga não só troca pela nova. Ela derrete na nova enquanto o dado gira até parar na face que a seed escolhe, e a folha embaixo da cena controla os dois: dá pra repetir, deixar em um décimo da velocidade ou avançar frame a frame. A cena também reage a você. Passa o ponteiro por cima e uma luzinha vai junto, ou toca no céu pra ver uma estrela cadente.",
    },
    examples: {
      title: { en: "Same seed, same scene", pt: "Mesma seed, mesma cena" },
      p: {
        en: "Six seeds and the scenes they grow. Hover one to make it move. Reload the page and you get the same six, down to where every star sits, because a seed always makes the same choices in the same order. Type one of these numbers in the field up top and that scene shows up there too.",
        pt: "Seis seeds e as cenas que nascem delas. Passa o ponteiro por cima de uma pra ela se mexer. Recarrega a página e vêm as mesmas seis, até a posição de cada estrela, porque uma seed sempre faz as mesmas escolhas na mesma ordem. Digita um desses números no campo lá em cima e a mesma cena aparece ali também.",
      },
    },
    places: {
      title: { en: "The place comes first", pt: "O lugar vem primeiro" },
      p: {
        en: "There are nine places, eleven times of day and eleven landmarks, but a seed doesn’t pick them separately. The place goes first, because it decides the rest: the times it can be drawn at and what can stand in it. That’s why a street is never drawn at sunset, and nothing under the sea gets snow. Pick a place and the page goes looking for a seed that lands there.",
        pt: "São nove lugares, onze horas do dia e onze marcos, mas uma seed não escolhe cada um separado. O lugar vem primeiro, porque ele decide o resto: as horas em que pode ser desenhado e o que pode estar nele. Por isso uma rua nunca é desenhada no pôr do sol, e nada no fundo do mar ganha neve. Escolhe um lugar e a página sai procurando uma seed que caia nele.",
      },
      label: { en: "Place", pt: "Lugar" },
      drawnAt: { en: "Drawn at", pt: "Desenhado em" },
      stands: { en: "What stands in it", pt: "O que está nele" },
    },
    // Every place, in the engine's order: what it's drawn at and what can
    // stand in it, as in "Art from a seed".
    place: {
      coast: {
        name: { en: "Coast", pt: "Costa" },
        times: {
          en: "Night, twilight, dusk, dawn, aurora, storm",
          pt: "Noite, crepúsculo, entardecer, amanhecer, aurora, tempestade",
        },
        stands: {
          en: "A lighthouse or a cabin",
          pt: "Um farol ou uma cabana",
        },
      },
      fjord: {
        name: { en: "Fjord", pt: "Fiorde" },
        times: {
          en: "Night, twilight, dawn, aurora, alpenglow, storm",
          pt: "Noite, crepúsculo, amanhecer, aurora, alpenglow, tempestade",
        },
        stands: {
          en: "A cabin or a sailboat",
          pt: "Uma cabana ou um veleiro",
        },
      },
      lake: {
        name: { en: "Lake", pt: "Lago" },
        times: {
          en: "Night, twilight, dusk, dawn, aurora, alpenglow, lanterns",
          pt: "Noite, crepúsculo, entardecer, amanhecer, aurora, alpenglow, lanternas",
        },
        stands: {
          en: "A sailboat or a cabin",
          pt: "Um veleiro ou uma cabana",
        },
      },
      valley: {
        name: { en: "Valley", pt: "Vale" },
        times: {
          en: "Night, twilight, dusk, dawn, aurora, alpenglow, storm, lanterns",
          pt: "Noite, crepúsculo, entardecer, amanhecer, aurora, alpenglow, tempestade, lanternas",
        },
        stands: {
          en: "A windmill or a cabin",
          pt: "Um moinho ou uma cabana",
        },
      },
      dunes: {
        name: { en: "Dunes", pt: "Dunas" },
        times: {
          en: "Night, twilight, dusk, dawn, storm",
          pt: "Noite, crepúsculo, entardecer, amanhecer, tempestade",
        },
        stands: { en: "Only the sky", pt: "Só o céu" },
      },
      garden: {
        name: { en: "Garden", pt: "Jardim" },
        times: {
          en: "Plum dusk, dusk, twilight, night, dawn, lanterns",
          pt: "Entardecer ameixa, entardecer, crepúsculo, noite, amanhecer, lanternas",
        },
        stands: {
          en: "A pagoda or a torii, under a cherry tree",
          pt: "Um pagode ou um torii, sob uma cerejeira",
        },
      },
      river: {
        name: { en: "River", pt: "Rio" },
        times: {
          en: "Dusk, dawn, twilight, night, lanterns",
          pt: "Entardecer, amanhecer, crepúsculo, noite, lanternas",
        },
        stands: {
          en: "A temple over steps down to the water",
          pt: "Um templo sobre degraus que descem até a água",
        },
      },
      city: {
        name: { en: "City", pt: "Cidade" },
        times: {
          en: "Rain, night, twilight, storm",
          pt: "Chuva, noite, crepúsculo, tempestade",
        },
        stands: {
          en: "Someone under an umbrella, or a vending machine",
          pt: "Alguém sob um guarda-chuva, ou uma máquina de venda automática",
        },
      },
      reef: {
        name: { en: "Reef", pt: "Recife" },
        times: { en: "Deep water", pt: "Águas profundas" },
        stands: {
          en: "A wreck, or a manta ray",
          pt: "Um naufrágio, ou uma raia-manta",
        },
      },
    },
    dots: {
      title: { en: "One dot per cell", pt: "Um ponto por célula" },
      p: {
        en: "Every frame is a grid of cells, one every three pixels or so, and each cell becomes a single dot: one of three sizes, or none at all, like a printed halftone. The brighter the cell, the bigger its dot. When a cell falls between two sizes, a four-by-four pattern decides which one it gets, so a smooth gradient turns into an even texture instead of hard bands. At three pixels you barely notice any of it. Make the dots bigger and it’s all you see.",
        pt: "Cada frame é uma grade de células, uma a cada uns três pixels, e cada célula vira um ponto só, em um de três tamanhos, ou nenhum, tipo meio-tom de impressão. Quanto mais clara a célula, maior o ponto. Quando uma célula fica entre dois tamanhos, um padrão de quatro por quatro decide qual ela leva, então um degradê suave vira uma textura uniforme em vez de faixas marcadas. Com três pixels você quase nem percebe. Aumenta os pontos e é só isso que você vê.",
      },
      size: { en: "Dot size", pt: "Tamanho do ponto" },
    },
    story: {
      title: { en: "The whole story", pt: "A história completa" },
      p: {
        en: "I left the code out of this page. The post has all of it: the tiny random number generator behind every choice, how a frame gets shaded, the water that reflects whatever is above it, the street drawn in one-point perspective, and how the dots get to the GPU.",
        pt: "Deixei o código de fora desta página. O post tem tudo: o gerador de números pseudoaleatórios bem pequeno por trás de cada escolha, como um frame é sombreado, a água que reflete o que tá em cima dela, a rua desenhada em perspectiva de um ponto e como os pontos chegam na GPU.",
      },
    },
  },
};
