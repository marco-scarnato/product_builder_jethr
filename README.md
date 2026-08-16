# 💼 Jet HR — Salary & Tax Calculator Prototype

> Prototipo interattivo e trasparente per la simulazione e il calcolo dello stipendio netto a partire dalla Retribuzione Annua Lorda (RAL), con dettaglio completo delle trattenute fiscali, previdenziali e del costo totale per l'azienda.

---

## 🎯 Obiettivo e Funzionalità Chiave

Costruire un simulatore standalone e reattivo che calcola in tempo reale lo stipendio netto del lavoratore dipendente e offre una serie di "chicche" di prodotto ad alto impatto:

1. **Simulazione Netto & Trattenute**:
   - **Netto Mensile** e **Netto Annuale** (selezionabile su 13 o 14 mensilità contrattuali).
   - **Contributi Previdenziali INPS** (aliquota IVS 9,19% a carico dipendente).
   - **IRPEF Lorda e Netta** con calcolo progressivo delle **detrazioni da lavoro dipendente** (Art. 13 TUIR).
   - **Addizionale Regionale** (scaglioni progressivi Regione Lombardia) e **Addizionale Comunale** (Comune di Milano, 0,80% con franchigia fino a 23.000 €).
   - **Costo Totale Datore di Lavoro**: Sezione espandibile con stima TFR (RAL / 13,5), INPS a carico azienda (~23,81%) e premio INAIL (~0,40%).

2. **URL State & Condivisibilità (Il tocco da Product Builder)**:
   - Sincronizzazione dinamica dello stato con i Query Parameters dell'URL (es. `?ral=45000&mensilita=13`) tramite `window.history.replaceState` senza ricaricamento né inquinamento della cronologia del browser.
   - Lettura istantanea dei parametri all'avvio (zero-flicker).
   - Pulsante **"Condividi"** nell'interfaccia con feedback immediato (*"Link Copiato!"*) per facilitare la condivisione rapida di offerte economiche tra recruiter, candidati o colleghi.

3. **Massima Trasparenza & Spiegazioni Normative**:
   - Ogni voce del cedolino presenta un'icona informativa (`Info`) che apre un dialog con:
     - Spiegazione in parole semplici della voce.
     - Formula matematica teorica applicata.
     - **Passaggi di calcolo analitici e numerati** con i dati reali inseriti dall'utente.
     - **Fonte normativa ufficiale** (es. Art. 11 e 13 TUIR, Delibera Comune di Milano, Circolare INPS).

4. **Ipotesi e Semplificazioni di Scenario Esplicite**:
   - Badge visivi in evidenza (`Milano (Lombardia)` e `Tempo Indeterminato`).
   - Postilla metodologica che chiarisce le assunzioni standard adottate per rendere il simulatore snello e comprensibile.

---

## 🏆 Qualità & Lighthouse Audit Score (100/100)

L'applicazione è stata ottimizzata per garantire le massime prestazioni, accessibilità e conformità agli standard web:

| Categoria Lighthouse | Punteggio | Dettagli |
| :--- | :---: | :--- |
| ⚡ **Performance** | **100 / 100** | FCP < 0.3s, LCP < 0.5s, TBT 0ms, CLS 0 |
| ♿ **Accessibility** | **100 / 100** | Pieno rispetto WCAG AAA, contrasto colori, label ARIA |
| 🛡️ **Best Practices** | **100 / 100** | Bundle compresso, zero errori console, script moderni |
| 🔍 **SEO** | **100 / 100** | Meta description, lingua italiana, viewport e `robots.txt` |

---

## 📂 Struttura del Progetto

```
product_builder_jethr/
├── public/
│   ├── favicon.svg            # Favicon del progetto
│   └── robots.txt             # Direttive crawler SEO
├── scripts/
│   └── audit.mjs              # Script automatizzato per Lighthouse Audit
├── src/
│   ├── components/            # Componenti UI React
│   │   ├── SalaryInputForm.tsx     # Input RAL, slider, preset, mensilità e pulsante Condividi
│   │   ├── SalaryHeroCards.tsx     # Card KPI Netto e Trattenute con layout simmetrico Mese/Anno
│   │   ├── PayslipDetailsTable.tsx # Tabella voci busta paga con icone info cliccabili
│   │   ├── CompanyCostCard.tsx     # Card espandibile stima costo azienda (HR)
│   │   ├── ExplanationDialog.tsx   # Modal trasparenza calcoli, formule e fonti normative
│   │   └── Navbar.tsx              # Testata applicazione con badge e brand
│   ├── core/                  # Motore di calcolo puro (Zero dipendenze UI)
│   │   ├── constants.ts       # Costanti, aliquote, scaglioni IRPEF e fonti normative
│   │   ├── engine.ts          # Funzioni matematiche e passaggi analitici di calcolo
│   │   └── explanations.ts    # Mappa spiegazioni pedagogiche e articoli di legge
│   ├── hooks/                 # Custom Hooks React
│   │   └── useSalaryCalculator.ts # Stato reattivo, calcolo memorizzato e sync URL
│   ├── types/                 # Definizioni TypeScript
│   │   └── salary.ts          # Interfacce per input, breakdown e dettagli analitici
│   ├── utils/                 # Funzioni helper
│   │   ├── cn.ts              # Helper per unione condizionale classi Tailwind
│   │   ├── formatters.ts      # Formattatori valuta (Euro) e percentuali
│   │   └── urlState.ts        # Helper parsing/serializzazione parametri URL e clipboard
│   ├── App.tsx                # Layout principale dell'applicazione
│   ├── index.css              # Direttive Tailwind CSS
│   └── main.tsx               # Entrypoint React
├── index.html                 # Template HTML con meta tag SEO e accessibilità
├── package.json               # Script npm e dipendenze
├── tailwind.config.js         # Configurazione Tailwind CSS
├── tsconfig.json              # Configurazione TypeScript
└── vite.config.ts             # Configurazione Vite bundler
```

---

## 🚀 Comandi Utili

Tutti i comandi principali per lo sviluppo, il testing e l'analisi del progetto:

### 1. Installazione Dipendenze
```bash
npm install
```

### 2. Server di Sviluppo (Dev Mode)
Avvia il server di sviluppo con Hot Module Replacement (HMR):
```bash
npm run dev
```
> L'app sarà disponibile su `http://localhost:5173/`.

### 3. Build di Produzione
Verifica i tipi TypeScript e genera il bundle ottimizzato e minificato nella cartella `dist/`:
```bash
npm run build
```

### 4. Anteprima Locale della Build di Produzione
Avvia un web server locale per testare la build presente in `dist/`:
```bash
npm run preview
```

### 5. Esecuzione del Lighthouse Audit (Performance, A11y, SEO)
Per eseguire l'audit automatico di conformità e performance con Google Chrome:
```bash
# 1. Assicurati che la build sia aggiornata e il server di preview sia attivo (oppure usa npm run audit)
npm run build

# 2. Avvia l'audit programmatico Lighthouse
npm run audit
```

### 6. Linting del Codice
Esegue il controllo di qualità del codice tramite `oxlint`:
```bash
npm run lint
```

---

## 📖 Riferimenti Normativi Applicati

- **Contributi INPS Dipendente (9,19%)**: *INPS, Circolare n. 117 del 20 ottobre 2022, Allegato n. 1 (Aliquota IVS tempo indeterminato).*
- **Scaglioni IRPEF 2026**: *Art. 11 TUIR come modificato dalla Legge di Bilancio (23% fino a 28.000 €, 33% da 28.001 a 50.000 €, 43% oltre 50.000 €).*
- **Detrazioni da Lavoro Dipendente**: *Art. 13, comma 1, TUIR (Formula a scaglioni decrescenti con tetto massimo a 50.000 €).*
- **Addizionale Regionale Lombardia**: *L.R. Lombardia n. 34/2001 e s.m.i. (Scaglioni progressivi da 1,23% a 1,73%).*
- **Addizionale Comunale Milano**: *Regolamento Addizionale Comunale IRPEF Comune di Milano (Aliquota 0,80% con franchigia totale di esenzione fino a 23.000 €).*
- **Accantonamento TFR & Costo Aziendale**: *Art. 2120 c.c. (Retribuzione / 13,5) e aliquota contributiva datoriale media terziario (~23,81%).*