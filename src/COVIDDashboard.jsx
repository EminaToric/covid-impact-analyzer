import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";

// ── DATA (Our World in Data / WHO published figures) ──────────────────────────

// Case and mortality trends (cumulative deaths per million, selected countries)
const MORTALITY_TRENDS = [
  { month: "Mar 20", USA: 1, UK: 2, Italy: 28, Germany: 1, Brazil: 0, India: 0, Japan: 0 },
  { month: "Jun 20", USA: 124, UK: 198, Italy: 346, Germany: 47, Brazil: 89, India: 8, Japan: 4 },
  { month: "Sep 20", USA: 195, UK: 215, Italy: 379, Germany: 56, Brazil: 230, India: 56, Japan: 7 },
  { month: "Dec 20", USA: 503, UK: 470, Italy: 680, Germany: 175, Brazil: 421, India: 108, Japan: 16 },
  { month: "Mar 21", USA: 810, UK: 762, Italy: 917, Germany: 429, Brazil: 867, India: 125, Japan: 28 },
  { month: "Jun 21", USA: 985, UK: 781, Italy: 1024, Germany: 510, Brazil: 1589, India: 268, Japan: 45 },
  { month: "Sep 21", USA: 1458, UK: 906, Italy: 1098, Germany: 564, Brazil: 2079, India: 330, Japan: 84 },
  { month: "Dec 21", USA: 1947, UK: 1091, Italy: 1294, Germany: 794, Brazil: 2390, India: 370, Japan: 95 },
  { month: "Mar 22", USA: 2679, UK: 1544, Italy: 1830, Germany: 1141, Brazil: 2803, India: 382, Japan: 149 },
  { month: "Jun 22", USA: 2986, UK: 1873, Italy: 2282, Germany: 1418, Brazil: 3029, India: 387, Japan: 296 },
];

// Vaccination rollout (% population fully vaccinated by mid-2022)
const VACCINATION = [
  { country: "Japan", rate: 79.8, color: "#7AA0B8" },
  { country: "UK", rate: 73.1, color: "#7A8C72" },
  { country: "Germany", rate: 75.6, color: "#8A9E88" },
  { country: "USA", rate: 67.2, color: "#C4908A" },
  { country: "Italy", rate: 79.4, color: "#B8A898" },
  { country: "Brazil", rate: 79.1, color: "#D4896A" },
  { country: "India", rate: 44.2, color: "#C4714A" },
];

// Healthcare system strain (ICU occupancy peak % during worst wave)
const ICU_STRAIN = [
  { country: "Italy", peak: 92, wave: "Spring 2020" },
  { country: "USA", peak: 78, wave: "Winter 2020" },
  { country: "Brazil", peak: 88, wave: "Spring 2021" },
  { country: "UK", peak: 71, wave: "Winter 2020" },
  { country: "Germany", peak: 64, wave: "Winter 2020" },
  { country: "India", peak: 95, wave: "Spring 2021" },
  { country: "Japan", peak: 41, wave: "Summer 2021" },
];

// Economic impact (GDP growth % 2020 vs pre-pandemic trend)
const ECONOMIC = [
  { country: "India", gdp2020: -6.6, recovery2021: 8.9 },
  { country: "Italy", gdp2020: -8.9, recovery2021: 6.6 },
  { country: "UK", gdp2020: -9.4, recovery2021: 7.5 },
  { country: "Brazil", gdp2020: -3.9, recovery2021: 4.6 },
  { country: "Germany", gdp2020: -3.7, recovery2021: 2.9 },
  { country: "USA", gdp2020: -2.8, recovery2021: 5.9 },
  { country: "Japan", gdp2020: -4.1, recovery2021: 1.7 },
];

// Excess mortality vs reported COVID deaths (% difference — positive = undercounting)
const EXCESS_MORTALITY = [
  { country: "India", reported: 382, excess: 2100, gap: 450 },
  { country: "Brazil", reported: 3029, excess: 4200, gap: 39 },
  { country: "USA", reported: 2986, excess: 3400, gap: 14 },
  { country: "Italy", reported: 2282, excess: 2650, gap: 16 },
  { country: "UK", reported: 1873, excess: 2100, gap: 12 },
  { country: "Germany", reported: 1418, excess: 1750, gap: 23 },
  { country: "Japan", reported: 296, excess: 280, gap: -5 },
];

// Key stats
const STATS = [
  {
    icon: "📊",
    stat: "6.9M",
    label: "Reported deaths globally",
    detail: "The official WHO count as of mid-2022. Excess mortality estimates suggest the real number is two to three times higher."
  },
  {
    icon: "💉",
    stat: "12B+",
    label: "Vaccine doses administered",
    detail: "More vaccine doses were delivered in two years than in any prior decade. But access was deeply unequal."
  },
  {
    icon: "📉",
    stat: "$28T",
    label: "Global economic loss",
    detail: "The IMF estimated cumulative global output losses from COVID at roughly $28 trillion between 2020 and 2025."
  },
  {
    icon: "🏥",
    stat: "95%",
    label: "Peak ICU occupancy",
    detail: "India's ICU system hit near-total capacity during the Delta wave in spring 2021, forcing painful triage decisions."
  },
];

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F7F3EE;
    --sand: #EDE4D8;
    --white: #FDFAF7;
    --terracotta: #C4714A;
    --terra-light: #D4896A;
    --terra-pale: #F0DDD3;
    --sage: #7A8C72;
    --sage-pale: #DDE4DA;
    --blush: #C4908A;
    --blush-pale: #F5EAE8;
    --gold: #C8A86A;
    --gold-pale: #F5EDDA;
    --sky: #7AA0B8;
    --sky-pale: #E0EDF5;
    --ink: #1E1B18;
    --ink-light: #4A4540;
    --ink-faint: #9A9088;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
  }

  .cv-root {
    max-width: 1080px;
    margin: 0 auto;
    padding: 2.5rem 2rem 5rem;
  }

  .cv-header {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(196,113,74,0.15);
  }

  .cv-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--terracotta);
    margin-bottom: 0.6rem;
  }

  .cv-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    font-weight: 400;
    line-height: 1.2;
    color: var(--ink);
    margin-bottom: 0.6rem;
  }

  .cv-title em { font-style: italic; color: var(--terracotta); }

  .cv-subtitle {
    font-size: 0.88rem;
    color: var(--ink-faint);
    max-width: 600px;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  .cv-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .cv-meta-item {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  .cv-meta-item span { color: var(--sage); }

  /* Stats */
  .cv-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.06);
    margin-bottom: 2.5rem;
  }

  .cv-stat {
    background: var(--white);
    padding: 1.5rem;
    transition: background 0.2s;
  }

  .cv-stat:hover { background: var(--cream); }
  .cv-stat-icon { font-size: 1.2rem; margin-bottom: 0.6rem; }

  .cv-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--terracotta);
    line-height: 1;
    margin-bottom: 0.2rem;
  }

  .cv-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 0.5rem;
  }

  .cv-stat-detail {
    font-size: 0.75rem;
    color: var(--ink-faint);
    line-height: 1.55;
  }

  /* Tabs */
  .cv-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .cv-tab {
    padding: 0.6rem 1.25rem;
    background: var(--white);
    border: 1.5px solid rgba(0,0,0,0.1);
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--ink-faint);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .cv-tab:hover {
    border-color: var(--terracotta);
    color: var(--terracotta);
    background: var(--terra-pale);
  }

  .cv-tab.active {
    background: var(--terracotta);
    border-color: var(--terracotta);
    color: white;
    box-shadow: 0 3px 10px rgba(196,113,74,0.25);
  }

  /* Section */
  .cv-section { animation: fadeUp 0.35s ease; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cv-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 0.3rem;
  }

  .cv-section-desc {
    font-size: 0.8rem;
    color: var(--ink-faint);
    line-height: 1.65;
    max-width: 600px;
    margin-bottom: 1.25rem;
  }

  .cv-chart-box {
    background: var(--white);
    border: 1px solid rgba(0,0,0,0.07);
    padding: 1.5rem 1.5rem 0.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  }

  .cv-chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* Writeup */
  .cv-writeup {
    background: var(--white);
    border: 1px solid rgba(0,0,0,0.07);
    border-left: 3px solid var(--terracotta);
    padding: 2rem 2.5rem;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  }

  .cv-writeup-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--terracotta);
    margin-bottom: 0.75rem;
  }

  .cv-writeup h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--ink);
    line-height: 1.3;
    margin-bottom: 1rem;
  }

  .cv-writeup p {
    font-size: 0.87rem;
    color: var(--ink-light);
    line-height: 1.85;
    margin-bottom: 1rem;
  }

  .cv-writeup p:last-child { margin-bottom: 0; }
  .cv-writeup strong { color: var(--ink); font-weight: 500; }

  .cv-findings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.25rem 0;
  }

  .cv-finding {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    background: var(--cream);
    border: 1px solid rgba(0,0,0,0.06);
  }

  .cv-finding-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--terracotta);
    line-height: 1;
    flex-shrink: 0;
    width: 1.75rem;
  }

  .cv-finding p {
    margin: 0;
    font-size: 0.84rem;
    color: var(--ink-light);
    line-height: 1.7;
  }

  .cv-source-bar {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 2rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(0,0,0,0.07);
  }

  .cv-source {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  .cv-source span { color: var(--sage); }

  .cv-tooltip {
    background: var(--white);
    border: 1px solid rgba(0,0,0,0.1);
    padding: 0.65rem 0.9rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }

  .cv-tooltip-label {
    font-size: 0.68rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 0.2rem;
  }

  .cv-tooltip-val {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: var(--terracotta);
  }

  @media (max-width: 700px) {
    .cv-stats { grid-template-columns: 1fr 1fr; }
    .cv-chart-grid { grid-template-columns: 1fr; }
    .cv-root { padding: 1.5rem 1rem 4rem; }
  }
`;

// ── Tooltip ───────────────────────────────────────────────────────────────────

const Tip = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="cv-tooltip">
      <p className="cv-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="cv-tooltip-val" style={{ color: p.color || "#C4714A", fontSize: payload.length > 2 ? "0.85rem" : "1.1rem" }}>
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}{unit}
          <span style={{ fontSize: "0.68rem", color: "#9A9088", marginLeft: "0.3rem" }}>{p.name}</span>
        </p>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

const TABS = ["Mortality", "Vaccination", "Economy", "Healthcare", "Analysis"];

export default function COVIDDashboard() {
  const [tab, setTab] = useState("Mortality");

  return (
    <>
      <style>{styles}</style>
      <div className="cv-root">

        <div className="cv-header">
          <p className="cv-eyebrow">COVID-19 Impact and Recovery · Our World in Data / WHO Analysis</p>
          <h1 className="cv-title">
            A pandemic that exposed every<br /><em>crack in the system.</em>
          </h1>
          <p className="cv-subtitle">
            I looked at four dimensions of COVID impact across seven countries: how mortality actually compared to what was reported, how vaccination rollout played out, what it did to healthcare systems at their worst moments, and what the economic damage looked like. Here is what the data shows.
          </p>
          <div className="cv-meta">
            <span className="cv-meta-item">Sources <span>Our World in Data · WHO · IMF · World Bank</span></span>
            <span className="cv-meta-item">Period <span>2020 to 2022</span></span>
            <span className="cv-meta-item">Countries <span>7 selected</span></span>
            <span className="cv-meta-item">Built by <span>Emina Toric</span></span>
          </div>
        </div>

        <div className="cv-stats">
          {STATS.map((s, i) => (
            <div key={i} className="cv-stat">
              <div className="cv-stat-icon">{s.icon}</div>
              <div className="cv-stat-num">{s.stat}</div>
              <div className="cv-stat-label">{s.label}</div>
              <p className="cv-stat-detail">{s.detail}</p>
            </div>
          ))}
        </div>

        <div className="cv-tabs">
          {TABS.map(t => (
            <button key={t} className={`cv-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Mortality */}
        {tab === "Mortality" && (
          <div className="cv-section">
            <h3 className="cv-section-title">Cumulative Deaths per Million over Time</h3>
            <p className="cv-section-desc">Reported COVID deaths per million people across seven countries from March 2020 through mid-2022. The divergence between countries tells a story about healthcare capacity, policy response, and how honestly deaths were being counted.</p>
            <div className="cv-chart-box">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={MORTALITY_TRENDS} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: "Deaths per million", angle: -90, position: "insideLeft", fill: "#9A9088", fontSize: 11 }} />
                  <Tooltip content={<Tip unit="" />} />
                  <Legend wrapperStyle={{ fontSize: "0.78rem", color: "#4A4540", paddingTop: "1rem" }} />
                  <Line type="monotone" dataKey="USA" stroke="#C4714A" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="UK" stroke="#7A8C72" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Italy" stroke="#C4908A" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Germany" stroke="#8A9E88" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Brazil" stroke="#D4896A" strokeWidth={2.5} dot={false} strokeDasharray="5 2" />
                  <Line type="monotone" dataKey="India" stroke="#B8A898" strokeWidth={2} dot={false} strokeDasharray="3 2" />
                  <Line type="monotone" dataKey="Japan" stroke="#7AA0B8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <h3 className="cv-section-title">Reported Deaths vs Excess Mortality</h3>
            <p className="cv-section-desc">Excess mortality is the difference between how many people actually died versus how many would have died in a normal year. In India, excess mortality estimates run more than four times the official COVID death count. Japan is the only country where reported and excess mortality are roughly aligned.</p>
            <div className="cv-chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={EXCESS_MORTALITY} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="country" tick={{ fill: "#4A4540", fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip unit=" per million" />} />
                  <Legend wrapperStyle={{ fontSize: "0.78rem", paddingTop: "0.5rem" }} />
                  <Bar dataKey="reported" name="Reported COVID deaths" fill="#C4908A" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="excess" name="Excess mortality estimate" fill="#C4714A" radius={[0, 3, 3, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Vaccination */}
        {tab === "Vaccination" && (
          <div className="cv-section">
            <h3 className="cv-section-title">Population Fully Vaccinated by Mid-2022</h3>
            <p className="cv-section-desc">India's vaccination rate sits well below every other country in this analysis despite being the world's largest vaccine manufacturer. Supply was not the problem. Getting doses to people was.</p>
            <div className="cv-chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={VACCINATION} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                  <YAxis type="category" dataKey="country" tick={{ fill: "#4A4540", fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip unit="%" />} />
                  <Bar dataKey="rate" name="Fully vaccinated" radius={[0, 3, 3, 0]}>
                    {VACCINATION.map((v, i) => (
                      <rect key={i} fill={v.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Economy */}
        {tab === "Economy" && (
          <div className="cv-section">
            <h3 className="cv-section-title">GDP Impact in 2020 and Recovery in 2021</h3>
            <p className="cv-section-desc">Every country contracted in 2020. The UK took the hardest hit among these seven. Japan recovered the least in 2021 despite having among the lowest death tolls, showing that economic recovery and health outcomes do not always move together.</p>
            <div className="cv-chart-box">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={ECONOMIC} margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="country" tick={{ fill: "#4A4540", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<Tip unit="%" />} />
                  <Legend wrapperStyle={{ fontSize: "0.78rem", paddingTop: "0.5rem" }} />
                  <Bar dataKey="gdp2020" name="GDP growth 2020" fill="#C4714A" radius={[3, 3, 0, 0]} opacity={0.8} />
                  <Bar dataKey="recovery2021" name="GDP growth 2021" fill="#7A8C72" radius={[3, 3, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Healthcare strain */}
        {tab === "Healthcare" && (
          <div className="cv-section">
            <h3 className="cv-section-title">Peak ICU Occupancy During Worst Wave</h3>
            <p className="cv-section-desc">How close each country's ICU system came to collapse at its worst point. India hit 95% during the Delta wave. Japan never exceeded 41%. The difference is not just luck. It is infrastructure, preparation, and population behavior.</p>
            <div className="cv-chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ICU_STRAIN} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                  <YAxis type="category" dataKey="country" tick={{ fill: "#4A4540", fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip unit="%" />} />
                  <Bar dataKey="peak" name="Peak ICU occupancy" fill="#C4714A" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Analysis */}
        {tab === "Analysis" && (
          <div className="cv-section">
            <div className="cv-writeup">
              <p className="cv-writeup-label">Analysis · Emina Toric</p>
              <h2>What COVID exposed about health systems, data quality, and who gets left behind</h2>

              <p>
                I looked at four dimensions of COVID impact across seven countries: mortality trends and how honest the counts were, vaccination rollout, what the pandemic did to healthcare systems at their peak, and the economic damage and recovery. Seven countries is a small sample but it covers enough variation in income level, health system design, and government response to say something meaningful.
              </p>

              <p>
                The thing that stands out most is not the death toll. It is how much we still do not know about the death toll. Excess mortality analysis consistently shows that reported COVID deaths undercounted the real number in most countries. <strong>India's official count is roughly 380 deaths per million. Excess mortality estimates put the real number closer to 2,100.</strong> That is not a rounding error. That is a fundamentally different picture of what happened.
              </p>

              <div className="cv-findings">
                <div className="cv-finding">
                  <span className="cv-finding-num">01</span>
                  <p><strong>Data quality is a health equity issue.</strong> Countries with weaker vital registration systems systematically undercounted COVID deaths. The countries that most undercounted were also the ones with the least healthcare capacity. The data gap and the care gap point in the same direction.</p>
                </div>
                <div className="cv-finding">
                  <span className="cv-finding-num">02</span>
                  <p><strong>Vaccination coverage and mortality outcomes are not perfectly correlated.</strong> Brazil vaccinated 79% of its population but still had among the highest death tolls. The Delta and Omicron waves hit before vaccines reached enough people in time. Timing mattered as much as coverage.</p>
                </div>
                <div className="cv-finding">
                  <span className="cv-finding-num">03</span>
                  <p><strong>Healthcare system capacity was the deciding factor at the worst moments.</strong> India's ICU system hit 95% during the Delta wave. Japan never exceeded 41%. The gap is not explained by case counts alone. It comes down to beds, staff, equipment, and the years of investment that either happened or did not.</p>
                </div>
                <div className="cv-finding">
                  <span className="cv-finding-num">04</span>
                  <p><strong>Economic recovery did not follow health outcomes.</strong> Japan had one of the lowest death tolls but the weakest economic recovery in 2021. The UK took the largest GDP hit in 2020 but recovered strongly. The relationship between pandemic severity and economic damage is messier than it looks.</p>
                </div>
              </div>

              <p>
                Working in healthcare data for a decade means I read this analysis differently than someone coming to it fresh. The excess mortality gap in India is not surprising to me. Health systems that are underfunded and understaffed in normal times do not suddenly perform well in a crisis. COVID did not create these vulnerabilities. It revealed them.
              </p>

              <p>
                Data sources: Our World in Data COVID-19 dataset, WHO Global Health Observatory, IMF World Economic Outlook, World Bank Development Indicators. All figures reference 2020 to mid-2022.
              </p>
            </div>
          </div>
        )}

        <div className="cv-source-bar">
          <span className="cv-source">Source <span>Our World in Data</span></span>
          <span className="cv-source">Source <span>WHO Global Health Observatory</span></span>
          <span className="cv-source">Source <span>IMF World Economic Outlook</span></span>
          <span className="cv-source">Source <span>World Bank Development Indicators</span></span>
          <span className="cv-source">Built by <span>Emina Toric · eminatoric.github.io</span></span>
        </div>

      </div>
    </>
  );
}
