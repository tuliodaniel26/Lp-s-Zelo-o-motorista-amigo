# ZELO — Landing Pages

Site institucional do ZELO (O Motorista Amigo), Belo Horizonte — 4 páginas estáticas (HTML + CSS + JS vanilla), sem build e sem dependência externa em produção.

Visual (out/2026): linguagem inspirada na DiDi — hero noturno em tela cheia com estrada vista de cima, círculo translúcido com o título, botões circulares, títulos leves em caixa-alta, palavras em marca-d'água e menu em faixas. Cores do ZELO: vermelho lanterna para ação, bordô da marca nas faixas de destaque.

## Estrutura

```
index.html                     → Página inicial (para quem é, como funciona, segurança)
zelo-landing-cliente.html      → Passageiro: comparativo, números, simulador de preço, FAQ
zelo-landing-motorista.html    → Recrutamento: simulador de ganhos, requisitos, candidatura
zelo-landing-page.html         → Estabelecimentos: cashback, Pacote Parceiro, cadastro
assets/zelo.css                → Todo o visual (cores e componentes)
assets/zelo.js                 → Cabeçalho, menu, carrosséis, contadores e animações de entrada
assets/fonts/                  → Fonte Jost (licença OFL), hospedada no próprio site
formularios/apps-script.gs     → Backend dos formulários (Google Apps Script + planilha)
```

## Como editar

- **Cores:** no topo de `assets/zelo.css` (`:root`). `--z-red` é o vermelho dos botões; `--z-wine` é o bordô da marca.
- **Tarifas das calculadoras:** objeto `TARIFA` no fim de `zelo-landing-cliente.html` e de `zelo-landing-motorista.html` (os dois precisam ficar iguais).
  - Preço ao cliente = corrida + deslocamento de retorno + `taxaServico`.
  - Corrida: `bandeirada` + `precoKm` × km + `precoMin` × min, com `adicNoturno` e piso `corridaMinima`. `comissao` (0.30) é a parte do ZELO; o motorista fica com 70% da corrida.
  - Deslocamento de retorno: volta estimada de app (`retornoBandeirada` + `retornoKm` × km + `retornoMin` × min, piso `retornoMinimo`) × `retornoFator`. `retornoMotorista` (0.90) é a parte do motorista; o ZELO fica com 10%.
  - `taxaServico` (R$ 3,50): taxa do serviço exclusivo ZELO, valor fixo por volta, cobrado do cliente e 100% do ZELO.
  - Conferência (8 km / 15 min): cliente R$ 53,12 (corrida R$ 30,48 + retorno R$ 19,14 + taxa R$ 3,50); motorista recebe R$ 38,57 (R$ 21,34 + R$ 17,23).
  - O Pacote Parceiro (`zelo-landing-page.html`) cita "R$ 53,12" como preço avulso de 8 km / 15 min: se a tarifa mudar, atualize esse texto também.
- **Cabeçalho, menu, ícones e rodapé** se repetem nas 4 páginas: altere nas 4.
- **Animações:** quem ativa "reduzir movimento" no celular vê o site sem animação; a estrada do topo pausa quando sai da tela.

## Rodando localmente

Use um servidor local (a fonte não carrega abrindo o arquivo direto):
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

- Logo em texto ("ZELO") no cabeçalho e rodapé — trocar por SVG da marca quando aprovado.
- Ilustrações no lugar de fotos (estrada, mapa, carro e telas com ícones) — trocar por fotos reais quando houver.
- Política de Privacidade e Termos de Uso (links ainda sem destino) e domínio próprio.
