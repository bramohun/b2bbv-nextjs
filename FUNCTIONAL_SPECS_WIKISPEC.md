<!-- 
============================================================================
FUNKCIONÁLIS SPECIFIKÁCIÓ (FRS) - BENUVÉNY ORVOSI PORTÁL FŐDOKUMENTUM
============================================================================

MIRE HASZNÁLJUK:
Ez a dokumentum a BENUvény Orvosi Portál központi funkcionális követelményspecifikációja (Functional Requirements Specification - FRS).
Részletesen rögzíti a rendszer üzleti célját, a felhasználói szerepköröket, az entitások adatmodelljét, 
a beviteli mezőkhöz tartozó adatformátumokat, példákat és korlátokat, az üzleti munkafolyamatokat, 
a bemeneteket, kimeneteket, a felhasználói szintű hibakezelést és az elfogadási kritériumokat.

A DOKUMENTUM JELLEGE:
A leírás szigorúan a funkcionális működésre (mit csináljon a rendszer a felhasználó szemszögéből) 
fókuszál, teljesen mellőzve a belső technológiai implementációs részleteket (keretrendszer, forráskódfájlok, 
belső változónevek). A funkcionális területek a felhasználói útvonalak (webes URL-ek) és felületek mentén 
kerülnek strukturálásra.
============================================================================
-->

# BENUvény orvosi portál funkcionális specifikáció

---

> **Dokumentum azonosító:** FRS-BVO-20261020  
> **Verzió:** 1.7.0  
> **Dátum:** 2026.10.20.  
> **Státusz:** Aktív / Hatályos (Közösségi funkciók és Képzési program teljes kivezetése a hatókörből; kizárólag OTC és vényköteles humán gyógyszerek követése)  
> **Élő prototípus elérhetőség:** [https://bvo.uneb.hu/](https://bvo.uneb.hu/) (tesztfiókok a 6. fejezetben)  

---

## Tartalomjegyzék

1. [Brief és Rendszer Áttekintés](#1-brief)
   - 1.1. Cél és Rendszer Áttekintés
   - 1.2. Megvalósítási Keretek és Szabadság
   - 1.3. Készletinformációk és LogiNet Middleware Integráció
   - 1.4. Kivitelezői Dokumentációs Igények
   - 1.5. Live Prototípus
   - 1.6. Felhasználói Szerepkörök
   - 1.7. Modulok és Felületek Áttekintése
   - 1.8. Akadálymentesség (WCAG 2.2) és Technikai SEO Irányelvek
2. [Fogalomtár](#2-fogalomtár)
3. [Adatmodellek Specifikációja](#3-adatmodellek-specifikációja)
   - 3.1. Felhasználó (User) Adatmodell
   - 3.2. Gyógyszer (Medicine) Adatmodell
   - 3.3. Gyógyszertár (Pharmacy) Adatmodell
   - 3.4. Patikai Készletrekord Adatmodell
   - 3.5. Regisztrációs Igény / Kapcsolatfelvételi Űrlap Adatmodell
4. [Modulok és Funkciók Részletes Leírása](#4-modulok-és-funkciók-részletes-leírása)
   - 4.0. Fejléc és Navigációs Sáv Modul
   - 4.1. Irányítópult (Dashboard)
   - 4.2. Gyógyszer Nyilvántartás (Lista és Adatlap)
   - 4.3. Gyógyszertár Kereső és Térkép
   - 4.4. Globális Keresés (Asztali és Mobil Overlay)
   - 4.5. Hitelesítés, Jogosultságok és Kapcsolatfelvétel
   - 4.6. Adminisztráció (Felhasználók és Patikák)
   - 4.7. Felhasználói Profil és Értesítéskezelés
5. [Korábban tervezett, de elvetett / külső rendszerbe átsorolt funkciók](#5-korábban-tervezett-de-elvetett--külső-rendszerbe-átsorolt-funkciók)
6. [Tesztfiókok és Hozzáférések](#6-tesztfiókok-és-hozzáférések)
7. [Változásnapló (Verziótörténet)](#7-változásnapló-verziótörténet)

---

---

## 1. Brief

### 1.1. Cél és Rendszer Áttekintés
A **BENUvény Orvosi Portál** egy modern, zárt orvosi szakmai információs és döntéstámogató rendszer, amely hiteles segítséget nyújt a gyógyszerészek, orvosok és egészségügyi szakemberek mindennapi betegellátási munkájában.

A portál elsődleges üzleti küldetése, hogy valós idejű, átlátható és megbízható tájékoztatást adjon:
1. **Gyógyszerkészletekről és piaci hiányokról:** Az országos szintű hiánycikkekről, a gyártási fennakadásokról, valamint a készletpótlás várható idejéről.
   > [!IMPORTANT]
   > **Státuszkövetési Hatókör (Termékköri Scope):**
   > A portál státuszkövetési funkcionalitása (piaci hiányok, kivonások, elérhetőség, valamint gyógyszertári polckészletek) **szigorúan és kizárólag a humán gyógyszerek alábbi két kategóriájára terjed ki:**
   > - **OTC (Over-The-Counter / Vény nélkül kapható gyógyszerek):** Hivatalosan törzskönyvezett humán gyógyszerek, amelyek orvosi rendelvény nélkül is kiadhatók a patikákban.
   > - **Vényköteles gyógyszerek (Rx):** Kizárólag orvosi rendelvényre (receptre) expediálható törzskönyvezett humán gyógyszerek.
   >
   > **Kizárt kategóriák (Nem követett termékstátuszok):** A rendszer határozottan **NEM követi** az egyéb nem gyógyszer besorolású patikai cikkek (étrend-kiegészítők, vitaminok és ásványi anyagok [nem gyógyszer formában], gyógyhatású készítmények, dermokozmetikumok, tápszerek, orvostechnikai eszközök, gyógyászati segédeszközök, kötszerek, diagnosztikai tesztek és egyéb drogéria áruk) készlet- és piaci státuszait. Ez biztosítja a rendszer orvosszakmai tisztaságát, magas megbízhatóságát és a betegellátási terápia közvetlen döntéstámogatását.
2. **Készítmények helyettesíthetőségéről:** Azonnali terápiás és hatóanyag-alapú (INN) alternatívák felkínálásával, elkerülve a betegek kezelésének megszakadását.
3. **Gyógyszertári elérhetőségről:** A legközelebbi vagy kijelölt preferált gyógyszertár naprakész polckészletéről, nyitvatartásáról és elérhetőségéről.

### 1.2. Megvalósítási Keretek és Szabadság
A specifikáció és a kapcsolódó prototípus kizárólag a rendszer üzleti és funkcionális működését, a felhasználói folyamatokat, az adatstruktúrákat és a felületi viselkedési szabályokat határozza meg.
- **Kivitelezői kompetencia:** A fejlesztési környezet, a technológiai keretrendszerek, az adatbázis-architektúra, a tárolási és gyorsítótárazási mechanizmusok megválasztása a kivitelező fejlesztő partner hatásköre.
- **Megvalósítási szabadság:** A kivitelező felelős a hosszú távon skálázható, magas rendelkezésre állású, robusztus és biztonságos architektúra szállításáért.

### 1.3. Készletinformációk és LogiNet Middleware Integráció
A portál alapvető értékajánlata a pontos és gyors készlet- és hiányinformációk elérése:
- **Integrációs alapok:** A gyógyszertári és piaci készletinformációk átadása, lekérdezése és szinkronizációja a BENU ökoszisztéma alapjainak megfelelően, a **LogiNet Middleware** rétegen keresztül valósul meg.
- **Rendszervizsgálat és Audit szükségessége:** Kiemelten fontos és kötelező lépés a meglévő LogiNet Middleware interfészeinek, adatmodelljeinek, válaszidejének és kapacitásának alapos funkcionális felmérése és auditja a végleges élesítés előtt.
- **Piaci Készlethiány Adatforrások Konszolidációja:** A piaci készlethiány meghatározása a LogiNet Middleware hálózati készletadatai, valamint a Nemzeti Népegészségügyi és Gyógyszerészeti Központ (NNGYK / korábbi OGYÉI) hivatalos termékhiány-nyilvántartásának háttérbeli konszolidációjával történik a maximális adathitelesség érdekében (az OGYÉI CSV nyers adatai közvetlenül nem jelennek meg a felületen).

### 1.4. Kivitelezői Dokumentációs Igények
A kockázatmentes implementáció érdekében a kivitelező partnerek feladata meghatározni, hogy a meglévő rendszerekből milyen műszaki és funkcionális interfész-leírásokra (API specifikációk, végponti dokumentációk, hitelesítési eljárások, tesztkörnyezeti adatok) van szükség az integrációhoz.

### 1.5. Live Prototípus
A működő, tesztelhető prototípus felülete nyilvánosan elérhető az alábbi címen:  
🔗 [https://bvo.uneb.hu/](https://bvo.uneb.hu/)  
*(Tesztfiókok és bejelentkezési adatok a [6. fejezetben](#6-tesztfiókok-és-hozzáférések) találhatók).*

### 1.6. Felhasználói Szerepkörök
A rendszerben két alapvető szerepkör létezik:
1. **Szakmai Felhasználó (User):** Orvos, gyógyszerész vagy regisztrált egészségügyi szakdolgozó. Teljes körűen hozzáfér a gyógyszer-nyilvántartáshoz, patikakeresőhöz, kedvencekhez, értesítésekhez és a saját profiljához. Nem éri el az adminisztrációs felületeket.
2. **Rendszeradminisztrátor (Admin):** Az üzemeltetésért felelős belső felhasználó. A szakmai felületeken felül hozzáfér a védett `/admin/*` útvonalakhoz: kezeli a felhasználói fiókokat és felügyeli a patikai adatok szinkronizációját.

### 1.7. Modulok és Felületek Áttekintése

| Modul Megnevezése | Elsődleges Felületi Útvonal (URL) | Fő Funkcionális Felelősség | Felületi Státusz |
| :--- | :--- | :--- | :--- |
| **Fejléc & Navigációs Sáv** | Globális komponens | Kereső, gyorslista, közeli patika kijelző, modulváltás, profil menü. | **Aktív** |
| **Irányítópult (Dashboard)** | `https://bvo.uneb.hu/dashboard` | Időszakos készletváltozások, preferált patika widget, gyors navigáció. | **Aktív** |
| **Gyógyszer Nyilvántartás** | `https://bvo.uneb.hu/gyogyszerek` | Teljes képernyős fluid táblázat, oszloprendezés, szűrés, kedvencek. | **Aktív** |
| **Gyógyszer Adatlap** | `https://bvo.uneb.hu/gyogyszerek/adatlap` | 4 szintű készletstátusz, árak, hiánybannerek, helyettesítők, történet. | **Aktív** |
| **Gyógyszertár Kereső** | `https://bvo.uneb.hu/gyogyszertarak` | Térkép, szinkronizált kártyalista, GPS helymeghatározás, heti rend modal. | **Aktív** |
| **Globális Keresés** | Globális / Mobil Overlay | Instant keresés gyógyszerek, hatóanyagok és patikák között. | **Aktív** |
| **Hitelesítés & Jogosultság** | `https://bvo.uneb.hu/login` | Jelszavas, Passkey és Magic Code belépés, 2FA, kapcsolatfelvételi űrlap. | **Aktív** |
| **Felhasználói Profil** | `https://bvo.uneb.hu/profile` | Szakterületek, preferált patika, hírlevelek, biztonság, 2FA, passkey. | **Aktív** |
| **Adminisztráció** | `https://bvo.uneb.hu/admin/*` | Felhasználók kezelése, patikák felügyelete és készletellenőrzés. | **Aktív** |

### 1.8. Akadálymentesség (WCAG 2.2) és Technikai SEO Irányelvek

A rendszer felületi megvalósításakor az alábbi elvek tekintendők irányadónak az akadálymentesség és a technikai keresőoptimalizálás kapcsán:

1. **Akadálymentesség és WCAG 2.2 Sztenderdek:**
   - **Törekedni kell a betartására (Jó gyakorlat):** A felületfejlesztés során törekedni kell az ésszerű ergonómiai és WCAG 2.2 irányelvek (kontrasztos megjelenés, olvasható betűméretek, egyértelmű interaktív elemek, alapvető billentyűzet-navigáció) betartására.
   - **Nem szigorú követelmény a maximális megfelelőség:** Tekintettel arra, hogy a portál **publikusan nem elérhető** (zártkörű, hatósági orvosi/gyógyszerészi azonosításhoz kötött szakmai rendszer), valamint a célcsoport (orvosok, gyógyszerészek) **jellemzően nincsen akadályoztatva**, a fejlesztés során **nem követelmény a maximális (pl. AAA) szintű akadálymentességi előírások betartása**, erre külön túlzott erőforrást nem szükséges fordítani.

2. **Technikai SEO és Böngészőhasználatot Segítő Megoldások:**
   - **Klasszikus SEO mentesség:** Mivel a portál zárt szakmai megoldás, **nem kötelező betartani a klasszikus keresőmotor-optimalizálási (SEO) irányelveket** (pl. külső keresőindexelés engedélyezése, meta leírások keresőrobotoknak, strukturált sémaadatok, webhelytérkép).
   - **Böngészést és lapfül-azonosítást segítő megoldások:** Ezzel szemben elvárt és kötelező a szakemberek mindennapi, gyakran több lapfüles munkavégzését támogató böngésző segítő megoldások alkalmazása:
     - **Kötelező Lapfül Cím (`<title>`) Struktúra:** Minden egyes belső és publikus felületi oldalnak rendelkeznie kell egyértelmű, funkciót tükröző HTML lapfülcímmel az alábbi egységes formátumban:
       `"{lap neve} | BENUvény Orvosi Portál"`  
       *Példák:*
       - `Irányítópult | BENUvény Orvosi Portál`
       - `Gyógyszerek | BENUvény Orvosi Portál`
       - `Gyógyszertárak | BENUvény Orvosi Portál`
       - `Profilom | BENUvény Orvosi Portál`
       - `Bejelentkezés | BENUvény Orvosi Portál`
       - `Adminisztráció | BENUvény Orvosi Portál`
     - **Kedvenc Ikon (Favicon):** A böngészőfülön kötelezően meg kell jelennie a hivatalos kék/zöld BENU embléma ikonjának, hogy a más lapok (orvosi szoftverek, EESZT, szakmai adatbázisok) között azonnal felismerhető legyen.

---

---

## 2. Fogalomtár

### 2.1. Piaci Gyógyszerkészlet
A gyártói és országos nagykereskedelmi szinten nyilvántartott elérhetőség:
- **Elérhető:** A készítmény a gyártótól és a nagykereskedőktől zavartalanul rendelhető.
- **Készlethiány:** Országos szintű átmeneti ellátási zavar, gyártói fennakadás.
- **Megszűnt:** A gyártó vagy a hatóság véglegesen kivonta a forgalomból.

### 2.2. Gyógyszertári Készlet (Polckészlet)
Egy adott konkrét fizikai gyógyszertárban (BF kód alapján azonosítva) rendelkezésre álló valós idejű darabszám.

### 2.3. Helyettesíthetőség (Terápiás és Hatóanyag Ekvivalencia)
Amennyiben egy készítmény hiánycikk vagy megszűnt, a rendszer azonos hatóanyag (INN) és anatómiai/terápiás osztály (ATC) alapján felkínálja az orvos számára a rendelhető, készleten lévő alternatívákat.

### 2.4. Készletértesítés
Feliratkozás egy adott gyógyszer országos vagy helyi státuszváltozására (harang ikon). Készlethiány megszűnésekor vagy újra elérhető állapotba kerüléskor a rendszer automatikus e-mail értesítőt / hírlevelet küld. Az értesítés bekapcsolása automatikusan a kedvencek közé is menti a gyógyszert.

### 2.5. A Négy Készletstátusz (Készletelérhetőségi Szintek)
A rendszer a készítmények elérhetőségét négy üzleti állapotba sorolja:
1. **Készleten:** A termék a patikában fizikai polckészleten van, és a nagykereskedelemből is folyamatosan utánpótolható.
2. **Korlátozottan:** A termék országosan hiánycikk vagy megszűnt, a nagykereskedelemből nem rendelhető, de a patikában még maradt elfekvő készlet.
3. **Rendelésre (1-2 munkanap):** A termék a nagykereskedelemben van, de a patika polcán épp nincs, rendelésre 1-2 munkanap alatt megérkezik.
4. **Nem elérhető:** A készítmény sem a patikában, sem a nagykereskedelemben nem érhető el (pl. tartós hiánycikk).

### 2.6. TK-szám (Törzskönyvi Szám)
A gyógyszerkészítmények hivatalos hatósági azonosítója (pl. `"OGYI-T-8898/01"`).

### 2.7. INN (Nemzetközi Szabadnév / Hatóanyag)
A gyógyszer aktív hatóanyagának hivatalos nemzetközi elnevezése (pl. `"metamizol-nátrium"`). A portál ezen az alapon határozza meg a helyettesíthetőséget.

### 2.8. ATC-kód
Az Egészségügyi Világszervezet (WHO) Anatómiai, Terápiás és Kémiai osztályozási kódja (pl. `"N02BB02"`).

### 2.9. Passkey (Biometrikus Azonosító)
FIDO2 szabványon alapuló eszközalapú azonosítás (Face ID, Touch ID, Windows Hello), amely jelszó megadása nélkül, 1-kattintásos biztonságos belépést nyújt.

### 2.10. Kényszerített Munkamenet Lezárás (Force Logout)
Adminisztrátori biztonsági művelet, amely érvényteleníti a felhasználó aktív bejelentkezési munkamenetét, azonnal kijelentkeztetve a fiókot a rendszerből.

### 2.11. Manuális Regisztrációs Igény / Kapcsolatfelvétel
A portál zárt jellege miatt nincs automatikus azonnali önkiszolgáló fióknyitás. Az új szakmai érdeklődők a bejelentkezési oldalról elérhető űrlap beküldésével veszik fel a kapcsolatot az üzemeltetéssel, akik hatósági pecsétszám-ellenőrzés után kézzel aktiválják a fiókot.

### 2.12. Státuszkövetési Hatókör: Kizárólag OTC és Vényköteles Termékek
A gyógyszerészeti nyilvántartásban és készletkezelésben a rendszer a státuszok követését (piaci szinten: `Elérhető`, `Készlethiány`, `Megszűnt`; gyógyszertári polcszinten: `Készleten`, `Korlátozottan`, `Rendelésre (1-2 munkanap)`, `Nem elérhető`) szigorúan csak két termékkörre alkalmazza:
1. **OTC (Over-The-Counter / Vény nélkül kapható gyógyszer):** Hatóságilag törzskönyvezett humán gyógyszerkészítmény, mely vény nélkül kapható.
2. **Vényköteles (Rx) Gyógyszer:** Hatóságilag törzskönyvezett humán gyógyszerkészítmény, mely kizárólag orvosi rendelvényre (receptre) adható ki.
*Egyéb termékek:* A gyógyszertári forgalomban jelen lévő nem gyógyszer termékek (pl. étrend-kiegészítők, gyógyhatású készítmények, kozmetikumok, gyógyászati segédeszközök) státuszait a rendszer nem követi.

---

---

## 3. Adatmodellek Specifikációja

Ez a szakasz a rendszer üzleti entitásainak felületi paramétereit részletezi: beviteli típusok, formátumok, példaértékek és megkötések.

### 3.1. Felhasználó (User) Adatmodell

- **Teljes név:**
  - **Felületi Típus:** Egysoros szövegmező
  - **Megadható Formátum:** Titulus + Vezetéknév + Keresztnév
  - **Példa Érték:** `"Dr. Kovács István"`
  - **Limitációk:** Kötelező. 3–100 karakter. A felhasználói profilban csak olvasható, kizárólag admin módosíthatja.
- **Elsődleges e-mail cím:**
  - **Felületi Típus:** Egysoros email mező
  - **Megadható Formátum:** Érvényes e-mail szintaxis (`felhasznalo@domain.hu`)
  - **Példa Érték:** `"demo@example.com"`
  - **Limitációk:** Kötelező. Rendszerszinten egyedi belépési azonosító. A profilban nem módosítható.
- **Másodlagos e-mail cím:**
  - **Felületi Típus:** Egysoros email mező
  - **Megadható Formátum:** Érvényes e-mail szintaxis
  - **Példa Érték:** `"kovacs.magan@orvos.hu"`
  - **Limitációk:** Opcionális. Külön hírlevél és értesítési szabályok köthetők hozzá.
- **Telefonszám:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Formátum:** Nemzetközi telefonszám formátum
  - **Példa Érték:** `"+36 30 123 4567"`
  - **Limitációk:** Opcionális. SMS alapú 2FA azonosítás használatához szükséges.
- **Szerepkör:**
  - **Felületi Típus:** Legördülő menü
  - **Megadható Értékek:** `User` (Szakmai felhasználó) / `Admin` (Rendszeradminisztrátor)
  - **Példa Érték:** `User`
  - **Limitációk:** Kötelező. Csak az adminisztrációban állítható.
- **Fiók Státusz:**
  - **Felületi Típus:** Legördülő menü
  - **Megadható Értékek:** `Active` (Aktív) / `Inactive` (Inaktív)
  - **Példa Érték:** `Active`
  - **Limitációk:** Inaktív státusz esetén a rendszer megtagadja a belépést.
- **Szakterületek:**
  - **Felületi Típus:** Kereshető többválasztós lista (Multi-select)
  - **Megadható Értékek:** Szabványos orvosi szakvizsgák listája
  - **Példa Érték:** `["Háziorvostan", "Belgyógyászat", "Kardiológia"]`
  - **Limitációk:** Minimum 1 szakterület kiválasztása ajánlott.
- **2FA Beállítások:**
  - **Felületi Típus:** Kétállású kapcsoló + Választógombok (Radio buttons)
  - **Megadható Értékek:** Státusz: `Be` / `Ki`; Csatornák: `E-mail OTP`, `SMS OTP`, `Hitelesítő App (TOTP)`
  - **Példa Érték:** `Be (E-mail OTP)`
  - **Limitációk:** A profiloldalon önkiszolgáló módon konfigurálható.
- **Passkey Kulcsok:**
  - **Felületi Típus:** Lista + Modális ablak
  - **Megadható Formátum:** Eszköz elnevezése (tetszőleges szöveg) + Regisztráció időpontja
  - **Példa Érték:** `"Rendelői MacBook Pro (Touch ID)"`
- **Megbízható Eszközök:**
  - **Felületi Típus:** Információs mező + Törlés gomb
  - **Megadható Érték:** Aktív 30 napos munkamenetek száma
  - **Példa Érték:** `"1 aktív eszköz"`

### 3.2. Gyógyszer (Medicine) Adatmodell

- **TK-szám (Törzskönyvi szám):**
  - **Felületi Típus:** Szöveges kód
  - **Példa Érték:** `"OGYI-T-8898/01"`
  - **Limitációk:** Elsődleges termékazonosító, nem módosítható.
- **Kereskedelmi Név:**
  - **Felületi Típus:** Szöveg / Kiemelt cím
  - **Példa Érték:** `"Algopyrin 500 mg tabletta"`
- **Hatóanyag (INN):**
  - **Felületi Típus:** Szöveg
  - **Példa Érték:** `"metamizol-nátrium"`
- **ATC Kód:**
  - **Felületi Típus:** 7 karakteres kód
  - **Példa Érték:** `"N02BB02"`
- **Kiszerelés:**
  - **Felületi Típus:** Szöveges leírás
  - **Példa Érték:** `"10x buborékcsomagolásban"`
- **Gyártó / Forgalomba hozatali engedély jogosultja:**
  - **Felületi Típus:** Szöveg
  - **Példa Érték:** `"Sanofi-Aventis Zrt."`
- **Országos Piaci Státusz:**
  - **Megadható Értékek:** `Elérhető` (zöld pill) / `Készlethiány` (sárga/narancs pill) / `Megszűnt` (piros pill)
- **Helyi Készletelérhetőségi Szint (Patikai Státusz):**
  - **Megadható Értékek:** `Készleten` / `Korlátozottan` / `Rendelésre (1-2 munkanap)` / `Nem elérhető`
- **Bruttó Fogyasztói Ár:**
  - **Felületi Típus:** Pénzösszeg (HUF)
  - **Példa Érték:** `"2 490 Ft"`
- **Támogatási Kategória (Kiadhatóság):**
  - **Példa Érték:** `"Vényköteles (Rx)"` / `"Nem vényköteles (OTC)"`
- **Hiányinformációk (Csak hiány esetén):**
  - **Hiány kezdete:** Dátum (`"2026.01.15."`)
  - **Várható befejezése:** Dátum vagy `"Bizonytalan"`
  - **Hivatalos ok:** Szöveg (pl. `"Gyártási kapacitáshiány"`)
  - **Terápiás javaslat:** Szöveg (helyettesítő INN készítmények listája)

### 3.3. Gyógyszertár (Pharmacy) Adatmodell

- **Gyógyszertár Azonosító (BF kód):**
  - **Felületi Típus:** Szöveges kód
  - **Példa Érték:** `"BF001"`
  - **Limitációk:** Egyedi belső patikaazonosító.
- **Gyógyszertár Neve:**
  - **Felületi Típus:** Szövegmező / Kattintható cím
  - **Példa Érték:** `"BENU Gyógyszertár Arany Sas"`
- **Cím Adatok:**
  - **Irányítószám:** 4 számjegy (pl. `"1052"`)
  - **Település / Város:** Szöveg (pl. `"Budapest"`)
  - **Közterület, házszám:** Szöveg (pl. `"Károly körút 1."`)
  - **Vármegye:** Szöveg (pl. `"Budapest"`)
- **Földrajzi Koordináták:**
  - **Szélesség (Lat):** Számérték (pl. `47.4979`)
  - **Hosszúság (Lng):** Számérték (pl. `19.0543`)
  - **Limitációk:** Térképi pozicionáláshoz és távolságszámításhoz szükséges.
- **Heti Nyitvatartás:**
  - **Megadható Formátum:** Hétfőtől vasárnapig naponta nyitási-zárási idő (pl. `"08:00 - 19:00"`) vagy `"Zárva"`
  - **Példa Érték:** H-P: 08:00-19:00, Szo: 08:00-14:00, V: Zárva
- **Elérhetőségek:**
  - **Telefonszám:** Hívható formátum (pl. `"+36 1 234 5678"`)
  - **E-mail cím:** Kattintható levélcím (pl. `"aranysas@benu.hu"`)

### 3.4. Patikai Készletrekord Adatmodell

- **TK-szám:** Hivatkozott gyógyszerkészítmény kódja
- **Raktári darabszám:** Pozitív egész szám (pl. `14 db`)
- **Patikai státuszbesorolás:** `Készleten` / `Korlátozottan` / `Rendelésre` / `Nem elérhető`
- **Utolsó készletszinkron:** Időbélyeg (pl. `2026.10.20 08:30:15`)

### 3.5. Regisztrációs Igény / Kapcsolatfelvételi Űrlap Adatmodell

- **Teljes név:** Szöveg (pl. `"Dr. Szabó Péter"`) — Kötelező
- **Szakmai e-mail cím:** E-mail (pl. `"szabo.peter@haziorvos.hu"`) — Kötelező
- **Telefonszám:** Nemzetközi telefonszám (pl. `"+36 20 987 6543"`) — Kötelező
- **Pecsétszám (Működési nyilvántartási szám):** 5–6 számjegy (pl. `"76543"`) — Kötelező orvosi azonosító
- **Szakterület / Munkahely:** Szöveg (pl. `"Háziorvosi Rendelő, Szeged"`) — Kötelező
- **Megjegyzés / Üzenet:** Többsoros szövegmező — Opcionális
- **Adatkezelési nyilatkozat:** Jelölőnégyzet — Kötelezően elfogadandó

---

---

## 4. Modulok és Funkciók Részletes Leírása

### 4.0. Fejléc és Navigációs Sáv Modul

A portál minden oldalának tetején rögzített (sticky), központi navigációs vezérlősávja.

#### 4.0.1. Működés és Felületi Elemek
1. **Arculat és Főoldali Navigáció:**
   - A hivatalos sötétkék/zöld **BENU VÉNY** embléma bal oldalt található.
   - Rákattintva az Irányítópultra (`https://bvo.uneb.hu/dashboard`) visz.
2. **Központi Globális Keresősáv:**
   - Asztali nézetben közvetlen beviteli mező élő lenyíló találati ablakkal (Gyógyszerek és Patikák között).
   - Mobilon érinthető nagyító gomb, amely teljes képernyős keresőfelületet (overlay-t) nyit meg.
3. **Közeli Patika Kijelző és Gyorsválasztó:**
   - Kiemelt mező a fejléc jobb oldalán: zöld aláhúzott patikanév (pl. *"BENU Gyógyszertár Arany Sas"*).
   - Ha még nincs kijelölt patika: *"Válasszon gyógyszertárat"* szöveg jelenik meg.
   - Rákattintva azonnal felugrik a teljes képernyős interaktív **Patikaválasztó Modális Ablak** (`PharmacyFinder`), ahol új preferált patika jelölhető ki.
4. **Ikonos Főmenü Pontok (Vertikális elrendezés):**
   - **Irányítópult:** Navigáció a főoldalra (`/dashboard`).
   - **Gyógyszer:** Navigáció a teljes gyógyszer-nyilvántartáshoz (`/gyogyszerek`).
   - **Gyógyszertár:** Navigáció a térképes patikakeresőhöz (`/gyogyszertarak`).
   - **Mentett (Könyvjelzők):** Kék számláló badge mutatja az elmentett gyógyszerek számát. Kattintásra controlled lebegő gyorslista nyílik meg, tetején az *"Összes"* linkkel.
   - **Profil Menü:** Felhasználó neve, szerepköre, közvetlen link a profilbeállításokhoz, valamint a Kijelentkezés gomb.
5. **Mobil Navigáció (<1024px):**
   - Bal oldali Hamburger menü gomb, amely lenyíló mobil menüpanelt nyit meg az összes fő navigációs útvonallal.

#### 4.0.2. Bemenetek és Kimenetek
- **Bemenet:** Menüelemekre történő kattintás, Patikaválasztó megnyitása, Mentett lista lenyitása, *"Összes"* gombra kattintás.
- **Kimenet:** Útvonalváltás (URL navigáció), modális ablak vagy legördülő panel megjelenítése, kijelölt patikanév azonnali felületi frissülése.

#### 4.0.3. Hibakezelés és Speciális Esetek
- **Hálózati késleltetés patikaválasztáskor:** A kijelölés azonnal helyi állapotba kerül, a mentés háttérben fut le, biztosítva az akadásmentes élményt.
- **Nincs mentett gyógyszer:** A Mentett gyorslista megnyitásakor üres állapotot jelző szöveg jelenik meg (*"Nincs még mentett gyógyszered."*).

#### 4.0.4. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.0.1:** A fejléc logójára kattintva a rendszer minden esetben az Irányítópultra navigál.
- **AC-4.0.2:** A Közeli patika gombra kattintva felugrik a kereső modal, és a választott patika azonnal megjelenik a fejlécben.
- **AC-4.0.3:** A Mentett gyorslistában az "Összes" linkre kattintva a felület a gyógyszerlistára navigál kizárólag a mentett kedvencekre szűrve (`onlyFavorites=true`).
- **AC-4.0.4:** A Profil menü Kijelentkezés gombjára kattintva a munkamenet azonnal érvényét veszti és a login oldal nyílik meg.
- **AC-4.0.5:** Minden oldal lapfülcíme kötelezően a `"{lap neve} | BENUvény Orvosi Portál"` formátumban jelenik meg.

---

### 4.1. Irányítópult (Dashboard)

A sikeres bejelentkezést követő központi áttekintő felület.

**Útvonal:** [https://bvo.uneb.hu/dashboard](https://bvo.uneb.hu/dashboard)

#### 4.1.1. Működés és Képernyőfelépítés
Kétoszlopos modern reszponzív elrendezés (Figma elrendezési minták alapján):
1. **Bal oldali oszlop (Globális készletváltozások):**
   - **Időszak-választó Kapszula:** `Elmúlt 3 nap` (alapértelmezett), `Elmúlt 1 nap`, `Elmúlt 7 nap`, `Elmúlt 30 nap`.
   - **Globális Figyelmeztető Kártya:** Sárga keretes összesítő, amely mutatja az adott időszakban bekövetkezett változásokat: összes változás, megszűnt, készlethiány és újra elérhető tételek száma. A készlethiány számlálóra kattintva azonnali gyorsszűrt átnavigálás történik a gyógyszerlistára.
   - **Legutóbbi Készletváltozások Táblázat:** A legfrissebb 20 piaci készletmozgás listája: gyógyszernév, hatóanyag, kiszerelés, gyártó, országos státusz pill, és közvetlen adatlap link.
2. **Jobb oldali oszlop (Közeli Gyógyszertár állapota):**
   - **Ha nincs preferált patika:** Kiemelt figyelmeztető doboz nagy térkép-illusztrációval és *"Patika keresése"* gombbal, amely megnyitja a keresőt.
   - **Ha van kijelölt preferált patika:** A gyógyszertár neve, címe, heti nyitvatartási összefoglalója, valamint a patika saját, helyi készletmozgásainak összesítője és táblázata.

#### 4.1.2. Bemenetek és Kimenetek
- **Bemenet:** Időszakválasztó gombokra kattintás (1, 3, 7, 30 nap), összesítő számlálóra kattintás, táblázati sorra kattintás.
- **Kimenet:** A statisztikák és a táblázat adatainak azonnali frissülése, átnavigálás a gyógyszerlistára előszűrt státusszal.

#### 4.1.3. Hibakezelés a Dashboardon
- **Nincs készletváltozás az adott időszakban:** A táblázat helyén diszkrét, tiszta információs sáv jelenik meg: *"A kiválasztott időszakban nem történt készletváltozás."*
- **Kieső patikaadatok:** Amennyiben a beállított preferált patika adatai nem tölthetők be, a rendszer automatikusan felajánlja a patikaválasztó újbóli megnyitását.

#### 4.1.4. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.1.1:** Az időszakválasztó gombokra kattintva a kártyák és a táblázat adatai oldalújratöltés nélkül, azonnal frissülnek.
- **AC-4.1.2:** Az összesítő kártyán a hiánycikkek számára kattintva a gyógyszerlista nyílik meg, automatikusan `Készlethiány` szűrővel.
- **AC-4.1.3:** Kijelölt preferált patika esetén a jobb oldali panel kizárólag az adott patika valós helyi készletmozgásait jeleníti meg.
- **AC-4.1.4:** Az Irányítópulton megjelenő adatok kizárólag az OTC és vényköteles humán gyógyszerek készletmozgásait tartalmazzák; egyéb termékek nem jelenhetnek meg.

---

### 4.2. Gyógyszer Nyilvántartás (Lista és Adatlap)

A portál központi munkafelülete a gyógyszerek keresésére, szűrésére és az adatlapi információk megtekintésére.

#### 4.2.1. Gyógyszerlista Oldal
**Útvonal:** [https://bvo.uneb.hu/gyogyszerek](https://bvo.uneb.hu/gyogyszerek)

1. **Fluid (Teljes Képernyőszélességű) Elrendezés:**
   - A táblázat a rendelkezésre álló teljes monitor-szélességet kihasználja (`w-full`), minimalizálva a szükségtelen vízszintes görgetést nagyméretű monitorokon.
2. **Keresési és Szűrési Vezérlősáv (Toolbar):**
   - Élő szöveges szűrő: azonnal keres gyógyszernévben, hatóanyagban és TK-számban.
   - Piaci Státusz Szűrő: `Minden státusz`, `Elérhető`, `Készlethiány`, `Megszűnt`.
   - Preferált Patika Készlet Szűrő: `Minden`, `Készleten`, `Korlátozottan`, `Rendelésre (1-2 munkanap)`, `Nem elérhető`.
   - *"Csak mentett gyógyszerek"* kapcsoló: kizárólag a könyvjelzőzött tételeket mutatja.
   - *"Csak szakterületem"* gomb: automatikusan az orvos profiljában megjelölt szakterületekhez tartozó készítményeket szűri.
3. **Interaktív Táblázat Tulajdonságai:**
   - **Drag & Drop Oszlopátrendezés:** Az oszlopfejlécek tetszőleges sorrendbe húzhatók; a beállított sorrend a böngészőben megőrződik.
   - **Oszlopkezelő Modál:** Az oszlopok láthatósága egyénileg ki-be kapcsolható.
   - **Rögzített (Sticky) Műveletek Oszlop:** A táblázat jobb szélén lévő műveleti oszlop (Adatlap megtekintése, Kedvenc csillag, Készletértesítő harang) vízszintes görgetés esetén is a képernyő jobb szélén rögzítve marad.
   - **Rendezhetőség:** Oszlopfejlécekre kattintva növekvő/csökkenő rendezés (név, ár, dátum stb.).

#### 4.2.2. Gyógyszer Részletes Adatlap
**Útvonal:** [https://bvo.uneb.hu/gyogyszerek/adatlap?tk=[tkSzam]](https://bvo.uneb.hu/gyogyszerek/adatlap) (Példa: `/gyogyszerek/adatlap?tk=OGYI-T-8898/01`)

1. **Termék Fejléc és Kulcsazonosítók:**
   - Kereskedelmi név, hatóanyag (INN), kiszerelés, gyártó, hivatalos TK-szám és ATC-kód.
   - Piaci státuszbadge (`Elérhető` / `Készlethiány` / `Megszűnt`) és utolsó adatszinkron időpontja.
2. **Készlethiány Figyelmeztető Doboz (Csak hiány esetén):**
   - Sárga kiemelt szekció: hiány kezdete, várható megszűnése, hivatalos indoklás és szakmai pótlási javaslat.
3. **Preferált Patika Helyi Készletkártyája:**
   - Megjeleníti a kijelölt gyógyszertár nevét, címét, nyitvatartását és a 4 szintű helyi készletbesorolást (`Készleten`, `Korlátozottan`, `Rendelésre`, `Nem elérhető`).
   - A patikanévre kattintva helyben felugrik a **Gyógyszertár Részletek Modál** a nyitvatartási renddel anélkül, hogy elhagynánk az adatlapot.
4. **Helyettesíthetőség (Terápiás Alternatívák):**
   - Azonos hatóanyagú (INN) vagy azonos terápiás csoportba tartozó helyettesítő készítmények listája készletelérhetőségi adatokkal és árakkal.
5. **Készletváltozási Előzmények (Történet):**
   - Időrendi lista a készítmény korábbi státuszváltozásairól (dátum, korábbi állapot, új állapot).

#### 4.2.3. Bemenetek és Kimenetek
- **Bemenet:** Keresési karakterek beírása, szűrőpill-ek váltása, oszlopok áthúzása, könyvjelző/értesítés ikonok kattintása.
- **Kimenet:** Valós idejű táblázatszűrés, adatlap megnyitása, modális ablak felugrása, könyvjelző számláló növekedése a fejlécben.

#### 4.2.4. Hibakezelés a Gyógyszer Modulban
- **Nincs találat a szűrésre:** A táblázatban megjelenik a *"Nincs a keresési feltételeknek megfelelő gyógyszer"* felirat, valamint a *"Szűrők törlése"* akciógomb.
- **Érvénytelen TK-szám az adatlapon:** Ha az URL-ben nem létező azonosító szerepel, a rendszer információs képernyőt jelenít meg: *"A keresett gyógyszer nem található"*, felkínálva a visszatérést a gyógyszerlistához.

#### 4.2.5. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.2.1:** Az oszlopok Drag & Drop átrendezése azonnal működik és az új sorrend újratöltés után is megmarad.
- **AC-4.2.2:** A Műveletek oszlop vízszintes görgetés esetén is folyamatosan látható marad a monitor jobb szélén rögzítve.
- **AC-4.2.3:** Az adatlapon a preferált patika nevére kattintva a nyitvatartási modal helyben, oldalváltás nélkül megnyílik.
- **AC-4.2.4:** Készlethiány esetén az adatlapon a sárga figyelmeztető doboz hiánytalanul tartalmazza az okot és a várható befejezést.
- **AC-4.2.5:** A gyógyszernyilvántartásban kizárólag OTC és vényköteles humán gyógyszerek szerepelnek; nem gyógyszer termékek státuszkövetése kizárt.

---

### 4.3. Gyógyszertár Kereső és Térkép

Gyógyszertárak felkutatása, helymeghatározás, nyitvatartási információk és preferált patika kijelölése.

**Útvonal:** [https://bvo.uneb.hu/gyogyszertarak](https://bvo.uneb.hu/gyogyszertarak)

#### 4.3.1. Képernyőfelépítés és Térképes Működés
1. **SubHeader Keresősáv és Pill Szűrők:**
   - Keresőmező településre, címre vagy patikanévre.
   - Gyorsszűrő kapszulák: `Most nyitva`, `Hétvégén nyitva`, `0-24 ügyeletes`.
2. **GPS Helymeghatározó Panel:**
   - *"Közeli patikák keresése (GPS)"* gomb: a böngésző engedélyével lekéri a felhasználó aktuális koordinátáit és távolság szerint növekvő sorrendbe rendezi a patikákat.
3. **Kettős Nézet (Split View):**
   - **Bal oldal (vagy mobilon lapozható fül):** Görgethető kártyalista a patikák adataival (név, cím, nyitvatartás ma, távolság km-ben, telefonszám, e-mail).
   - **Jobb oldal:** Interaktív OpenStreetMap térkép zöld/kék patika jelölőkkel (markerekkel).
4. **Kétirányú Szinkronizáció:**
   - Ha a felhasználó rákattint egy patikakártyára a listában, a térkép odagördül és kinyitja az információs buborékot (popup).
   - Ha a térképen kattint egy markerre, a bal oldali kártyalista az adott patikára görget.

#### 4.3.2. Preferált Gyógyszertár Kijelölése
- Minden patikakártyán található egy *"Közelinek jelölöm"* akciógomb.
- Kattintásra a választott patika zöld pipás aktív státuszt kap (*"Közeli gyógyszertáram"*), és azonnal megjelenik a felső navigációs fejlécben, valamint az Irányítópulton.

#### 4.3.3. Heti Nyitvatartási Részletek Modál
- A patika címére vagy a *"Nyitvatartás részletei"* linkre kattintva felugró modális ablak részletesen bemutatja a hét minden napjára érvényes nyitási és zárási időpontokat, az ügyeleti rendet, valamint a közvetlen telefonhívási lehetőséget.

#### 4.3.4. Mélylinkelés (Deep Linking) Támogatása
- Az oldal támogatja a közvetlen azonosítóval történő hivatkozást: `/gyogyszertarak?id=BF133`.
- Ilyen link megnyitásakor a térkép automatikusan a hivatkozott gyógyszertárra fókuszál (centrálás és zoom), a kártya kiemelést kap, és a nyitvatartási modal automatikusan felugrik.

#### 4.3.5. Bemenetek és Kimenetek
- **Bemenet:** Cím vagy település gépelése, nyitvatartási pill szűrők kattintása, GPS gomb megnyomása, térkép görgetése/kattintása.
- **Kimenet:** Szűrt patikalista, térképi jelölők frissülése, preferált patika felületi beállítása.

#### 4.3.6. Hibakezelés a Gyógyszertár Modulban
- **GPS helymeghatározás megtagadása:** Ha a felhasználó böngészőjében letiltja a helymeghatározást, a rendszer nem dob hibát, hanem diszkrét értesítést ad, és megtartja az alapértelmezett budapesti referencia-helyzetet.
- **Nincs patika a megadott szűrésre:** A lista helyén megjelenik az *"A megadott feltételekkel nem található gyógyszertár"* üzenet és a szűrők egykattintásos törlésének gombja.

#### 4.3.7. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.3.1:** A keresőmezőbe beírt településnévre (pl. "Szeged") a kártyalista és a térkép jelölői késlekedés nélkül kizárólag a szegedi patikákat jelenítik meg.
- **AC-4.3.2:** A "Közelinek jelölöm" gombra kattintva a választott patika azonnal megjelenik a fejlécben és az Irányítópulton is újratöltés nélkül.
- **AC-4.3.3:** Mélylinkkel érkezve (`/gyogyszertarak?id=BF133`) a térkép automatikusan a megadott patikára fókuszál, és a heti nyitvatartási modal felugrik.

---

### 4.4. Globális Keresés (Asztali és Mobil Overlay)

A fejlécbe integrált, rendszerszintű intelligens keresőmotor a gyógyszerek és gyógyszertárak gyors eléréséhez.

#### 4.4.1. Keresési Felületek
- **Asztali nézet (≥768px):** A fejléc közepén lévő beviteli mező alatt gépeléskor azonnal legördül a 400px széles lebegő találati kártya.
- **Mobil nézet (<768px):** A nagyító ikonra kattintva **teljes képernyős Mobil Kereső Overlay** nyílik meg (`fixed inset-0 z-[100]`), letiltva a háttér görgetését. Tartalma: visszalépés gomb, automatikusan fókuszált keresőmező törlés (X) gombbal, és vízszintesen görgethető kategória fülek (`Minden`, `Gyógyszerek`, `Patikák`).

#### 4.4.2. Keresési Logika és Találatok
- Már **1 beírt karakter** után azonnal megnyílik a találati felület.
- **Keresési területek:**
  - *Gyógyszerek:* Kereskedelmi név és Hatóanyag (INN).
  - *Gyógyszertárak:* Név, Település, Utca és Cím.
- **Kategória fülek:** `Minden`, `Gyógyszerek`, `Patikák`.
- **Megjelenítési korlátok:** Kategóriánként legfeljebb 5 tétel jelenik meg, a Minden fülön összesen legfeljebb 10 tétel.
- **Navigáció találatra kattintva:**
  - Gyógyszerre kattintva -> az adott gyógyszer adatlapjára visz (`/gyogyszerek/adatlap?tk=...`).
  - Patikára kattintva -> a patikakeresőbe visz a térkép fókuszálásával és az adatlap megnyitásával (`/gyogyszertarak?id=...`).
  - Kattintáskor a mobil overlay automatikusan bezárul és a háttér görgetése helyreáll.

#### 4.4.3. Elfogadási Kritériumok
- **AC-4.4.1:** Gyógyszernév és hatóanyag alapján a releváns készítmények azonnal megjelennek a találati panelen.
- **AC-4.4.2:** Mobilon a kereső megnyitásakor a billentyűzet automatikusan felugrik és a háttér nem görgethető el.

---

### 4.5. Hitelesítés, Jogosultságok és Kapcsolatfelvétel

A portál hivatalos, orvosi szakmai azonosítási és beléptetési rendszere.

**Útvonal:** [https://bvo.uneb.hu/login](https://bvo.uneb.hu/login)

#### 4.5.1. Bejelentkezési Módok (3 Fül)
A képernyő közepén lévő 479px széles, letisztult kártyán három belépési mód választható:
1. **Jelszavas Bejelentkezés (Alapértelmezett):**
   - 56px magas e-mail cím mező (`demo@example.com`).
   - 56px magas maszkolt jelszómező (`vény123`).
   - 56px magas sötétkék *"Bejelentkezés"* akciógomb jobbra mutató nyíllal.
   - *"Elfelejtett jelszó"* hivatkozás, amely a `/forgot-password` oldalra vezet.
2. **Passkey Biometrikus Belépés:**
   - 1-kattintásos belépés Touch ID, Face ID vagy Windows Hello azonosítással jelszó gépelése nélkül.
3. **Egyszeri E-mail Kódos Belépés (Magic Code):**
   - Jelszó nélküli belépési kérelem: az e-mail cím megadása után a rendszer 6-jegyű ellenőrző kódot generál és a 2FA felületre navigál.

#### 4.5.2. Kétfaktoros Azonosítás (2FA) Igazolási Képernyő
Amennyiben a felhasználó fiókjában aktív a 2FA és az eszköz még nem megbízható:
- Tájékoztató pajzs ikon és az ellenőrző kód kiküldésének visszaigazolása.
- 56px magas, nagyméretű, középre zárt 6-jegyű OTP kód beviteli mező.
- **"Megbízható eszköz megjegyzése (ne kérjen kódot 30 napig)" jelölőnégyzet:** Alapértelmezetten bepipálva. Megjelölése esetén a böngésző 30 napig mentesül az újabb kódkérés alól.
- *"Kód igazolása"* sötétkék akciógomb, amely sikeres azonosítás után beléptet a Dashboardra.
- *(A prototípus felületén tesztelői segédlet mutatja a működő demó kódot: `123456`).*

#### 4.5.3. Elfelejtett Jelszó Oldal
**Útvonal:** [https://bvo.uneb.hu/forgot-password](https://bvo.uneb.hu/forgot-password)
- E-mail cím megadása után belépési kód igényelhető. A prototípus felületén tájékoztató doboz emlékeztet a működő demó jelszóra.

#### 4.5.4. Manuális Regisztrációs Igény / Kapcsolatfelvételi Űrlap
A zárt szakmai jelleg miatt **nincs azonnali önkiszolgáló fiókregisztráció**:
- Az új orvos vagy gyógyszerész a bejelentkezési oldalról elérhető kapcsolatfelvételi linken keresztül nyithatja meg a regisztrációs igény űrlapot.
- **Kötelező adatok:** Teljes név, Szakmai e-mail, Telefonszám, Orvosi/Gyógyszerészi pecsétszám, Szakterület/Munkahely, valamint az adatkezelési szabályzat elfogadása.
- **Folyamat:** Az űrlap beküldésekor a rendszer visszaigazolást ad az igény rögzítéséről. Az adminisztrátor a kamarai nyilvántartásban ellenőrzi a pecsétszámot, és az adminisztrációs felületen manuálisan hozza létre az új aktív fiókot.

#### 4.5.5. Hibakezelés és Biztonság
- **Hibás jelszó vagy e-mail:** Piros figyelmeztető üzenet jelenik meg a beviteli mezők alatt (*"Érvénytelen e-mail cím vagy jelszó"*).
- **Inaktív fiók:** Inaktív vagy felfüggesztett felhasználó (pl. `teszt@example.com`) belépési kísérletét a rendszer azonnal elutasítja: *"A fiók felfüggesztésre került. Kérjük, keresse az adminisztrátort."*
- **AC-4.5.1:** Helyes bejelentkezési adatokkal a felhasználó közvetlenül a Dashboardra érkezik.
- **AC-4.5.2:** A 30 napos megbízható eszköz pipálása esetén a következő belépéskor a rendszer nem kéri újra a kétfaktoros kódot.
- **AC-4.5.3:** Felfüggesztett fiók esetén a belépés elutasításra kerül és hibaüzenet jelenik meg.

---

### 4.6. Adminisztráció (Felhasználók és Patikák)

Kizárólag `Admin` szerepkörű felhasználók számára engedélyezett felületcsoport.

#### 4.6.1. Felhasználókezelés
**Útvonal:** [https://bvo.uneb.hu/admin/users](https://bvo.uneb.hu/admin/users)
- **Felhasználói Táblázat:** Név, E-mail cím, Szerepkör (`Admin` / `User`), Státusz (`Aktív` / `Inaktív`), Szakterületek, Műveleti gomb (`⋮`).
- **Felhasználó Szerkesztő Modál (3 Fül):**
  1. *Alapadatok:* Név, Elsődleges e-mail, Szerepkör váltás (`User` / `Admin`), Státusz váltás (`Active` / `Inactive`).
  2. *Profil:* Másodlagos e-mail és orvosi szakterületek hozzárendelése.
  3. *Hírlevél:* Készletértesítő preferenciák konfigurálása.
- **Adminisztrátori Műveletek:**
  - Fiók felfüggesztése / aktiválása megerősítő kérdéssel. *(Saját fiókját az adminisztrátor nem deaktiválhatja).*
  - **Munkamenet Kényszerített Lezárása (Force Logout):** Azonnal érvényteleníti az aktív bejelentkezést, a felhasználó azonnal kijelentkezik.

#### 4.6.2. Gyógyszertár Karbantartás és Készletáttekintés
**Útvonal:** [https://bvo.uneb.hu/admin/pharmacies](https://bvo.uneb.hu/admin/pharmacies)
- A portálon **nincs patika-szerkesztő űrlap** (az adatok forrása a külső Patika Kezelő rendszer).
- A felület **áttekintést és készletellenőrzést** biztosít: patikák listája, BF kódok, adatszinkron és készletszinkron időpontok, valamint az adott patika termékkészletének tételes táblázata.

#### 4.6.3. Elfogadási Kritériumok
- **AC-4.6.1:** Normál szakmai felhasználó (`User`) nem érheti el az `/admin/*` útvonalakat; jogosulatlan próbálkozás esetén a rendszer visszairányítja a Dashboardra.
- **AC-4.6.2:** A Force Logout végrehajtásakor a célfelhasználó böngészőjében a következő kattintáskor azonnal megjelenik a bejelentkezési ablak.

---

### 4.7. Felhasználói Profil és Értesítéskezelés

A felhasználó személyes adatainak, értesítéseinek és fiókbiztonságának kezelési központja.

**Útvonal:** [https://bvo.uneb.hu/profile](https://bvo.uneb.hu/profile)

#### 4.7.1. Személyes Adatok és Szakterületek
- Név, Elsődleges és Másodlagos e-mail cím olvasási módban jelenik meg (*"Módosításához keresse az adminisztrációt"*).
- **Szakterületek szerkesztése:** Kereshető többválasztós listában az orvos szabadon frissítheti szakorvosi képesítéseit, majd a *"Szakterületek mentése"* gombbal rögzítheti.

#### 4.7.2. Preferált Gyógyszertár Kezelése
- Megjeleníti a jelenleg kijelölt közeli patika kártyáját.
- Gombok: *"Módosítás"* (megnyitja a modális patikakeresőt) és *"Törlés"* (eltávolítja a kijelölést).

#### 4.7.3. Készletinfó Hírlevél és Értesítési Beállítások
Külön-külön konfigurálható az **Elsődleges ÉS a Másodlagos e-mail címre**:
- Kapcsoló: `Be` / `Ki`.
- Gyakoriság: `Napi`, `Heti`, `Havi`.
- Kiküldés órája: `0` és `23` óra között.
- Témák: `Újra elérhető`, `Készlethiány`, `Megszűnt`.
- Hatókör: `Minden`, `Szakterület + mentett gyógyszerek`, `Csak szakterület`, `Csak mentett gyógyszer`.

#### 4.7.4. Aloldalak: Kedvencek és Készletértesítések
- **Mentett Kedvencek Oldal:** [https://bvo.uneb.hu/profile/favorites](https://bvo.uneb.hu/profile/favorites)
  - Elmentett gyógyszerek listája, készletállapotuk, és közvetlen eltávolítási opció.
- **Készletértesítések Oldal:** [https://bvo.uneb.hu/profile/notifications](https://bvo.uneb.hu/profile/notifications)
  - Aktív értesítés-feliratkozások táblázata a feliratkozás pontos dátumával és azonnali leiratkozási gombbal.

#### 4.7.5. Biztonság és Kétfaktoros Azonosítás (2FA / Passkey)
- **2FA Kapcsoló és Csatorna:** `Be`/`Ki` kapcsoló, csatornaválasztás: `E-mail OTP`, `SMS OTP`, `Hitelesítő App (TOTP)`.
- **Passkey Kezelés:** Regisztrált biometrikus eszközök listája, *"Új Passkey hozzáadása"* gomb és törlési lehetőség.
- **Megbízható Eszközök Elfelejtése:** *"Eszközök elfelejtése"* gomb, amely azonnal érvényteleníti az összes 30 napos megjegyzett böngészőt.

#### 4.7.6. Elfogadási Kritériumok
- **AC-4.7.1:** A hírlevél beállítások módosításai azonnal mentésre kerülnek és a rendszer a visszajelző üzenetet megjeleníti.
- **AC-4.7.2:** Az "Eszközök elfelejtése" gombra kattintva a megbízható eszközök számlálója nullázódik.

---

---

## 5. Korábban tervezett, de elvetett / külső rendszerbe átsorolt funkciók

Ez a fejezet összefoglalja azokat az elemeket, amelyek korábbi koncepciókban szerepeltek, de a jelenlegi érvényes felületen nem aktívak vagy külső rendszer feladatkörébe tartoznak:

1. **Jelszó Módosítása a Felhasználói Profilban:**
   - *Státusz:* Nem aktív felületi elem. Az orvosi profilban a személyes adatok védettek; módosításuk adminisztrátori közreműködéssel történik.
2. **Betegtájékoztató Letöltése a Gyógyszer Adatlapról:**
   - *Státusz:* Jelenleg nem aktív a prototípus felületén.
3. **Globális Kereső: "Összes találat megtekintése" külön találati oldal:**
   - *Státusz:* Nem vezet külön gyűjtőoldalra; a találatok a felugró panelen közvetlenül kattinthatók.
4. **Adminisztrációs Gyógyszertár Adatszerkesztő Űrlap:**
   - *Státusz:* Külső rendszerbe átsorolva. A patikák alapadatainak karbantartása a központi Patika Kezelő rendszerben történik; a portál kizárólag áttekintést és készletellenőrzést nyújt.
5. **Gyógyszer Lista Kártyás Nézete:**
   - *Státusz:* Elvetve. A gyógyszerek böngészése a magas adattartalom és a szakmai szempontok miatt kizárólag rendezhető táblázatos nézetben történik.
6. **Önkiszolgáló Automatikus Felhasználói Regisztrációs Felület:**
   - *Státusz:* Jelenleg nem tervezett. A rendszer zárt szakmai jellege miatt a regisztráció kizárólag a bejelentkező felületről indított kapcsolatfelvételi űrlapon és kézi adminisztrátori jóváhagyáson keresztül működik.
7. **Nem Gyógyszer Patikai Termékek (Étrend-kiegészítők, Orvostechnikai Eszközök, Kozmetikumok) Státuszkövetése:**
   - *Státusz:* Rendszer hatókörén kívüli (Out of scope) funkció.
   - *Részletek:* A BENUvény orvosi portál célzottan a gyógyító és terápia-meghatározó orvosok és gyógyszerészek számára készült. A készlet- és piaci státuszok, hiányok és helyettesíthetőség monitorozása emiatt szigorúan a törzskönyvezett humán gyógyszerekre – azon belül is kizárólag az OTC és a vényköteles készítményekre – korlátozódik. A patikai forgalomban jelen lévő több tízezer egyéb cikk (étrend-kiegészítők, vitaminok, kozmetikumok, orvostechnikai eszközök, tápszerek) státuszkövetése tudatos döntés alapján nem része a portál funkcionalitásának, megelőzve az orvosi fókusz felhígulását és az adatzajt.

---

---

## 6. Tesztfiókok és Hozzáférések

A működő prototípus élő kipróbálására szolgáló tesztfiókok a [https://bvo.uneb.hu/login](https://bvo.uneb.hu/login) oldalon.

> **Egységes jelszó minden tesztfiókhoz:** `vény123`  
> *(2FA tesztelése esetén a működő demó ellenőrző kód: `123456`)*

### 6.1. Rendszeradminisztrátor Tesztfiók
- **E-mail:** `admin@example.com`
- **Jelszó:** `vény123`
- **Szerepkör:** Admin
- **Státusz:** Aktív
- **Rendeltetés:** Az adminisztrációs felület (`/admin/users`, `/admin/pharmacies`) és a felhasználókezelési, patikaellenőrzési műveletek tesztelése.

### 6.2. Dr. Kovács István (Szakmai Felhasználó Tesztfiók)
- **E-mail:** `demo@example.com`
- **Jelszó:** `vény123`
- **Szerepkör:** User
- **Státusz:** Aktív
- **Szakterületek:** Háziorvostan, Belgyógyászat
- **Rendeltetés:** A normál orvosi munkafolyamatok tesztelése (Dashboard, fluid gyógyszerlista, kedvencek, értesítések, patikakereső térkép, profilbeállítások). Védett adminisztrációs oldalakra nem léphet be.

### 6.3. Dr. Teszt Szabolcs (Felfüggesztett / Inaktív Fiók Tesztelése)
- **E-mail:** `teszt@example.com`
- **Jelszó:** `vény123`
- **Szerepkör:** User
- **Státusz:** Inaktív
- **Szakterületek:** Kardiológia
- **Rendeltetés:** Az inaktív fiókok belépési elutasításának és biztonsági védelmének ellenőrzése.

---

---

## 7. Változásnapló (Verziótörténet)

Ez a fejezet a funkcionális specifikációban eszközölt módosítások és kiegészítések időrendi naplója.

| Verzió | Dátum | Változás Típusa | Változások Részletes Összefoglalása |
| :--- | :--- | :--- | :--- |
| **v1.7.0** | 2026.10.20. | Hatókör Tisztítás (Scope Alignment) | **Közösségi funkciók és Képzési program teljes kivezetése a funkcionális specifikációból:**<br>• A dokumentáció teljes mértékben szinkronba került a prototípus aktív fejlesztési scope-jával; a felületen csak koncepciótervként létező funkciók (Közösségi fórum, képzések listája és LMS integráció, admin moderáció) kivezetésre kerültek a specifikációból.<br>• Az adatmodellek (3. fejezet) és a funkcionális modulok (4. fejezet) újraszámozása (4.4 Globális Keresés, 4.5 Hitelesítés, 4.6 Adminisztráció, 4.7 Profil).<br>• Az Elfogadási Kritériumok (AC) frissítése és beépített újraszámozása a funkcionális modulokban.<br>• Profil és admin felületi hírlevél/értesítési beállítások szűkítése a valós készletértesítési funkcionalitásra. |
| **v1.6.1** | 2026.10.20. | Funkcionális Hatókör & Irányelvek Pontosítása | **Gyógyszer státuszkövetés, WCAG és böngésző title követelmények rögzítése:**<br>• Rögzítésre került, hogy a portál gyógyszerkészlet- és hiánystátuszkövetési funkciói kizárólag a humán gyógyszerek két csoportjára korlátozódnak: **OTC (vény nélkül kapható)** és **vényköteles (Rx)** készítmények; egyéb nem gyógyszer cikkek (étrend-kiegészítők, kozmetikumok, tápszerek, gyógyászati segédeszközök) státuszai kívül esnek a hatókörön.<br>• **WCAG 2.2 irányelvek:** Törekedni kell az alapvető sztenderdek betartására, de zárt szakmai rendszer lévén és a nem akadályoztatott orvosi célcsoport miatt nem követelmény a maximális szintű megfelelőség.<br>• **Technikai SEO és lapfül title formátum:** Zárt rendszer lévén klasszikus SEO elvárások nincsenek, de a böngészést segítő lapfülcím kötelezően a `"{lap neve} \| BENUvény Orvosi Portál"` formátumban kell megjelenjen (új 1.8 fejezet és AC-4.0.5). |
| **v1.6.0** | 2026.10.19. | Átfogó Revízió & FRS Bővítés | **Prototípus működés szerinti teljes körű funkcionális szinkronizáció és követelménybővítés:**<br>• Minden fő funkcionális modul kiegészítése strukturált **Bemenetek és Kimenetek**, felhasználói szintű **Hibakezelés** és pontosan ellenőrizhető **Elfogadási Kritériumok (Acceptance Criteria - AC)** fejezetekkel a globális követelményszabályoknak megfelelően.<br>• A 4 szintű készletstátusz (`Készleten`, `Korlátozottan`, `Rendelésre (1-2 munkanap)`, `Nem elérhető`) és a hozzá tartozó hálózati / helyi felületi megjelenítés megerősítése.<br>• A Gyógyszertárak modul SubHeader keresőjének, pill szűrőinek (`Most nyitva`, `Hétvégén nyitva`, `0-24`), GPS helymeghatározó paneljének, valamint a heti nyitvatartási modal és mélylinkelés (`/gyogyszertarak?id=...`) leírásának véglegesítése.<br>• A fejléc Mentett gyorslista "Összes" gombjának navigációs viselkedése (`onlyFavorites=true` szinkron) a gyógyszerlista oldallal.<br>• Manuális regisztrációs kapcsolatfelvételi űrlap, 2FA és passkey biztonsági folyamatok pontosítása. |
| **v1.5.1** | 2026.09.08. | Módosítás | **Gyógyszerlista táblázat fluid (teljes képernyőszélességű) elrendezése:**<br>• A gyógyszerek oldal és az adatáblázat fix maximális szélességi korlátja (1440px) feloldásra került; a felület dinamikusan kitölti a teljes képernyőszélességet.<br>• Nagyobb monitorokon jelentősen javult az adatok átláthatósága és olvashatósága, minimalizálva a vízszintes görgetés szükségességét.<br>• Frissítésre került a 4.2.1. pont (Fluid elrendezés). |
| **v1.4.1** | 2026.08.24. | Kiegészítés | **Manuális felhasználói regisztráció és kapcsolatfelvételi űrlap rögzítése:**<br>• Tisztázásra került, hogy a felhasználók regisztrációja kézzel (manuálisan) történik az adminisztrátor által.<br>• Az új szakmai felhasználó a bejelentkezési felületről elérhető űrlapon veszi fel a kapcsolatot az adminisztrációval (pecsétszám, szakterület megadásával).<br>• Új adatmodell (3.6) és új funkcionális leírás (4.6.4), elvetett funkciók (5.9) és Változásnapló (7) bevezetése. |

<!-- DOKUMENTUM VÉGE -->
