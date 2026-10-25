# ZELO — Landing Pages

Site institucional do ZELO (O Motorista Amigo), Belo Horizonte — 4 páginas estáticas (HTML + Tailwind CSS compilado + JS vanilla), sem dependência de build em produção.

## Estrutura

```
index.html                     → Hub (porta de entrada, direciona para as 3 páginas abaixo)
zelo-landing-cliente.html      → Página para o passageiro (quem vai usar o serviço)
zelo-landing-motorista.html    → Página de recrutamento de motoristas
zelo-landing-page.html         → Página para estabelecimentos parceiros (bares/restaurantes)
zelo.min.css                   → CSS compilado do Tailwind (gerado via Tailwind CLI, não via CDN)
```

## Rodando localmente

Não precisa de servidor nem de build — é só abrir os arquivos num navegador, mantendo todos na mesma pasta (o `zelo.min.css` precisa estar ao lado dos `.html`).

Para testar como em produção (recomendado, especialmente no celular):
```bash
npx serve .
```

## Deploy

Compatível com qualquer host de arquivo estático: Vercel, Netlify, GitHub Pages, Cloudflare Pages. Recomendação: conectar este repositório ao Vercel ou Netlify para deploy automático a cada push.

## Pendências conhecidas

- WhatsApp oficial: +55 31 97361-9814 | E-mail: zeloomotoristaamigo@gmail.com
- Logo em texto ("ZELO") na navbar/footer — trocar por SVG da marca quando aprovado.
- Formulários (`/zelo-landing-page.html` e `/zelo-landing-motorista.html`) apontam para Cloud Functions cujo endpoint ainda é um placeholder — ver projeto `zelo-firebase-functions` para o backend.
