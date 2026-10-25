# Como ativar os formulários (planilha Google)

Feito uma vez, com a conta **zeloomotoristaamigo@gmail.com**. Leva ~10 minutos.

1. Em drive.google.com, crie uma planilha chamada **ZELO — Cadastros do site**.
2. Na planilha: **Extensões → Apps Script**. Apague o que estiver no editor e cole todo o conteúdo de `apps-script.gs`. Salve (ícone de disquete).
3. No topo do editor, escolha a função **configurar** e clique em **Executar**. O Google pede autorização:
   **Revisar permissões → escolha a conta da ZELO → Avançado → Acessar (não seguro) → Permitir**.
   (O aviso aparece porque o script é seu e não passou por verificação do Google — é normal.)
   As abas **Parceiros** e **Motoristas** aparecem na planilha.
4. **Implantar → Nova implantação** → engrenagem → **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   Clique em **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
5. Cole essa URL em `FORM_ENDPOINT` em `zelo-landing-page.html` e `zelo-landing-motorista.html` e publique.

Teste: abra a URL `/exec` no navegador — deve aparecer `{"ok":true,"servico":"ZELO formulários"}`.
Depois preencha cada formulário do site: a linha aparece na planilha e chega um e-mail de aviso.

**Se mudar o script depois:** Implantar → Gerenciar implantações → lápis → Versão: **Nova versão** → Implantar. Assim a URL continua a mesma.
