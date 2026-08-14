# Business Context: Calcolatore Stipendio Netto da RAL (Milano)

## 1. Obiettivo e Scenario
Il progetto è un simulatore/calcolatore di retribuzione netta annuale e mensile partendo dalla Retribuzione Annua Lorda (RAL), specificamente progettato per un lavoratore dipendente a tempo indeterminato nel comune di Milano (Regione Lombardia), ispirato ai canoni di semplicità, trasparenza e design premium di Jet HR.

## 2. Parametri del Modello Fiscale di Riferimento

### A. Dati del Dipendente (Default)
- **Tipologia contrattuale**: Lavoratore dipendente a tempo indeterminato (CCNL standard commercio/servizi).
- **Residenza fiscale**: Milano (Lombardia).
- **Carichi familiari**: Nessun familiare a carico (scenario base, estendibile).
- **Mensilità**: 13 o 14 mensilità (selezionabile dall'utente, default 13/14).

---

### B. Contributi Previdenziali a carico lavoratore (INPS IVS)
- **Aliquota IVS standard**: `9.19%` sull'imponibile previdenziale (RAL).
- **Aliquota aggiuntiva 1%**: Applicabile per la quota retributiva eccedente la prima fascia di retribuzione pensionabile annuale (~€55.008 per anno di riferimento).
- **Imponibile Fiscale (IRPEF)**: `RAL - Contributi INPS`.

---

### C. IRPEF Lorda (Scaglioni a 3 aliquote)
1. **Fino a 28.000 €**: `23%`
2. **Da 28.000,01 € a 50.000 €**: `35%`
3. **Oltre 50.000 €**: `43%`

---

### D. Detrazioni da Lavoro Dipendente (Art. 13 TUIR)
Formula a scaglioni decrescenti in base al reddito complessivo:
- **Fino a 15.000 €**: `1.955 €` (minimo garantito 690 € o 1.380 € a seconda dei giorni lavorati, 365 gg).
- **Da 15.000 € a 28.000 €**: `1.910 + 1.190 * [(28.000 - Reddito) / 13.000]`
- **Da 28.000 € a 50.000 €**: `1.910 * [(50.000 - Reddito) / 22.000]`
- **Oltre 50.000 €**: `0 €` (con eventuale franchigia/adeguamento normativo se applicabile).

*IRPEF Netta = Max(0, IRPEF Lorda - Detrazioni Lavoro Dipendente).*

---

### E. Addizionali IRPEF

#### 1. Addizionale Regionale (Lombardia)
Aliquote progressive per scaglioni:
- Fino a 15.000 €: `1.23%`
- Da 15.000,01 a 28.000 €: `1.58%`
- Da 28.000,01 a 50.000 €: `1.72%`
- Oltre 50.000 €: `1.73%`

#### 2. Addizionale Comunale (Milano)
- Aliquota unica: `0.80%`
- Soglia esenzione: reddito fino a 23.000 € (se il reddito supera la soglia, l'addizionale si applica sull'intero importo).

---

### F. Formula di Sintesi
```
Netto Annuale = RAL - Contributi INPS - IRPEF Netta - Addizionale Regionale - Addizionale Comunale
Netto Mensile = Netto Annuale / Numero Mensilità (13 o 14)
```

## 3. Note di Trasparenza e Semplificazioni
- Vengono escluse agevolazioni speciali (es. Rientro dei cervelli, decontribuzioni temporanee straordinarie mese per mese se non parametrizzate, fringe benefit).
- Il calcolo riflette l'annualità fiscale piena standard.
