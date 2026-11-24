---
title: Sem servidor pra rodar
description: O Deskline, o acesso remoto que eu fiz pra substituir o AnyDesk
date: 2026-11-20
metaTitle: "Sem servidor pra rodar: acesso remoto em Rust sobre o iroh"
metaDescription: Como o Deskline, um app de acesso remoto em Rust, usa a chave pública Ed25519 de cada computador como endereço, conecta por QUIC com o iroh, com hole punching e relay de reserva, e mantém uma ida e volta inteira de frames em trânsito.
seed: 118
about: https://deskline.luannzin.com
---

Eu comecei o [Deskline](https://deskline.luannzin.com/pt) como a menor coisa que desse pra substituir o AnyDesk quando eu ajudo a família e os amigos: um acesso remoto sem conta e sem servidor pra rodar. O AnyDesk dá pra cada computador um número de 9 dígitos que sai dos servidores dele. O Deskline não tem servidor distribuindo número, então o código de um computador é a chave pública dele, e você copia e cola.

Não foi a primeira coisa que eu fiz desse jeito. Cinco dias antes do primeiro commit do Deskline, eu comecei o PartyLine, e quase tudo que o Deskline usa veio de lá.

## Onde começou

O PartyLine é um game show de festa que roda no terminal. Uma pessoa cria a sala, os amigos entram pela rede local ou pela internet com um código de convite, e todo mundo joga uma rodada de minigames num porão renderizado no Blender e convertido pro terminal.

Entrar numa sala precisava da mesma coisa que o Deskline precisou depois: dois computadores que se acham pela internet, sem servidor meu e sem abrir porta no roteador. O PartyLine faz isso com o [iroh](https://github.com/n0-computer/iroh): conexões QUIC discadas pela chave pública, hole punching, um relay quando não existe caminho direto, e mDNS na rede local. O README dele chama isso de LAN virtual embutida.

O Deskline monta o endpoint do mesmo jeito, com uma linha a mais:

```rust title="src/net.rs" {2}
let ep = Endpoint::builder(presets::N0)
    .secret_key(identity(home)?)
    .alpns(vec![ALPN.to_vec()])
    .bind()
    .await?;
let mdns = MdnsAddressLookup::builder().build(ep.id())?;
ep.address_lookup()?.add(mdns);
```

O PartyLine cria uma chave nova toda vez que abre, então um código de convite dura enquanto o jogo tá aberto. O Deskline grava a chave num arquivo na primeira vez e lê de lá daí em diante, então o código de um computador nunca muda.

O resto veio junto. Subir a versão no `Cargo.toml` e dar push builda todas as plataformas no GitHub Actions e publica o release, e as cópias instaladas se atualizam sozinhas a partir dele. O PartyLine desenha cada palavra como fonte de pixel e a arte com um dither ordenado, e as lines, meus apps que só precisam de um código ou de um link, ficaram com os dois. No dia seguinte ao primeiro commit do Deskline, começou o Sightline:

| Line | Primeiro commit | O que é |
| --- | --- | --- |
| PartyLine | 12 de novembro | Um game show de festa no terminal |
| Deskline | 17 de novembro | Acesso remoto sem servidor pra rodar |
| Sightline | 18 de novembro | Sua tela como um link, ao vivo no navegador |

## O código é a chave

Um endpoint do iroh é identificado pela chave pública Ed25519 dele, 32 bytes. O Deskline escreve ela em z-base-32, um alfabeto feito pra gente ler, sem 0, l, v nem 2 pra confundir. Cinco bits por caractere dá 52 caracteres, mostrados em grupos de quatro:

```rust title="src/net.rs"
pub fn code(id: EndpointId) -> String {
    let z = id.to_z32();
    z.as_bytes().chunks(4).map(|c| std::str::from_utf8(c).unwrap()).collect::<Vec<_>>().join(" ")
}
```

Na tela inicial os 13 grupos vão em três linhas de cinco, cinco e três, pra nunca sobrar um grupo sozinho no final. Esse aqui seu navegador acabou de criar, uma chave Ed25519 de verdade escrita do jeito que o Deskline escreve:

```line
code
```

Quem precisa de ajuda copia o código e te manda. Você cola, e o Deskline guarda em Recentes com o nome que você escolher.

A conexão é QUIC com TLS amarrado a essa chave, então você chega no computador cujo código você colou, e nada no meio do caminho consegue ler ou mudar a sessão, nem os relays. Os relays são os públicos da n0: eles ajudam os dois computadores a se acharem, e carregam o tráfego criptografado quando não tem caminho direto.

## Quem entra

Só o código não te dá nada. Uma sessão começa com um clique em Aceitar, com a senha de acesso não supervisionado, ou porque a outra pessoa já marcou Sempre permitir pra você antes. Deixar controlar vem marcado, igual na janela de aceitar do AnyDesk; desmarca e fica só pra ver.

Enquanto alguém tá conectado, o computador sendo ajudado mostra uma barra vermelha com Chat, Retomar o controle e Parar de compartilhar. Ela fica por cima de todas as outras janelas, mesmo com o Deskline minimizado.

## Frames em trânsito

A primeira versão mandava a tela em H.264 e fazia quem tava vendo confirmar cada frame com um ack. O host deixava no máximo dois frames sem ack, então um link lento perdia frames em vez de acumular atraso.

Dois sobra na mesma rede. Pela internet vira um teto: dois frames por ida e volta, então com 200 milissegundos entre os computadores chegam dez frames por segundo, não importa o quão rápido seja o link. No dia seguinte o limite virou uma ida e volta inteira de frames, até 8, e desde a 0.5.0, quando os frames por segundo passaram de 60, até 32:

```rust title="src/host.rs" {1}
let in_flight = (net::rtt(&conn).as_millis() / gap.as_millis() + 2).clamp(2, 32) as u32;
while seq.wrapping_sub(*acked.borrow_and_update()) >= in_flight {
    acked.changed().await?;
}
```

O `gap` é o tempo entre dois frames: 33 milissegundos nos 30 frames por segundo que o Deskline usa pra mandar um desktop. Uma ida e volta de 200 milissegundos deixa 8 frames no caminho ao mesmo tempo, o suficiente pro host nunca parar pra esperar enquanto o link dá conta. Arrasta a ida e volta e troca entre as duas regras:

```line
inflight
```

Esperar também é como o host descobre que o link encheu. Ele soma quanto tempo esperou por ack a cada segundo. Passou de 300 milissegundos, ele pede 30% menos bits pro encoder. Ficou abaixo de 50 por três segundos seguidos, ele começa a pedir 15% a mais por segundo, até voltar pra taxa cheia da qualidade:

```rust title="src/host.rs"
if blocked > Duration::from_millis(300) {
    rate = (rate * 0.7).max(0.1);
    calm = 0;
    enc.set_rate(rate);
} else if blocked < Duration::from_millis(50) && rate < 1.0 {
    calm += 1;
    if calm >= 3 {
        rate = (rate * 1.15).min(1.0);
        enc.set_rate(rate);
    }
}
```

O Deskline nunca testa a banda. Os acks contam frames, não bytes, e um comentário em cima daquela linha diz quando mudar isso: se frames em 4K um dia lotarem os buffers de um link, aí conta bytes, a taxa vezes a ida e volta.

## Imagem que não sai da GPU

O encoder é o OpenH264, compilado junto, ou o da placa de vídeo quando tem um. No Windows, pelo Media Foundation, a imagem vai da captura pro encoder sem sair da GPU. No Linux, o GStreamer deixa a GPU redimensionar e converter, com NVENC, ou VA-API em Intel e AMD.

Pra jogo e vídeo tem a qualidade Nativa: a tela no tamanho dela, até 4K, e na taxa de atualização dela, até 240 frames por segundo. A imagem nunca diminui. Quando o link ou o computador não dá conta, chegam menos frames.

Uma imagem que fica parada por 200 milissegundos é codificada de novo, até oito vezes, pro texto borrado pelo movimento ficar nítido. Para antes se uma recodificação sair com menos de 512 bytes: essa já tá o mais nítida possível.

## O crepúsculo

O Deskline começou com a cara do egui, a biblioteca de interface em Rust em que ele é feito, com o azul e tudo. Na 0.3.0 eu levei ele pro sistema deste site, e foi ali que eu criei a identidade visual das lines: uma marca em pixel art de 32 por 32, quatro cores de crepúsculo sobre a noite, e um dither Bayer 4x4, a mesma matriz que as [cenas](/writing/art-from-a-seed) deste site usam.

O Deskline desenha o link entre os dois computadores do mesmo jeito, uma faixa de pontos de crepúsculo que vão mais longe e esquentam pro dourado quanto melhor o link. O quão bom ele é sai de dois números, o caminho e a ida e volta:

```rust title="src/look.rs"
pub fn link_quality(kind: &str, ms: u32) -> f32 {
    let base = match kind {
        "LAN" => 1.0,
        "Direct" => 0.9,
        _ => 0.6,
    };
    (base - ms as f32 / 600.0).clamp(0.15, 1.0)
}
```

Na mesma rede o medidor fica o mais cheio e quente possível. Por um relay, com uma ida e volta lenta, ele nunca fica abaixo de 0,15, então sempre sobra um pouco de crepúsculo.

## O resto

- **Acesso não supervisionado.** Pros seus próprios computadores, uma senha, guardada como hash Argon2. Cinco tentativas erradas bloqueiam quem tentou por cinco minutos, e trinta de qualquer um bloqueiam todo mundo por um tempo.
- **A tela de login.** Instalado no Windows, o Deskline roda como um serviço que sobe antes de alguém entrar, então dá pra ver e clicar na tela de login, na tela de bloqueio e nos prompts do UAC.
- **Arquivos e área de transferência.** Copia arquivos num computador e aperta Ctrl+V no outro, e eles vão e colam onde você tá.
- **Voltando.** Um link morto é percebido em uns 12 segundos em vez de 30. Quem tava vendo reconecta sozinho e volta direto por 90 segundos.
- **Versões diferentes.** Mensagens desconhecidas são ignoradas, então dois computadores em versões diferentes ainda conversam.
- **Linux e macOS.** Eu escrevi essas partes sem uma máquina Linux ou Mac pra testar. Espera umas arestas por lá.

O Deskline foi do primeiro commit até a 0.8.0 entre 17 e 19 de novembro. O Sightline, que começou no dia 18, faz a parte da tela sem instalar nada: [um link que você abre no navegador](/writing/your-screen-as-a-link).
