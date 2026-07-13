---
title: "Internacionalização não deveria ser uma camada separada da aplicação."
excerpt: "better-intl muda a forma de pensar i18n no Next.js. Em vez de organizar traduções por idioma, você organiza por feature. Tudo é gerado em build-time ou in-development-time, com tipagem completa e zero runtime de i18n. Ainda é um projeto em evolução, nasceu como um PoC validado em produção."
publishedAt: "2026-07-01"
author: "Luan Fabri"
tags:
  - i18n
rating: 19
---

> Internacionalização não deveria ser uma camada separada da aplicação.

### TL;DR

> Eu sei que ler PITCH é chatão para um car*lho, mas dá uma chance para essa publicação, e me ajuda a simplificar coisas que são naturalmente dificeis.

`better-intl` muda a forma de pensar i18n no Next.js.

Em vez de organizar traduções por idioma, você organiza por **feature**.

Tudo é gerado em build-time ou in-development-time, com tipagem completa e zero runtime de i18n.

Ainda é um projeto em evolução, nasceu como um "*PoC*" validado em produção.

> O README do projeto vende melhor a ideia, e talvez responda algumas dúvidas.

Links:
[https://github.com/luannzin/better-intl](https://github.com/luannzin/better-intl)
[https://www.npmjs.com/package/better-intl](https://www.npmjs.com/package/better-intl)

## Problema

Hoje, a maioria das soluções de internacionalização seguem o mesmo padrão:

* arquivos separados por idioma
* strings espalhadas pelo projeto
* keys abstratas
* runtime responsável por resolver tudo

Na prática, isso cria uma camada paralela ao código.

Você não pensa em feature.
Você pensa em “onde está essa tradução?”

## Mudança de mentalidade

O `better-intl` tenta inverter isso completamente:

> o sistema de arquivos do projeto passa a ser o sistema de internacionalização.

## Como funciona na prática

Em vez disso:

```
/locales/en.json
/locales/pt.json
```

Você escreve assim:

```ts
// src/components/header/t.ts
export default {
  greeting: {
    en: "Hello {name}",
    pt: "Olá {name}",
  },
}
```

E consome assim:

```ts
t.components.header.greeting({ name: "Ada" })
```

## O que isso muda?

tradução deixa de ser “lookup por key”, vira parte do código da feature, tudo é tipado, não existe runtime de i18n, não existe provider ou hook e não existe string key.

## Ideia central

> Eliminar hooks, contexts, providers, falta de tipagem e melhorar a DX.

## Por que isso existe

A maioria das libs resolve internacionalização como um sistema paralelo.

O `better-intl` tenta tratar i18n como parte do próprio código.

Sem camada extra.

Sem abstração escondida em runtime.

## Situação

Ainda não é a versão “final”.

É uma exploração prática de um modelo diferente de internacionalização no Next.js.

---

Se você já sofreu com tradução espalhada, keys perdidas, setup de provider ou boilerplate de i18n

essa abordagem tenta cortar tudo isso de uma vez.