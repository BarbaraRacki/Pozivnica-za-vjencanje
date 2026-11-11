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

## Objava (GitHub Pages)
Settings → Pages → Source: *Deploy from a branch* → `main` / `root` → Save.
Pozivnica će biti na adresi `https://barbararacki.github.io/Pozivnica-za-vjencanje/`.
