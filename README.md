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

## Popis gostiju i potvrde u Google tablici
1. Napravite novu Google tablicu (sheets.new), npr. „Vjenčanje – gosti”.
2. **Proširenja → Apps Script**, obrišite postojeći kod, zalijepite `google-apps-script.gs` i spremite.
3. Gore odaberite funkciju **postavi** i kliknite **▶ Pokreni** (dopustite pristup). Nastaje list „Gosti”.
4. **Implementiraj → Nova implementacija → Web-aplikacija** (Izvrši kao: Ja, Pristup: Bilo tko) → kopirajte URL (…/exec).
5. U skripti zalijepite URL u `WEB_APP_URL` i spremite. U tablici: **💌 Pozivnica → Pripremi gumbe za slanje**.
6. Isti URL upišite u `rsvpSheetUrl` u `index.html`.

U list „Gosti” upisujete ime i prezime i mobitel. Klik na **📲 Pošalji** upiše datum u „Poslano”
i otvori WhatsApp s osobnom poveznicom. Kad gost otvori pozivnicu, popuni se „Otvoreno”, a kad potvrdi,
popune se „Dolazi”, „Broj osoba”, „Prehrana”, „Poruka” i „Potvrđeno”.

## Objava (GitHub Pages)
Settings → Pages → Source: *Deploy from a branch* → `main` / `root` → Save.
Pozivnica će biti na adresi `https://barbararacki.github.io/Pozivnica-za-vjencanje/`.
