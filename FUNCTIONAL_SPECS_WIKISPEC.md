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

> **Dokumentum azonosító:** FRS-BVO-20261020  
> **Verzió:** 1.8.2  
> **Dátum:** 2026.10.20.  
> **Státusz:** Aktív / Hatályos (Dashboard kétszintes kompakt készletváltozási lista, Mobil nézet és helyszíni orvosi vizit támogatása, Accordion szűrőpanel, gyógyszerkártyák, patika Split View)  
> **Élő prototípus elérhetőség:** [https://bvo.uneb.hu/](https://bvo.uneb.hu/) (tesztfiókok a 6. fejezetben)  

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

### 1.9. Eszközhasználati Környezet: Asztali/Laptop Fókusz és Helyszíni Orvosi Vizit (Mobil Kontextus)

A BENUvény Orvosi Portál funkcionális kialakításakor alapvető szempont az egészségügyi szakemberek valós munkakörnyezetének és szokásainak pontos leképezése:

1. **Elsődleges Felhasználási Környezet: Rendelői Munkaállomás (Desktop / Laptop)**
   - **Rendelői fókusz:** A portál funkcióit a háziorvosok, szakorvosok és gyógyszerészek túlnyomórészt az orvosi rendelőben vagy intézményi munkaállomáson (számítógépen, nagy felbontású monitoron vagy laptopon) használják.
   - **Többoszlopos adatsűrűség:** A több mint 41 000 forgalomban lévő humán gyógyszerkészítmény részletes törzskönyvi adatainak (15 adatmező: TK szám, hatóanyag, kiszerelés, gyártó, csomagolás, kiadhatósági alcsoport, biztonsági elemek, engedély dátum, piaci státusz, közeli patika készlet és frissítési időpontok) áttekintése, drag-and-drop oszlopátrendezése és komplex szűrése a nagyméretű, teljes képernyős (fluid) asztali táblázatos felületen a leghatékonyabb.

2. **Különleges Szituációk és Mobil Kontextus: Helyszíni Betegvizit (Ambuláns Használat)**
   - **Kiszállás a beteghez:** Az orvosi hivatásban rendszeresen előforduló élethelyzet, amikor a kezelőorvos rendelőn kívül, a páciens otthonában végez helyszíni vizitet, vagy ügyeleti ellátás keretében tartózkodik a beteg ágya mellett.
   - **Mobil döntéstámogatási igény:** Ilyen helyzetben az orvos kizárólag okostelefonján vagy kisméretű táblagépén keresztül tud tájékozódni. A helyszínen, a vényírás pillanatában azonnal választ kell kapnia az alábbi kritikus kérdésekre:
     - *Elérhető-e jelenleg országosan a felírni kívánt gyógyszer, vagy készlethiány áll fenn?*
     - *A beteghez legközelebb eső BENU gyógyszertárban van-e fizikai polckészleten a készítményből?*
     - *Készlethiány esetén milyen azonnali helyettesítő (azonos hatóanyagú, INN) készítmény kapható a közeli patikában?*
   - **Mobiltervezési alapelv:** A mobil felület nem csupán az asztali nézet egyszerűsítése, hanem egykezes, érintésbarát orvosi döntéstámogató munkaeszköz:
     - A horizontálisan görgetendő táblázat helyett áttekinthető, modern **gyógyszerkártyák** jelennek meg.
     - A táblázatfejléc szűrői helyett a szűrést és rendezést egyetlen gombbal kezelhető, lenyitható **Accordion szűrőpanel** biztosítja számlálóval.
     - A gyógyszertár keresőben **osztott képernyős (Split View)** elrendezés segíti az egyidejű térképes és listás tájékozódást (40% térkép, 60% lista).

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

#### 4.0.5. Desktop vs. Mobil Felületi Eltérések a Fejlécben és a Navigációban

| Funkció / Felületi Elem | Asztali / Laptop Nézet (≥1024px) | Mobil / Tablet Portré Nézet (<1024px) |
| :--- | :--- | :--- |
| **Főmenü Elrendezése** | Vízszintesen elhelyezkedő ikonos gombok az oldal tetején (Irányítópult, Gyógyszer, Gyógyszertár, Mentett, Profil). | Bal oldali Hamburger menügombbal előhívható, függőlegesen gördülő menüpanel. |
| **Központi Intelligens Kereső** | Közvetlenül gépelhető beviteli mező a fejléc közepén, lebegő azonnali találati ablakkal. | Kisméretű érintőgomb (nagyító ikon), amely teljes képernyős keresőfelületet (Overlay) nyit meg a képernyő tetején. |
| **Közeli Patika Kijelzése és Módosítása** | A fejléc jobb oldalán folyamatosan látható felirat és zöld aláhúzott patikanév; kattintásra felugró modal. | A hamburger menü fejlécében elhelyezett kiemelt információs kártya patikanévvel és „Módosítás” akciógombbal. |
| **Mentett Gyógyszerek Gyorselérése** | Lebegő gyorsablak a fejlécből kék számláló jelvénnyel, tetején közvetlen „Összes” hivatkozással. | A mobil hamburger menüben önálló „Mentett gyógyszerek” sor az aktuális darabszámot mutató kék jelvénnyel. |
| **Profil és Munkamenet Kezelés** | Jobb szélső profil avatar legördülő menüvel (Profil adatok, Adminisztráció, Kijelentkezés). | A mobil hamburger menü alsó szekciójába integrált profilbeállítások és piros kiemelt Kijelentkezés gomb. |

---

### 4.1. Irányítópult (Dashboard)

A sikeres bejelentkezést követő központi áttekintő felület.

**Útvonal:** [https://bvo.uneb.hu/dashboard](https://bvo.uneb.hu/dashboard)

#### 4.1.1. Működés és Képernyőfelépítés
Kétoszlopos modern reszponzív elrendezés (Figma elrendezési minták alapján):
1. **Bal oldali oszlop (Globális készletváltozások):**
   - **Időszak-választó Kapszula:** `Elmúlt 3 nap` (alapértelmezett), `Elmúlt 1 nap`, `Elmúlt 7 nap`, `Elmúlt 30 nap`.
   - **Globális Figyelmeztető Kártya:** Sárga keretes összesítő, amely mutatja az adott időszakban bekövetkezett változásokat: összes változás, megszűnt, készlethiány és újra elérhető tételek száma. A készlethiány számlálóra kattintva azonnali gyorsszűrt átnavigálás történik a gyógyszerlistára.
   - **Legutóbbi Készletváltozások Listája:** A legfrissebb 20 piaci készletmozgás áttekinthető, kétszintes kompakt kártyasorokban:
     - *Felső szint (1. sor):* A terméknév a teljes rendelkezésre álló szélességet megkapja, maximum 2 soros intelligens szövegtördeléssel (`line-clamp-2`), sötétkék félkövér kiemeléssel és közvetlen hivatkozással a gyógyszer adatlapjára (`/gyogyszerek/adatlap?tk=...`). A teljes hivatalos terméknév lebegő szövegként (title attribútum) is olvasható.
     - *Alsó szint (2. sor):* Szuper kompakt metainfó sáv: bal oldalon a színkódolt országos státuszjelvény (`Elérhető`, `Hiány`, `Megszűnt`), jobb oldalon a készletváltozás pontos időbélyege (ÉÉÉÉ-HH-NN ÓÓ:PP).
     - *Oszlopfejléc mentesség:* A merev 3 oszlopos táblázatfejlécek helyett a lista közvetlenül a kártyafejléc alatt kezdődik, minimális sormagasságot és maximális adatsűrűséget biztosítva.
2. **Jobb oldali oszlop (Közeli Gyógyszertár állapota):**
   - **Ha nincs preferált patika:** Kiemelt figyelmeztető doboz nagy térkép-illusztrációval és *"Patika keresése"* gombbal, amely megnyitja a keresőt.
   - **Ha van kijelölt preferált patika:** A gyógyszertár neve, címe, heti nyitvatartási összefoglalója, valamint a patika saját, helyi készletmozgásainak összesítője és azonos kétszintes kompakt készletváltozási listája.

#### 4.1.2. Bemenetek és Kimenetek
- **Bemenet:** Időszakválasztó gombokra kattintás (1, 3, 7, 30 nap), összesítő számlálóra kattintás, terméknév linkre kattintás.
- **Kimenet:** A statisztikák és a táblázat adatainak azonnali frissülése, átnavigálás a gyógyszerlistára előszűrt státusszal vagy az adott gyógyszer adatlapjára.

#### 4.1.3. Hibakezelés a Dashboardon
- **Nincs készletváltozás az adott időszakban:** A táblázat helyén diszkrét, tiszta információs sáv jelenik meg: *"A kiválasztott időszakban nem történt készletváltozás."*
- **Kieső patikaadatok:** Amennyiben a beállított preferált patika adatai nem tölthetők be, a rendszer automatikusan felajánlja a patikaválasztó újbóli megnyitását.

#### 4.1.4. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.1.1:** Az időszakválasztó gombokra kattintva a kártyák és a táblázat adatai oldalújratöltés nélkül, azonnal frissülnek.
- **AC-4.1.2:** Az összesítő kártyán a hiánycikkek számára kattintva a gyógyszerlista nyílik meg, automatikusan `Készlethiány` szűrővel.
- **AC-4.1.3:** Kijelölt preferált patika esetén a jobb oldali panel kizárólag az adott patika valós helyi készletmozgásait jeleníti meg.
- **AC-4.1.4:** Az Irányítópulton megjelenő adatok kizárólag az OTC és vényköteles humán gyógyszerek készletmozgásait tartalmazzák; egyéb termékek nem jelenhetnek meg.
- **AC-4.1.5:** A legutóbbi készletváltozások listájában a hosszú terméknevek a rendelkezésre álló teljes szélességben, levágás nélkül legfeljebb 2 sorba tördelődnek, közvetlenül az adatlapra navigálnak, alattuk pedig egységesen látható a státuszjelvény és az időbélyeg.

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

4. **Mobil Kártyás Megjelenítés és Nézetváltó (<1024px vagy Kézi Váltás):**
   - **Automatikus Töréspont:** 1024 képpont alatti képernyőszélesség esetén a felület automatikusan átvált az ergonomikus kártyás megjelenítésre (`MedicineCard`).
   - **Kétállású Nézetváltó Gomb:** A fejlécben elhelyezett kapcsoló (`Kártyák` / `Táblázat`) lehetővé teszi, hogy az orvos tabletjén vagy telefonján szükség esetén manuálisan visszaváltson a sokoszlopos táblázatra.
   - **Lenyitható Accordion Szűrőpanel:** A keresősáv alatt egyetlen gombbal nyitható/csukható szűrő- és rendeződoboz, amely jelzi az aktív szűrők számát (`X aktív szűrő`).
   - **Mobil Gyógyszerkártya Struktúra:** Fejléc (gyógyszernév, országos státuszbadge, közeli patika indikátor, jobb felső sarokban konstans megjelenített utolsó frissítési dátum és időpont – pl. `Utolsó frissítés: 2026-10-21 00:35`), törzs (hatóanyag, kiszerelés, gyártó, valamint a termékazonosító / TK-szám), lenyitható „További adatok” fül (csomagolás, kiadhatóság, alcsoport, biztonsági elemek, engedély dátuma), és lábléc nagyméretű érintőgombokkal (Mentés kedvencnek, Hiányértesítés, Részletek adatlap gomb).

#### 4.2.1.4. Desktop vs. Mobil Felületi Eltérések a Gyógyszerkeresőben

| Funkció / Képernyőelem | Asztali / Laptop Nézet (≥1024px) | Mobil Nézet (<1024px) |
| :--- | :--- | :--- |
| **Elsődleges Megjelenítés** | Teljes képernyős, 15 oszlopos fluid adattáblázat horizontális görgetéssel. | 1 vagy 2 oszlopos érintésbarát gyógyszerkártya-rács (`MedicineCard`). |
| **Nézet Felülbírálása** | Alapértelmezett a táblázat, de a fejléc Nézetváltó gombjával kártyás nézetre is kapcsolható. | Alapértelmezett a kártyás rács, de a Nézetváltó gombbal táblázatra váltható. |
| **Szűrési Felület** | A táblázat oszlopfejlécei alatt elhelyezkedő különálló beviteli mezők, dátumválasztók és legördülők. | A keresőmező alatt elhelyezett, egy kattintással lenyitható **Accordion szűrőpanel**. |
| **Szűrőpanel Beviteli Mezői** | Oszloponkénti szűrők (TK szám, Hatóanyag, Gyártó, Státusz, Patika, Dátum tól-ig). | • **Rendezés:** Legutóbb frissült, Legrégebben frissült, Név A-Z, Név Z-A, Közeli patika készlet elöl.<br>• **Státusz:** Mindegyik, Elérhető, Készlethiány, Megszűnt.<br>• **Gyorskapcsolók:** Csak mentett, Közeli patikában elérhető.<br>• **Frissítés dátuma:** Kezdő dátum és záró dátum naptár választó.<br>• **Szűrők törlése:** Egykattintásos alaphelyzetbe állítás. |
| **Aktív Szűrők Visszajelzése** | A beviteli mezők kitöltöttsége jelzi a szűrést. | Az Accordion szűrőgombon számláló jelvény jelenik meg (pl. *"3 aktív szűrő"*), mellette közvetlen *"Szűrők törlése"* gombbal. |
| **Oszlopkezelés & Testreszabás** | Drag & Drop oszlopátrendezés az egérrel és oszlopki/be kapcsoló modális ablak. | Kártyás nézetben a kártyák „További adatok megjelenítése” gombjával egy érintéssel kinyithatók a részletes mezők. |
| **Műveleti Gombok Elhelyezése** | A táblázat jobb szélén folyamatosan rögzített (sticky) fix oszlop. | A gyógyszerkártya alján elhelyezett, nagyméretű ujjal kényelmesen érinthető gombsor (Mentés, Értesítés, Részletek). |
| **Lapozó és Eredménysor** | Széles, egy soros alsó lábléc lapszámozó gombokkal és találatszám választóval. | Egymás alá törő, kártya-alapú kompakt mobil lapszámozó érintőgombokkal. |

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

#### 4.2.2.6. Desktop vs. Mobil Felületi Eltérések a Gyógyszer Adatlapon

| Funkció / Képernyőelem | Asztali / Laptop Nézet (≥1024px) | Mobil Nézet (<1024px) |
| :--- | :--- | :--- |
| **Kártya Elrendezés és Margók** | Kényelmes, nagyméretű 32px belső margó; többhasábos vízszintes információs blokkok. | Kompakt 16px belső margó a képernyőszélesség maximális kihasználásához; egymás alá rendeződő függőleges blokkok. |
| **Fejléc Akciógombok** | Jobb felső sarokba igazított gombok (Mentés, Értesítés kérése). | A gyógyszernév alatt automatikusan új sorba törő, kényelmes teljes szélességű gombsor. |
| **Készlethiány és Megszűnés Bannerek** | 3 oszlopos adatmező elrendezés (Kezdet, Vége, Indoklás). | Egymás alá törő kártyasor, kiemelt vastag betűs olvashatósággal. |
| **Gyógyszertári Készletjelvények** | Szöveges leírás mellett elhelyezett státusz pill-ek. | Ujjbegyre optimalizált, nagy kontrasztú készletjelvények és közvetlen patika megnyitó linkek. |
| **Helyettesítő Készítmények (SimilarMedicines)** | 6 oszlopos táblázat (Név, Kiszerelés, Gyártó, Státusz, Közeli Patika, Műveletek). | **Mobil Kártyás Lista:** Minden helyettesítő gyógyszer önálló kis kártyaként jelenik meg hatóanyaggal, készletjelvénnyel és egyérintéses Mentés/Értesítés/Részletek gombokkal. |

#### 4.2.3. Bemenetek és Kimenetek
- **Bemenet:** Keresési karakterek beírása, szűrőpill-ek váltása, oszlopok áthúzása, könyvjelző/értesítés ikonok kattintása, mobil accordion szűrők és nézetváltó érintése.
- **Kimenet:** Valós idejű táblázatszűrés vagy kártyarács-frissülés, nézetváltás (grid/table), adatlap megnyitása, modális ablak felugrása, könyvjelző számláló növekedése a fejlécben.

#### 4.2.4. Hibakezelés a Gyógyszer Modulban
- **Nincs találat a szűrésre:** A táblázatban és a kártyás nézetben is megjelenik a *"Nem található a keresésnek megfelelő gyógyszer"* felirat, valamint a *"Szűrők törlése"* akciógomb.
- **Érvénytelen TK-szám az adatlapon:** Ha az URL-ben nem létező azonosító szerepel, a rendszer információs képernyőt jelenít meg: *"A keresett gyógyszer nem található"*, felkínálva a visszatérést a gyógyszerlistához.

#### 4.2.5. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.2.1:** Az oszlopok Drag & Drop átrendezése azonnal működik és az új sorrend újratöltés után is megmarad.
- **AC-4.2.2:** A Műveletek oszlop vízszintes görgetés esetén is folyamatosan látható marad a monitor jobb szélén rögzítve.
- **AC-4.2.3:** Az adatlapon a preferált patika nevére kattintva a nyitvatartási modal helyben, oldalváltás nélkül megnyílik.
- **AC-4.2.4:** Készlethiány esetén az adatlapon a sárga figyelmeztető doboz hiánytalanul tartalmazza az okot és a várható befejezést.
- **AC-4.2.5:** A gyógyszernyilvántartásban kizárólag OTC és vényköteles humán gyógyszerek szerepelnek; nem gyógyszer termékek státuszkövetése kizárt.
- **AC-4.2.6:** 1024px alatti képernyőszélesség esetén a gyógyszerek oldalon automatikusan a kártyás nézet jelenik meg, az Accordion szűrőpanel pedig egy érintéssel lenyitható és az aktív szűrők számát jelvénnyel mutatja.
- **AC-4.2.7:** A gyógyszerkártyán a „További adatok megjelenítése” gombra kattintva a másodlagos adatok (csomagolás, kiadhatóság, engedély dátuma) oldalváltás nélkül kibomlanak.
- **AC-4.2.8:** A gyógyszerkártya fejlécének jobb felső sarkában az utolsó adatmódosítás/szinkronizálás pontos dátuma és ideje (`Utolsó frissítés: ÉÉÉÉ-HH-NN ÓÓ:PP`, pl. `Utolsó frissítés: 2026-10-21 00:35`) konstans módon, a másodlagos adatok lenyitása nélkül is közvetlenül és folyamatosan olvasható, míg a termékazonosító (TK-szám) az elsődleges törzsadatok között kap helyet.

---

### 4.3. Gyógyszertár Kereső és Térkép

Gyógyszertárak felkutatása, helymeghatározás, nyitvatartási információk és preferált patika kijelölése.

**Útvonal:** [https://bvo.uneb.hu/gyogyszertarak](https://bvo.uneb.hu/gyogyszertarak)

#### 4.3.1. Képernyőfelépítés és Térképes Működés
1. **SubHeader Keresősáv és Pill Szűrők (Összecsukható Accordion Panel):**
   - **Accordion nyitó/csukó gomb:** A címsorban a cím mellett elhelyezkedő *"Keresés és szűrők"* gomb, amellyel a keresősáv tetszőlegesen összecsukható vagy kinyitható, így nem zavarja a térképi viewportot és a függőleges képernyőterületet.
   - **Aktív Szűrő Számláló Jelvény (Badge):** Bármilyen aktív keresési vagy szűrési feltétel (beírt keresőszöveg, Most nyitva, Hétvégén nyitva, 0-24) esetén a gombon azonnal megjelenik egy számláló jelvény a beállított szűrők pontos darabszámával (pl. `1`, `2`, `3`). A jelvény csukott állapotban is folyamatosan tájékoztatja az orvost az aktív szűrésről.
   - Keresőmező településre, címre vagy patikanévre.
   - Gyorsszűrő kapszulák: `Most nyitva`, `Hétvégén nyitva`, `0-24 ügyeletes`.
   - *"Szűrés törlése"* hivatkozás az összes aktív feltétel azonnali alaphelyzetbe állítására.
2. **GPS Helymeghatározó Panel:**
   - *"Közeli patikák keresése (GPS)"* gomb: a böngésző engedélyével lekéri a felhasználó aktuális koordinátáit és távolság szerint növekvő sorrendbe rendezi a patikákat.
3. **Kettős Nézet és Mobil Bottom Sheet:**
   - **Asztali nézet (≥1024px):** Kétpaneles elrendezés: bal oldalon 476px széles gördülő sáv a patikák adataival (név, cím, nyitvatartás ma, távolság km-ben, telefonszám, e-mail), a tartózkodási hely és a közeli patika kártyákkal a lista elején; jobb oldalon a teljes fennmaradó területet kitöltő OpenStreetMap térkép.
   - **Mobil nézet (<1024px):** A fejléc címsorával egy sorban elhelyezkedő 3-állású nézetválasztó (`[Térkép | Osztott | Lista]`) és a térkép feletti interaktív **Bottom Sheet (alsó felhúzható lap)**:
     - *Peek / Térkép fókusz (~92px magasság):* A térkép dominál a háttérben; az alsó lapon a fogantyú és egy kompakt összegző sor jelzi a térképen látható patikák számát, koppintásra kinyílik.
     - *Fél / Osztott nézet (~50% magasság):* Kiegyensúlyozott térkép és lista elrendezés (50% térkép, 50% lista) a keresősáv és a szűrőgombok alatt.
     - *Teljes / Lista fókusz (100% magasság a címsor alatt):* A „Lista” gombra koppintva a lista felülete kitakarja a címsor alatti teljes területet (a térképet és a címsor alatti kereső/szűrősávot is), maximális képernyőmagasságot biztosítva a patikakártyák böngészéséhez. A lista legfelső részén beépített, azonnali gyorskereső mező és kompakt nyitvatartási gyorsszűrők (Most nyitva, Hétvégén nyitva, 0-24) állnak rendelkezésre, miközben a felső címsor a nézetválasztóval rögzítve marad a közvetlen visszaváltáshoz.
     - *Görgethető információs kártyák:* Az információs blokkok („Az Ön tartózkodási helye” és „Az Ön közeli gyógyszertára”) a görgethető lista elején helyezkednek el, így lefelé görgetve elúsznak és nem blokkolják a patikakártyák láthatóságát.
4. **Kétirányú Szinkronizáció:**
   - Ha a felhasználó rákattint egy patikakártyára a listában, a térkép odagördül és kinyitja az információs buborékot (popup).
   - Ha a térképen kattint egy markerre, a bal oldali kártyalista az adott patikára görget, mobilon pedig a Bottom Sheet automatikusan legalább 50%-ra kinyílik.
5. **Dinamikus Térképi Találatszámláló és Összes (n db) Link:**
   - A patikalista fejlécében (asztali és mobil nézetben egyaránt) a kiírás közvetlenül és dinamikusan követi a térkép aktuális kivágatában látható patikák számát: `"{X} BENU gyógyszertár a térképen"` formátumban (zöld pont jelzés nélkül).
   - Amennyiben a térkép nagyítása vagy elmozgatása miatt kevesebb patika látható, mint a teljes találati halmaz, a felirat mellett megjelenik a közvetlen `"Összes ({n} db)"` szöveges hivatkozás, amelyre kattintva a térkép azonnal visszaáll a teljes országos áttekintő nézetre.

#### 4.3.2. Preferált Gyógyszertár Kijelölése
- Minden patikakártyán található egy *"Közelinek jelölöm"* akciógomb.
- Kattintásra a választott patika zöld pipás aktív státuszt kap (*"Közeli gyógyszertáram"*), és azonnal megjelenik a felső navigációs fejlécben, valamint az Irányítópulton.

#### 4.3.3. Heti Nyitvatartási Részletek Modál
- A patika címére vagy a *"Nyitvatartás részletei"* linkre kattintva felugró modális ablak részletesen bemutatja a hét minden napjára érvényes nyitási és zárási időpontokat, az ügyeleti rendet, valamint a közvetlen telefonhívási lehetőséget.

#### 4.3.4. Mélylinkelés (Deep Linking) Támogatása
- Az oldal támogatja a közvetlen azonosítóval történő hivatkozást: `/gyogyszertarak?id=BF133`.
- Ilyen link megnyitásakor a térkép automatikusan a hivatkozott gyógyszertárra fókuszál (centrálás és zoom), a kártya kiemelést kap, és a nyitvatartási modal automatikusan felugrik.

#### 4.3.5. Bemenetek és Kimenetek
- **Bemenet:** Cím vagy település gépelése, nyitvatartási pill szűrők kattintása, "Keresés és szűrők" accordion gomb megnyomása, GPS gomb megnyomása, térkép görgetése/kattintása, Bottom Sheet fogantyú húzása/koppintása, `"Összes (n db)"` linkre kattintás.
- **Kimenet:** Szűrt patikalista, térképi jelölők frissülése, preferált patika felületi beállítása, dinamikus számláló felirat frissülése, térképi nézet visszaállítása országos méretre, keresősáv animált kinyitása/összecsukása, aktív szűrőszámláló badge kijelzése.

#### 4.3.6. Hibakezelés a Gyógyszertár Modulban
- **GPS helymeghatározás megtagadása:** Ha a felhasználó böngészőjében letiltja a helymeghatározást, a rendszer nem dob hibát, hanem diszkrét értesítést ad, és megtartja az alapértelmezett budapesti referencia-helyzetet.
- **Nincs patika a megadott szűrésre:** A lista helyén megjelenik az *"A megadott feltételekkel nem található gyógyszertár"* üzenet és a szűrők egykattintásos törlésének gombja.

#### 4.3.7. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.3.1:** A keresőmezőbe beírt településnévre (pl. "Szeged") a kártyalista és a térkép jelölői késlekedés nélkül kizárólag a szegedi patikákat jelenítik meg.
- **AC-4.3.2:** A "Közelinek jelölöm" gombra kattintva a választott patika azonnal megjelenik a fejlécben és az Irányítópulton is újratöltés nélkül.
- **AC-4.3.3:** Mélylinkkel érkezve (`/gyogyszertarak?id=BF133`) a térkép automatikusan a megadott patikára fókuszál, és a heti nyitvatartási modal felugrik.
- **AC-4.3.4:** Mobil nézetben (<1024px) a gyógyszertár kereső fejlécében a nézetválasztó (`[Térkép | Osztott | Lista]`) közvetlenül a címsorral egy sorban helyezkedik el. A 'Lista' gombra kattintva a lista 100%-ban kitakarja a címsor alatti részt, a lista tetején kompakt gyorskeresővel és szűrőkapszulákkal. 'Osztott' állapotban a felület 50% térkép és 50% lista arányban oszlik meg a keresősáv alatt, 'Térkép' állapotban pedig a lap minimalizált (~92px) betekintő szintre csukódik. A fogantyú húzásával vagy a címsori vezérlővel a szintek szabadon válthatók. A tartózkodási hely és a közeli patika kártyák a lap görgethető listájának elején helyezkednek el, így lefelé görgetve elgördülnek a képernyőről, maximális helyet adva a patikáknak. A listában lévő patikára koppintva a térkép odaugrik a patika koordinátájára és kinyitja annak információs buborékját; térképi marker érintésekor pedig a lap automatikusan legalább 50%-ra nyílik.
- **AC-4.3.5:** A patikalista fejlécében a számláló kizárólag a térkép aktuális nézetében látható patikák számát jelzi ki (`"{X} BENU gyógyszertár a térképen"` formátumban zöld pont nélkül). Az `"Összes ({n} db)"` szöveges linkre kattintva a térkép nézete azonnal visszaáll a teljes országos nézetre.
- **AC-4.3.6:** A Gyógyszertár Kereső fejlécében a "Keresés és szűrők" gombra kattintva a keresőmező és a pill szűrők panelje animáltan összecsukható és kinyitható (accordion). Összecsukott állapotban a keresősáv nem foglal helyet a képernyőből (viewport). Ha legalább egy szűrési feltétel aktív (beírt keresőszöveg vagy bekapcsolt nyitvatartási pill), a gombon egy számláló jelvény (badge) jelzi az aktív szűrők darabszámát nyitott és csukott állapotban egyaránt. A szűrők törlésekor a jelvény automatikusan eltűnik.

#### 4.3.8. Desktop vs. Mobil Felületi Eltérések a Gyógyszertár Keresőben (Bottom Sheet)

| Funkció / Képernyőelem | Asztali / Laptop Nézet (≥1024px) | Mobil Nézet (<1024px) |
| :--- | :--- | :--- |
| **Képernyőelrendezés** | Bal oldalon 476px széles fix sáv, mellette a monitor teljes fennmaradó részét kitöltő nagy térkép. | Teljes képernyős térkép a háttérben, felette interaktív, érintéssel húzható **Bottom Sheet (alsó felhúzható lap)**. |
| **Kereső és Szűrősáv Megjelenése** | A fejlécben accordionnal összecsukható/kinyitható sáv; aktív szűrők esetén a címsor gombján számláló jelvény (badge) jelzi a darabszámot, így összecsukva is biztosított a maximális térképi viewport. | A címsorban lévő gombbal bármikor összecsukható; alapértelmezetten csukott állapotban nyílik meg a mobil képernyőterület maximalizálására, aktív szűrő badge jelzéssel. |
| **Nézetvezérlő Lehetőségek** | Nincs szükség lapváltásra; a lista és a nagy térkép egymás mellett folyamatosan látható. | A címsorral egy sorban elhelyezett 3-állású **nézetválasztó gomb** (`[Térkép | Osztott | Lista]`): Lista nézetben a lista kitakarja a címsor alatti teljes területet (100% magasság beépített keresővel); Osztott nézetben 50/50 felosztás; Térkép módban betekintő lap (~92px). A lap alsó fogantyúja érintéses húzással is szinkronban vezérli az állapotokat. |
| **Információs Kártyák Elhelyezése** | A bal oldali sáv görgethető listájának elején, így kisebb monitorokon is elúsznak a patikák elől. | A Bottom Sheet görgethető listájának legtetején (nem sticky): lefelé görgetve elúsznak, így a teljes sheet-magasság a patikáké marad. |
| **Interakció és Térképszinkron** | Patikakártyára kattintva a jobb oldali térkép simán odagördül a markerre és kinyitja az adatbuborékot. | Az alsó kártyalistában koppintva a háttértérkép azonnal odaugrik; a térképi markerre koppintva a lap automatikusan Fél (~50%) magasságra ugrik és kijelöli a patikát. |
| **Preferált Patika Kijelölése** | A kártya jobb szélén lévő „Közelinek jelölöm” gomb. | Ujjbegyre optimalizált nagyméretű, teljes szélességű érintőgomb a mobil kártya alsó részén. |
| **Nyitvatartási Részletek** | Modális ablakban nyílik meg a térkép felett. | Érintésre felugró, mobil képernyőre igazított részletes heti táblázat és közvetlen egyérintéses telefonhívás (`tel:`) lehetőség. |

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
5. **Gyógyszer Lista Kártyás Nézete kizárólagos asztali nézetként:**
   - *Státusz:* Módosítva / Részben felülvizsgálva. Asztali munkaállomásokon továbbra is a többoszlopos táblázat az elsődleges az adatsűrűség miatt. Azonban a mobil eszközökön és a helyszíni betegvizitek során a kártyás elrendezés (`MedicineCard`) lett a hivatalos alapértelmezett nézet, amelyet a felhasználó igény szerint kézi nézetváltó kapcsolóval mindkét felületen szabadon átválthat.
6. **Önkiszolgáló Automatikus Felhasználói Regisztrációs Felület:**
   - *Státusz:* Jelenleg nem tervezett. A rendszer zárt szakmai jellege miatt a regisztráció kizárólag a bejelentkező felületről indított kapcsolatfelvételi űrlapon és kézi adminisztrátori jóváhagyáson keresztül működik.
7. **Nem Gyógyszer Patikai Termékek (Étrend-kiegészítők, Orvostechnikai Eszközök, Kozmetikumok) Státuszkövetése:**
   - *Státusz:* Rendszer hatókörén kívüli (Out of scope) funkció.
   - *Részletek:* A BENUvény orvosi portál célzottan a gyógyító és terápia-meghatározó orvosok és gyógyszerészek számára készült. A készlet- és piaci státuszok, hiányok és helyettesíthetőség monitorozása emiatt szigorúan a törzskönyvezett humán gyógyszerekre – azon belül is kizárólag az OTC és a vényköteles készítményekre – korlátozódik. A patikai forgalomban jelen lévő több tízezer egyéb cikk (étrend-kiegészítők, vitaminok, kozmetikumok, orvostechnikai eszközök, tápszerek) státuszkövetése tudatos döntés alapján nem része a portál funkcionalitásának, megelőzve az orvosi fókusz felhígulását és az adatzajt.

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

## 7. Változásnapló (Verziótörténet)

Ez a fejezet a funkcionális specifikációban eszközölt módosítások és kiegészítések időrendi naplója.

| Verzió | Dátum | Változás Típusa | Változások Részletes Összefoglalása |
| :--- | :--- | :--- | :--- |
| **v1.8.2** | 2026.10.21. | Termékkártya Ergonómia | **Gyógyszer termékkártya fejléc és adatelrendezés optimalizálása:**<br>• A gyógyszerkereső oldal kártyás nézetében (`MedicineCard`) az **Utolsó frissítés** dátuma és időpontja (pl. `Utolsó frissítés: 2026-10-21 00:35`) a kártya jobb felső sarkába került, így közvetlenül a kártya fejlécében, a státuszjelvény mellett biztosít állandó, kiemelt olvashatóságot.<br>• A korábban jobb felül lévő törzskönyvi azonosító (`Azonosító:` / `tkSzam`) lekerült az elsődleges törzsadatok közé (a Hatóanyag, Kiszerelés és Gyártó mezők mellé).<br>• Frissített elfogadási kritérium: AC-4.2.8. |
| **v1.8.1** | 2026.10.20. | Ergonómiai Optimalizálás | **Dashboard készletváltozási lista kétszintes kompakt optimalizálása:**<br>• A korábbi merev 3 oszlopos táblázat (amelyben a hosszú terméknevek lebegve csonkán, 20-30 karakter után levágódtak) felváltása modern kétszintes kártyasorokkal a `StockChangesWidget` komponensben.<br>• **Felső szint (1. sor):** A terméknév a teljes rendelkezésre álló kártyaszélességet (több mint 500px) megkapja, intelligens legfeljebb 2 soros szövegtördeléssel (`line-clamp-2`), közvetlen kattintható linkkel az adatlapra és lebegő címmel (`title`).<br>• **Alsó szint (2. sor):** Letisztult, szuper kompakt metainfó sáv bal oldalon az országos státuszjelvénnyel (`Elérhető`, `Hiány`, `Megszűnt`), jobb oldalon a pontos időbélyeggel.<br>• A merev táblázatfejléc elhagyásával ~42px függőleges hely takarítható meg, a sorok pedig diszkrét hover kiemelést kaptak a könnyebb pásztázásért.<br>• Új elfogadási kritérium (AC-4.1.5). |
| **v1.8.0** | 2026.10.20. | Mobil Nézet és Helyszíni Vizit Támogatás | **Teljes körű reszponzív és mobil ergonómiai optimalizálás:**<br>• Új koncepció bevezetése (1.9. fejezet): Asztali/laptop fókuszú rendelői környezet mellett a helyszíni orvosi betegvizit (ambuláns használat) teljes körű támogatása.<br>• **Gyógyszerkereső mobil nézet (<1024px):** Automatikus átváltás ergonomikus gyógyszerkártyákra (`MedicineCard`), kétállású kézi Nézetváltó gomb (`Kártyák` / `Táblázat`), lenyitható egyérintéses **Accordion szűrőpanel** beépített rendezési opciókkal, aktív szűrőszámláló jelvénnyel és egykattintásos szűrőtörléssel.<br>• **Gyógyszertár Kereső Címsori Nézetválasztó, Összecsukható Kereső és Bottom Sheet:** Mobilon (<1024px) a 3-állású nézetválasztó (`[Térkép | Osztott | Lista]`) közvetlenül a címsorral egy sorban helyezkedik el. A „Lista” elemre kattintva a lista felülete kitakarja a címsor alatti teljes részt (100% képernyőkitöltés a térkép és szűrősáv felett, beépített in-sheet gyorskeresővel és gyorsszűrőkkel), míg az „Osztott” (50/50) és „Térkép” (92px peek) állapotok megőrzik a térkép interaktív elérését. A címsorban helyet kapott az **összecsukható kereső és szűrőpanel (Accordion)** gombja, amely aktív szűrés esetén számláló jelvénnyel (badge) jelzi a feltételek darabszámát nyitott és csukott állapotban is. A patikalistában a számláló dinamikusan a térképen látható patikákat jelzi (`"{X} BENU gyógyszertár a térképen"`), mellette tiszta szöveges linkkel (`Összes ({n} db)`). A tartózkodási hely és a közeli patika kártyák a lap görgethető listájának elejére kerültek (nem sticky), így lefelé görgetve elúsznak és a teljes sheet-magasság a patikakártyáké marad.<br>• **Mobil Navigáció és Keresés:** Hamburger menübe integrált „Mentett gyógyszerek” számlálóval, azonnali közeli patika adatkijelzés és módosítási akciógomb, valamint teljes képernyős keresőfelület (Mobil Kereső Overlay).<br>• **Helyettesítő gyógyszerek:** Az adatlapon mobil nézetben a helyettesítő készítmények táblázata automatikusan kártyás listává alakul át.<br>• Részletes **Desktop vs. Mobil összehasonlító táblázatok** elhelyezése minden érintett felületi modulban (4.0.5, 4.2.1.4, 4.2.2.6, 4.3.8) és új elfogadási kritériumok (AC-4.2.6, AC-4.2.7, AC-4.3.4, AC-4.3.5, AC-4.3.6). |
| **v1.7.0** | 2026.10.20. | Hatókör Tisztítás (Scope Alignment) | **Közösségi funkciók és Képzési program teljes kivezetése a funkcionális specifikációból:**<br>• A dokumentáció teljes mértékben szinkronba került a prototípus aktív fejlesztési scope-jával; a felületen csak koncepciótervként létező funkciók (Közösségi fórum, képzések listája és LMS integráció, admin moderáció) kivezetésre kerültek a specifikációból.<br>• Az adatmodellek (3. fejezet) és a funkcionális modulok (4. fejezet) újraszámozása (4.4 Globális Keresés, 4.5 Hitelesítés, 4.6 Adminisztráció, 4.7 Profil).<br>• Az Elfogadási Kritériumok (AC) frissítése és beépített újraszámozása a funkcionális modulokban.<br>• Profil és admin felületi hírlevél/értesítési beállítások szűkítése a valós készletértesítési funkcionalitásra. |
| **v1.6.1** | 2026.10.20. | Funkcionális Hatókör & Irányelvek Pontosítása | **Gyógyszer státuszkövetés, WCAG és böngésző title követelmények rögzítése:**<br>• Rögzítésre került, hogy a portál gyógyszerkészlet- és hiánystátuszkövetési funkciói kizárólag a humán gyógyszerek két csoportjára korlátozódnak: **OTC (vény nélkül kapható)** és **vényköteles (Rx)** készítmények; egyéb nem gyógyszer cikkek (étrend-kiegészítők, kozmetikumok, tápszerek, gyógyászati segédeszközök) státuszai kívül esnek a hatókörön.<br>• **WCAG 2.2 irányelvek:** Törekedni kell az alapvető sztenderdek betartására, de zárt szakmai rendszer lévén és a nem akadályoztatott orvosi célcsoport miatt nem követelmény a maximális szintű megfelelőség.<br>• **Technikai SEO és lapfül title formátum:** Zárt rendszer lévén klasszikus SEO elvárások nincsenek, de a böngészést segítő lapfülcím kötelezően a `"{lap neve} \| BENUvény Orvosi Portál"` formátumban kell megjelenjen (új 1.8 fejezet és AC-4.0.5). |
| **v1.6.0** | 2026.10.19. | Átfogó Revízió & FRS Bővítés | **Prototípus működés szerinti teljes körű funkcionális szinkronizáció és követelménybővítés:**<br>• Minden fő funkcionális modul kiegészítése strukturált **Bemenetek és Kimenetek**, felhasználói szintű **Hibakezelés** és pontosan ellenőrizhető **Elfogadási Kritériumok (Acceptance Criteria - AC)** fejezetekkel a globális követelményszabályoknak megfelelően.<br>• A 4 szintű készletstátusz (`Készleten`, `Korlátozottan`, `Rendelésre (1-2 munkanap)`, `Nem elérhető`) és a hozzá tartozó hálózati / helyi felületi megjelenítés megerősítése.<br>• A Gyógyszertárak modul SubHeader keresőjének, pill szűrőinek (`Most nyitva`, `Hétvégén nyitva`, `0-24`), GPS helymeghatározó paneljének, valamint a heti nyitvatartási modal és mélylinkelés (`/gyogyszertarak?id=...`) leírásának véglegesítése.<br>• A fejléc Mentett gyorslista "Összes" gombjának navigációs viselkedése (`onlyFavorites=true` szinkron) a gyógyszerlista oldallal.<br>• Manuális regisztrációs kapcsolatfelvételi űrlap, 2FA és passkey biztonsági folyamatok pontosítása. |
| **v1.5.1** | 2026.09.08. | Módosítás | **Gyógyszerlista táblázat fluid (teljes képernyőszélességű) elrendezése:**<br>• A gyógyszerek oldal és az adatáblázat fix maximális szélességi korlátja (1440px) feloldásra került; a felület dinamikusan kitölti a teljes képernyőszélességet.<br>• Nagyobb monitorokon jelentősen javult az adatok átláthatósága és olvashatósága, minimalizálva a vízszintes görgetés szükségességét.<br>• Frissítésre került a 4.2.1. pont (Fluid elrendezés). |
| **v1.4.1** | 2026.08.24. | Kiegészítés | **Manuális felhasználói regisztráció és kapcsolatfelvételi űrlap rögzítése:**<br>• Tisztázásra került, hogy a felhasználók regisztrációja kézzel (manuálisan) történik az adminisztrátor által.<br>• Az új szakmai felhasználó a bejelentkezési felületről elérhető űrlapon veszi fel a kapcsolatot az adminisztrációval (pecsétszám, szakterület megadásával).<br>• Új adatmodell (3.6) és új funkcionális leírás (4.6.4), elvetett funkciók (5.9) és Változásnapló (7) bevezetése. |

<!-- DOKUMENTUM VÉGE -->
