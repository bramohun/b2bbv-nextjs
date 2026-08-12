<!-- 
============================================================================
FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - WIKISPEC FŐDOKUMENTUM
============================================================================

MIRE HASZNÁLJUK:
Ez a dokumentum a BENU B2B Betegútvezérlő / Orvosi Gyógyszerkereső portál 
központi funkcionális specifikációja. Részletesen leírja a rendszer üzleti célját,
az entitások adatmodelljét, az egyes modulok és felületek működését, a beviteli 
mezőkhöz tartozó adatformátumokat, példákat és limitációkat, a felhasználói 
interakciókat, valamint a tesztelési hozzáféréseket.

KAPCSOLÓDÓ USER STORY-K:
- Egészségügyi szakemberként (orvos/gyógyszerész) szeretnék naprakész információt kapni 
  a gyógyszerek piaci elérhetőségéről, készlethiányáról és a helyettesíthetőségről.
- Felhasználóként szeretném megtalálni a legközelebbi preferált gyógyszertáramat és 
  ellenőrizni annak aktuális készletét.
- Felhasználóként szeretnék szakmai és akkreditált képzéseken részt venni.
- Adminisztrátorként szeretném kezelni a felhasználókat, jogosultságokat, patikákat és tartalmakat.

KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
- Fejléc / Navigációs sáv (Globális kereső, Közeli patika, Kedvencek, Profil)
- Irányítópult (Dashboard): https://bvo.uneb.hu/dashboard
- Gyógyszer Nyilvántartás (Lista + Adatlap): https://bvo.uneb.hu/gyogyszerek
- Gyógyszertár Kereső (Térkép + Készlet): https://bvo.uneb.hu/gyogyszertarak
- BENU Képzési Program: https://bvo.uneb.hu/kepzesek
- Közösség és Fórum: https://bvo.uneb.hu/kozosseg
- Képzési Program (Képzések): https://bvorvosi.vercel.app/kepzesek
- Hitelesítés & Profilkezelés: https://bvorvosi.vercel.app/login, https://bvorvosi.vercel.app/profile
- Adminisztráció (Felhasználók, Patikák, Moderálás): https://bvorvosi.vercel.app/admin/users
============================================================================
-->

# WikiSpec Funkcionális Specifikáció

> **Verzió:** 6.1  
> **Dátum:** 2026.08.12.  
> **Státusz:** Aktualizált (Prototípus kódbázisa alapján teljes körűen felülvizsgált és frissített)  
> **Prototípus URL:** [https://bvorvosi.vercel.app/](https://bvorvosi.vercel.app/)

---

## Tartalomjegyzék
1. [Brief (Áttekintés)](#1-brief)
2. [Fogalomtár (Glossary)](#2-fogalomtár)
3. [Adatmodellek Specifikációja](#3-adatmodellek-specifikációja)
   - [3.1. Felhasználó (User) Adatmodell](#31-felhasználó-user-adatmodell)
   - [3.2. Gyógyszer (Medicine) Adatmodell](#32-gyógyszer-medicine-adatmodell)
   - [3.3. Gyógyszertár (Pharmacy) Adatmodell](#33-gyógyszertár-pharmacy-adatmodell)
   - [3.4. Képzés / Kurzus (Course) Adatmodell](#34-képzés--kurzus-course-adatmodell)
   - [3.5. Patikai Készletrekord Adatmodell](#35-patikai-készletrekord-adatmodell)
4. [Modulok és Funkciók Részletes Leírása](#4-modulok-és-funkciók-részletes-leírása)
   - [4.0. Fejléc és Navigációs Sáv Modul](#40-fejléc-és-navigációs-sáv-modul)
   - [4.1. Irányítópult (Dashboard)](#41-irányítópult-dashboard)
   - [4.2. Gyógyszer Nyilvántartás](#42-gyógyszer-nyilvántartás)
     - [4.2.1. Gyógyszer Lista Oldal](#421-gyógyszer-lista-oldal)
     - [4.2.2. Gyógyszer Adatlap](#422-gyógyszer-adatlap)
   - [4.3. Gyógyszertár Kereső](#43-gyógyszertár-kereső)
     - [4.3.1. Gyógyszertárak Oldal](#431-gyógyszertárak-oldal)
     - [4.3.2. Gyógyszertári Készlet Nézet (Modális Nézet)](#432-gyógyszertári-készlet-nézet-modális-nézet)
   - [4.4. Képzési Program](#44-képzési-program)
     - [4.4.1. Képzések Főoldal](#441-képzések-főoldal)
     - [4.4.2. Képzés Részletes Oldal és BENU LMS Integráció](#442-képzés-részletes-oldal-és-benu-lms-integráció)
   - [4.5. Globális Keresés](#45-globális-keresés)
   - [4.6. Hitelesítés és Jogosultságok](#46-hitelesítés-és-jogosultságok)
     - [4.6.1. Bejelentkezés Oldal](#461-bejelentkezés-oldal)
     - [4.6.2. Kétfaktoros Azonosítás (2FA) Igazolási Felület](#462-kétfaktoros-azonosítás-2fa-igazolási-felület)
     - [4.6.3. Elfelejtett Jelszó Oldal](#463-elfelejtett-jelszó-oldal)
     - [4.6.4. Jogosultságkezelés és Munkamenet Biztonság](#464-jogosultságkezelés-és-munkamenet-biztonság)
   - [4.7. Adminisztráció](#47-adminisztráció)
     - [4.7.1. Felhasználókezelés](#471-felhasználókezelés)
     - [4.7.2. Fórum és Tartalom Moderálás](#472-fórum-és-tartalom-moderálás)
     - [4.7.3. Gyógyszertár Karbantartás](#473-gyógyszertár-karbantartás)
   - [4.8. Felhasználói Profil](#48-felhasználói-profil)
     - [4.8.1. Személyes Adatok és Szakterületek](#481-személyes-adatok-és-szakterületek)
     - [4.8.2. Preferált Gyógyszertár Kezelése](#482-preferált-gyógyszertár-kezelése)
     - [4.8.3. Hírlevél Beállítások Szekció](#483-hírlevél-beállítások-szekció)
     - [4.8.4. Mentett Kedvencek Oldal](#484-mentett-kedvencek-oldal)
     - [4.8.5. Készletértesítések Oldal](#485-készletértesítések-oldal)
     - [4.8.6. Biztonság és Kétfaktoros Azonosítás](#486-biztonság-és-kétfaktoros-azonosítás-2fa--passkey)
5. [Korábban tervezett, de elvetett / külső rendszerbe átsorolt funkciók](#5-korábban-tervezett-de-elvetett--külső-rendszerbe-átsorolt-funkciók)
6. [Tesztfiókok és Hozzáférések](#6-tesztfiókok-és-hozzáférések)

---

## 1. Brief

### Cél
Egy orvosi szakmai portál biztosítása, amely támogatja a gyógyszerészeket és orvosokat a napi munkájukban. A rendszer célja, hogy naprakész információt nyújtson a gyógyszerkészletekről, a piaci készlethiányról, a helyettesíthetőségről, a legközelebbi preferált patika elérhetőségéről, valamint szakmai és akkreditált képzési lehetőségeket mutasson be.

### Live Prototípus
A működő prototípus felülete elérhető az alábbi hivatkozáson:  
🔗 [https://bvorvosi.vercel.app/](https://bvorvosi.vercel.app/)

### Felhasználói Szerepkörök
- **Szakmai Felhasználó (User):** Orvos, gyógyszerész vagy egészségügyi szakdolgozó. Hozzáfér a gyógyszer-nyilvántartáshoz, patikakeresőhöz, képzésekhez és a saját profilbeállításaihoz.
- **Rendszeradminisztrátor (Admin):** A portál működését felügyelő felhasználó, aki felhasználókat kezel, patikaadatokat tekint át és tartalommoderációt végez.

### Modulok Áttekintése
A rendszer moduláris felépítésű, központjában a biztonságos szakmai azonosítás áll. A fő funkcionális egységek:
- **[Fejléc és Navigációs Sáv](#40-fejléc-és-navigációs-sáv-modul):** Központi navigáció, mentett gyógyszer gyorslista, közeli patika kijelző és profil menü.
- **[Irányítópult](#41-irányítópult-dashboard):** Központi összegző felület a piaci és patikai készletváltozásokról.
- **[Gyógyszer Nyilvántartás](#42-gyógyszer-nyilvántartás):** Gyógyszerek keresése, fejlett táblázatos szűrése, rendezése és részletes adatlapja.
- **[Gyógyszertár Kereső](#43-gyógyszertár-kereső):** Patikák térképes és szinkronizált listás megjelenítése, nyitvatartás és készletellenőrzés.
- **[Képzési Program](#44-képzési-program):** Szakmai és akkreditált képzések böngészése, ismertetése és átirányítás a BENU LMS rendszerbe.
- **[Globális Keresés](#45-globális-keresés):** Fejlécből indítható instant keresés a portál tartalmában.
- **[Adminisztráció](#47-adminisztráció):** Felhasználók, patika-áttekintő nézet és közösségi tartalmak kezelése.
- **[Felhasználói Profil](#48-felhasználói-profil):** Szakmai beállítások, preferált patika, hírlevelek és fiókbiztonság.

---

## 2. Fogalomtár

| Kifejezés | Definíció és Üzleti Jelentés | Konkrét Felületi Példa |
|---|---|---|
| **Közeli Patika (Preferált Patika)** | A felhasználó által megjelölt gyógyszertár. A rendszer ezen patika készletadatait és státuszfrissítéseit kiemelten kezeli az egész portálon. | *"BENU Gyógyszertár Arany Sas"* |
| **Kedvenc Gyógyszer (Mentett Gyógyszer)** | A felhasználó által könyvjelzővel megjelölt gyógyszer, amely bekerül a mentett listába a gyors elérés érdekében. | *"Algopyrin 500 mg filmtabletta"* |
| **Készletértesítés** | Feliratkozás egy adott gyógyszer piaci vagy patikai státuszváltozására (pl. készlethiány vagy újra elérhető állapot). Feliratkozáskor a termék automatikusan mentetté is válik. | Értesítés küldése hírlevélben vagy felületi visszajelzésben. |
| **TK-szám** | Törzskönyvi szám - a gyógyszerek hatósági egyedi azonosítója. | `"OGYI-T-8898/01"` |
| **INN** | Nemzetközi Szabadnév (International Nonproprietary Name) - a gyógyszer hatóanyaga. | `"metamizol-nátrium"` |
| **ATC-kód** | Anatómiai, Terápiás és Kémiai osztályozási rendszer kódja. | `"N02BB02"` |
| **Hírlevél Hatókör (Scope)** | A készletértesítő hírlevelek szűrési köre (pl. teljes adatbázis, csak a felhasználó szakterülete, vagy csak a mentett kedvenc gyógyszerei). | `"Szakterület + mentett gyógyszerek"` |
| **BENU LMS Rendszer** | A BENU külső e-learning és továbbképzési rendszere, ahol a tananyagok tényleges feldolgozása, a tesztkitöltés és a kreditpont-jóváírás történik. | *"BENU LMS felület"* |
| **Passkey (Biometrikus azonosító)** | Eszközalapú biometrikus kulcs (Touch ID, Face ID, Windows Hello), amely jelszó nélküli 1-kattintásos belépést tesz lehetővé. | *"Work Mac TouchID"* |
| **Kényszerített Munkamenet Lezárás** | Adminisztrátori vagy biztonsági művelet, amely azonnal érvényteleníti a felhasználó aktív belépését. | Felhasználó azonnali átirányítása a bejelentkezési oldalra. |

---

## 3. Adatmodellek Specifikációja

Ez a szakasz a rendszer fő üzleti entitásait mutatja be a beviteli mezők, adattípusok, megadható értékek, példák és limitációk szempontjából.

### 3.1. Felhasználó (User) Adatmodell

| Mező neve | Felületi Típus | Megadható Adatok / Formátum | Példa Érték | Üzleti & Felületi Limitációk |
|---|---|---|---|---|
| **Teljes név** | Egysoros szövegmező | Szöveg (vezetéknév + keresztnév) | `"Dr. Kovács István"` | Kötelező. Min. 3, max. 100 karakter. A profilban csak olvasható. |
| **Elsődleges e-mail** | Egysoros email mező | Érvényes e-mail formátum (`user@domain.hu`) | `"demo@example.com"` | Kötelező. Egyedi belépési azonosító. A profilban nem módosítható. |
| **Másodlagos e-mail** | Egysoros email mező | Érvényes e-mail formátum | `"kovacs.private@email.hu"` | Opcionális. Értesítések és hírlevelek másodlagos címe. |
| **Telefonszám** | Szövegmező | Telefonszám formátum (`+36...`) | `"+36 30 123 4567"` | Opcionális. Az SMS alapú 2FA azonosítás csatornája. |
| **Szerepkör** | Legördülő menü | `User` (Szakmai) / `Admin` (Rendszeradmin) | `User` | Kötelező. Kizárólag az adminisztrátor módosíthatja. |
| **Fiók Státusz** | Legördülő menü | `Active` (Aktív) / `Inactive` (Inaktív) | `Active` | Inaktív fiókkal a bejelentkezés elutasításra kerül. |
| **Szakterületek** | Kereshető multi-select | Orvosi kódlista elemei | `["Háziorvos", "Belgyógyász"]` | Több opció is kiválasztható a megadott kódlistából. |
| **2FA Állapot & Csatorna** | Kapcsoló + Rádiógombok | `Be` / `Ki`; Csatornák: `E-mail`, `SMS`, `TOTP` | `Be (E-mail OTP)` | Önkiszolgáló módon állítható a Profilban. |
| **Passkey Kulcsok** | Lista + Modal | Eszköznév + Regisztrációs dátum | `[{ name: "MacBook", createdAt: "2026-01-15" }]` | Egy fiókhoz több biometrikus eszköz is rendelhető. |
| **Megbízható Eszközök** | Számláló / Gomb | Megjegyzett 30 napos munkamenetek azonosítói | `3 aktív eszköz` | Egy kattintással az összes eszköz elfelejthető. |
| **Hírlevél (Képzés)** | Kapcsoló + Checkboxok | Be/Ki; Kategóriák: `Akkreditált`, `Gyártói`, `Eladásösztönző` | `Feliratkozva: Akkreditált` | Külön konfigurálható az elsődleges és másodlagos e-mail címre. |
| **Hírlevél (Készlet)** | Kapcsoló + Select/Radio | Frekvencia (`Napi`/`Heti`/`Havi`), Időpont (0-23h), Téma multiselect, Hatókör | `Heti, 09:00, Készlethiány, Szakterület + mentett` | Külön konfigurálható az elsődleges és másodlagos e-mail címre. |
| **Preferált Patika** | Kiválasztó komponens | Egy kijelölt gyógyszertár azonosítója | `"BENU Gyógyszertár Arany Sas"` | Opcionális. Bármikor módosítható vagy törölhető. |

### 3.2. Gyógyszer (Medicine) Adatmodell

| Mező neve | Felületi Típus | Megadható Adatok / Formátum | Példa Érték | Üzleti & Felületi Limitációk |
|---|---|---|---|---|
| **Kereskedelmi Név** | Megjelenítő / Szöveg | Szöveg | `"Algopyrin 500 mg filmtabletta"` | Kötelező azonosító elnevezés. |
| **TK-szám** | Megjelenítő / Szöveg | Hatósági azonosító formátum | `"OGYI-T-8898/01"` | Egyedi törzskönyvi szám. Rendszerazonosító. |
| **INN (Hatóanyag)** | Megjelenítő / Link | Szöveg (Hatóanyag neve) | `"metamizol-nátrium"` | Kattintható hivatkozás: szűr a listában. |
| **Márkanév** | Megjelenítő / Szöveg | Kereskedelmi márkaneve | `"Algopyrin"` | A termékcsalád márkaneve. |
| **ATC-kód** | Megjelenítő / Címke | 7 karakteres kód | `"N02BB02"` | Szabványos anatómiai-terápiás osztályozás. |
| **Gyártó** | Megjelenítő / Szöveg | Cégnév | `"Sanofi-Aventis Zrt."` | A forgalomba hozatali engedélyes / gyártó. |
| **Kiszerelés** | Megjelenítő / Szöveg | Mennyiség és csomagolási forma | `"20x filmtabletta"` | A dobozban található kiszerelés. |
| **Csomagolási részletek**| Megjelenítő / Szöveg | Részletes csomagolás leírása | `"bliszterben és dobozban"` | Opcionális oszlop a nyilvántartásban. |
| **Kiadhatóság** | Megjelenítő / Szöveg | `Vényköteles` / `Vény nélkül kapható` | `Vényköteles` | Fő kiadhatósági besorolás. |
| **Kiadhatósági alcsoport**| Megjelenítő / Szöveg | Részletes kiadhatósági kód/szöveg | `"VN"` | Opcionális oszlop a nyilvántartásban. |
| **Biztonsági elemek** | Megjelenítő / Szöveg | `Van` / `Nincs` | `Van` | Egyedi azonosító és dézsmálásgátló megléte. |
| **Engedélyezés dátuma** | Megjelenítő / Dátum | Dátum formátum (`ÉÉÉÉ.MM.NN`) | `2010.05.12` | Hatósági engedélyezés időpontja. |
| **Státusz** | Címke (Színkódolt) | `Elérhető` / `Készlethiány` / `Megszűnt` | `Készlethiány` | Zöld (Elérhető), Sárga (Készlethiány), Piros (Megszűnt). |
| **Utolsó frissítés** | Megjelenítő / Dátum | Dátum és időbélyeg | `2026.08.10 14:32` | A piaci státusz utolsó módosításának ideje. |
| **Hiány kezdete** | Dátum kijelző | Dátum formátum (`ÉÉÉÉ.MM.NN`) | `2026.07.15` | Kizárólag készlethiány esetén jelenik meg. |
| **Hiány várható vége**| Dátum kijelző | Dátum formátum (`ÉÉÉÉ.MM.NN`) | `2026.09.30` | Becsült lejárati dátum (ha hiányzik: "Folyamatban"). |
| **Hiány oka** | Szövegblokk | Szöveges leírás | `"Gyártási kapacitáshiány"` | Részletes tájékoztatás (ha hiányzik: "Szakmai ok"). |
| **Pótlási javaslat** | Szövegblokk | Szöveges leírás | `"Helyettesíthető azonos INN készítménnyel."` | Szakmai javaslat a betegellátáshoz. |

### 3.3. Gyógyszertár (Pharmacy) Adatmodell

| Mező neve | Felületi Típus | Megadható Adatok / Formátum | Példa Érték | Üzleti & Felületi Limitációk |
|---|---|---|---|---|
| **BF azonosító kód** | Megjelenítő / Szöveg | Egyedi hatósági/rendszer kód | `"BF001"` | A patika egyedi azonosítója. |
| **Patika neve** | Szövegmező | Szöveg | `"BENU Gyógyszertár Arany Sas"` | Kötelező megnevezés. |
| **Irányítószám** | Szövegmező | 4 számjegy | `"1052"` | Magyarországi irányítószám. |
| **Város** | Szövegmező | Szöveg | `"Budapest"` | Kötelező településnév. |
| **Utca, házszám** | Szövegmező | Szöveg | `"Károly körút 1."` | Pontos közterület megnevezés. |
| **Vármegye** | Legördülő menü | Vármegyék listája | `"Pest / Budapest"` | Területi besorolás. |
| **Szélesség (Lat)** | Számos mező | Tizedes tört (`-90` és `+90` között) | `47.4979` | Földrajzi koordináta térképhez. |
| **Hosszúság (Lng)** | Számos mező | Tizedes tört (`-180` és `+180` között)| `19.0543` | Földrajzi koordináta térképhez. |
| **Nyitvatartás** | Napi Időpontok | Nyitás-Zárás naptári naponként (H-Va) | `"08:00 - 19:00"` | Naponta állítható nyitási/zárási időpont vagy "Zárva". |
| **Telefonszám** | Szövegmező | Telefonszám formátum | `"+36 1 234 5678"` | Kapcsolattartási telefonszám. |
| **E-mail cím** | Email mező | Érvényes e-mail formátum | `"aranysas@benu.hu"` | Elektronikus elérhetőség. |

### 3.4. Képzés / Kurzus (Course) Adatmodell

| Mező neve | Felületi Típus | Megadható Adatok / Formátum | Példa Érték | Üzleti & Felületi Limitációk |
|---|---|---|---|---|
| **Kurzus azonosító** | Szöveg azonosító | Karakterlánc | `"c1"` | Egyedi kurzusazonosító. |
| **Cím** | Szöveg | Karakterlánc | `"A hipertónia legújabb terápiás irányelvei"` | A képzés megnevezése. |
| **Kategória** | Címke | `Akkreditált` / `Gyártói` / `Eladásösztönző` | `Akkreditált` | A képzés szakmai kategóriája. |
| **Becsült időtartam** | Szám / Kijelző | Percek száma | `45 perc` | A tananyag feldolgozásához szükséges becsült idő. |
| **Tartalomtípus** | Ikon / Szöveg | `Videó` / `PDF` | `Videó` | A tananyag fő formátuma. |
| **Rövid leírás** | Szövegblokk | Részlet | `"Összefoglaló a legújabb kardiológiai irányelvekről..."` | Kártyás nézeten megjelenő összefoglaló. |
| **Részletes leírás** | Szövegblokk | Formázott szöveg | `"A kurzus részletesen bemutatja..."` | A kurzus adatlapján megjelenő teljes leírás. |
| **Akkreditált pontok**| Kártya / Kijelző | Egész szám | `2 kreditpont` | Akkreditált képzéseknél megszerezhető pontszám. |

### 3.5. Patikai Készletrekord Adatmodell

| Mező neve | Felületi Típus | Megadható Adatok / Formátum | Példa Érték | Üzleti & Felületi Limitációk |
|---|---|---|---|---|
| **TK-szám** | Szövegmező | Törzskönyvi szám | `"OGYI-T-8898/01"` | Hivatkozott gyógyszer azonosítója. |
| **Raktári darabszám** | Számmező | Pozitív egész szám | `42` | A kiválasztott patikában lévő fizikai darabszám. |
| **Utolsó adatszinkron** | Dátum és idő | `ÉÉÉÉ.MM.NN ÓÓ:PP:SS` | `2026.08.12 08:15:30` | Patikai alapadatok utolsó frissítési ideje. |
| **Utolsó készletszinkron**| Dátum és idő | `ÉÉÉÉ.MM.NN ÓÓ:PP:SS` | `2026.08.12 09:00:12` | Készletadatok utolsó frissítési ideje. |

---

## 4. Modulok és Funkciók Részletes Leírása

### 4.0. Fejléc és Navigációs Sáv Modul

#### Brief
A portál tetején rögzített (sticky) központi navigációs sáv, amely minden oldalon elérhető. Biztosítja az oldalak közötti gyors váltást, a mentett kedvenc gyógyszerek elérését, a kijelölt közeli patika megjelenítését és módosítását, a rendszerszintű keresést, valamint a felhasználói fiókműveleteket.

#### Felületi elemek és Beviteli Mezők

1. **Fő navigációs linkek:**
   - **Elemet tartalmazó menüpontok:** `Irányítópult` (`/dashboard`), `Gyógyszerek` (`/gyogyszerek`), `Gyógyszertárak` (`/gyogyszertarak`), `BENU Képzési Program` (`/kepzesek`).
   - **Adminisztráció menüpont (`/admin/users`):** Kizárólag `Admin` szerepkörrel rendelkező felhasználóknak jelenik meg a navigációs sávban.

2. **Közeli Patika Kijelző (Preferált Patika):**
   - **Megjelenés:** Ha a felhasználó beállított preferált patikát, annak neve és helyszín ikonja látható a fejlécben.
   - **Interakció:** A gombra kattintva felugrik a teljes képernyős **Patikaválasztó Modális Ablak** (`PharmacyFinder`), ahol a felhasználó térképről vagy listából új közeli patikát jelölhet ki vagy módosíthatja a meglévőt.

3. **Mentett Gyógyszerek Gyorslista (Könyvjelző Ikon):**
   - **Felületi elem:** Könyvjelző ikon jelzőjelvénnyel (badge counter).
   - **Számláló jelvény:** Megjeleníti a felhasználó által mentett gyógyszerek aktuális darabszámát.
   - **Lenyíló panel (Dropdown):**
     - Megjeleníti a mentett gyógyszerek listáját: Terméknév, TK-szám, és színessel kódolt Státusz címke (`Elérhető` - zöld, `Készlethiány` - sárga, `Megszűnt` - piros).
     - Bármelyik termékre kattintva a rendszer közvetlenül az adott gyógyszer adatlapjára navigál (`/gyogyszerek/adatlap?tk=[tkSzam]`).
     - Ha nincs mentett gyógyszer, a panel a `"Nincs mentett gyógyszered."` szöveget mutatja.
   - **"Összes megtekintése" gomb:** Átirányít a mentett kedvencek részletes profiloldalára (`/profile/favorites`).

4. **Felhasználói Profil Menü (Avatár):**
   - **Felületi elem:** Monogramos avatár kör (a felhasználó nevének első két kezdőbetűjével, pl. `"KÍ"`).
   - **Lenyíló opciók:**
     - Fejlécben a bejelentkezett felhasználó teljes neve.
     - `"Profil beállítások"` -> átirányítás a profiloldalra (`/profile`).
     - `"Kijelentkezés"` -> azonnal kijelentkezteti a felhasználót és visszanavigál a bejelentkezési oldalra (`/login`).

5. **Mobil Hamburger Menü:**
   - Kisebb kijelzőméret (mobil) esetén a navigációs linkek összecsukódnak egy hamburger menü gomb mögé.

---

### 4.1. Irányítópult (Dashboard)

#### Brief
A bejelentkezést követő nyitóoldal. Gyors áttekintést nyújt a piaci gyógyszer-státuszváltozásokról, a kiválasztott preferált patika állapotáról és az aktuális képzésekről.

**Útvonal:** [https://bvorvosi.vercel.app/dashboard](https://bvorvosi.vercel.app/dashboard)

#### Felületi elemek és Beviteli Mezők

1. **Időszak Választó (Time Period Selector):**
   - **Felületi elem:** Gombválasztó fülek.
   - **Választható opciók:** `1 nap`, `7 nap`, `30 nap`.
   - **Alapértelmezett érték:** `1 nap`.
   - **Működés:** Az itt kiválasztott időintervallum alapján frissülnek az Irányítópulton látható statisztikai mutatószámok és a legutóbbi készletváltozások listája.

2. **Készletváltozások Összegző Panel:**
   - Egyetlen összefoglaló kártya, amely kiírja a kiválasztott időszak összes státuszváltozásának darabszámát (pl. `"Mai nap változásai: 12 db"`).
   - A kártyán belül három kattintható előszűrő hivatkozás található:
     - **Megszűnt darabszám:** Kattintásra a Gyógyszerlistára navigál pre-szűrve (`/gyogyszerek?status=Megszűnt&lastUpdate_from=...`).
     - **Hiány darabszám:** Kattintásra a Gyógyszerlistára navigál pre-szűrve (`/gyogyszerek?status=Készlethiány&lastUpdate_from=...`).
     - **Elérhető darabszám:** Kattintásra a Gyógyszerlistára navigál pre-szűrve (`/gyogyszerek?status=Elérhető&lastUpdate_from=...`).

3. **Legutóbbi Státuszváltozások Táblázata:**
   - **Oszlopok:** `Státusz` (színkódolt badge), `Név` (gyógyszer kereskedelmi neve), `Dátum` (utolsó frissítés időpontja). (TK-szám oszlop a táblázatban nincs).
   - **Interakció:** Bármely gyógyszersorra kattintva a rendszer átirányít az adott [Gyógyszer Adatlapjára](#422-gyógyszer-adatlap).
   - **"Összes változás" link:** Átirányít a gyógyszerlistára utolsó frissítés szerint csökkenő sorrendbe rendezve.

4. **Közeli Patika Modul:**
   - **Ha van kiválasztott preferált patika:** Megjeleníti a patika nevét, az időszaki statisztikai összesítőt (pl. `"X db újra készleten"`, `"Y db elfogyott"` — mindkettő kattintható hivatkozás, amely előszűrt gyógyszerlistára visz), valamint a patika legutóbbi N készletváltozásának táblázatát.
   - **Ha nincs kijelölt preferált patika:** Egy interaktív térképes modul jelenik meg tájékoztató szöveggel és a patikakereső oldalra mutató hivatkozással.

5. **Képzési Program Promóciós Modul:**
   - 6 legújabb szakmai kurzus listája kategória-jelvénnyel (`Akkreditált`, `Gyártói`, `Eladásösztönző`), becsült időtartammal (`X perc`) és tartalomtípus ikonnal (`Videó` / `PDF`).
   - `"Összes képzés megtekintése"` link: közvetlen navigáció a [Képzési Programba](#441-képzések-főoldal).

---

### 4.2. Gyógyszer Nyilvántartás

#### 4.2.1. Gyógyszer Lista Oldal

A portál központi kereső- és szűrőfelülete a gyógyszerkészítmények táblázatos böngészésére.

**Útvonal:** [https://bvorvosi.vercel.app/gyogyszerek](https://bvorvosi.vercel.app/gyogyszerek)

#### Beviteli Mezők, Fejléc alatti Szűrősor és Funkciók Specifikációja

A listaoldalon nincs különálló felső fő keresőmező vagy státusz legördülő; a keresés és szűrés a **táblázat fejléc alatti szűrősorán**, a **gyorsgombokon**, vagy **URL-paramétereken** keresztül történik.

1. **Oszlopfejléces Rendezés (Sorting):**
   - A táblázat rendezhető oszlopainak fejlécére kattintva a sorrend ciklikusan változik: **Növekvő (asc) → Csökkenő (desc) → Rendezés törlése (null)**.
   - Az aktuális rendezési irányt **▲ (növekvő)** vagy **▼ (csökkenő)** nyilak jelzik az oszlopfejléc mellett.

2. **Fejléc alatti Per-oszlop Szűrősor:**
   - A táblázat oszlopfejlécei alatt egy dedikált szűrősor található minden látható oszlophoz:
     - **Szabadszöveges szűrőmezők:** Egysoros `"Szűrés..."` beviteli mezők a TK-szám, Terméknév, Hatóanyag, Kiszerelés, Gyártó, Csomagolás, Kiadhatóság stb. oszlopokhoz. Élő szűrést végeznek.
     - **Státusz Oszlopszűrő (Select):** Legördülő menü az alábbi opciókkal: `Mindegy`, `Elérhető`, `Készlethiány`, `Megszűnt`.
     - **Közeli Patika Készlet Oszlopszűrő (Select):** Legördülő menü az alábbi opciókkal: `Mindegy`, `Elérhető`, `Nem elérhető`. (Csak beállított preferált patika esetén aktív).
     - **Dátumtartomány Szűrőpár (Utolsó frissítés és Közeli patika frissítve oszlopok):** Dátumválasztó mezőpár (`Dátumtól` és `Dátumig` formátumban: `ÉÉÉÉ.MM.NN`).
     - **"Szűrők törlése":** A szűrőmezők tartalmának kiürítésével a szűrés visszaáll.

3. **Automatikus Oszlopmegjelenítés:**
   - Preferált patika beállításakor a táblázat automatikusan bekapcsolja a `Közeli patika` (készletstátusz) és a `Közeli patika frissítve` (státusz frissítés időpontja) oszlopokat.

4. **Közeli Patikában Elérhető Gyorsgomb:**
   - Gomb a lista felett: `"Közeli patikában elérhető"`. Bekapcsolva kizárólag a kijelölt gyógyszertárban raktáron lévő készítményeket mutatja.

5. **Mentett Gyógyszerek Gyorsgomb:**
   - Gomb a lista felett: `"Mentett gyógyszerek"`. Bekapcsolva kizárólag a könyvjelzővel megjelölt termékeket mutatja.

6. **Mélylinkelés (URL Paraméterek):**
   - A lista állapota teljes mértékben hivatkozható URL-ből az alábbi paraméterekkel: `search`, `status`, `nearbyOnly`, `sort`, `order`, `lastUpdate_from`, `lastUpdate_to`, `nearbyPharmacyStock`. Ezt használják az Irányítópultról átmutató linkek is.

7. **Nézet Testreszabása Panel (Oszlopbeállítások és Átrendezés):**
   - **Gomb:** `"Nézet"`.
   - **Oszlopok ki/bekapcsolása:** A felugró panelen jelölőnégyzetekkel tetszőlegesen ki- és bekapcsolhatók a táblázat oszlopai. A beállítások megőrződnek a böngésző helyi tárolójában.
   - **Oszlopok Drag & Drop Átrendezése:** A táblázat oszlopai a fejlécnél található fogantyú ikon (`drag_indicator`) megragadásával egérrel szabadon átrendezhetők. A `Műveletek` oszlop mindig rögzítve az utolsó helyen marad.

8. **Találatszám Címsor és Üres Állapot:**
   - A lapfejlécben látható az aktuálisan szűrt találatok száma: `"Gyógyszerek (N termék)"`.
   - Ha nincs találat, a táblázatban a `"Nem található a keresésnek megfelelő gyógyszer."` üzenet jelenik meg.

9. **Műveletek Oszlop (Sorról sorra):**
   - **Kedvencnek jelölés (Könyvjelző ikon):** Kattintásra menti a gyógyszert. Ha a gyógyszer eltávolításakor ahhoz aktív készletértesítés kapcsolódik, a rendszer megerősítő modális ablakot jelenít meg:
     - *Üzenet:* `"A gyógyszer eltávolításával a kapcsolódó készletértesítés is törlődik. Biztosan folytatja?"`
     - *Opciók:* `Igen, törlöm` / `Mégse`.
   - **Értesítés kérése (Harang ikon):** Kattintásra feliratkoztat a készletváltozásokra (a termék automatikusan a mentettek közé is bekerül).
   - **Részletek gomb:** Átirányít a gyógyszer adatlapjára.

10. **Lapozó (Pagination) Specifikáció:**
    - Fix **24 elem/oldal** jelenik meg (nincs sor-elemszám választó).
    - **Vezérlők:** `«` (Előző oldal), számozott oldalgombok `...` jelekkel a távolabbi oldalaknál, `»` (Következő oldal). (Nincs külön Első/Utolsó gomb).
    - **Mobil nézet:** Mobilon az oldalszámok helyett kompakt `X / Y` kijelzés látható.

---

#### 4.2.2. Gyógyszer Adatlap

Egy konkrét gyógyszer részletes szakmai adatlapja.

**Útvonal:** `https://bvo.uneb.hu/gyogyszerek/adatlap?tk=[tkSzam]`  
*(Példa: [https://bvo.uneb.hu/gyogyszerek/adatlap?tk=OGYI-T-8898%2F01](https://bvo.uneb.hu/gyogyszerek/adatlap?tk=OGYI-T-8898%2F01))*

#### Részletes Adatmezők és Funkciók

1. **Törzsadatok Megjelenítése:**
   - Az adatlapon megjelenített törzsadatok: **Hatóanyag (INN)**, **Márkanév**, **ATC-kód**, **Gyártó**, **Kiszerelés**, **Utolsó frissítés időpontja**.
   - *(A Csomagolási részletek, Kiadhatósági alcsoport, Biztonsági jellemzők, Engedélyezés dátuma adatok kizárólag a Gyógyszer nyilvántartás táblázatának testreszabható oszlopaiban érhetők el).*
   - **INN (Hatóanyag) Interakció:** A hatóanyag kattintható hivatkozás. Rákattintva a rendszer visszanavigál a gyógyszerlistára, automatikusan az adott hatóanyagra szűrve.

2. **Országos Készlet-összesítő Blokk:**
   - **Elérhető státusznál:** Megjeleníti az elérhetőségi összesítést: `"N gyógyszertárban elérhető: Készleten X patikában / Rendelésre 1-2 munkanapon belül Y patikában"`. Két külön **"Megnézem hol"** gombbal megnyitható a raktáron lévő, illetve a rendelést fogadó patikák térképes modális nézete.
   - **Készlethiány státusznál:** Kizárólag a `"Készleten X patikában"` sor jelenik meg a megfelelő készletellenőrző gombbal.

3. **Közeli Patika Készletjelző Badge:**
   - Az adatlapon megjelenik egy kiemelt jelvény: `"Közeli patikában elérhető / nem elérhető"` felirattal, a preferált patika nevével és a frissítés időpontjával.

4. **Interaktív Műveleti Gombok (Adatlap fejléc):**
   - **Kedvencnek jelölés (Könyvjelző ikon):** Mentés a mentett listára / eltávolítás (ugyanazzal a megerősítő dialoggal, mint a listán).
   - **Értesítés kérése (Harang ikon):** Készletértesítés be- és kikapcsolása.

5. **Készlethiány Részletes Kártya (kizárólag Készlethiány státusznál):**
   - *Hiány kezdete:* Dátum (pl. `2026.07.15`).
   - *Hiány várható vége:* Dátum (pl. `2026.09.30`, ha nincs megadva: `"Folyamatban"`).
   - *Hiány oka:* Szöveges megnevezés (ha nincs megadva: `"Szakmai ok"`).
   - *Pótlási javaslat:* Szakmai javaslat a pótlásra.

6. **Helyettesítő Termékek Ajánlója:**
   - Azonos hatóanyagú (INN) elérhető készítmények listája kártyás elrendezésben. (A kód kizárólag azonos hatóanyag alapján ajánl).

7. **Státusz Történet Idővonal:**
   - Időrendi lista a gyógyszer korábbi elérhetőségi változásairól (Dátum, Régi státusz → Új státusz).

---

### 4.3. Gyógyszertár Kereső

#### 4.3.1. Gyógyszertárak Oldal

Interaktív térképes és szinkronizált listás kereső a patikák megtalálására.

**Útvonal:** [https://bvorvosi.vercel.app/gyogyszertarak](https://bvorvosi.vercel.app/gyogyszertarak)

#### Beviteli Mezők és Szűrők

1. **Kereső mező:**
   - **Típus:** Egysoros szövegmező.
   - **Megadható adatok:** Patika neve, Utca/Házszám cím, Város neve vagy BF azonosító kód.
   - **Példák:** `"BENU"`, `"1052 Budapest"`, `"Károly körút"`, `"BF001"`.

2. **Nyitvatartási Szűrőgombok:**
   - **Opciók:** `"Most nyitva"`, `"Hétvégén nyitva"`, `"0-24 órában nyitva"`.
   - **Működés:** Szűri a térképes jelölőket és a kapcsolódó listát.

3. **"Mutasd az összeset" Gomb:**
   - Alaphelyzetbe állítja a térkép nézetét (középpont és zoom), de az aktív nyitvatartási és szöveges szűrőket **NEM törli**.

4. **Mobil Lista / Térkép Nézetváltó:**
   - Kisebb kijelzőméretnél egy kapcsológomb jellegű opcióválasztó jelenik meg a fejlécben (`Lista` / `Térkép`), amely lehetővé teszi a két nézet közötti váltást mobilon.

5. **Térkép - Lista Szinkronizáció és Találatszám:**
   - A lista panelén kizárólag azon gyógyszertárak kártyái jelennek meg, amelyek az aktuális térképes kivágatban láthatók (maximum 50 kártya).
   - **Találatszám kijelzés:** `"Összesen N gyógyszertár / a térképen X gyógyszertár."`
   - **[Mutasd az összest] hivatkozás:** Visszaállítja a térkép zoom szintjét az összes patika megjelenítéséhez.

6. **Nyitvatartási Státusz Kijelzés (Patikakártya):**
   - Háromállapotú jelvény: **Nyitva** (zöld), **Hamarosan zár** (sárga), **Zárva** (piros) + a napi nyitvatartási időpontok kijelzése (pl. `08:00 - 19:00`).

7. **Preferált Patika Kijelölése:**
   - Gomb a patikakártyán és a térképes felugró ablakban: Ház / helyszín hozzáadása ikon (`"Közeli patikának jelölöm"`).
   - Visszajelzés: A kiválasztott patikán egyértelmű `"Közeli gyógyszertár"` kitűző jelenik meg, és beállítása érvényesül az egész portálon.

8. **Gyógyszertár Részletek Modal és Mélylinkelés (URL query paraméter):**
   - **Megnyitás:** A patikakártyán és a térképes marker felugró ablakában lévő `"Részletek"` gombra kattintva megnyílik a gyógyszertár részletes adatlapja egy reszponzív felugró modális ablakban.
   - **Mélylinkelés (Deep Linking):** Ha a felhasználó a Globális keresőből vagy más felületről hivatkozással érkezik (pl. `/gyogyszertarak?id=BF133`), a rendszer a térképen automatikusan az adott patikára fókuszál (zoom 15) és megnyitja a részletes modális ablakot.
   - **A Modal Tartalma:**
     - *Fejléc:* Gyógyszertár neve, belső azonosító kódja (pl. `BF133`), esetleges `"Közeli gyógyszertár"` jelvény és bezáró `X` gomb.
     - *Aktuális státusz & Elérhetőségek:* Háromállapotú jelvény (`Nyitva`, `Hamarosan zár`, `Zárva`), pontos cím, kattintható telefonszám (`tel:` hivatkozással azonnali hívásindításhoz) és kattintható e-mail cím (`mailto:` hivatkozással levelezéshez).
     - *Heti nyitvatartási rend:* Hétfőtől Vasárnapig napokra lebontott nyitvatartási idők. Az aktuális nap kiemelésre kerül (kiemelt háttér és `"Ma"` badge). A zárva tartó napoknál `"ZÁRVA"` felirat jelenik meg.
   - **Reszponzivitás:** Mobilon és asztali kijelzőn egyaránt görgethető, érintésbarát felületet nyújt (`max-h-[90vh]`).
   - **Akciógombok:**
     - `"Közeli patikának jelölöm"` / `"Közeli jelölés eltávolítása"` (szinkronizálja a preferált patika állapotot).
     - `"Mutasd térképen"` (bezárja a modalt és ráfókuszál a gyógyszertárra a térképen).
     - `"Bezárás"` (lezárja a modális ablakot).

---

#### 4.3.2. Gyógyszertári Készlet Nézet (Modális Nézet)

- **Funkció:** A Gyógyszer adatlapról a `"Megnézem hol"` gombokkal megnyitható teljes képernyős modális ablak.
- **Működés:** Kizárólag azokat a gyógyszertárakat jeleníti meg a térképen és a kísérő listában, ahol a kiválasztott gyógyszer raktáron van vagy rendelhető.

---

### 4.4. Képzési Program

#### 4.4.1. Képzések Főoldal

A szakmai és akkreditált képzések böngészőfelülete.

**Útvonal:** [https://bvorvosi.vercel.app/kepzesek](https://bvorvosi.vercel.app/kepzesek)

#### Felületi elemek és Szűrők

1. **Kategória Szűrő Fülek:**
   - **Típus:** Horizontális fül-választó (Tabs).
   - **Választható opciók:** `Összes`, `Akkreditált`, `Gyártói`, `Eladásösztönző`.
   - **Alapértelmezett:** `Összes`.

2. **Kurzuskártyák adatai:**
   - Képzés címe, Kategória jelvény (`Akkreditált` - zöld, `Gyártói` - kék, `Eladásösztönző` - sárga), Rövid leírás, Tananyag becsült időtartama (pl. `"45 perc"`), Tartalomtípus ikon (Videó / PDF Dokumentum), `"Részletek"` gomb és `"Érdekel"` gomb. *(Kreditpont a kártyán NEM jelenik meg)*.

3. **"Érdekel" Gomb és BENU LMS Tájékoztató Modal:**
   - A kurzuskártyán lévő `"Érdekel"` gombra kattintva megnyílik a **BENU LMS bemutató modális ablak**.
   - **Tartalom:** Tájékoztató leírás a BENU Képzési Programról, a továbbképzési rendszerről és a kreditpont-gyűjtésről.
   - **Gombok:** `"Tovább a BENU LMS-re"` (külső hivatkozás a tanulási felületre) és `"Bezárás"`.

---

#### 4.4.2. Képzés Részletes Oldal és BENU LMS Integráció

**Útvonal:** `https://bvorvosi.vercel.app/kepzesek/[courseId]`  
*(Példa: [https://bvorvosi.vercel.app/kepzesek/c1](https://bvorvosi.vercel.app/kepzesek/c1))*

#### Adatlap felépítése és működési logika

1. **Bevezető Videó Placeholder:** Képzés fejléce lejátszás gombbal és kategória jelvénnyel.
2. **Tanfolyam Részletei:** Részletes szöveges ismertető a képzésről.
3. **Tartalmi Elemek (Modullista):**
   - *Modul 1:* Bevezető előadás (Videó ikon, időtartam).
   - *Modul 2:* Klinikai adatok és segédanyagok (PDF ikon, diaszám).
   - *Modul 3 (Zárolt):* Záróteszt és Akkreditáció — Felirat: `"A tartalom eléréséhez lépjen be a BENU LMS rendszerbe"`.
4. **Akkreditált Pontok Kártya:** Megszerezhető kreditpontok kijelzése (pl. `2 kreditpont`) + `"Pontszerzés"` gomb (megnyitja az LMS Tájékoztató Modalt).
5. **Hibaállapot:** Nem létező kurzusazonosító esetén `"Tanfolyam nem található"` üzenet és gomb a listára való visszalépéshez.
6. **Üzleti Integráció:** A tananyagok tényleges feldolgozása, a tesztkitöltés és a kreditpontok elismerése a külső BENU LMS rendszerben történik.

---

### 4.5. Globális Keresés

A navigációs fejlécbe épített rendszerszintű instant kereső.

#### Beviteli Mező Specifikáció és Működés
- **Típus:** Egysoros keresőmező kereső ikonnal a fejlécben.
- **Keresési tartomány:**
  - *Gyógyszerek:* Gyógyszer kereskedelmi neve és Hatóanyaga (INN). *(TK-szám alapján a globális kereső nem keres).*
  - *Gyógyszertárak:* Patika neve, Település és Cím.
  - *Közösség:* Fórum témák címe.
- **Működés és Találati Panel:**
  - Már **1 karakter** beírása után megnyílik az élő találati panel.
  - **Kategória fülek:** `Minden`, `Gyógyszerek`, `Patikák`, `Közösség`.
  - **Találati korlátok:** Kategóriánként max. 5 találat jelenik meg, a `Minden` fülön összesen max. 10 találat.
  - **Navigáció találatra kattintva:**
    - Gyógyszer találat → gyógyszer adatlapjára navigál (`/gyogyszerek/adatlap?tk=[tkSzam]`).
    - Gyógyszertár találat → a gyógyszertár keresőre navigál a kiválasztott patika mélylinkjével, fókuszált térképpel és megnyitott adatlapjával (`/gyogyszertarak?id=[pharmacyId]`).
    - Közösségi találat → a közösségi főoldalra navigál (`/kozosseg`).
  - **Lábléc:** `"Összes találat megtekintése"` gomb (jelenleg elvetett/előkészített funkció).

---

### 4.6. Hitelesítés és Jogosultságok

#### 4.6.1. Bejelentkezés Oldal

**Útvonal:** [https://bvorvosi.vercel.app/login](https://bvorvosi.vercel.app/login)

A bejelentkezési felület háromféle belépési módot kínál a fejlécben lévő fülek segítségével:

1. **Jelszavas bejelentkezés (alapértelmezett):**
   - *E-mail cím:* Egysoros email mező. Példa: `demo@example.com`, `admin@example.com`. Kötelező.
   - *Jelszó:* Maszkolt jelszómező. Példa: `vény123`. Kötelező.
   - *"Elfelejtett jelszó?" link:* Átirányítás a `/forgot-password` oldalra.
   - *"Bejelentkezés" gomb:* Beküldéskor ellenőrzi az adatokat.

2. **Passkey biometrikus bejelentkezés (1-kattintásos kényelmi funkció):**
   - *"Belépés Passkey-vel" gomb:* Megnyomása után szimulálja a biometrikus megerősítést (Touch ID / Face ID / Windows Hello) és közvetlenül az Irányítópultra navigál.

3. **E-mail kódos bejelentkezés (Magic Code):**
   - *E-mail cím mező:* Szabványos email mező.
   - *"Egyszeri belépőkód küldése" gomb:* Kiküldi a 6 jegyű belépési kódot és átvált a 2FA nézetre.

#### 4.6.2. Kétfaktoros Azonosítás (2FA) Igazolási Felület

Jelszavas belépés vagy e-mail kód kérése után (ha a 2FA aktív és az eszköz nincs megjegyezve) az alábbi felület jelenik meg:

- **6-jegyű OTP kód mező:** Számszerű beviteli mező (pl. `123456`).
- **"Megbízható eszköz megjegyzése (30 napig)" jelölőnégyzet:** **Alapértelmezetten be van pipálva**. Bejelölve a rendszer 30 napig nem kér 2FA kódot az adott böngészőben.
- **Demó kód kijelzés:** A felületen látható a teszt kód (`123456`).

#### 4.6.3. Elfelejtett Jelszó Oldal

**Útvonal:** [https://bvorvosi.vercel.app/forgot-password](https://bvorvosi.vercel.app/forgot-password)

- *E-mail cím mező:* Szabványos email mező.
- *"Belépési kód küldése" gomb:* Kattintásra a felületen megjelenik a generált 6 jegyű belépési kód prototípus gépelési tájékoztatóval (`"Prototípus mód: ... itt láthatja a belépési kódot"`).
- *Információs alert:* Tájékoztatja a tesztelőt, hogy a prototípusban a generált kóddal nem lehet továbbhaladni, a fix jelszót kell használni.
- *Hivatkozások:* `"Vissza a bejelentkezéshez"` és `"Mégis emlékszem a jelszavamra"`.

#### 4.6.4. Jogosultságkezelés és Munkamenet Biztonság
- Szerepkörök: `Admin` (teljes hozzáférés az `/admin/*` útvonalakhoz) és `User` (szakmai felhasználó).
- **Munkamenet biztonság:** Adminisztrátori fiók-felfüggesztés vagy munkamenet-lezárás (Force Logout) esetén a felhasználó a következő műveletnél azonnal kijelentkeztetésre kerül.

---

### 4.7. Adminisztráció

Kizárólag `Admin` szerepkörrel rendelkező felhasználók számára elérhető felület.

#### 4.7.1. Felhasználókezelés

**Útvonal:** [https://bvorvosi.vercel.app/admin/users](https://bvorvosi.vercel.app/admin/users)

#### Felhasználó Lista és Szerkesztő Modal (Fülek)

- **Táblázat oszlopai:** Név / E-mail cím, Szerepkör (`Admin` / `Orvos`), Fiók státusz (`Aktív` / `Inaktív`), Szakterületek (max 2 megjelenítve + `+N`), Műveleti menü (`⋮`).

1. **Alapadatok Fül (Modal):**
   - *Teljes név:* Egysoros szövegmező. Kötelező.
   - *Elsődleges e-mail cím:* Email mező. Kötelező, egyedi.
   - *Szerepkör (Role):* Legördülő menü (`User` / `Admin`).
   - *Fiók Státusz (Status):* Legördülő menü (`Active` / `Inactive`).

2. **Profil Fül (Modal):**
   - *Másodlagos e-mail cím:* Email mező. Opcionális.
   - *Szakterületek:* Kódlistás multi-select jelölőnégyzet szakterületekből.

3. **Hírlevél Fül (Modal):**
   - Elsődleges és Másodlagos e-mail cím hírlevél preferenciáinak adminisztrátori beállítása.
   - **Kategóriák:** `"Közösség, Fórum"` (kiküldés ideje, rendszeresség, téma, csak saját témák — a kivezetett fórum maradványa) és `"Készletinfó"`.

#### Adminisztrátori Műveletek & Védelmek
- **Deaktiválás / Aktiválás:** Megerősítő dialog. *(Az adminisztrátor saját fiókját nem deaktiválhatja).*
- **Munkamenet Azonnali Lezárása (Force Logout):** Növeli a munkamenet verziót, azonnal kijelentkezteti a felhasználót.
- **Jelszó-visszaállítás kezdeményezése:** Értesítést generál a jelszó-visszaállításról.

---

#### 4.7.2. Fórum és Tartalom Moderálás

**Útvonal:** [https://bvorvosi.vercel.app/admin/forum](https://bvorvosi.vercel.app/admin/forum)

- Témák és Hozzászólások áttekintése (az admin számára a rejtett tartalmak is láthatók).
- **Moderációs műveletek:**
  - *Téma Lezárása / Feloldása:* Lezárt témához nem lehet új hozzászólást fűzni.
  - *Elrejtés / Megjelenítés (Téma és Hozzászólás):* Visszavonható elrejtés toggle (nem törlés!).
  - *Szöveg Szerkesztése:* Téma leírásának vagy hozzászólás szövegének módosítása moderálási céllal.
  - *Szerző Anonimizálása:* Lecseréli a szerző nevét `"Anonim Felhasználó"` feliratra.
  - *Lenyitható komment-lista:* Témánként megtekinthetők és moderálhatók a kapcsolódó hozzászólások.

---

#### 4.7.3. Gyógyszertár Karbantartás

**Útvonal:** [https://bvorvosi.vercel.app/admin/pharmacies](https://bvorvosi.vercel.app/admin/pharmacies)

#### Csak Olvasható Áttekintő Felület Specifikációja

A prototípusban **NINCS patika-szerkesztő űrlap**. A felületen az alábbi tájékoztató látható: *"Az adatok szerkesztése a Patika Kezelő rendszerben történik. Itt csak áttekintő nézet érhető el."*

1. **Gyógyszertárak Lista Oldal:**
   - *Keresőmező:* Keresés név, település, cím vagy BF kód alapján.
   - *Táblázat oszlopai:* BF kód, Név, Település, Cím, Nyitvatartás (ma), Utolsó adatszinkron időpontja, Utolsó készletszinkron időpontja, Részletek gomb.

2. **Részletes Patika Nézet (`/admin/pharmacies/[id]`):**
   - *Patikai alapadatok:* Név, BF kód, Cím, Telefonszám, E-mail, Szinkronidőpontok (olvasható kártyákon).
   - *Termékkészlet Táblázat:* Megjeleníti a patikához tartozó termékeket: TK-szám, Terméknév, Hatóanyag, Kiszerelés, Gyártó, Státusz, Raktári darabszám (`dapieces`).
   - *Táblázatos Funkciók:* Oszloponkénti szűrősor, növekvő/csökkenő rendezés, 25 elemes lapozó, `"Szűrők törlése"` gomb.

---

### 4.8. Felhasználói Profil

A felhasználó saját adataik, preferenciáik és fiókbiztonságuk kezelési központja.

**Útvonal:** [https://bvorvosi.vercel.app/profile](https://bvorvosi.vercel.app/profile)

#### 4.8.1. Személyes Adatok és Szakterületek
- **Név, Elsődleges e-mail, Másodlagos e-mail:** Megjelenítő mezők olvasási módban. *Magyarázó felirat:* `"Szerkesztéséhez keresse az adminisztrációt."`
- **Szakterületek Módosítása:**
  - *Típus:* Kereshető multi-select komponens szakterület keresővel.
  - *Megadható értékek:* Az orvosi szakterület kódlista elemei.
  - *Gomb:* `"Szakterületek mentése"`.

#### 4.8.2. Preferált Gyógyszertár Kezelése
- Megjeleníti a jelenleg kiválasztott preferált patika kártyáját.
- *Gombok:* `"Módosítás"` (megnyitja a modális patikakeresőt) és `"Törlés"` (megerősítő dialogot nyit).

#### 4.8.3. Hírlevél Beállítások Szekció

A profil egyik legterjedelmesebb funkcióblokkja, amely **külön konfigurálható az Elsődleges ÉS a Másodlagos e-mail címre**:

1. **BENU Képzési Program Hírlevél:**
   - *Feliratkozás kapcsoló:* `Be` / `Ki`.
   - *Érdekelt témakörök gombok:* `Akkreditált`, `Gyártói`, `Eladásösztönző`.

2. **Készletinfó Hírlevél:**
   - *Feliratkozás kapcsoló:* `Be` / `Ki`.
   - *Rendszeresség (Select):* `Napi`, `Heti`, `Havi`.
   - *Kiküldés ideje (Számmező):* `0` – `23` óra között.
   - *Téma (Multiselect gombok):* `Újra elérhető`, `Készlethiány`, `Megszűnt`.
   - *Témakör / Hatókör (Select):* `Minden`, `Szakterület + mentett gyógyszerek`, `Csak szakterület`, `Csak mentett gyógyszer`.

#### 4.8.4. Mentett Kedvencek Oldal
- **Útvonal:** [https://bvorvosi.vercel.app/profile/favorites](https://bvorvosi.vercel.app/profile/favorites)
- Tájékoztató infó-kártya, mentett gyógyszerek listája törlési lehetőséggel és értesítések közvetlen kezelésével.

#### 4.8.5. Készletértesítések Oldal
- **Útvonal:** [https://bvorvosi.vercel.app/profile/notifications](https://bvorvosi.vercel.app/profile/notifications)
- Aktív készletértesítések táblázata a **feliratkozás időpontjával** és egykattintásos leiratkozási opcióval.

#### 4.8.6. Biztonság és Kétfaktoros Azonosítás (2FA / Passkey)

1. **Kétfaktoros Azonosítás (2FA) Kapcsoló:**
   - *Kapcsoló:* `Be` / `Ki`.
   - *2FA Csatorna választás:* `E-mail OTP (alapértelmezett)`, `SMS OTP (mobil telefonszámra)`, `Hitelesítő App (TOTP)`. SMS választása esetén megjeleníti a regisztrált telefonszámot.

2. **Passkey Kulcsok Kezelése (Biometria):**
   - *Regisztrált eszközök listája:* Megjeleníti a fiókhoz kapcsolt eszközök nevét és regisztrációs dátumát (pl. `"Work Mac TouchID - 2026-01-15"`).
   - *"Új Passkey" gomb:* Megnyit egy modális ablakot az eszköz nevének megadásához.
   - *Törlés gomb:* Passkey eltávolítása.

3. **Megbízható Eszközök Kezelése:**
   - Kijelzi a 30 napra megjegyzett munkamenetek számát.
   - *"Eszközök elfelejtése" gomb:* Azonnal érvényteleníti az összes megjegyzett eszközt, így a rákövetkező belépéskor minden böngészőben kötelezővé válik a 2FA kód megadása.

4. **Profil alja:** `"Kijelentkezés a rendszerből"` gomb.

---

## 5. Korábban tervezett, de elvetett / külső rendszerbe átsorolt funkciók

Ez a szekció azokat a funkciókat tartalmazza, amelyek korábbi tervekben szerepeltek, de a jelenlegi felületen nem aktívak, módosultak vagy külső rendszerbe kerültek át.

### ~~Közösségi Fórum a Felhasználói Főmenüben~~
> **Státusz:** Nem aktív a fő navigációs menüben – szerepét a Képzési Program vette át.  
> **Elérhetőség:** Korábbi útvonal: `https://bvorvosi.vercel.app/kozosseg`. A témák és hozzászólások közvetlen URL-lel és a globális keresőből továbbra is elérhetők (témalétrehozás, hozzászólások működnek). A moderációs felület az adminisztrációban megmaradt (`/admin/forum`).

### ~~Közösségi Aktivitás Dashboard-Widget~~
> **Státusz:** Elvetve (a kódban explicit `"HASZNÁLATON KÍVÜL"` jelöléssel).  
> Helyét az Irányítópulton a Képzési Program promóciós widget vette át.

### ~~Jelszó Módosítása a Felhasználói Profilban~~
> **Státusz:** Nem aktív a felületen.  
> A profiloldalon az alapadatok csak olvashatók. Jelszó módosításához vagy adategyeztetéshez a felhasználónak az adminisztrációt kell keresnie.

### ~~Betegtájékoztató Letöltése a Gyógyszer Adatlapról~~
> **Státusz:** Tervezett / Jelenleg nem aktív.  
> A kódkommentben szereplő letöltési funkció a prototípusban nem készült el.

### ~~Globális Kereső: "Összes találat megtekintése" Gomb~~
> **Státusz:** Nem funkcionális gomb.  
> A kereső panel láblécében megjelenik, meglévő felületi elem, de nem indít külön találati oldalt.

### ~~Adminisztrációs Gyógyszertár Szerkesztő Űrlap~~
> **Státusz:** Külső rendszerbe átsorolva.  
> Az adminisztrációs felületen nincs patika-szerkesztő űrlap (koordináták, nyitvatartás szerkesztése). A patikaadatok szerkesztése a külső Patika Kezelő rendszerben történik, az admin felület kizárólag áttekintést és készletellenőrzést nyújt.

### ~~Gyógyszer Lista: Kártya Nézet Váltás~~
> **Státusz:** Nem aktív a felületen.  
> A gyógyszerlista a szakmai áttekinthetőség érdekében kizárólag a rendezhető és szűrhető táblázatos nézetben érhető el.

### ~~Gyógyszer Keresés: ATC Kód és Gyártó Alapján a Szabad Szöveges Keresőben~~
> **Státusz:** Nem aktív a szabad szöveges mezőben.  
> A keresőmező Név és Hatóanyag alapján keres. Az ATC kód és Gyártó adatok az oszlopszűrőkben és a kijelölhető oszlopokban érhetők el.

---

## 6. Tesztfiókok és Hozzáférések

> **Megjegyzés:** Az alábbi tesztfiókok a prototípus élő kipróbálására szolgálnak a [https://bvorvosi.vercel.app/login](https://bvorvosi.vercel.app/login) oldalon.

**Minden fiók egységes jelszava:** `vény123`

| # | Fiók neve | Email | Jelszó | Szerepkör | Státusz | Szakterületek | Tesztelési Rendeltetés |
|---|---|---|---|---|---|---|---|
| 1 | Adminisztrátor | `admin@example.com` | `vény123` | Admin | Aktív | – | Adminisztrációs felület és felhasználókezelés tesztelése ([https://bvorvosi.vercel.app/admin/users](https://bvorvosi.vercel.app/admin/users)). |
| 2 | Dr. Kovács István (Orvos) | `demo@example.com` | `vény123` | User | Aktív | Háziorvos, Belgyógyász | Szakmai portál teljes körű tesztelése (keresés, kedvencek, értesítések, profilbeállítások). Az admin felület elérése számára korlátozott. |
| 3 | Dr. Teszt Szabolcs (Inaktív) | `teszt@example.com` | `vény123` | User | Inaktív | Kardiológus | Felfüggesztett/Inaktív fiók bejelentkezési elutasításának és védelmének tesztelése. |

---
