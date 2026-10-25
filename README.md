# ZELO — Landing Pages

Site institucional do ZELO (O Motorista Amigo), Belo Horizonte — 4 páginas estáticas (HTML + Tailwind CSS compilado + JS vanilla), sem dependência de build em produção.

## Estrutura

```
index.html                     → Hub (porta de entrada, direciona para as 3 páginas abaixo)
zelo-landing-cliente.html      → Página para o passageiro (quem vai usar o serviço)
zelo-landing-motorista.html    → Página de recrutamento de motoristas
zelo-landing-page.html         → Página para estabelecimentos parceiros (bares/restaurantes)
zelo.min.css                   → CSS compilado do Tailwind (gerado via Tailwind CLI, não via CDN)
formularios/apps-script.gs     → Backend dos formulários (Google Apps Script + planilha)
```

## Rodando localmente

Não precisa de servidor nem de build — é só abrir os arquivos num navegador, mantendo todos na mesma pasta (o `zelo.min.css` precisa estar ao lado dos `.html`).

Para testar como em produção (recomendado, especialmente no celular):
```bash
npx serve .
```

## Deploy

Publicado no Render (Static Site, publish directory `.`): cada push na `main` atualiza https://zelo-o-amigo.onrender.com em 1–2 min.

## Contato e formulários

- WhatsApp oficial: +55 31 97361-9814 | E-mail: zeloomotoristaamigo@gmail.com
- Cada página abre o WhatsApp com uma mensagem pronta diferente, para identificar a origem do contato.
- Formulários de parceiro e motorista enviam para uma planilha Google via Apps Script (`FORM_ENDPOINT` em cada página). Enquanto `FORM_ENDPOINT` estiver vazio — ou se o envio falhar — os dados preenchidos seguem pelo WhatsApp, então nenhum contato se perde. Ativação: `formularios/COMO-ATIVAR.md`.

## Pendências conhecidas

- Logo em texto ("ZELO") na navbar/footer — trocar por SVG da marca quando aprovado.
- Preencher `FORM_ENDPOINT` nas duas páginas com a URL /exec do Apps Script (ver `formularios/COMO-ATIVAR.md`).
- Imagens reais nos placeholders e domínio próprio.
