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
> **Verzió:** 1.6.1  
> **Dátum:** 2026.10.20.  
> **Státusz:** Aktív / Hatályos (Termékköri státuszkövetés rögzítése: kizárólag OTC és vényköteles gyógyszerek)  
> **Élő prototípus elérhetőség:** [https://bvo.uneb.hu/](https://bvo.uneb.hu/) (tesztfiókok a 6. fejezetben)  
> **Önálló Elfogadási Kritériumok (AC) jegyzék:** [ACCEPTANCE_CRITERIA.md](file:///c:/Users/abramov.gabor/GitHub/b2bbv-nextjs/ACCEPTANCE_CRITERIA.md)  

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
   - 3.4. Képzés / Kurzus (Course) Adatmodell *(Nem fejlesztési scope, prototípusban sem látható)*
   - 3.5. Patikai Készletrekord Adatmodell
   - 3.6. Regisztrációs Igény / Kapcsolatfelvételi Űrlap Adatmodell
   - 3.7. Közösségi Téma és Hozzászólás Adatmodell
4. [Modulok és Funkciók Részletes Leírása](#4-modulok-és-funkciók-részletes-leírása)
   - 4.0. Fejléc és Navigációs Sáv Modul
   - 4.1. Irányítópult (Dashboard)
   - 4.2. Gyógyszer Nyilvántartás (Lista és Adatlap)
   - 4.3. Gyógyszertár Kereső és Térkép
   - 4.4. Képzési Program *(Nem fejlesztési scope, prototípusban sem látható)*
   - 4.5. Globális Keresés (Asztali és Mobil Overlay)
   - 4.6. Hitelesítés, Jogosultságok és Kapcsolatfelvétel
   - 4.7. Adminisztráció (Felhasználók, Patikák, Moderálás)
   - 4.8. Felhasználói Profil és Értesítéskezelés
   - 4.9. Közösség és Szakmai Fórum
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
4. **Szakmai továbbképzési lehetőségekről:** Akkreditált kreditpontos és gyártói képzési anyagok specifikált keretrendszeréről *(Nem fejlesztési scope, prototípusban sem látható, részletek a 4.4. és 5.1. pontokban)*.

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
2. **Rendszeradminisztrátor (Admin):** Az üzemeltetésért felelős belső felhasználó. A szakmai felületeken felül hozzáfér a védett `/admin/*` útvonalakhoz: kezeli a felhasználói fiókokat, felügyeli a patikai adatok szinkronizációját és moderálja a szakmai fórumot.

### 1.7. Modulok és Felületek Áttekintése

| Modul Megnevezése | Elsődleges Felületi Útvonal (URL) | Fő Funkcionális Felelősség | Felületi Státusz |
| :--- | :--- | :--- | :--- |
| **Fejléc & Navigációs Sáv** | Globális komponens | Kereső, gyorslista, közeli patika kijelző, modulváltás, profil menü. | **Aktív** |
| **Irányítópult (Dashboard)** | `https://bvo.uneb.hu/dashboard` | Időszakos készletváltozások, preferált patika widget, gyors navigáció. | **Aktív** |
| **Gyógyszer Nyilvántartás** | `https://bvo.uneb.hu/gyogyszerek` | Teljes képernyős fluid táblázat, oszloprendezés, szűrés, kedvencek. | **Aktív** |
| **Gyógyszer Adatlap** | `https://bvo.uneb.hu/gyogyszerek/adatlap` | 4 szintű készletstátusz, árak, hiánybannerek, helyettesítők, történet. | **Aktív** |
| **Gyógyszertár Kereső** | `https://bvo.uneb.hu/gyogyszertarak` | Térkép, szinkronizált kártyalista, GPS helymeghatározás, heti rend modal. | **Aktív** |
| **Képzési Program** | `https://bvo.uneb.hu/kepzesek` | Kurzusok listázása, kategóriák, akkreditáció, LMS átirányítás. | ⚠️ **Nem fejlesztési scope, prototípusban sem látható** |
| **Globális Keresés** | Globális / Mobil Overlay | Instant keresés gyógyszerek, hatóanyagok és patikák között. | **Aktív** |
| **Hitelesítés & Jogosultság** | `https://bvo.uneb.hu/login` | Jelszavas, Passkey és Magic Code belépés, 2FA, kapcsolatfelvételi űrlap. | **Aktív** |
| **Felhasználói Profil** | `https://bvo.uneb.hu/profile` | Szakterületek, preferált patika, hírlevelek, biztonság, 2FA, passkey. | **Aktív** |
| **Adminisztráció** | `https://bvo.uneb.hu/admin/*` | Felhasználók kezelése, patikák felügyelete, tartalommoderáció. | **Aktív** |
| **Közösség és Fórum** | `https://bvo.uneb.hu/kozosseg` | Szakmai eszmecsere, témák, hozzászólások (közvetlen URL elérés). | **Közvetlen URL** |

### 1.8. Akadálymentesség (WCAG 2.2) és Technikai SEO Irányelvek

A rendszer felületi megvalósításakor az alábbi elvek tekintendők irányadónak az akadálymentesség és a technikai keresőoptimalizálás kapcsán:

1. **Akadálymentesség és WCAG 2.2 Sztenderdek:**
   - **Törekedni kell a betartására (Jó gyakorlat):** A felületfejlesztés során törekedni kell az ésszerű ergonómiai és WCAG 2.2 irányelvek (kontrasztos megjelenés, olvasható betűméretek, egyértelmű interaktív elemek, alapvető billentyűzet-navigáció) betartására.
   - **Nem szigorú követelmény a maximális megfelelőség:** Tekintettel arra, hogy a portál **publikusan nem elérhető** (zártkörű, hatósági orvosi/gyógyszerészi azonosításhoz kötött szakmai rendszer), valamint a célcsoport (orvosok, gyógyszerészek) **jellemzően nincsen akadályoztatva**, a fejlesztés során **nem követelmény a maximális (pl. AAA) szintű akadálymentességi előírások betartása**, erre külön túlzott erőforrást nem szükséges fordítani.

2. **Technikai SEO és Böngészőhasználatot Segítő Megoldások:**
   - **Klasszikus SEO mentesség:** Mivel a portál zárt szakmai megoldás, **nem kötelező betartani a klasszikus keresőmotor-optimalizálási (SEO) irányelveket** (pl. külső keresőindexelés engedélyezése, meta leírások keresőrobotoknak, strukturált sémaadatok, webhelytérkép).
   - **Böngészést és lapfül-azonosítást segítő megoldások:** Ezzel szemben elvárt és kötelező a szakemberek mindennapi, gyakran több lapfüles munkavégzését támogató böngésző segítő megoldások alkalmazása.
   - **Egységes Lapfül Cím (Page `<title>`) Formátum:** A böngészőfül gyors és egyértelmű beazonosíthatósága érdekében minden oldal fejlécében a HTML `<title>` címke kötelezően az alábbi formátumot követi:
     ```
     {lap neve} | BENUvény Orvosi Portál
     ```
     *Hivatalos felületi példák:*
     - `Irányítópult | BENUvény Orvosi Portál`
     - `Gyógyszerek | BENUvény Orvosi Portál`
     - `Gyógyszer Adatlap | BENUvény Orvosi Portál` (vagy konkrét terméknél: `{Kereskedelmi név} | BENUvény Orvosi Portál`)
     - `Gyógyszertárak | BENUvény Orvosi Portál`
     - `Bejelentkezés | BENUvény Orvosi Portál`
     - `Profil és Beállítások | BENUvény Orvosi Portál`
     - `Adminisztráció | BENUvény Orvosi Portál`
     - `Közösség | BENUvény Orvosi Portál`

---

---

## 2. Fogalomtár

### 2.1. LogiNet Middleware
A BENU ökoszisztéma alapját képező központi integrációs réteg, amely a gyógyszertári készletadatok, raktárkészletek és szinkronizációs folyamatok valós idejű közvetítéséért felel a portál felé.

### 2.2. Közeli Patika (Preferált Patika)
A felhasználó által kiválasztott gyógyszertár (pl. *"BENU Gyógyszertár Arany Sas"*). A portál teljes felületén kiemelten kezeli ezen patika készletét és státuszait (Irányítópult widget, Fejléc kijelző, Gyógyszer adatlap sor).

### 2.3. Kedvenc Gyógyszer (Mentett Gyógyszer)
A felhasználó által könyvjelzővel (csillag ikonnal) megjelölt gyógyszerkészítmény. Megjelenik a fejléc gyorslistájában és a Profil mentett tételei között a gyors eléréshez.

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

### 2.9. BENU LMS (Külső Rendszer / Nem fejlesztési scope, prototípusban sem látható)
A BENU külső online e-learning és akkreditált továbbképzési portálja. A tananyagok tényleges feldolgozása, a vizsgatesztek kitöltése és a kreditpontok jóváírása ezen a külső felületen történik. *(Nem fejlesztési scope, prototípusban sem látható, részletek: 4.4. és 5.1. pont).*

### 2.10. Passkey (Biometrikus Azonosító)
FIDO2 szabványon alapuló eszközalapú azonosítás (Face ID, Touch ID, Windows Hello), amely jelszó megadása nélkül, 1-kattintásos biztonságos belépést nyújt.

### 2.11. Kényszerített Munkamenet Lezárás (Force Logout)
Adminisztrátori biztonsági művelet, amely érvényteleníti a felhasználó aktív bejelentkezési munkamenetét, azonnal kijelentkeztetve a fiókot a rendszerből.

### 2.12. Manuális Regisztrációs Igény / Kapcsolatfelvétel
A portál zárt jellege miatt nincs automatikus azonnali önkiszolgáló fióknyitás. Az új szakmai érdeklődők a bejelentkezési oldalról elérhető űrlap beküldésével veszik fel a kapcsolatot az üzemeltetéssel, akik hatósági pecsétszám-ellenőrzés után kézzel aktiválják a fiókot.

### 2.13. Státuszkövetési Hatókör: Kizárólag OTC és Vényköteles Termékek
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
  - **Limitációk:** Egy fiókhoz tetszőleges számú biometrikus kulcs rögzíthető.
- **Megbízható Eszközök:**
  - **Felületi Típus:** Számláló kártya + Műveleti gomb
  - **Megadható Formátum:** Megjegyzett böngésző-munkamenetek darabszáma
  - **Példa Érték:** `2 aktív megbízható eszköz`
  - **Limitációk:** Egyetlen gombnyomással az összes megjegyzett munkamenet elfelejthető.
- **Készletinfó Hírlevél Beállítás:**
  - **Felületi Típus:** Kapcsoló + Menük
  - **Megadható Értékek:** Gyakoriság: `Napi`/`Heti`/`Havi`; Kiküldési óra: `0–23`; Témák: `Újra elérhető`, `Készlethiány`, `Megszűnt`; Hatókör: `Minden`, `Szakterület + mentett`, `Csak szakterület`, `Csak mentett`
  - **Példa Érték:** `Heti, 08:00, [Újra elérhető, Készlethiány], Szakterület + mentett`
  - **Limitációk:** Külön konfigurálható az elsődleges és a másodlagos e-mail címre.
- **Preferált Patika:**
  - **Felületi Típus:** Kiválasztó kártya + Törlés gomb
  - **Megadható Érték:** Egy gyógyszertár megnevezése és azonosítója
  - **Példa Érték:** `"BENU Gyógyszertár Arany Sas (BF001)"`
  - **Limitációk:** Legfeljebb 1 preferált patika jelölhető ki egyszerre.

### 3.2. Gyógyszer (Medicine) Adatmodell

- **Kereskedelmi Név:**
  - **Felületi Típus:** Szöveges megjelenítés
  - **Példa Érték:** `"Algopyrin 500 mg filmtabletta"`
  - **Limitációk:** Kötelező alapadat.
- **TK-szám (Törzskönyvi szám):**
  - **Felületi Típus:** Szöveges megjelenítés / Rendszerazonosító
  - **Példa Érték:** `"OGYI-T-8898/01"`
  - **Limitációk:** Egyedi hatósági azonosító kód.
- **INN (Hatóanyag):**
  - **Felületi Típus:** Kattintható hivatkozás
  - **Példa Érték:** `"metamizol-nátrium"`
  - **Limitációk:** Rákattintva azonos hatóanyagú készítményekre szűr a listában.
- **Márkanév:**
  - **Felületi Típus:** Szöveges megjelenítés
  - **Példa Érték:** `"Algopyrin"`
- **ATC-kód:**
  - **Felületi Típus:** Címke jelvény
  - **Példa Érték:** `"N02BB02"`
- **Gyártó / Engedélyes:**
  - **Felületi Típus:** Szöveges megjelenítés
  - **Példa Érték:** `"Sanofi-Aventis Zrt."`
- **Kiszerelés és Csomagolás:**
  - **Felületi Típus:** Szöveges leírás
  - **Példa Érték:** `"20x filmtabletta buborékcsomagolásban és dobozban"`
- **Kiadhatóság:**
  - **Felületi Típus:** Szöveges kategória
  - **Megadható Értékek:** `Vényköteles` / `Vény nélkül kapható (VN / OTC)`
  - **Példa Érték:** `Vényköteles`
  - **Limitációk és Szabályok:** A rendszerben nyilvántartott és készlet-/hiánystátusz szempontjából követett termékek köre zárt: kizárólag `Vényköteles` és `Vény nélkül kapható (VN / OTC)` kiadhatóságú készítmények státuszait követi a rendszer. Nem gyógyszer kategóriák (pl. étrend-kiegészítők, gyógytermékek) nem képezik a követett adatbázis részét.
- **Biztonsági Elemek:**
  - **Felületi Típus:** Állapotjelző
  - **Megadható Értékek:** `Van` / `Nincs`
  - **Példa Érték:** `Van (Egyedi azonosító és dézsmálásgátló)`
- **Általános Piaci Státusz:**
  - **Felületi Típus:** Színkódolt címke
  - **Megadható Értékek:** `Elérhető` (zöld), `Készlethiány` (sárga), `Megszűnt` (piros)
  - **Példa Érték:** `Készlethiány`
  - **Limitációk:** A piaci státuszok követése, hiánybejelentések és forgalomból történő kivonások monitorozása kizárólag az OTC és a vényköteles készítményekre vonatkozik.
- **Hiány Részletei (ha státusza Készlethiány):**
  - **Hiány kezdete:** Dátum (`2026.07.15`)
  - **Várható befejezés:** Dátum (`2026.11.30`) vagy `"Folyamatban"`
  - **Hiány hivatalos oka:** Szöveges leírás (pl. `"Gyártási kapacitáshiány"`)
  - **Szakmai pótlási javaslat:** Szöveg (pl. `"Helyettesíthető azonos INN készítménnyel"`)
- **Fogyasztói Ár és Térítési Díj:**
  - **Bruttó fogyasztói ár:** Pénznem összeg (pl. `"2 490 Ft"`, bordó színnel kiemelve)
  - **Becsült térítési díj:** Pénznem összeg (pl. `"1 245 Ft"`, sötétkékkel kiemelve)

### 3.3. Gyógyszertár (Pharmacy) Adatmodell

- **BF azonosító kód:**
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

### 3.4. Képzés / Kurzus (Course) Adatmodell *(Nem fejlesztési scope, prototípusban sem látható)*

> [!NOTE]
> Ez az adatmodell a rendszerben korábban megtervezett képzési struktúrát rögzíti; jelenleg nem fejlesztési scope, a prototípusban sem látható.

- **Kurzus azonosító:** Karakterlánc (pl. `"c1"`)
- **Cím:** Szöveg (pl. `"A hipertónia legújabb terápiás irányelvei"`)
- **Kategória:** `Akkreditált` / `Gyártói` / `Eladásösztönző`
- **Becsült időtartam:** Perc érték (pl. `"45 perc"`)
- **Tartalom formátuma:** `Videó` / `PDF Dokumentum`
- **Rövid és Részletes Leírás:** Szöveges összefoglalók
- **Akkreditált Kreditpont:** Egész szám (pl. `2 kreditpont`) — *a részletes adatlapon megjelenő érték*

### 3.5. Patikai Készletrekord Adatmodell

- **TK-szám:** Hivatkozott gyógyszerkészítmény kódja
- **Raktári darabszám:** Pozitív egész szám (pl. `14 db`)
- **Patikai státuszbesorolás:** `Készleten` / `Korlátozottan` / `Rendelésre` / `Nem elérhető`
- **Utolsó készletszinkron:** Időbélyeg (pl. `2026.10.20 08:30:15`)

### 3.6. Regisztrációs Igény / Kapcsolatfelvételi Űrlap Adatmodell

- **Teljes név:** Szöveg (pl. `"Dr. Szabó Péter"`) — Kötelező
- **Szakmai e-mail cím:** E-mail (pl. `"szabo.peter@haziorvos.hu"`) — Kötelező
- **Telefonszám:** Nemzetközi telefonszám (pl. `"+36 20 987 6543"`) — Kötelező
- **Pecsétszám (Működési nyilvántartási szám):** 5–6 számjegy (pl. `"76543"`) — Kötelező orvosi azonosító
- **Szakterület / Munkahely:** Szöveg (pl. `"Háziorvosi Rendelő, Szeged"`) — Kötelező
- **Megjegyzés / Üzenet:** Többsoros szövegmező — Opcionális
- **Adatkezelési nyilatkozat:** Jelölőnégyzet — Kötelezően elfogadandó

### 3.7. Közösségi Téma és Hozzászólás Adatmodell

- **Téma címe:** Szöveg (min. 5, max. 150 karakter)
- **Téma kategóriája / Szakterülete:** Kódlista elem (pl. `"Kardiológia"`, `"Háziorvostan"`)
- **Szerző megnevezése:** Felhasználó neve vagy `"Anonim Felhasználó"`
- **Tartalom:** Formázott szöveges bejegyzés
- **Moderációs Státusz:** `Aktív` / `Lezárt` / `Elrejtett`

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
4. **Ikonos Navigációs Menüpontok:**
   - **Irányítópult:** Navigáció a `/dashboard` felületre.
   - **Gyógyszer:** Navigáció a `/gyogyszerek` felületre.
   - **Gyógyszertár:** Navigáció a `/gyogyszertarak` felületre.
   - **Mentett (Gyorslista):** Csillag ikon számláló jelvénnyel, amely a mentett készítmények számát mutatja.
   - **Profil:** Felhasználói fiók menü.
5. **Mentett Gyógyszerek Lenyíló Gyorslista (Dropdown):**
   - A *"Mentett"* gombra kattintva lenyílik a mentett termékek előnézete.
   - **"Összes" gomb:** A lenyíló ablak fejlécében elhelyezett zöld link. Rákattintva a rendszer azonnal a gyógyszerlista oldalra (`https://bvo.uneb.hu/gyogyszerek`) navigál, és automatikusan aktiválja a *"Csak mentett gyógyszerek"* szűrőt (`onlyFavorites=true`).
   - **Készítmény sorok:** Terméknév, TK-szám, és színes készletjelvény (`Elérhető`, `Készlethiány`, `Megszűnt`). Sorra kattintva közvetlenül a gyógyszer adatlapjára visz.
   - **Üres állapot:** *"Nincs még mentett gyógyszered."* felirat látható, ha a lista üres.
6. **Felhasználói Profil Dropdown:**
   - Megjeleníti az orvos nevét és e-mail címét.
   - Opciók: *"Profilom és Beállítások"* (`/profile`) és *"Kijelentkezés"*.
7. **Globális Lábléc (Footer):**
   - Minden oldal alján megjelenő sötétkék sáv a "Color & Code" fejlesztői jelzéssel, hivatalos jogi hivatkozásokkal és a szoftver aktuális verziószámával (`v1.6.0`).

#### 4.0.2. Bemenetek és Kimenetek
- **Bemenet:** Egérkattintás a menüpontokra, keresési kulcsszavak gépelése, patika kiválasztása a modálban.
- **Kimenet:** Oldalnavigáció, modális ablak megjelenése, lenyíló menük aktiválása.

#### 4.0.3. Hibakezelés
- **Üres mentett lista:** Ha a felhasználó úgy kattint az "Összes" gombra, hogy nincs egyetlen mentett gyógyszere sem, a gyógyszeroldalon az "Összesen 0 találat" állapot és segítő tájékoztató szöveg jelenik meg.
- **Hálózati késés:** Lassú adatletöltés esetén a lenyíló ablak finom pulzáló helykitöltőt jelenít meg az adatok beérkezéséig.

#### 4.0.4. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.0.1:** A fejléc logójára kattintva a felület minden esetben az Irányítópultra (`/dashboard`) navigál.
- **AC-4.0.2:** A Közeli patika blokkra kattintva a Patikaválasztó modál megnyílik, és új patika kiválasztásakor a fejléc azonnal frissül a választott patika nevével.
- **AC-4.0.3:** A Mentett lenyíló ablakban lévő "Összes" hivatkozásra kattintva a gyógyszerlista megnyílik, és a táblázatban kizárólag a mentett gyógyszerek jelennek meg.
- **AC-4.0.4:** Kijelentkezéskor a rendszer érvényteleníti a munkamenetet és a bejelentkezési oldalra (`/login`) irányít át.
- **AC-4.0.5:** A böngésző lapfülének megnevezése (HTML `<title>`) minden belső és publikus oldalon kötelezően a `"{lap neve} | BENUvény Orvosi Portál"` egységes formátumot jeleníti meg, elősegítve a böngészőlapok gyors azonosítását.

---

### 4.1. Irányítópult (Dashboard)

A bejelentkezést követő központi áttekintő felület, amely összefoglalja a legfontosabb piaci és helyi készletmozgásokat a legújabb 2 oszlopos Figma elrendezés szerint.

**Útvonal:** [https://bvo.uneb.hu/dashboard](https://bvo.uneb.hu/dashboard)

#### 4.1.1. Működés és Felületi Elemek
1. **Fejléc és Időszak Választó (Time Period Selector):**
   - Lekerekített kapszula alakú gomb naptár ikonnal.
   - **Választható időintervallumok:** `Elmúlt 3 nap` (alapértelmezett), `Elmúlt 1 nap (Mai nap)`, `Elmúlt 7 nap`, `Elmúlt 30 nap`.
   - A választás azonnal újraszámolja a statisztikai kártyákat és frissíti a legfrissebb változások listáját.
2. **"Globális Készletváltozás" Összesítő Kártya (Bal hasáb):**
   - Kiemelt, világossárga kártya (`#FFFCE9`) felkiáltójel ikonnal a bal hasáb tetején.
   - Részletes összefoglalót ad: hány gyógyszer került újonnan készlethiányba, mennyi vált újra elérhetővé, és hány terméket vontak ki a forgalomból (megszűnt).
   - **Hatóköri szabály:** Az összesítés kizárólag az OTC és vényköteles gyógyszerek változásait kalkulálja; egyéb nem gyógyszer termékek (pl. táplálékkiegészítők, kozmetikumok) nem képezik a statisztika részét.
   - Amennyiben van beállított közeli patika, külön mondat emeli ki a preferált patikában történt változásokat.
   - A szöveges számértékek közvetlenül kattintható hivatkozások, amelyek a gyógyszerlistát az adott státuszra előszűrve nyitják meg.
3. **Legutóbbi 20 Készletváltozás Táblázata (Bal hasáb):**
   - Időrendi lista a legfrissebb 20 készlet- és piaci státuszváltozásról (kizárólag OTC és vényköteles készítmények).
   - Oszlopok: Színes státuszjelvény (`Elérhető`, `Hiány`, `Megszűnt`), Gyógyszer kereskedelmi neve (adatlapra vezető link), Változás rögzítésének dátuma.
   - A táblázat alatt az *"Összes változás megtekintése"* gomb a teljes gyógyszerlistára navigál dátum szerinti csökkenő rendezéssel.
4. **Gyógyszertári Készlet és Térkép Widget (Jobb hasáb):**
   - *Ha nincs beállítva patika:* Tájékoztató grafika *"Válasszon közeli gyógyszertárat"* címmel és egy *"Gyógyszertár keresése"* gombbal, amely megnyitja a kereső modált.
   - *Ha van beállítva patika:* Megjeleníti a patika nevét, címét, nyitvatartását, a *"Készleten"* és *"Elfogyott / hiány"* tételek darabszámát, valamint a legutóbbi helyi készletmozgások listáját.

#### 4.1.2. Bemenetek és Kimenetek
- **Bemenet:** Időszak kiválasztása a legördülő kapszulából, kattintás a statisztikai linkekre vagy a patikakereső gombra.
- **Kimenet:** Dinamikusan újraszámolt statisztikák, frissített táblázatsorok, átnavigálás a szűrt gyógyszerlistára vagy a patikaválasztó modál megnyitása.

#### 4.1.3. Hibakezelés
- **Nincs adat az adott időszakra:** Ha egy szűkebb időszakra (pl. Elmúlt 1 nap) nincs regisztrált készletmozgás, a táblázat *"Nem történt készletváltozás a kiválasztott időszakban"* barátságos állapotüzenetet ad.

#### 4.1.4. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.1.1:** Az időszak-választóban történő módosítás (pl. 7 napról 30 napra) azonnal és oldalújratöltés nélkül újraszámolja a készletváltozások darabszámait.
- **AC-4.1.2:** A figyelmeztető kártyán a "készlethiány" számára kattintva a rendszer a gyógyszerlistára navigál, ahol a státuszszűrő automatikusan `Készlethiány` értékre van állítva.
- **AC-4.1.3:** Beállított preferált patika esetén a widgetben a helyi készletváltozások az adott patika BF kódjára szűrt valós adatokat mutatják.
- **AC-4.1.4:** Az Irányítópulton megjelenő összesítő kártya és a legutóbbi 20 készletváltozás táblázata kizárólag az OTC és vényköteles termékek adatait számolja és jeleníti meg; egyéb patikai árucikkek nem szerepelhetnek a készletmozgásokban.

---

### 4.2. Gyógyszer Nyilvántartás (Lista és Adatlap)

A portál központi felülete a hazai piacon elérhető gyógyszerek adatainak böngészésére, szűrésére és mélyreható elemzésére.

#### 4.2.1. Gyógyszer Lista Oldal
**Útvonal:** [https://bvo.uneb.hu/gyogyszerek](https://bvo.uneb.hu/gyogyszerek)

##### 4.2.1.1. Teljes Szélességű (Fluid) Elrendezés
- A táblázat rugalmasan (fluid módon) kitölti a felhasználó teljes böngészőablakát, feloldva minden mesterséges szélességi korlátot.
- Széles képernyőn (Full HD, 2K, 4K) rendkívül nagy mennyiségű adatoszlop áttekinthető egyidejűleg vízszintes görgetés nélkül.

##### 4.2.1.2. Gyorsszűrők és Testreszabás
- **"Csak mentett gyógyszerek" szűrő:** Jelölőnégyzet. Bekapcsolásakor azonnal kizárja a nem kedvencnek jelölt készítményeket. A fejléc Mentett -> Összes linkje automatikusan bekapcsolja ezt a funkciót.
- **"Közeli gyógyszertárban elérhető" szűrő:** Bekapcsolásakor csak azok a készítmények maradnak a listában, amelyek a preferált patikában fizikai polckészleten vannak.
- **"Oszlopok" Testreszabó Panel:**
  - Lenyíló ablak jelölőnégyzetekkel.
  - Szabadon be- és kikapcsolható oszlopok: TK-szám, Kereskedelmi név, Hatóanyag, Kiszerelés, Gyártó, Státusz, Közeli patika készlet, Közeli patika frissítve, Utolsó frissítés, Csomagolás, Kiadhatóság, Biztonsági jellemzők, Támogatás, Bruttó fogyasztói ár, Ekvivalencia.
  - A kiválasztott oszlopbeállításokat a böngésző lokálisan megjegyzi a következő munkamenetre is.

##### 4.2.1.3. Oszlopok Rendezése és Drag & Drop Átrendezés
- **Oszlopfejlécek fogantyúja (`drag_indicator`):** Az adatoszlopok fejléce előtt elhelyezett ikonnal az oszlopok sorrendje egérrel szabadon áthúzható (a jobb szélső "Műveletek" oszlop fixen rögzített).
- **Rendezés:** Az oszlop nevére kattintva a lista növekvő vagy csökkenő sorrendbe rendeződik.

##### 4.2.1.4. Oszloponkénti Élő Szűrősáv
A fejlécek alatt közvetlenül minden adatoszlophoz dedikált szűrőmező tartozik:
- Szöveges szűrőmezők (Név, Hatóanyag, TK-szám, Gyártó) gépelés közbeni azonnali szűréssel.
- Legördülő státuszszűrő (`Mindegy`, `Elérhető`, `Készlethiány`, `Megszűnt`).
- Közeli patika készletválasztó (`Mindegy`, `Készleten`, `Nincs készleten`).
- Dátumválasztó mezők a frissítési idő szűrésére.

##### 4.2.1.5. Rögzített (Sticky) Műveleti Oszlop és Akciógombok
- A táblázat jobb szélén lévő **"Műveletek" oszlop fix pozíciójú**: vízszintes görgetés esetén is folyamatosan látható marad a képernyő jobb szélén, finom elválasztó árnyékkal.
- **Műveleti gombok (36px x 36px négyzetek):**
  - **Kedvenc gomb (Csillag):** Egykattintásos mentés a mentett listába. Sárga csillag jelzi az aktív állapotot. Ha olyan gyógyszert távolítanak el, amihez értesítés volt beállítva, megerősítő kérdés jelenik meg.
  - **Értesítés gomb (Harang):** Feliratkozás státuszváltozási hírlevélre. Kék harang jelzi az aktív feliratkozást.
  - **"Részletek >" Link:** Jobbra mutató nyíl hivatkozás az adott gyógyszer részletes adatlapjára.

##### 4.2.1.6. Lapozó és Oldalméret
- Lapozás számozott gombokkal és Előző/Következő vezérlőkkel a bal alsó sarokban.
- Oldalméret választó a jobb alsó sarokban: `10`, `20` (alapértelmezett), `50`, `100` elem/oldal.

---

#### 4.2.2. Gyógyszer Adatlap
**Útvonal:** `https://bvo.uneb.hu/gyogyszerek/adatlap?tk=[tkSzam]`

##### 4.2.2.1. Fejléc és Visszanavigálás
- `"< Vissza a gyógyszerekhez"` link, amely visszaállítja a gyógyszerlistát az előzőleg beállított szűrők és lapozási pozíció megtartásával.
- Terméknév sötétkékkel kiemelve, alatta az ATC-kód és a hatóanyag megnevezése.
- Felső akciógombok: *"Kedvencekhez adás"* és *"Értesítést kérek"* (48px méretű kiemelt gombok).

##### 4.2.2.2. Státusz Figyelmeztető Bannerek
- **Készlethiány esetén:** Sárga keretes doboz felkiáltójellel. Bemutatja a hiány kezdetét, becsült végét, a hivatalos okot és a szakmai pótlási javaslatot.
- **Megszűnt készítmény esetén:** Piros keretes figyelmeztető doboz a forgalomból való kivonás dátumával és hatósági tájékoztatással.

##### 4.2.2.3. Hálózati és Helyi Készletstátuszok (A 4 Készletszint)
A készletinformációk két külön blokkban jelennek meg:

1. **Országos Hálózati Készlet (BENU GYÓGYSZERTÁRAK):**
   - Normál gyógyszer esetén:
     - `[Készleten]` **X db BENU Gyógyszertárban** (kattintható link a patikakeresőbe).
     - `[Rendelésre]` **Y db BENU Gyógyszertárban (1-2 munkanap)** (kattintható link).
   - Hiánycikk esetén:
     - Ha van még elfekvő készlet: `[Korlátozottan]` **X db BENU Gyógyszertárban**.
     - Egyéb patikákra: `[Nem elérhető]` **Z gyógyszertárban**.
2. **Helyi Készlet (KÖZELI GYÓGYSZERTÁR):**
   - Ha van beállított közeli patika:
     - Megjeleníti a megfelelő színkódolt jelvényt (`Készleten`, `Korlátozottan`, `Rendelésre (1-2 munkanap)`, `Nem elérhető`).
     - A patika neve kék aláhúzott hivatkozásként jelenik meg.
     - **Azonnali részletmegtekintés:** A patika nevére kattintva helyben felugrik a **Gyógyszertár Részletek Modális Ablak** a nyitvatartással és elérhetőségekkel anélkül, hogy el kellene hagyni a gyógyszer adatlapját!
   - Ha nincs beállítva patika:
     - *"Nincs beállítva közeli gyógyszertár"* felirat és *"Gyógyszertár kiválasztása"* gyorslink.

##### 4.2.2.4. Részletes Tulajdonságok és Árinformációk Kártya
Három oszlopos áttekintő kártya:
- Törzsadatok: Gyártó, Kiszerelés, Támogatási kategória, Ekvivalencia, TK-szám, Hatóanyag (kattintható INN).
- Árak: Bordó színnel kiemelt **Bruttó fogyasztói ár** (pl. `2 490 Ft`) és sötétkékkel kiemelt **Becsült térítési díj** támogatott termékeknél.

##### 4.2.2.5. Helyettesítő Készítmények (Substitutes Kártya)
- Azonos hatóanyagú (INN) vagy terápiásan ekvivalens gyógyszerek táblázata.
- Megjeleníti a helyettesítő termék nevét, kiszerelését, árát, elérhetőségét a közeli patikában, közvetlen kedvenc/értesítés gombokat és átnavigálási lehetőséget az adott helyettesítő adatlapjára.

##### 4.2.2.6. Státusz Történet (Előzmények Kártya)
- Időrendi lista a gyógyszer korábbi készlet- és piaci státuszváltozásairól (dátum, régi státusz -> új státusz).
- A blokk alján látható az utolsó adatbázis-szinkronizáció pontos időbélyege.

#### 4.2.3. Hibakezelés a Gyógyszer Modulban
- **Nincs találat a szűrésre:** Ha a felhasználó által megadott keresési és szűrési feltételeknek egyetlen gyógyszer sem felel meg, a táblázatban megjelenik az *"A megadott szűrési feltételekkel nem található gyógyszer"* üzenet, valamint egy *"Szűrők törlése"* gomb, amely alaphelyzetbe állítja a beviteli mezőket.
- **Nem létező TK-szám az adatlapon:** Ha az URL-ben megadott törzskönyvi szám nem található a nyilvántartásban, a felület figyelmeztető hibaüzenetet jelenít meg (*"A keresett gyógyszer nem található"*), és felkínálja a visszatérést a gyógyszerlistára.

#### 4.2.4. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.2.1:** A táblázat oszlopfejlécei az egérrel áthúzhatók (Drag & Drop), és az új sorrend a táblázat újratöltésekor vagy lapozáskor sem esik szét.
- **AC-4.2.2:** A jobb szélső "Műveletek" oszlop vízszintes görgetéskor mindvégig látható marad a monitor jobb szélén rögzített módon.
- **AC-4.2.3:** A gyógyszer adatlapon a "Közeli gyógyszertár" nevére kattintva azonnal felugrik a Gyógyszertár Részletek modális ablak anélkül, hogy a böngésző elnavigálna a gyógyszer oldaláról.
- **AC-4.2.4:** Készlethiányos gyógyszer esetén a hiány oka, kezdete és a helyettesítő javaslat jól láthatóan megjelenik a sárga figyelmeztető bannerben.
- **AC-4.2.5:** A gyógyszer-nyilvántartásban és a státuszkövetésben kizárólag OTC és vényköteles készítmények vesznek részt; egyéb nem gyógyszer termékek (étrend-kiegészítők, gyógyhatású termékek, kozmetikumok, gyógyászati segédeszközök) státuszait a rendszer nem monitorozza és nem jeleníti meg státuszkövetett tételként.

---

### 4.3. Gyógyszertár Kereső és Térkép

A rendszer interaktív térképes és szinkronizált listás felülete a BENU gyógyszertárak készletének, nyitvatartásának és elhelyezkedésének áttekintésére.

**Útvonal:** [https://bvo.uneb.hu/gyogyszertarak](https://bvo.uneb.hu/gyogyszertarak)

#### 4.3.1. Fejléc Alatti Kereső- és Szűrősáv (SubHeader)
1. **Keresőmező:**
   - Egysoros keresőmező jobb oldali nagyító ikonnal.
   - Gépelhető: Patika neve, település, utca, irányítószám (pl. `"1052"`, `"Szeged"`, `"Görgey"`).
   - Valós időben szűri a kártyalistát és a térképen látható markereket.
2. **Nyitvatartási Szűrőgombok (Filter Pills):**
   - Kapszula gombok: `"Most nyitva"` (óra ikon), `"Hétvégén nyitva"` (naptár ikon), `"0-24 órában nyitva"` (épület ikon).
   - Bekapcsoláskor azonnal kizárják a feltételnek meg nem felelő patikákat.
3. **"Szűrés törlése" Link:**
   - Kék aláhúzott szöveg, amely csak akkor jelenik meg, ha aktív szűrő vagy beírt keresőszöveg van érvényben. Egy kattintással töröl minden szűrőt.
4. **Mobil Nézetváltó:**
   - Mobilon megjelenő kapcsoló gomb (`Lista` / `Térkép`), amellyel a felhasználó válthat a térkép és a függőleges kártyalista között.

#### 4.3.2. Helyzet- és Preferenciameghatározó Panelek
A lista tetején két kiemelt információs kártya segíti a tájékozódást:
1. **"Az Ön tartózkodási helye" Panel (Világoskék kártya):**
   - Kiírja a felhasználó észlelt vagy beállított címét (alapértelmezett: *"Budapest, Soroksári út 32., 1095"*).
   - **"Aktuális hely frissítése" gomb:** Kattintásra a rendszer engedélyt kér a böngésző GPS helymeghatározásától, újraszámolja a patikák távolságát légvonalban, és a térképet a felhasználó aktuális pozíciójára állítja.
2. **"Válasszon közeli gyógyszertárat" / "Az Ön közeli gyógyszertára:" Panel (Világoszöld kártya):**
   - *Ha nincs kijelölt patika:* *"Válasszon a listából közeli gyógyszertárat, hogy láthassa a készletét!"* tájékoztató szöveg.
   - *Ha van kijelölt patika:* Kiírja a választott patika nevét zöld aláhúzott szövegként. Rákattintva a térkép azonnal ráfókuszál a gyógyszertárra és ráközelít (zoom).

#### 4.3.3. Patikalista és Részletes Kártyák (Pharmacy Cards)
- **Találati számláló:** Kiírja a találatok pontos számát (pl. *"10 BENU gyógyszertárat találtunk"*). Térképi nagyítás esetén jelzi a látható kivágat patikáit és felkínálja a `[Mutasd az összest]` visszaállítást.
- **Patika Kártya Felépítése:**
  - **Patika neve:** Kék aláhúzott link, amely megnyitja a részletes heti adatlap modált.
  - **Pontos cím:** Irányítószám, város, utca, házszám.
  - **Becsült távolság:** Tizedes pontosságú légvonalbeli távolság az észlelt pozíciótól (pl. `"~2.4 km"`).
  - **Napi nyitvatartás és státuszjelvény:**
    - Zöld: *"Nyitva"*
    - Sárga: *"Hamarosan zár"* vagy *"Hamarosan nyit"*
    - Piros: *"Zárva"*
  - **"Többit mutasd" Link:** Közvetlen gomb a heti nyitvatartás megnyitásához.
  - **"Közelinek jelölöm" / "Közeli gyógyszertár" Akciógomb:**
    - Ha nincs kiválasztva: Világoszöld gomb plusz jellel.
    - Ha ki van választva: Teli zöld gomb fehér pipával.
    - Kattintásra azonnal beállítja vagy feloldja a preferált patika állapotot az egész portálon.
  - **Kártya kiválasztása:** Kattintásra határozott zöld keretet kap, és a térképen is aktívvá válik az adott marker.

#### 4.3.4. Interaktív Térkép és Lebegő Információs Ablak (Master Popup)
- Teljes felületű OpenStreetMap térkép nagyítási és mozgatási lehetőséggel.
- **Egyedi BENU Jelölők (Pins):** Csepp alakú ikon fehér kör közepén hivatalos BENU zöld kereszttel. A kijelölt patika kiemelt színű aktív jelölőként látható.
- **Lebegő felugró ablak:** A jelölőre kattintva elegáns kártya nyílik lefelé mutató nyíllal: patikanév, cím, távolság, nyitvatartás, "Közelinek jelölöm" akciógomb és adatlap link.

#### 4.3.5. Gyógyszertár Részletek Modal és Mélylinkelés
- **Mélylinkelés URL támogatása:** Közvetlen címmel (pl. `https://bvo.uneb.hu/gyogyszertarak?id=BF133`) megnyitva a felület azonnal az adott gyógyszertárra navigálja a térképet, és automatikusan megnyitja a heti részletes adatlap modált.
- **Modal tartalma:** Patika hivatalos neve, kódja, státusza, kattintható telefonszám (`tel:` hívásindításhoz), kattintható e-mail cím (`mailto:` levélíráshoz), Hétfőtől Vasárnapig tartó heti nyitvatartási táblázat az aktuális nap kiemelésével.

#### 4.3.6. Gyógyszertári Készlet Nézet (Adatlap Modál)
- A gyógyszer adatlapról a *"Megnézem hol"* gombokkal előhívható speciális modális nézet, amely kizárólag azokat a patikákat tünteti fel a térképen és a listában, ahol a vizsgált gyógyszer elérhető vagy rendelhető.

#### 4.3.7. Hibakezelés a Gyógyszertár Modulban
- **GPS helymeghatározás megtagadása:** Ha a felhasználó böngészőjében letiltja a helymeghatározást, a rendszer nem dob hibát, hanem diszkrét értesítést ad, és megtartja az alapértelmezett budapesti referencia-helyzetet.
- **Nincs patika a megadott szűrésre:** A lista helyén megjelenik az *"A megadott feltételekkel nem található gyógyszertár"* üzenet és a szűrők egykattintásos törlésének gombja.

#### 4.3.8. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.3.1:** A keresőmezőbe beírt településnévre (pl. "Szeged") a kártyalista és a térkép jelölői késlekedés nélkül kizárólag a szegedi patikákat jelenítik meg.
- **AC-4.3.2:** A "Közelinek jelölöm" gombra kattintva a választott patika azonnal megjelenik a fejlécben és az Irányítópulton is újratöltés nélkül.
- **AC-4.3.3:** Mélylinkkel érkezve (`/gyogyszertarak?id=BF133`) a térkép automatikusan a megadott patikára fókuszál, és a heti nyitvatartási modal felugrik.

---

### 4.4. Képzési Program *(Nem fejlesztési scope, prototípusban sem látható)*

> [!WARNING]
> **Felületi Státusz: Nem fejlesztési scope, prototípusban sem látható**  
> Ez a modul és felület jelenleg nem képezi a fejlesztési scope részét, a prototípusban sem látható (a navigációs fejlécből, a főoldali irányítópultról és a globális keresőből kivezetésre került, közvetlen menühivatkozás nem vezet rá).  
> Az alábbi fejezet a korábbi koncepció szerinti működést, a kurzusadatokat és az LMS kapcsolódási logikát rögzíti specifikációs nyilvántartás céljából.

**Útvonal:** `https://bvo.uneb.hu/kepzesek` *(Közvetlen eléréssel érhető el)*

#### 4.4.1. Működés és Képzés Lista Oldal
1. **Kategória Szűrősáv:**
   - Kapszula szűrők: `Összes` (alapértelmezett), `Akkreditált` (zöld címke), `Gyártói` (kék címke), `Eladásösztönző` (sárga címke).
2. **Kurzuskártyák Tartalma:**
   - Képzés címe, kategória címkéje, rövid szakmai összefoglaló, becsült időtartam (pl. `"45 perc"`), tartalomtípus ikon (Videó / PDF).
   - Gombok a kártyán: *"Részletek"* (navigáció az adatlapra) és *"Érdekel"* (BENU LMS tájékoztató modál megnyitása).
3. **BENU LMS Tájékoztató Modal:**
   - Az *"Érdekel"* gombra kattintva felugró ablak bemutatja a képzési rendszert és átirányítási linket nyújt a külső BENU LMS tanulási felületre.

#### 4.4.2. Képzés Részletes Oldal
**Útvonal:** `https://bvo.uneb.hu/kepzesek/[courseId]` (Példa: `/kepzesek/c1`)
- **Bevezető Videó Placeholder:** Képzés fejléce lejátszás szimbólummal.
- **Részletes Ismertető:** A képzés szakmai céljai és leírása.
- **Modullista:**
  - 1. modul: Bevezető előadás (videó ikon).
  - 2. modul: Klinikai adatok (PDF segédanyag).
  - 3. modul (Zárolt): Záróteszt és akkreditáció — felirat: *"A tartalom eléréséhez lépjen be a BENU LMS rendszerbe"*.
- **Akkreditált Pontok Kártya:** Megszerezhető kreditpontok kiemelve (pl. `2 kreditpont`) és *"Pontszerzés"* gomb, amely az LMS-re irányít át.

#### 4.4.3. Bemenetek, Kimenetek és Hibakezelés
- **Bemenet:** Kategória szűrő gombok kattintása, *"Érdekel"* vagy *"Részletek"* gomb választása.
- **Kimenet:** Szűrt kurzuslista, modális tájékoztató ablak megnyitása, navigáció a kurzus adatlapjára.
- **Nem létező kurzusazonosító:** Ha az URL-ben érvénytelen azonosító szerepel, a felület *"A képzés nem található"* hibaüzenetet ad és visszairányítást kínál a listára.
- **Elfogadási kritérium (ha a felület aktívvá válik):**
  - **AC-4.4.1:** A kurzuskártyák kategória szerinti szűrése pontosan és azonnal kiszűri a nem releváns képzéseket.
  - **AC-4.4.2:** A zárolt akkreditációs modulra kattintva a felület tájékoztatást ad az LMS belépési kötelezettségről.

---

### 4.5. Globális Keresés (Asztali és Mobil Overlay)

A fejlécbe integrált, rendszerszintű intelligens keresőmotor a gyógyszerek és gyógyszertárak gyors eléréséhez.

#### 4.5.1. Keresési Felületek
- **Asztali nézet (≥768px):** A fejléc közepén lévő beviteli mező alatt gépeléskor azonnal legördül a 400px széles lebegő találati kártya.
- **Mobil nézet (<768px):** A nagyító ikonra kattintva **teljes képernyős Mobil Kereső Overlay** nyílik meg (`fixed inset-0 z-[100]`), letiltva a háttér görgetését. Tartalma: visszalépés gomb, automatikusan fókuszált keresőmező törlés (X) gombbal, és vízszintesen görgethető kategória fülek (`Minden`, `Gyógyszerek`, `Patikák`).

#### 4.5.2. Keresési Logika és Találatok
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

#### 4.5.3. Elfogadási Kritériumok
- **AC-4.5.1:** Gyógyszernév és hatóanyag alapján a releváns készítmények azonnal megjelennek a találati panelen.
- **AC-4.5.2:** Mobilon a kereső megnyitásakor a billentyűzet automatikusan felugrik és a háttér nem görgethető el.

---

### 4.6. Hitelesítés, Jogosultságok és Kapcsolatfelvétel

A portál hivatalos, orvosi szakmai azonosítási és beléptetési rendszere.

**Útvonal:** [https://bvo.uneb.hu/login](https://bvo.uneb.hu/login)

#### 4.6.1. Bejelentkezési Módok (3 Fül)
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

#### 4.6.2. Kétfaktoros Azonosítás (2FA) Igazolási Képernyő
Amennyiben a felhasználó fiókjában aktív a 2FA és az eszköz még nem megbízható:
- Tájékoztató pajzs ikon és az ellenőrző kód kiküldésének visszaigazolása.
- 56px magas, nagyméretű, középre zárt 6-jegyű OTP kód beviteli mező.
- **"Megbízható eszköz megjegyzése (ne kérjen kódot 30 napig)" jelölőnégyzet:** Alapértelmezetten bepipálva. Megjelölése esetén a böngésző 30 napig mentesül az újabb kódkérés alól.
- *"Kód igazolása"* sötétkék akciógomb, amely sikeres azonosítás után beléptet a Dashboardra.
- *(A prototípus felületén tesztelői segédlet mutatja a működő demó kódot: `123456`).*

#### 4.6.3. Elfelejtett Jelszó Oldal
**Útvonal:** [https://bvo.uneb.hu/forgot-password](https://bvo.uneb.hu/forgot-password)
- E-mail cím megadása után belépési kód igényelhető. A prototípus felületén tájékoztató doboz emlékeztet a működő demó jelszóra.

#### 4.6.4. Manuális Regisztrációs Igény / Kapcsolatfelvételi Űrlap
A zárt szakmai jelleg miatt **nincs azonnali önkiszolgáló fiókregisztráció**:
- Az új orvos vagy gyógyszerész a bejelentkezési oldalról elérhető kapcsolatfelvételi linken keresztül nyithatja meg a regisztrációs igény űrlapot.
- **Kötelező adatok:** Teljes név, Szakmai e-mail, Telefonszám, Orvosi/Gyógyszerészi pecsétszám, Szakterület/Munkahely, valamint az adatkezelési szabályzat elfogadása.
- **Folyamat:** Az űrlap beküldésekor a rendszer visszaigazolást ad az igény rögzítéséről. Az adminisztrátor a kamarai nyilvántartásban ellenőrzi a pecsétszámot, és az adminisztrációs felületen manuálisan hozza létre az új aktív fiókot.

#### 4.6.5. Hibakezelés és Biztonság
- **Hibás jelszó vagy e-mail:** Piros figyelmeztető üzenet jelenik meg a beviteli mezők alatt (*"Érvénytelen e-mail cím vagy jelszó"*).
- **Inaktív fiók:** Inaktív vagy felfüggesztett felhasználó (pl. `teszt@example.com`) belépési kísérletét a rendszer azonnal elutasítja: *"A fiók felfüggesztésre került. Kérjük, keresse az adminisztrátort."*
- **AC-4.6.1:** Helyes bejelentkezési adatokkal a felhasználó közvetlenül a Dashboardra érkezik.
- **AC-4.6.2:** A 30 napos megbízható eszköz pipálása esetén a következő belépéskor a rendszer nem kéri újra a kétfaktoros kódot.

---

### 4.7. Adminisztráció

Kizárólag `Admin` szerepkörű felhasználók számára engedélyezett felületcsoport.

#### 4.7.1. Felhasználókezelés
**Útvonal:** [https://bvo.uneb.hu/admin/users](https://bvo.uneb.hu/admin/users)
- **Felhasználói Táblázat:** Név, E-mail cím, Szerepkör (`Admin` / `User`), Státusz (`Aktív` / `Inaktív`), Szakterületek, Műveleti gomb (`⋮`).
- **Felhasználó Szerkesztő Modál (3 Fül):**
  1. *Alapadatok:* Név, Elsődleges e-mail, Szerepkör váltás (`User` / `Admin`), Státusz váltás (`Active` / `Inactive`).
  2. *Profil:* Másodlagos e-mail és orvosi szakterületek hozzárendelése.
  3. *Hírlevél:* Készletértesítő és egyéb preferenciák adminisztrátori konfigurálása.
- **Adminisztrátori Műveletek:**
  - Fiók felfüggesztése / aktiválása megerősítő kérdéssel. *(Saját fiókját az adminisztrátor nem deaktiválhatja).*
  - **Munkamenet Kényszerített Lezárása (Force Logout):** Azonnal érvényteleníti az aktív bejelentkezést, a felhasználó azonnal kijelentkezik.

#### 4.7.2. Fórum és Tartalom Moderálás
**Útvonal:** [https://bvo.uneb.hu/admin/forum](https://bvo.uneb.hu/admin/forum)
- Témák és hozzászólások teljes listája.
- **Műveletek:** Téma lezárása (nincs új hozzászólás), Elrejtés / Megjelenítés (visszavonható moderálás), Szöveg javítása, Szerző anonimizálása (`"Anonim Felhasználó"` megnevezésre).

#### 4.7.3. Gyógyszertár Karbantartás és Készletáttekintés
**Útvonal:** [https://bvo.uneb.hu/admin/pharmacies](https://bvo.uneb.hu/admin/pharmacies)
- A portálon **nincs patika-szerkesztő űrlap** (az adatok forrása a külső Patika Kezelő rendszer).
- A felület **áttekintést és készletellenőrzést** biztosít: patikák listája, BF kódok, adatszinkron és készletszinkron időpontok, valamint az adott patika termékkészletének tételes táblázata.

#### 4.7.4. Elfogadási Kritériumok
- **AC-4.7.1:** Normál szakmai felhasználó (`User`) nem érheti el az `/admin/*` útvonalakat; jogosulatlan próbálkozás esetén a rendszer visszairányítja a Dashboardra.
- **AC-4.7.2:** A Force Logout végrehajtásakor a célfelhasználó böngészőjében a következő kattintáskor azonnal megjelenik a bejelentkezési ablak.

---

### 4.8. Felhasználói Profil és Értesítéskezelés

A felhasználó személyes adatainak, értesítéseinek és fiókbiztonságának kezelési központja.

**Útvonal:** [https://bvo.uneb.hu/profile](https://bvo.uneb.hu/profile)

#### 4.8.1. Személyes Adatok és Szakterületek
- Név, Elsődleges és Másodlagos e-mail cím olvasási módban jelenik meg (*"Módosításához keresse az adminisztrációt"*).
- **Szakterületek szerkesztése:** Kereshető többválasztós listában az orvos szabadon frissítheti szakorvosi képesítéseit, majd a *"Szakterületek mentése"* gombbal rögzítheti.

#### 4.8.2. Preferált Gyógyszertár Kezelése
- Megjeleníti a jelenleg kijelölt közeli patika kártyáját.
- Gombok: *"Módosítás"* (megnyitja a modális patikakeresőt) és *"Törlés"* (eltávolítja a kijelölést).

#### 4.8.3. Készletinfó Hírlevél és Értesítési Beállítások
Külön-külön konfigurálható az **Elsődleges ÉS a Másodlagos e-mail címre**:
- Kapcsoló: `Be` / `Ki`.
- Gyakoriság: `Napi`, `Heti`, `Havi`.
- Kiküldés órája: `0` és `23` óra között.
- Témák: `Újra elérhető`, `Készlethiány`, `Megszűnt`.
- Hatókör: `Minden`, `Szakterület + mentett gyógyszerek`, `Csak szakterület`, `Csak mentett gyógyszer`.

#### 4.8.4. Aloldalak: Kedvencek és Készletértesítések
- **Mentett Kedvencek Oldal:** [https://bvo.uneb.hu/profile/favorites](https://bvo.uneb.hu/profile/favorites)
  - Elmentett gyógyszerek listája, készletállapotuk, és közvetlen eltávolítási opció.
- **Készletértesítések Oldal:** [https://bvo.uneb.hu/profile/notifications](https://bvo.uneb.hu/profile/notifications)
  - Aktív értesítés-feliratkozások táblázata a feliratkozás pontos dátumával és azonnali leiratkozási gombbal.

#### 4.8.5. Biztonság és Kétfaktoros Azonosítás (2FA / Passkey)
- **2FA Kapcsoló és Csatorna:** `Be`/`Ki` kapcsoló, csatornaválasztás: `E-mail OTP`, `SMS OTP`, `Hitelesítő App (TOTP)`.
- **Passkey Kezelés:** Regisztrált biometrikus eszközök listája, *"Új Passkey hozzáadása"* gomb és törlési lehetőség.
- **Megbízható Eszközök Elfelejtése:** *"Eszközök elfelejtése"* gomb, amely azonnal érvényteleníti az összes 30 napos megjegyzett böngészőt.

#### 4.8.6. Elfogadási Kritériumok
- **AC-4.8.1:** A hírlevél beállítások módosításai azonnal mentésre kerülnek és a rendszer a visszajelző üzenetet megjeleníti.
- **AC-4.8.2:** Az "Eszközök elfelejtése" gombra kattintva a megbízható eszközök számlálója nullázódik.

---

### 4.9. Közösség és Szakmai Fórum

Zárt szakmai kommunikációs tér orvosok és gyógyszerészek közötti tapasztalatcserére.

**Útvonal:** [https://bvo.uneb.hu/kozosseg](https://bvo.uneb.hu/kozosseg) *(Közvetlen eléréssel érhető el; a főmenüben nem szerepel)*.

#### 4.9.1. Működés és Témakezelés
- **Szakterületi szűrés:** Témák böngészése orvosi szakágak szerint.
- **Téma Részletes Oldal:** Téma indító bejegyzése, hozzászólások időrendben, új hozzászólás beküldése.
- **Új Téma Indítása:** Cím, szakterület és szöveg megadásával. Lehetőség van **anonim közzétételre** is (a szerző neve helyett `"Anonim Felhasználó"` jelenik meg).
- **Lezárt Téma:** Lezárt státuszú témához a felület nem engedélyez új hozzászólást fűzni.

#### 4.9.2. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.9.1:** Anonim témaindítás vagy hozzászólás esetén a szerző valós neve és azonosítója rejtve marad, kizárólag az "Anonim Felhasználó" megnevezés jelenik meg a többi felhasználó számára.
- **AC-4.9.2:** Lezárt státuszú fórumtémánál a rendszer letiltja az új hozzászólás beküldésének lehetőségét és tájékoztató feliratot jelenít meg.

---

---

## 5. Korábban tervezett, de elvetett / külső rendszerbe átsorolt funkciók

Ez a fejezet összefoglalja azokat az elemeket, amelyek korábbi koncepciókban szerepeltek, de a jelenlegi érvényes felületen nem aktívak vagy külső rendszer feladatkörébe tartoznak:

1. **Képzési Program (BENU Képzések - `/kepzesek`):**
   - *Státusz:* ⚠️ Nem fejlesztési scope, prototípusban sem látható.
   - *Részletek:* A képzési felület és a külső LMS hivatkozások nem részei a fejlesztési scope-nak, és a prototípusban sem láthatók (a navigációs fejlécben [Navbar], az Irányítópulton és a Globális Keresőben sem érhető el hivatkozás rájuk). A funkció részletes leírását a 4.4. fejezet tartalmazza a funkcionális nyilvántartás érdekében.
2. **Közösségi Fórum a Főmenüben és a Globális Keresőben:**
   - *Státusz:* Kivezetve a kiemelt főmenüből. A fórum közvetlen URL-en (`/kozosseg`) elérhető maradt, az adminisztrációs felügyelet működik.
3. **Közösségi Aktivitás Widget az Irányítópulton:**
   - *Státusz:* Elvetve.
4. **Jelszó Módosítása a Felhasználói Profilban:**
   - *Státusz:* Nem aktív felületi elem. Az orvosi profilban a személyes adatok védettek; módosításuk adminisztrátori közreműködéssel történik.
5. **Betegtájékoztató Letöltése a Gyógyszer Adatlapról:**
   - *Státusz:* Jelenleg nem aktív a prototípus felületén.
6. **Globális Kereső: "Összes találat megtekintése" külön találati oldal:**
   - *Státusz:* Nem vezet külön gyűjtőoldalra; a találatok a felugró panelen közvetlenül kattinthatók.
7. **Adminisztrációs Gyógyszertár Adatszerkesztő Űrlap:**
   - *Státusz:* Külső rendszerbe átsorolva. A patikák alapadatainak karbantartása a központi Patika Kezelő rendszerben történik; a portál kizárólag áttekintést és készletellenőrzést nyújt.
8. **Gyógyszer Lista Kártyás Nézete:**
   - *Státusz:* Elvetve. A gyógyszerek böngészése a magas adattartalom és a szakmai szempontok miatt kizárólag rendezhető táblázatos nézetben történik.
9. **Önkiszolgáló Automatikus Felhasználói Regisztrációs Felület:**
   - *Státusz:* Jelenleg nem tervezett. A rendszer zárt szakmai jellege miatt a regisztráció kizárólag a bejelentkező felületről indított kapcsolatfelvételi űrlapon és kézi adminisztrátori jóváhagyáson keresztül működik.
10. **Nem Gyógyszer Patikai Termékek (Étrend-kiegészítők, Orvostechnikai Eszközök, Kozmetikumok) Státuszkövetése:**
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
- **Rendeltetés:** Az adminisztrációs felület (`/admin/users`, `/admin/pharmacies`, `/admin/forum`) és a teljes körű moderációs műveletek tesztelése.

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
| **v1.6.1** | 2026.10.20. | Funkcionális Hatókör & Irányelvek Pontosítása | **Gyógyszer státuszkövetés, WCAG és böngésző title követelmények rögzítése:**<br>• Rögzítésre került, hogy a portál gyógyszerkészlet- és hiánystátuszkövetési funkciói kizárólag a humán gyógyszerek két csoportjára korlátozódnak: **OTC (vény nélkül kapható)** és **vényköteles (Rx)** készítmények; egyéb nem gyógyszer cikkek (étrend-kiegészítők, kozmetikumok, tápszerek, gyógyászati segédeszközök) státuszai kívül esnek a hatókörön.<br>• **WCAG 2.2 irányelvek:** Törekedni kell az alapvető sztenderdek betartására, de zárt szakmai rendszer lévén és a nem akadályoztatott orvosi célcsoport miatt nem követelmény a maximális szintű megfelelőség.<br>• **Technikai SEO és lapfül title formátum:** Zárt rendszer lévén klasszikus SEO elvárások nincsenek, de a böngészést segítő lapfülcím kötelezően a `"{lap neve} \| BENUvény Orvosi Portál"` formátumban kell megjelenjen (új 1.8 fejezet és AC-4.0.5). |
| **v1.6.0** | 2026.10.20. | Átfogó Revízió & FRS Bővítés | **Prototípus működés szerinti teljes körű funkcionális szinkronizáció és követelménybővítés:**<br>• Új dátumozott kiadás (`bvo-funkcionalis-specifikacio-20261020.md`) létrehozása és a főkatalógus szinkronizálása.<br>• **Képzési Program dokumentációjának megőrzése inaktív felületi státuszjelzéssel:** A Képzési Program és az LMS integráció részletes funkcionális leírása a dokumentumban megmaradt (3.4. és 4.4. fejezetek), de egyértelműen és kiemelten megjelölve, hogy a felület a jelenlegi éles prototípusban **nem aktív** (a navigációból kivezetve).<br>• Minden fő funkcionális modul kiegészítése strukturált **Bemenetek és Kimenetek**, felhasználói szintű **Hibakezelés** és pontosan ellenőrizhető **Elfogadási Kritériumok (Acceptance Criteria - AC)** fejezetekkel a globális követelményszabályoknak megfelelően.<br>• A 4 szintű készletstátusz (`Készleten`, `Korlátozottan`, `Rendelésre (1-2 munkanap)`, `Nem elérhető`) és a hozzá tartozó hálózati / helyi felületi megjelenítés megerősítése.<br>• A Gyógyszertárak modul SubHeader keresőjének, pill szűrőinek (`Most nyitva`, `Hétvégén nyitva`, `0-24`), GPS helymeghatározó paneljének, valamint a heti nyitvatartási modal és mélylinkelés (`/gyogyszertarak?id=...`) leírásának véglegesítése.<br>• A fejléc Mentett gyorslista "Összes" gombjának navigációs viselkedése (`onlyFavorites=true` szinkron) a gyógyszerlista oldallal.<br>• Manuális regisztrációs kapcsolatfelvételi űrlap, 2FA és passkey biztonsági folyamatok pontosítása. |
| **v1.5.1** | 2026.09.08. | Módosítás | **Gyógyszerlista táblázat fluid (teljes képernyőszélességű) elrendezése:**<br>• A gyógyszerek oldal és az adatáblázat fix maximális szélességi korlátja (1440px) feloldásra került; a felület dinamikusan kitölti a teljes képernyőszélességet.<br>• Nagyobb monitorokon jelentősen javult az adatok átláthatósága és olvashatósága, minimalizálva a vízszintes görgetés szükségességét.<br>• Frissítésre került a 4.2.1. pont (Fluid elrendezés). |
| **v1.4.1** | 2026.08.24. | Kiegészítés | **Manuális felhasználói regisztráció és kapcsolatfelvételi űrlap rögzítése:**<br>• Tisztázásra került, hogy a felhasználók regisztrációja kézzel (manuálisan) történik az adminisztrátor által.<br>• Az új szakmai felhasználó a bejelentkezési felületről elérhető űrlapon veszi fel a kapcsolatot az adminisztrációval (pecsétszám, szakterület megadásával).<br>• Új adatmodell (3.6) és új funkcionális leírás (4.6.4), elvetett funkciók (5.9) és Változásnapló (7) bevezetése. |

<!-- DOKUMENTUM VÉGE -->
