# Pozivnica za vjenčanje

Interaktivna web-pozivnica za vjenčanje: jedna datoteka (`index.html`), bez servera.

## Što sadrži
- Omotnica koja se otvara dodirom, uz padanje latica
- Imena, datum i grad
- Odbrojavanje do vjenčanja (dani, sati, minute, sekunde)
- Gumb **Dodaj u kalendar** (.ics s podsjetnikom dan ranije)
- Program dana
- Lokacije s gumbom za upute (Google Maps)
- Potvrda dolaska (RSVP): gost ispuni obrazac i pošalje gotovu poruku putem WhatsAppa ili e-maila
- Česta pitanja (dress code, parking, pokloni…)
- Neobavezna pozadinska glazba

## Kako urediti
Otvorite `index.html` i promijenite objekt `WEDDING` na vrhu `<script>` dijela
(imena, datum, lokacije, program, broj za WhatsApp, e-mail, pitanja).
Ništa drugo nije potrebno mijenjati.

## Potvrde dolaska u Google tablicu
1. Napravite novu Google tablicu (sheets.new), npr. „Potvrde dolaska”.
2. **Proširenja → Apps Script**, obrišite postojeći kod i zalijepite sadržaj `google-apps-script.gs`. Spremite.
3. **Implementiraj → Nova implementacija** → vrsta **Web-aplikacija**
   - Izvrši kao: **Ja**
   - Tko ima pristup: **Bilo tko**
4. **Implementiraj**, dopustite pristup (Napredno → Idi na … ), kopirajte **URL web-aplikacije**.
5. Upišite taj URL u `rsvpSheetUrl` u `index.html`.

Svaka potvrda dodaje novi red na listu „Potvrde”.

## Objava (GitHub Pages)
Settings → Pages → Source: *Deploy from a branch* → `main` / `root` → Save.
Pozivnica će biti na adresi `https://barbararacki.github.io/Pozivnica-za-vjencanje/`.
