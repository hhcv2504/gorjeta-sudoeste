# Gorjeta App — Sudoeste

## O que é esse projeto
App de gestão de comissão e gorjeta de restaurante.
Desenvolvido em React + Vite.

## Regras de negócio principais

### Períodos
- Calculados automaticamente pelo 2º e 4º domingo de cada mês
- Período 1: segunda após 4º domingo do mês anterior → 2º domingo do mês atual
- Período 2: segunda após 2º domingo → 4º domingo do mês atual
- Pagamento sempre na terça após o domingo que fecha o período

### Garçons
- Campos lançados manualmente: venda com gorjeta, gorjeta recebida, couvert, ticket médio, faltas
- Calculados automaticamente: perda %, a receber, desconto extras, bônus, total final

### Fórmulas de cálculo — garçons

#### A receber
aReceber = gorjetaRecebida × 0.45
(NÃO é proporcional à venda total — é fixo sobre a gorjeta recebida de cada garçom)

#### Perda %
gorjetaEsperada = vendaGorjeta × 0.10
perda = (gorjetaEsperada - gorjetaRecebida) / (gorjetaRecebida × 0.01)
(se gorjetaRecebida = 0, perda = 0)

#### Férias
aReceberFerias = (menorAReceber × 0.80) / diasPeriodo × diasFerias
menorAReceber = menor valor de (aReceber - extras) entre todos os garçons do período

### Bônus dos garçons
Critérios de elegibilidade (obrigatórios para qualquer bônus):
- Venda mínima no período: R$ 20.000
- Zero faltas no período
- Sem atender aos dois critérios → sem nenhum bônus

**Bônus 1 — Controle de Perda**
- Perda < 1% → R$ 150
- Perda entre 1% e 1,99% → R$ 80
- Perda ≥ 2% → sem bônus

**Bônus 2 — Ticket Médio (referência da casa: TM R$ 139)**
- TM ≥ R$ 140 → R$ 80
- TM ≥ R$ 150 → R$ 120
- TM ≥ R$ 160 → R$ 170

**Regras complementares:**
- Bônus de Perda e TM são cumulativos no mesmo período
- Metas revisadas a cada 3 meses ou sempre que houver reajuste de cardápio

### Extras
- Metade paga a casa, metade descontada da equipe
- Peso: colaborador 1x, garçom 1,5x, gerente 2,5x

## Stack
- React 18
- Vite 5
- Sem biblioteca de UI (tudo CSS inline)
- Dados salvos em localStorage

## Padrões
- Sempre em português brasileiro
- Moeda em formato BRL (R$ 1.234,56)
- Tema escuro com cor de destaque dourada (#C8A96E)