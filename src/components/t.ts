// Labels for the client components. They take them as props, so a language
// switch re-renders them with the new ones instead of keeping the first.
export default {
  share: {
    share: { en: "Share", pt: "Compartilhar" },
    copyLink: { en: "Share, copy link", pt: "Compartilhar, copiar link" },
    more: { en: "More ways to share", pt: "Mais formas de compartilhar" },
    onX: { en: "Share on X", pt: "Compartilhar no X" },
    onLinkedIn: { en: "Share on LinkedIn", pt: "Compartilhar no LinkedIn" },
    onOther: { en: "Share on other apps", pt: "Compartilhar em outros apps" },
  },
  copy: {
    code: { en: "Copy code", pt: "Copiar código" },
    copied: { en: "Copied", pt: "Copiado" },
    failed: { en: "Copy failed", pt: "Falha ao copiar" },
  },
  scene: {
    label: {
      en: "An animated scene drawn in dots:",
      pt: "Uma cena animada desenhada em pontos:",
    },
    another: { en: "Another scene", pt: "Outra cena" },
    draw: { en: "Draw another scene", pt: "Sortear outra cena" },
  },
  diagram: {
    label: { en: "Diagram:", pt: "Diagrama:" },
    between: { en: ", then ", pt: ", depois " },
  },
  // The lines' live pieces in posts (`line` fences)
  lines: {
    code: {
      made: {
        en: "A public key your browser just made",
        pt: "Uma chave pública que seu navegador acabou de criar",
      },
      random: {
        en: "32 random bytes: this browser can't make Ed25519 keys",
        pt: "32 bytes aleatórios: esse navegador não cria chaves Ed25519",
      },
      another: { en: "Another key", pt: "Outra chave" },
    },
    inflight: {
      sharing: { en: "Sharing", pt: "Compartilhando" },
      viewing: { en: "Viewing", pt: "Vendo" },
      roundTrip: { en: "Round trip", pt: "Ida e volta" },
      rule: { en: "Frames in flight", pt: "Frames em trânsito" },
      two: { en: "Two", pt: "Dois" },
      trip: { en: "A round trip", pt: "Uma ida e volta" },
      // "Up to 8 in flight, 30 frames a second arrive"
      upTo: { en: "Up to", pt: "Até" },
      inFlight: { en: "in flight", pt: "em trânsito" },
      arrive: {
        en: "frames a second arrive",
        pt: "frames por segundo chegando",
      },
      slowed: {
        en: "Played at a tenth of the speed",
        pt: "Rodando a um décimo da velocidade",
      },
    },
    link: {
      server: {
        en: "The page's server gets",
        pt: "O servidor da página recebe",
      },
      relays: {
        en: "The relays get the room",
        pt: "Os relays recebem a sala",
      },
      made: {
        en: "Made in this browser. Nobody's sharing on it",
        pt: "Feito nesse navegador. Ninguém tá compartilhando nele",
      },
      another: { en: "Another link", pt: "Outro link" },
    },
    critters: {
      label: { en: "A critter:", pt: "Um bichinho:" },
      seed: { en: "seed", pt: "seed" },
      another: { en: "Another critter", pt: "Outro bichinho" },
    },
  },
};
