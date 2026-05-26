# Gorjeta App — Sudoeste

Aplicativo de gestão de comissão e gorjeta para restaurante.

## Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (já vem junto com o Node)

### Passo a passo

1. **Abra o terminal** na pasta do projeto

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Rode o projeto:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```

---

## Como fazer deploy no Vercel (quando quiser colocar no ar)

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Instale o Vercel CLI: `npm i -g vercel`
3. Na pasta do projeto, rode: `vercel`
4. Siga as instruções — em 2 minutos o app está no ar com link público

---

## Estrutura do projeto

```
gorjeta-app/
├── index.html          → página base
├── package.json        → dependências
├── vite.config.js      → configuração do bundler
└── src/
    ├── main.jsx        → entry point do React
    └── App.jsx         → aplicativo completo
```

## Funcionalidades

- ✅ Calendário automático de períodos (2º e 4º domingo de cada mês)
- ✅ Lançamento de gorjeta, extras, dados dos garçons e faltas
- ✅ Cálculo automático de perda %, a receber, desconto de extras
- ✅ Bônus por perda de gorjeta (regra dos R$ 20k)
- ✅ Bônus por ticket médio (faixas progressivas)
- ✅ Bônus por maior couvert
- ✅ Cálculo de férias proporcional
- ✅ Cadastro de garçons e colaboradores
- ✅ Regras e percentuais editáveis
- ✅ Dados salvos automaticamente no navegador (localStorage)

## Dados salvos

O app salva tudo automaticamente no seu navegador. Não há banco de dados externo — os dados ficam no `localStorage` do navegador onde o app for aberto.
