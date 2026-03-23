# 🦠 COVID-19 Impact and Recovery Analyzer

An interactive data dashboard examining four dimensions of COVID-19 impact across seven countries: mortality trends and data quality, vaccination rollout, healthcare system strain, and economic impact and recovery.

**Live Demo:** [View Dashboard](#) 

---

## Why I Built This

I spent a decade working in healthcare data at two of the largest health insurers in America. When COVID hit, I watched the data in real time and knew immediately that the reported numbers were not telling the full story. Healthcare systems that are underfunded and understaffed in normal times do not suddenly perform well in a crisis. COVID did not create these vulnerabilities. It revealed them.

This project puts those instincts into a structured analysis across seven countries, looking at what the data actually says versus what was reported.

---

## What It Shows

| Indicator | Source | Coverage |
|---|---|---|
| Cumulative deaths per million | Our World in Data | 7 countries, 2020 to 2022 |
| Reported deaths vs excess mortality | Our World in Data / WHO | 7 countries, ~2022 |
| Vaccination coverage | Our World in Data | 7 countries, mid-2022 |
| Peak ICU occupancy | WHO / national health ministries | 7 countries, worst wave |
| GDP contraction and recovery | IMF World Economic Outlook | 7 countries, 2020 to 2021 |

### Dashboard Tabs

**Mortality** — cumulative death trends over time plus a comparison of reported COVID deaths versus excess mortality estimates. India's official count is roughly 380 per million. Excess mortality estimates put it closer to 2,100.

**Vaccination** — coverage rates by mid-2022, with India as a notable outlier despite being the world's largest vaccine manufacturer.

**Economy** — 2020 GDP contraction and 2021 recovery side by side. The relationship between pandemic severity and economic damage is messier than it looks.

**Healthcare** — peak ICU occupancy during each country's worst wave. India hit 95% during the Delta wave. Japan never exceeded 41%.

**Analysis** — a written analysis connecting the data to healthcare system design, data quality as a health equity issue, and what working in healthcare data for a decade means for how you read these numbers.

---

## Key Findings

1. Most countries undercounted COVID deaths. Countries with weaker vital registration systems undercounted the most. The data gap and the care gap point in the same direction.

2. Vaccination coverage and mortality outcomes are not perfectly correlated. Timing mattered as much as coverage.

3. Healthcare system capacity was the deciding factor at the worst moments. Years of prior investment either paid off or did not.

4. Economic recovery did not follow health outcomes. Japan had among the lowest death tolls but the weakest economic recovery in 2021.

---

## Tech Stack

- **React** with Vite
- **Recharts** for all data visualizations
- **CSS-in-JS** — no external frameworks
- Deployed on **Vercel**

---

## Data Sources

- [Our World in Data COVID-19 Dataset](https://ourworldindata.org/covid-deaths)
- [WHO Global Health Observatory](https://www.who.int/data/gho)
- [IMF World Economic Outlook](https://www.imf.org/en/Publications/WEO)
- [World Bank Development Indicators](https://databank.worldbank.org)

All figures reference 2020 to mid-2022.

---

## About

Built by **Emina Toric** — data professional with a background in computer science, human development, and a decade of healthcare analytics.

[Portfolio](https://eminatoric.github.io) · [LinkedIn](https://linkedin.com/in/emina-toric-msc) · [GitHub](https://github.com/EminaToric)
