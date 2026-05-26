import { useState, useEffect, useCallback } from "react";

// ─── UTILS ───────────────────────────────────────────────────────────────────

function getNthSunday(year, month, n) {
  // month: 0-indexed
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const date = new Date(year, month, d);
    if (date.getMonth() !== month) break;
    if (date.getDay() === 0) {
      count++;
      if (count === n) return date;
    }
  }
  return null;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmtDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("pt-BR");
}

function fmtBRL(val) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val || 0);
}

function fmtPct(val) {
  return (val || 0).toFixed(2) + "%";
}

function getPeriods(year, month) {
  // Returns the 2 periods for a given month (0-indexed)
  const sun2 = getNthSunday(year, month, 2);
  const sun4 = getNthSunday(year, month, 4);

  // Period 1: Monday after 4th Sunday of prev month → 2nd Sunday of this month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevSun4 = getNthSunday(prevYear, prevMonth, 4);

  const p1Start = addDays(prevSun4, 1);
  const p1End = sun2;
  const p1Pay = addDays(sun2, 2);

  // Period 2: Monday after 2nd Sunday → 4th Sunday of this month
  const p2Start = addDays(sun2, 1);
  const p2End = sun4;
  const p2Pay = addDays(sun4, 2);

  return [
    { label: `Período 1 — ${fmtDate(p1Start)} a ${fmtDate(p1End)}`, start: p1Start, end: p1End, pay: p1Pay, key: `${year}-${month}-1` },
    { label: `Período 2 — ${fmtDate(p2Start)} a ${fmtDate(p2End)}`, start: p2Start, end: p2End, pay: p2Pay, key: `${year}-${month}-2` },
  ];
}

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────

const INITIAL_CARGOS = [
  { id: "gg", nome: "Gerente Geral", setor: "Gerência", pontos: 16, pesoExtras: 2.5 },
  { id: "gfb", nome: "Gerente F&B", setor: "Gerência", pontos: 14, pesoExtras: 2.5 },
  { id: "cf", nome: "Chefe de Fila", setor: "Gerência", pontos: 12, pesoExtras: 2.5 },
  { id: "cb", nome: "Chefe de Bar", setor: "Bar", pontos: 9, pesoExtras: 1 },
  { id: "bm1", nome: "Barman 1", setor: "Bar", pontos: 7, pesoExtras: 1 },
  { id: "bm2", nome: "Barman 2", setor: "Bar", pontos: 6.5, pesoExtras: 1 },
  { id: "ck", nome: "Chefe de Cozinha", setor: "Cozinha", pontos: 9, pesoExtras: 1 },
  { id: "cz1", nome: "Cozinheiro 1", setor: "Cozinha", pontos: 7, pesoExtras: 1 },
  { id: "cz2", nome: "Cozinheiro 2", setor: "Cozinha", pontos: 6.5, pesoExtras: 1 },
  { id: "ac1", nome: "Aux. Cozinha 1", setor: "Cozinha", pontos: 5.5, pesoExtras: 1 },
  { id: "ac2", nome: "Aux. Cozinha 2", setor: "Cozinha", pontos: 5, pesoExtras: 1 },
  { id: "asg1", nome: "ASG 1", setor: "Cozinha", pontos: 4.5, pesoExtras: 1 },
  { id: "asg2", nome: "ASG 2", setor: "Cozinha", pontos: 4, pesoExtras: 1 },
  { id: "cm1", nome: "Cumin 1", setor: "Salão", pontos: 7, pesoExtras: 1 },
  { id: "cm2", nome: "Cumin 2", setor: "Salão", pontos: 6.5, pesoExtras: 1 },
  { id: "cm3", nome: "Cumin 3", setor: "Salão", pontos: 6, pesoExtras: 1 },
  { id: "cx1", nome: "Caixa 1", setor: "Salão", pontos: 6, pesoExtras: 1 },
  { id: "est1", nome: "Estoquista 1", setor: "Salão", pontos: 6, pesoExtras: 1 },
  { id: "gc", nome: "Garçom", setor: "Garçons", pontos: 0, pesoExtras: 1.5 },
];

const INITIAL_FUNCIONARIOS = [
  { id: "f1", nome: "Felipe Portela de Azevedo", cargoId: "bm1", ativo: true },
  { id: "f2", nome: "Gean Santiago dos Santos", cargoId: "bm1", ativo: true },
  { id: "f3", nome: "Misael Santiago dos Santos", cargoId: "cb", ativo: true },
  { id: "f4", nome: "Muhammad Rodrigues da Silva", cargoId: "bm2", ativo: true },
  { id: "f5", nome: "Neidiane Arante Campos", cargoId: "bm2", ativo: true },
  { id: "f6", nome: "Adriano Junges Oliveira", cargoId: "asg1", ativo: true },
  { id: "f7", nome: "Ananias Ferreira Batista", cargoId: "ck", ativo: true },
  { id: "f8", nome: "Antonia Alice de Arruda Silva Santos", cargoId: "cz1", ativo: true },
  { id: "f9", nome: "Antonio Lopes dos Santos", cargoId: "cz1", ativo: true },
  { id: "f10", nome: "Cladeilde Lima Oliveira", cargoId: "asg2", ativo: true },
  { id: "f11", nome: "Débora Meirelles Gomes", cargoId: "cz2", ativo: true },
  { id: "f12", nome: "Francisca Maria Chaves", cargoId: "cz2", ativo: true },
  { id: "f13", nome: "Francisco Jefferson Pereira de Carvalho", cargoId: "asg2", ativo: true },
  { id: "f14", nome: "Jady da Cruz Ferreira", cargoId: "cz1", ativo: true },
  { id: "f15", nome: "Jennefe Ravnara Vieira Rumão", cargoId: "cz2", ativo: true },
  { id: "f16", nome: "Kelly Alves Firmino", cargoId: "asg1", ativo: true },
  { id: "f17", nome: "Luciano Dias Pereira", cargoId: "asg2", ativo: true },
  { id: "f18", nome: "Luis Pereira da Silva Filho", cargoId: "ac1", ativo: true },
  { id: "f19", nome: "Raimundo Nonato Rodrigues da Silva", cargoId: "asg1", ativo: true },
  { id: "f20", nome: "Robson Tavares de Oliveira", cargoId: "cz1", ativo: true },
  { id: "f21", nome: "Vanusa Maria da Cruz", cargoId: "cz2", ativo: true },
  { id: "f22", nome: "Vinicius Marques", cargoId: "ck", ativo: true },
  { id: "f23", nome: "Alexsandro da Rocha Porto", cargoId: "cf", ativo: true },
  { id: "f24", nome: "Daniel Lopes da Cruz", cargoId: "gfb", ativo: true },
  { id: "f25", nome: "Jean Pereira de Sousa", cargoId: "gfb", ativo: true },
  { id: "f26", nome: "Wilkson Henrique Ferreira de Sousa", cargoId: "gg", ativo: true },
  { id: "f27", nome: "Ana Lúcia dos Santos Ramos", cargoId: "cm3", ativo: true },
  { id: "f28", nome: "Ana Luísa Carvalho dos Santos", cargoId: "cx1", ativo: true },
  { id: "f29", nome: "Carla Karine Fernandes de Oliveira", cargoId: "cm1", ativo: true },
  { id: "f30", nome: "Cleiziane Rodrigues da Silva", cargoId: "cx1", ativo: true },
  { id: "f31", nome: "Erick Ribeiro Reis", cargoId: "cm3", ativo: true },
  { id: "f32", nome: "Fabrício Bandeira de Sousa", cargoId: "cm1", ativo: true },
  { id: "f33", nome: "Gabriel Gonzalles Mendes Lopes", cargoId: "cm2", ativo: true },
  { id: "f34", nome: "Janaina Albuquerque de Oliveira", cargoId: "cm3", ativo: true },
  { id: "f35", nome: "Jefson Ribeiro Matos", cargoId: "cm1", ativo: true },
  { id: "f36", nome: "Josué Pereira Moura Campos", cargoId: "est1", ativo: true },
  { id: "f37", nome: "Manoel Cunha de Souza", cargoId: "cm1", ativo: true },
  { id: "f38", nome: "Neomar Junio de Oliveira Lima", cargoId: "cm3", ativo: true },
  { id: "f39", nome: "Paulo Vitor Ferreira Cunha", cargoId: "cm1", ativo: true },
];

const INITIAL_GARCONS = [
  { id: "g1", nome: "Camily Alves Santos", ativo: true },
  { id: "g2", nome: "Felipe Emiliano dos Santos", ativo: true },
  { id: "g3", nome: "Felipe Henrique da Silva", ativo: true },
  { id: "g4", nome: "Francisca Pereira de Souza", ativo: true },
  { id: "g5", nome: "Gerson Cabral Silva", ativo: true },
  { id: "g6", nome: "Italo dos Santos Lourenço", ativo: true },
  { id: "g7", nome: "Jose Augusto de Abreu Filho", ativo: true },
  { id: "g8", nome: "Jucelino Alves dos Santos", ativo: true },
  { id: "g9", nome: "Marcos Vinicius Ribeiro Nunes", ativo: true },
  { id: "g10", nome: "Rafael Ferreira da Silva", ativo: true },
  { id: "g11", nome: "Ronilson Barbosa", ativo: true },
];

const INITIAL_REGRAS = {
  pctCusto: 13,
  pctProdAdm: 4,
  vendaMinimaBonus: 20000,
  bonusPerda2: 80,
  bonusPerda1: 150,
  bonusCouvert: 100,
  ticketFaixa1: 140,
  ticketFaixa2: 150,
  ticketFaixa3: 160,
  bonusTicket1: 80,
  bonusTicket2: 120,
  bonusTicket3: 170,
};

// ─── COLORS ───────────────────────────────────────────────────────────────────

const CORES = {
  bg: "#0F0F0F",
  surface: "#181818",
  card: "#1E1E1E",
  border: "#2A2A2A",
  accent: "#C8A96E",
  accentDim: "#8A6E3E",
  green: "#4CAF7D",
  red: "#E05C5C",
  amber: "#E0A050",
  purple: "#9B7FE0",
  text: "#F0EDE8",
  textSec: "#888580",
  textTer: "#555250",
};

const S = {
  app: {
    display: "flex", minHeight: "100vh", background: CORES.bg,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: CORES.text, fontSize: 14,
  },
  sidebar: {
    width: 220, background: CORES.surface, borderRight: `1px solid ${CORES.border}`,
    display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh",
  },
  sidebarMobile: (open) => ({
    position: "fixed", top: 0, left: 0, bottom: 0, height: "100%", width: "min(82vw, 280px)",
    zIndex: 200, transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.25s ease", boxShadow: open ? "8px 0 40px rgba(0,0,0,0.55)" : "none",
  }),
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 150 },
  hamburger: {
    background: "transparent", border: "none", color: CORES.text, fontSize: 24,
    cursor: "pointer", lineHeight: 1, padding: 4, flexShrink: 0,
  },
  sidebarHeader: {
    padding: "24px 20px 16px", borderBottom: `1px solid ${CORES.border}`,
  },
  logo: { fontSize: 18, fontWeight: 700, color: CORES.accent, letterSpacing: "-0.5px" },
  logoSub: { fontSize: 11, color: CORES.textSec, marginTop: 2 },
  navSection: {
    fontSize: 10, color: CORES.textTer, padding: "16px 20px 6px",
    textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
  },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "9px 20px",
    fontSize: 13, cursor: "pointer", color: active ? CORES.accent : CORES.textSec,
    background: active ? "rgba(200,169,110,0.08)" : "transparent",
    borderLeft: `2px solid ${active ? CORES.accent : "transparent"}`,
    transition: "all 0.15s", fontWeight: active ? 600 : 400,
  }),
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: {
    padding: "16px 28px", borderBottom: `1px solid ${CORES.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: CORES.surface, position: "sticky", top: 0, zIndex: 10,
  },
  topbarTitle: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" },
  topbarSub: { fontSize: 12, color: CORES.textSec, marginTop: 2 },
  content: { padding: 28, flex: 1, minWidth: 0 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 },
  card: {
    background: CORES.card, border: `1px solid ${CORES.border}`,
    borderRadius: 12, padding: 20, marginBottom: 16,
  },
  metricCard: {
    background: CORES.surface, border: `1px solid ${CORES.border}`,
    borderRadius: 10, padding: "14px 16px",
  },
  metricLabel: { fontSize: 11, color: CORES.textSec, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" },
  metricValue: { fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" },
  metricSub: { fontSize: 11, color: CORES.textTer, marginTop: 2 },
  cardTitle: {
    fontSize: 13, fontWeight: 600, marginBottom: 14, color: CORES.textSec,
    textTransform: "uppercase", letterSpacing: "0.06em",
  },
  tableWrap: { overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "0 -4px", padding: "0 4px" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left", padding: "8px 12px", fontSize: 11,
    color: CORES.textTer, borderBottom: `1px solid ${CORES.border}`,
    textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, whiteSpace: "nowrap",
  },
  td: { padding: "10px 12px", borderBottom: `1px solid ${CORES.border}`, verticalAlign: "middle", whiteSpace: "nowrap" },
  input: {
    width: "100%", background: CORES.surface, border: `1px solid ${CORES.border}`,
    borderRadius: 8, padding: "8px 12px", color: CORES.text, fontSize: 13,
    outline: "none", boxSizing: "border-box",
  },
  label: { fontSize: 11, color: CORES.textSec, marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" },
  btn: (variant = "default") => ({
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
    borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600, border: "none",
    background: variant === "primary" ? CORES.accent : CORES.surface,
    color: variant === "primary" ? "#0F0F0F" : CORES.text,
    border: variant === "primary" ? "none" : `1px solid ${CORES.border}`,
    transition: "opacity 0.15s",
  }),
  badge: (color) => {
    const map = {
      green: { bg: "rgba(76,175,125,0.15)", color: CORES.green },
      red: { bg: "rgba(224,92,92,0.15)", color: CORES.red },
      amber: { bg: "rgba(224,160,80,0.15)", color: CORES.amber },
      purple: { bg: "rgba(155,127,224,0.15)", color: CORES.purple },
      gold: { bg: "rgba(200,169,110,0.15)", color: CORES.accent },
      gray: { bg: "rgba(136,133,128,0.15)", color: CORES.textSec },
    };
    const c = map[color] || map.gray;
    return {
      display: "inline-block", fontSize: 11, padding: "2px 8px",
      borderRadius: 20, fontWeight: 600, background: c.bg, color: c.color,
    };
  },
  row: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 0", borderBottom: `1px solid ${CORES.border}`, fontSize: 13,
  },
  avatar: (color = CORES.accentDim) => ({
    width: 32, height: 32, borderRadius: "50%", background: color + "33",
    color: color, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, flexShrink: 0,
  }),
  divider: { borderBottom: `1px solid ${CORES.border}`, margin: "16px 0" },
  formGroup: { marginBottom: 14 },
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────

function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initial;
      const parsed = JSON.parse(stored);
      // Mescla defaults para objetos simples, garantindo que novas chaves apareçam
      if (initial && typeof initial === "object" && !Array.isArray(initial) &&
          parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return { ...initial, ...parsed };
      }
      return parsed;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

function useIsMobile(breakpoint = 760) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Metric({ label, value, sub, color }) {
  return (
    <div style={S.metricCard}>
      <div style={S.metricLabel}>{label}</div>
      <div style={{ ...S.metricValue, color: color || CORES.text }}>{value}</div>
      {sub && <div style={S.metricSub}>{sub}</div>}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", prefix, suffix }) {
  return (
    <div style={S.formGroup}>
      {label && <label style={S.label}>{label}</label>}
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: CORES.textSec, fontSize: 13 }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...S.input, paddingLeft: prefix ? 28 : 12, paddingRight: suffix ? 36 : 12 }}
        />
        {suffix && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: CORES.textSec, fontSize: 13 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function Initials(nome) {
  return nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// ─── CALC ENGINE ─────────────────────────────────────────────────────────────

function calcPeriodo(periodo, cargos, funcionarios, garcons, regras) {
  const { gorjetaTotal = 0, extras = 0, pctCusto, pctProdAdm } = { ...regras, ...periodo };

  const custo = gorjetaTotal * (pctCusto / 100);
  const liquida = gorjetaTotal - custo;
  const totalGarcons = (periodo.garconsDados || []).reduce((s, g) => s + (g.gorjetaRecebida || 0) * 0.45, 0);
  const totalProdAdm = gorjetaTotal * (pctProdAdm / 100);
  const totalDistribuicao = liquida - totalGarcons - totalProdAdm;

  // Extras: metade casa, metade equipe
  const extrasEquipe = extras / 2;

  // Peso total de extras
  const funcAtivos = (periodo.funcionariosFaltas || []);
  const garconsDados = (periodo.garconsDados || []);

  // Colaboradores (não garçons)
  const colabs = funcionarios.filter(f => f.ativo).map(f => {
    const cargo = cargos.find(c => c.id === f.cargoId);
    const falta = funcAtivos.find(x => x.id === f.id);
    const diasFalta = falta ? (falta.faltas || 0) : 0;
    return { ...f, cargo, diasFalta, pesoExtras: cargo?.pesoExtras || 1, pontos: cargo?.pontos || 0 };
  });

  const gc = garconsDados.map(g => {
    const info = garcons.find(x => x.id === g.id);
    return { ...g, nome: info?.nome || g.id, pesoExtras: 1.5 };
  });

  // Total peso extras
  const totalPesoExtras = colabs.reduce((s, c) => s + c.pesoExtras, 0) + gc.reduce((s, g) => s + g.pesoExtras, 0);
  const extrasUnitario = totalPesoExtras > 0 ? extrasEquipe / totalPesoExtras : 0;

  // Pontos totais colaboradores (ajustado por faltas)
  // Calculamos período em dias
  const diasPeriodo = periodo.start && periodo.end
    ? Math.round((new Date(periodo.end) - new Date(periodo.start)) / 86400000) + 1
    : 14;

  const totalPontosColabs = colabs.reduce((s, c) => {
    const pontosEfetivos = c.pontos * Math.max(0, diasPeriodo - c.diasFalta) / diasPeriodo;
    return s + pontosEfetivos;
  }, 0);

  const valorPontoColab = totalPontosColabs > 0 ? totalDistribuicao / totalPontosColabs : 0;

  // Couvert máximo entre garçons
  const maxCouvert = gc.length > 0 ? Math.max(...gc.map(g => g.couvert || 0)) : 0;

  // Resultados colaboradores
  const resultColabs = colabs.map(c => {
    const pontosEfetivos = c.pontos * Math.max(0, diasPeriodo - c.diasFalta) / diasPeriodo;
    const aReceber = pontosEfetivos * valorPontoColab;
    const descontoExtras = extrasUnitario * c.pesoExtras;
    const total = Math.max(0, aReceber - descontoExtras);
    return { ...c, pontosEfetivos, aReceber, descontoExtras, total };
  });

  // Resultados garçons
  const pctGarcomVenda = totalGarcons; // total destinado a garçons
  // Cada garçom recebe proporcional à sua venda
  const totalVendaGarcons = gc.reduce((s, g) => s + (g.vendaGorjeta || 0), 0);

  const resultGarcons = gc.map(g => {
    const vendaGorjeta = g.vendaGorjeta || 0;
    const gorjetaRecebida = g.gorjetaRecebida || 0;
    const couvert = g.couvert || 0;
    const ticketMedio = g.ticketMedio || 0;
    const faltas = g.faltas || 0;
    const ferias = g.ferias || false;

    // Perda
    const gorjetaEsperada = vendaGorjeta * 0.1;
    const perda = gorjetaRecebida > 0 ? ((gorjetaEsperada - gorjetaRecebida) / (gorjetaRecebida * 0.01)) : 0;

    // A receber: proporcional à sua venda sobre o total destinado a garçons
    const aReceber = gorjetaRecebida * 0.45;

    // Desconto extras
    const descontoExtras = extrasUnitario * 1.5;

    // Total parcial
    const totalParcial = Math.max(0, aReceber - descontoExtras);

    // Bônus — elegibilidade: venda mínima E zero faltas no período
    const qualificaBonus = vendaGorjeta >= regras.vendaMinimaBonus && faltas === 0;
    let bonusPerda = 0;
    if (qualificaBonus) {
      if (perda < 1) bonusPerda = regras.bonusPerda1;
      else if (perda < 2) bonusPerda = regras.bonusPerda2;
    }
    const bonusCouvert = qualificaBonus && couvert === maxCouvert && couvert > 0 ? regras.bonusCouvert : 0;
    let bonusTicket = 0;
    if (qualificaBonus && ticketMedio > 0) {
      if (ticketMedio >= regras.ticketFaixa3) bonusTicket = regras.bonusTicket3;
      else if (ticketMedio >= regras.ticketFaixa2) bonusTicket = regras.bonusTicket2;
      else if (ticketMedio >= regras.ticketFaixa1) bonusTicket = regras.bonusTicket1;
    }

    // Bônus de perda e ticket médio são cumulativos
    const totalFinal = totalParcial + bonusPerda + bonusCouvert + bonusTicket;

    return {
      ...g, vendaGorjeta, gorjetaRecebida, couvert, ticketMedio, faltas, ferias,
      perda, aReceber, descontoExtras, totalParcial,
      bonusPerda, bonusCouvert, bonusTicket, totalFinal, qualificaBonus,
    };
  });

  return {
    custo, liquida, totalGarcons, totalProdAdm, totalDistribuicao,
    extrasEquipe, valorPontoColab, resultColabs, resultGarcons, maxCouvert,
  };
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function Dashboard({ periodos, cargos, funcionarios, garcons, regras, setPeriodos }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const periods = getPeriods(year, month);

  // Find or create current period data
  const currentKey = periods[0].key;
  const currentPeriodo = periodos.find(p => p.key === currentKey) || {};

  const calc = calcPeriodo(
    { ...periods[0], ...currentPeriodo, pctCusto: regras.pctCusto, pctProdAdm: regras.pctProdAdm },
    cargos, funcionarios, garcons, regras
  );

  const totalPago = calc.resultGarcons.reduce((s, g) => s + g.totalFinal, 0) +
    calc.resultColabs.reduce((s, c) => s + c.total, 0);

  return (
    <div>
      <div style={S.grid4}>
        <Metric label="Gorjeta Total" value={fmtBRL(currentPeriodo.gorjetaTotal || 0)} sub="Período atual" color={CORES.accent} />
        <Metric label="Total Garçons" value={fmtBRL(calc.totalGarcons)} sub={`${garcons.filter(g => g.ativo).length} garçons`} />
        <Metric label="Distribuição" value={fmtBRL(calc.totalDistribuicao)} sub="Salão + caixa" />
        <Metric label="Extras" value={fmtBRL(currentPeriodo.extras || 0)} sub="½ casa · ½ equipe" color={CORES.amber} />
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Próximos períodos</div>
          {[...getPeriods(year, month), ...getPeriods(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1)].map((p, i) => (
            <div key={p.key} style={{ ...S.row, flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                <span style={S.badge(i === 0 ? "gold" : "gray")}>{i === 0 ? "Atual" : `P${i + 1}`}</span>
                <span style={{ fontSize: 12, color: CORES.text, flex: 1 }}>{p.label}</span>
              </div>
              <div style={{ fontSize: 11, color: CORES.textSec, paddingLeft: 4 }}>
                Pagamento: {fmtDate(p.pay)}
              </div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Top garçons — período atual</div>
          {calc.resultGarcons.length === 0 && (
            <div style={{ color: CORES.textTer, fontSize: 13, padding: "20px 0", textAlign: "center" }}>
              Nenhum dado lançado ainda
            </div>
          )}
          {[...calc.resultGarcons].sort((a, b) => b.totalFinal - a.totalFinal).slice(0, 5).map(g => (
            <div key={g.id} style={S.row}>
              <div style={S.avatar(CORES.accent)}>{Initials(g.nome)}</div>
              <div style={{ flex: 1, fontSize: 12 }}>
                <div style={{ fontWeight: 600 }}>{g.nome}</div>
                <div style={{ color: CORES.textSec }}>
                  Perda: <span style={{ color: g.perda < 1 ? CORES.green : g.perda < 2 ? CORES.amber : CORES.red }}>{fmtPct(g.perda)}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: CORES.accent }}>{fmtBRL(g.totalFinal)}</div>
                {(g.bonusPerda > 0 || g.bonusCouvert > 0 || g.bonusTicket > 0) && (
                  <div style={{ fontSize: 11, color: CORES.green }}>
                    +{fmtBRL(g.bonusPerda + g.bonusCouvert + g.bonusTicket)} bônus
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LancamentoPeriodo({ periodos, setPeriodos, cargos, funcionarios, garcons, regras }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [periodIdx, setPeriodIdx] = useState(0);

  const periods = getPeriods(year, month);
  const period = periods[periodIdx];

  const existing = periodos.find(p => p.key === period.key) || {
    key: period.key, gorjetaTotal: "", extras: "",
    funcionariosFaltas: [], garconsDados: [],
  };

  const [gorjetaTotal, setGorjetaTotal] = useState(existing.gorjetaTotal || "");
  const [extras, setExtras] = useState(existing.extras || "");
  const [faltas, setFaltas] = useState(() => {
    const mapa = {};
    (existing.funcionariosFaltas || []).forEach(f => { mapa[f.id] = f.faltas; });
    return mapa;
  });
  const [gdados, setGdados] = useState(() => {
    const mapa = {};
    (existing.garconsDados || []).forEach(g => { mapa[g.id] = g; });
    return mapa;
  });

  useEffect(() => {
    const ex = periodos.find(p => p.key === period.key) || {};
    setGorjetaTotal(ex.gorjetaTotal || "");
    setExtras(ex.extras || "");
    const fmap = {};
    (ex.funcionariosFaltas || []).forEach(f => { fmap[f.id] = f.faltas; });
    setFaltas(fmap);
    const gmap = {};
    (ex.garconsDados || []).forEach(g => { gmap[g.id] = g; });
    setGdados(gmap);
  }, [period.key]);

  const save = () => {
    const data = {
      key: period.key, start: period.start, end: period.end,
      gorjetaTotal: parseFloat(gorjetaTotal) || 0,
      extras: parseFloat(extras) || 0,
      funcionariosFaltas: Object.entries(faltas).map(([id, f]) => ({ id, faltas: parseFloat(f) || 0 })),
      garconsDados: Object.entries(gdados).map(([id, g]) => ({ id, ...g })),
    };
    setPeriodos(prev => {
      const sem = prev.filter(p => p.key !== period.key);
      return [...sem, data];
    });
    alert("Período salvo com sucesso!");
  };

  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  const updateGarcom = (id, field, val) => {
    setGdados(prev => ({ ...prev, [id]: { ...(prev[id] || { id }), id, [field]: val } }));
  };

  const periodoData = {
    ...period, gorjetaTotal: parseFloat(gorjetaTotal) || 0, extras: parseFloat(extras) || 0,
    funcionariosFaltas: Object.entries(faltas).map(([id, f]) => ({ id, faltas: parseFloat(f) || 0 })),
    garconsDados: Object.entries(gdados).map(([id, g]) => ({ id, ...g })),
    pctCusto: regras.pctCusto, pctProdAdm: regras.pctProdAdm,
  };
  const calc = calcPeriodo(periodoData, cargos, funcionarios, garcons, regras);

  return (
    <div>
      {/* Seleção de período */}
      <div style={{ ...S.card, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={S.btn()} onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}>‹</button>
          <span style={{ fontSize: 15, fontWeight: 600, minWidth: 140, textAlign: "center" }}>{meses[month]} {year}</span>
          <button style={S.btn()} onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}>›</button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {periods.map((p, i) => (
            <button key={p.key} style={{ ...S.btn(periodIdx === i ? "primary" : "default") }} onClick={() => setPeriodIdx(i)}>
              Período {i + 1}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: CORES.textSec }}>
          {period.label} · Pagamento: {fmtDate(period.pay)}
        </div>
      </div>

      {/* Cabeçalho */}
      <div style={S.card}>
        <div style={S.cardTitle}>Dados do período</div>
        <div style={S.grid2}>
          <Input label="Gorjeta total (R$)" value={gorjetaTotal} onChange={setGorjetaTotal} type="number" prefix="R$" />
          <Input label="Extras contratados (R$)" value={extras} onChange={setExtras} type="number" prefix="R$" />
        </div>
        <div style={S.grid4}>
          <Metric label="Custo" value={fmtBRL(calc.custo)} />
          <Metric label="Garçons" value={fmtBRL(calc.totalGarcons)} />
          <Metric label="Prod./Adm." value={fmtBRL(calc.totalProdAdm)} />
          <Metric label="Distribuição" value={fmtBRL(calc.totalDistribuicao)} />
        </div>
      </div>

      {/* Garçons */}
      <div style={S.card}>
        <div style={S.cardTitle}>Lançamento dos garçons</div>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Garçom</th>
                <th style={S.th}>Venda c/ gorjeta</th>
                <th style={S.th}>Gorjeta recebida</th>
                <th style={S.th}>Couvert</th>
                <th style={S.th}>Ticket médio</th>
                <th style={S.th}>Faltas</th>
                <th style={S.th}>Perda %</th>
                <th style={S.th}>A receber</th>
                <th style={S.th}>Bônus</th>
                <th style={S.th}>Total final</th>
                <th style={S.th}>Férias</th>
              </tr>
            </thead>
            <tbody>
              {garcons.filter(g => g.ativo).map(g => {
                const d = gdados[g.id] || {};
                const r = calc.resultGarcons.find(x => x.id === g.id) || {};
                return (
                  <tr key={g.id}>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={S.avatar(CORES.accentDim)}>{Initials(g.nome)}</div>
                        <span style={{ fontWeight: 500 }}>{g.nome}</span>
                      </div>
                    </td>
                    <td style={S.td}><input type="number" style={{ ...S.input, width: 110 }} value={d.vendaGorjeta || ""} onChange={e => updateGarcom(g.id, "vendaGorjeta", parseFloat(e.target.value) || 0)} placeholder="0,00" /></td>
                    <td style={S.td}><input type="number" style={{ ...S.input, width: 110 }} value={d.gorjetaRecebida || ""} onChange={e => updateGarcom(g.id, "gorjetaRecebida", parseFloat(e.target.value) || 0)} placeholder="0,00" /></td>
                    <td style={S.td}><input type="number" style={{ ...S.input, width: 100 }} value={d.couvert || ""} onChange={e => updateGarcom(g.id, "couvert", parseFloat(e.target.value) || 0)} placeholder="0,00" /></td>
                    <td style={S.td}><input type="number" style={{ ...S.input, width: 100 }} value={d.ticketMedio || ""} onChange={e => updateGarcom(g.id, "ticketMedio", parseFloat(e.target.value) || 0)} placeholder="0,00" /></td>
                    <td style={S.td}><input type="number" style={{ ...S.input, width: 70 }} value={d.faltas || ""} onChange={e => updateGarcom(g.id, "faltas", parseFloat(e.target.value) || 0)} placeholder="0" min="0" /></td>
                    <td style={S.td}>
                      <span style={{ color: r.perda < 1 ? CORES.green : r.perda < 2 ? CORES.amber : CORES.red, fontWeight: 600 }}>
                        {r.perda != null ? fmtPct(r.perda) : "—"}
                      </span>
                    </td>
                    <td style={S.td}>{r.aReceber != null ? fmtBRL(r.aReceber) : "—"}</td>
                    <td style={S.td}>
                      {r.qualificaBonus ? (
                        <div style={{ fontSize: 11 }}>
                          {r.bonusPerda > 0 && <div style={{ color: CORES.green }}>+{fmtBRL(r.bonusPerda)} perda</div>}
                          {r.bonusCouvert > 0 && <div style={{ color: CORES.amber }}>+{fmtBRL(r.bonusCouvert)} couvert</div>}
                          {r.bonusTicket > 0 && <div style={{ color: CORES.purple }}>+{fmtBRL(r.bonusTicket)} ticket</div>}
                          {r.bonusPerda === 0 && r.bonusCouvert === 0 && r.bonusTicket === 0 && <span style={{ color: CORES.textTer }}>—</span>}
                        </div>
                      ) : <span style={{ ...S.badge("red"), fontSize: 10 }}>{(d.faltas || 0) > 0 ? "c/ faltas" : "< venda mín."}</span>}
                    </td>
                    <td style={S.td}><span style={{ fontWeight: 700, color: CORES.accent }}>{r.totalFinal != null ? fmtBRL(r.totalFinal) : "—"}</span></td>
                    <td style={S.td}>
                      <input type="checkbox" checked={d.ferias || false} onChange={e => updateGarcom(g.id, "ferias", e.target.checked)} style={{ accentColor: CORES.accent }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Colaboradores */}
      <div style={S.card}>
        <div style={S.cardTitle}>Colaboradores — faltas</div>
        <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Nome</th>
              <th style={S.th}>Cargo</th>
              <th style={S.th}>Setor</th>
              <th style={S.th}>Pontos</th>
              <th style={S.th}>Faltas</th>
              <th style={S.th}>Desconto extras</th>
              <th style={S.th}>A receber</th>
              <th style={S.th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {calc.resultColabs.map(c => (
              <tr key={c.id}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={S.avatar(CORES.purple)}>{Initials(c.nome)}</div>
                    {c.nome}
                  </div>
                </td>
                <td style={S.td}>{c.cargo?.nome || "—"}</td>
                <td style={S.td}><span style={S.badge("gray")}>{c.cargo?.setor || "—"}</span></td>
                <td style={S.td}>{c.cargo?.pontos || 0}</td>
                <td style={S.td}>
                  <input type="number" style={{ ...S.input, width: 70 }} value={faltas[c.id] || ""} onChange={e => setFaltas(prev => ({ ...prev, [c.id]: e.target.value }))} placeholder="0" min="0" />
                </td>
                <td style={S.td}>{fmtBRL(c.descontoExtras)}</td>
                <td style={S.td}>{fmtBRL(c.aReceber)}</td>
                <td style={S.td}><span style={{ fontWeight: 700, color: CORES.accent }}>{fmtBRL(c.total)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <button style={{ ...S.btn("primary"), marginTop: 8 }} onClick={save}>💾 Salvar período</button>
    </div>
  );
}

function Funcionarios({ funcionarios, setFuncionarios, cargos }) {
  const [form, setForm] = useState({ nome: "", cargoId: cargos[0]?.id || "" });
  const [editId, setEditId] = useState(null);

  const salvar = () => {
    if (!form.nome.trim()) return;
    if (editId) {
      setFuncionarios(prev => prev.map(f => f.id === editId ? { ...f, ...form } : f));
      setEditId(null);
    } else {
      setFuncionarios(prev => [...prev, { id: "f" + Date.now(), ...form, ativo: true }]);
    }
    setForm({ nome: "", cargoId: cargos[0]?.id || "" });
  };

  const toggleAtivo = (id) => setFuncionarios(prev => prev.map(f => f.id === id ? { ...f, ativo: !f.ativo } : f));
  const editar = (f) => { setForm({ nome: f.nome, cargoId: f.cargoId }); setEditId(f.id); };

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>{editId ? "Editar funcionário" : "Novo funcionário"}</div>
        <div style={S.grid2}>
          <Input label="Nome completo" value={form.nome} onChange={v => setForm(p => ({ ...p, nome: v }))} />
          <div style={S.formGroup}>
            <label style={S.label}>Cargo</label>
            <select style={S.input} value={form.cargoId} onChange={e => setForm(p => ({ ...p, cargoId: e.target.value }))}>
              {cargos.filter(c => c.id !== "gc").map(c => <option key={c.id} value={c.id}>{c.nome} — {c.setor}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btn("primary")} onClick={salvar}>{editId ? "Salvar edição" : "Adicionar"}</button>
          {editId && <button style={S.btn()} onClick={() => { setEditId(null); setForm({ nome: "", cargoId: cargos[0]?.id || "" }); }}>Cancelar</button>}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Todos os colaboradores</div>
        <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Nome</th><th style={S.th}>Cargo</th><th style={S.th}>Setor</th><th style={S.th}>Pontos</th><th style={S.th}>Status</th><th style={S.th}></th>
          </tr></thead>
          <tbody>
            {funcionarios.map(f => {
              const cargo = cargos.find(c => c.id === f.cargoId);
              return (
                <tr key={f.id} style={{ opacity: f.ativo ? 1 : 0.4 }}>
                  <td style={S.td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={S.avatar(CORES.purple)}>{Initials(f.nome)}</div>{f.nome}</div></td>
                  <td style={S.td}>{cargo?.nome || "—"}</td>
                  <td style={S.td}><span style={S.badge("gray")}>{cargo?.setor || "—"}</span></td>
                  <td style={S.td}>{cargo?.pontos || 0}</td>
                  <td style={S.td}><span style={S.badge(f.ativo ? "green" : "red")}>{f.ativo ? "Ativo" : "Inativo"}</span></td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ ...S.btn(), fontSize: 11, padding: "4px 10px" }} onClick={() => editar(f)}>Editar</button>
                      <button style={{ ...S.btn(), fontSize: 11, padding: "4px 10px" }} onClick={() => toggleAtivo(f.id)}>{f.ativo ? "Desativar" : "Ativar"}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function Garcons({ garcons, setGarcons }) {
  const [form, setForm] = useState({ nome: "" });
  const [editId, setEditId] = useState(null);

  const salvar = () => {
    if (!form.nome.trim()) return;
    if (editId) {
      setGarcons(prev => prev.map(g => g.id === editId ? { ...g, ...form } : g));
      setEditId(null);
    } else {
      setGarcons(prev => [...prev, { id: "g" + Date.now(), ...form, ativo: true }]);
    }
    setForm({ nome: "" });
  };

  const toggleAtivo = (id) => setGarcons(prev => prev.map(g => g.id === id ? { ...g, ativo: !g.ativo } : g));
  const editar = (g) => { setForm({ nome: g.nome }); setEditId(g.id); };

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>{editId ? "Editar garçom" : "Novo garçom"}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Input label="Nome completo" value={form.nome} onChange={v => setForm(p => ({ ...p, nome: v }))} />
          </div>
          <div style={{ marginBottom: 14, display: "flex", gap: 8 }}>
            <button style={S.btn("primary")} onClick={salvar}>{editId ? "Salvar" : "Adicionar"}</button>
            {editId && <button style={S.btn()} onClick={() => { setEditId(null); setForm({ nome: "" }); }}>Cancelar</button>}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Todos os garçons</div>
        <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Nome</th><th style={S.th}>Status</th><th style={S.th}></th>
          </tr></thead>
          <tbody>
            {garcons.map(g => (
              <tr key={g.id} style={{ opacity: g.ativo ? 1 : 0.4 }}>
                <td style={S.td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={S.avatar(CORES.accent)}>{Initials(g.nome)}</div>{g.nome}</div></td>
                <td style={S.td}><span style={S.badge(g.ativo ? "green" : "red")}>{g.ativo ? "Ativo" : "Inativo"}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ ...S.btn(), fontSize: 11, padding: "4px 10px" }} onClick={() => editar(g)}>Editar</button>
                    <button style={{ ...S.btn(), fontSize: 11, padding: "4px 10px" }} onClick={() => toggleAtivo(g.id)}>{g.ativo ? "Desativar" : "Ativar"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function Regras({ regras, setRegras }) {
  const up = (field, val) => setRegras(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));

  return (
    <div>
      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Percentuais da gorjeta</div>
          <Input label="% Custo" value={regras.pctCusto} onChange={v => up("pctCusto", v)} type="number" suffix="%" />
          <Input label="% Produção / Administrativo" value={regras.pctProdAdm} onChange={v => up("pctProdAdm", v)} type="number" suffix="%" />
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Condição mínima para bônus</div>
          <Input label="Venda mínima com gorjeta (R$)" value={regras.vendaMinimaBonus} onChange={v => up("vendaMinimaBonus", v)} type="number" prefix="R$" />
          <div style={{ fontSize: 12, color: CORES.textSec, lineHeight: 1.6, padding: "8px 0" }}>
            Para receber qualquer bônus, o garçom precisa atingir esta venda mínima <strong>e</strong> ter zero faltas no período. Sem atender aos dois critérios, nenhum bônus (perda, couvert ou ticket) é aplicado.
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Bônus por perda de gorjeta</div>
          <Input label="Bônus — perda abaixo de 2%" value={regras.bonusPerda2} onChange={v => up("bonusPerda2", v)} type="number" prefix="R$" />
          <Input label="Bônus — perda abaixo de 1%" value={regras.bonusPerda1} onChange={v => up("bonusPerda1", v)} type="number" prefix="R$" />
          <Input label="Bônus — maior couvert do período" value={regras.bonusCouvert} onChange={v => up("bonusCouvert", v)} type="number" prefix="R$" />
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Bônus por ticket médio</div>
          <Input label="Faixa 1 — ticket a partir de (R$)" value={regras.ticketFaixa1} onChange={v => up("ticketFaixa1", v)} type="number" prefix="R$" />
          <Input label="Bônus faixa 1" value={regras.bonusTicket1} onChange={v => up("bonusTicket1", v)} type="number" prefix="R$" />
          <div style={S.divider} />
          <Input label="Faixa 2 — ticket a partir de (R$)" value={regras.ticketFaixa2} onChange={v => up("ticketFaixa2", v)} type="number" prefix="R$" />
          <Input label="Bônus faixa 2" value={regras.bonusTicket2} onChange={v => up("bonusTicket2", v)} type="number" prefix="R$" />
          <div style={S.divider} />
          <Input label="Faixa 3 — ticket a partir de (R$)" value={regras.ticketFaixa3} onChange={v => up("ticketFaixa3", v)} type="number" prefix="R$" />
          <Input label="Bônus faixa 3" value={regras.bonusTicket3} onChange={v => up("bonusTicket3", v)} type="number" prefix="R$" />
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

const SCREENS = [
  { id: "dashboard", label: "Dashboard", icon: "◈", section: "Principal" },
  { id: "lancamento", label: "Lançamento", icon: "✦", section: "Principal" },
  { id: "garcons", label: "Garçons", icon: "◉", section: "Equipe" },
  { id: "funcionarios", label: "Colaboradores", icon: "◎", section: "Equipe" },
  { id: "regras", label: "Regras e bônus", icon: "◇", section: "Config." },
];

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [periodos, setPeriodos] = useStorage("gorjeta_periodos", []);
  const [funcionarios, setFuncionarios] = useStorage("gorjeta_funcionarios", INITIAL_FUNCIONARIOS);
  const [garcons, setGarcons] = useStorage("gorjeta_garcons", INITIAL_GARCONS);
  const [cargos] = useState(INITIAL_CARGOS);
  const [regras, setRegras] = useStorage("gorjeta_regras", INITIAL_REGRAS);

  const sections = [...new Set(SCREENS.map(s => s.section))];

  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(false);
  const go = (id) => { setScreen(id); setNavOpen(false); };

  const screenProps = { periodos, setPeriodos, cargos, funcionarios, setFuncionarios, garcons, setGarcons, regras, setRegras };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {isMobile && navOpen && <div style={S.backdrop} onClick={() => setNavOpen(false)} />}

      <div style={{ ...S.sidebar, ...(isMobile ? S.sidebarMobile(navOpen) : {}) }}>
        <div style={S.sidebarHeader}>
          <div style={S.logo}>Gorjeta</div>
          <div style={S.logoSub}>Sudoeste · Gestão de comissão</div>
        </div>
        {sections.map(sec => (
          <div key={sec}>
            <div style={S.navSection}>{sec}</div>
            {SCREENS.filter(s => s.section === sec).map(s => (
              <div key={s.id} style={S.navItem(screen === s.id)} onClick={() => go(s.id)}>
                <span>{s.icon}</span> {s.label}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={S.main}>
        <div style={{ ...S.topbar, ...(isMobile ? { padding: "12px 16px" } : {}) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            {isMobile && (
              <button style={S.hamburger} onClick={() => setNavOpen(true)} aria-label="Abrir menu">☰</button>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={S.topbarTitle}>{SCREENS.find(s => s.id === screen)?.label}</div>
              <div style={S.topbarSub}>
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>
        <div style={{ ...S.content, ...(isMobile ? { padding: 16 } : {}) }}>
          {screen === "dashboard" && <Dashboard {...screenProps} />}
          {screen === "lancamento" && <LancamentoPeriodo {...screenProps} />}
          {screen === "garcons" && <Garcons {...screenProps} />}
          {screen === "funcionarios" && <Funcionarios {...screenProps} />}
          {screen === "regras" && <Regras {...screenProps} />}
        </div>
      </div>
    </div>
  );
}
