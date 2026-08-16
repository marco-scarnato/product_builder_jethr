# Architettura Tecnica Frontend

## 1. Principi Guida
1. **Zero Backend (Standalone Web App)**: Tutto il calcolo e la logica risiedono sul client per massima reattività e privacy.
2. **Separazione Netta tra Core Engine e UI**:
   - Il motore di calcolo è puro TypeScript (`src/core/tax-engine/`), privo di dipendenze React o browser APIs.
   - Ogni funzione di calcolo è deterministica, immutabile e testabile con facilità.
3. **Design System & UX "Jet HR Style"**:
   - Palette raffinata (Dark mode elegante / Light mode moderno con contrasti puliti e accenti vibranti).
   - Componenti modulari e accessibili.
   - Feedback visivo immediato al variare della RAL (senza lag).

---

## 2. Struttura del Progetto

```
src/
├── core/                       # Motore logico puro (agnostico da React)
│   ├── tax-engine/
│   │   ├── types.ts            # Tipi per input/output del calcolo fiscale
│   │   ├── constants.ts        # Aliquote INPS, scaglioni IRPEF, addizionali Milano/Lombardia
│   │   ├── inps.ts             # Calcolo contributi previdenziali IVS
│   │   ├── irpef.ts            # Calcolo IRPEF lorda e detrazioni lavoro dipendente
│   │   ├── additions.ts        # Calcolo addizionale regionale e comunale
│   │   └── index.ts            # Funzione unificata: calculateNetSalary()
│   └── test/                   # Validazioni e scenari di test
│
├── components/                 # Componenti React
│   ├── ui/                     # Componenti atomici riutilizzabili (Button, Card, Slider, Tooltip, Badge, Table)
│   ├── layout/                 # Header, Footer, Hero Section
│   ├── calculator/             # Form di input RAL, mensilità, toggle
│   ├── breakdown/              # Visualizzazione waterfall/cards delle trattenute fiscali
│   ├── paycheck/               # Simulatore cedolino / busta paga mensile
│   └── methodology/            # Modal/Drawer con spiegazione step-by-step dei calcoli
│
├── utils/                      # Helper di formattazione (valuta EUR, percentuali, cn per Tailwind)
│   └── formatters.ts
│   └── cn.ts
│
├── types/                      # Tipi globali dell'applicazione
│
├── App.tsx                     # Entrypoint dell'applicazione
├── main.tsx                    # Bootstrap Vite + React
└── index.css                   # Tailwind base & custom utilities
```

---

## 3. Flusso dei Dati
```
[User Input: RAL, Mensilità]
         │
         ▼
[Tax Engine: calculateNetSalary()]
         │
         ├── INPS Calculator ────► Trattenute INPS & Imponibile Fiscale
         ├── IRPEF Calculator ───► IRPEF Lorda, Detrazioni, IRPEF Netta
         └── Addizionali ────────► Addizionale Regionale & Addizionale Comunale
         │
         ▼
[Output Structure: TaxBreakdownResult]
         │
         ├── Summary Cards (Netto Annuo, Netto Mensile, Trattenute Totali)
         ├── Interactive Charts / Waterfall (Visual Breakdown)
         ├── Paycheck Preview (Dettaglio Busta Paga 13/14 mensilità)
         └── Methodology Drawer (Dettaglio formule e aliquote)
```
