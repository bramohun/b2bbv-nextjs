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
> **Verzió:** 1.16.0  
> **Dátum:** 2026.10.21.  
> **Státusz:** Aktív / Hatályos (Irányítópult Közeli gyógyszertár választás teljes körű funkcionális megerősítése: beépített gyorskereső mező lebegő autocompleter panellel és gyorsválasztó modállal, interaktív térképes felület kétállású „Közelinek jelölöm” funkciógombbal és helyi részletes patika adatlap megnyitással, valamint preferált állapotban közvetlen „Másik patika választása” és „Kijelölés törlése” műveletek a Dashboard elhagyása nélkül; technikai implementációs adatok [OpenStreetMap/Leaflet] funkcionális szintre tisztítása)  
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
| **Fejléc, Lábléc & Globális UI** | Globális komponens | Kereső, gyorslista, közeli patika kijelző, modulváltás, profil menü, lábléc (verziószám és szerzői jog), Toast értesítési rendszer. | **Aktív** |
| **Irányítópult (Dashboard)** | `https://bvo.uneb.hu/dashboard` | Időszakos készletváltozások, preferált patika widget, gyors navigáció. | **Aktív** |
| **Gyógyszer Nyilvántartás** | `https://bvo.uneb.hu/gyogyszerek` | Teljes képernyős fluid táblázat, oszloprendezés, szűrés, kedvencek. | **Aktív** |
| **Gyógyszer Adatlap** | `https://bvo.uneb.hu/gyogyszerek/adatlap` (és `/gyogyszerek/[...id]`) | 4 szintű készletstátusz, 250 patikás országos hálózati eloszlás, megszűnt termék és hiány figyelmeztető kártyák, 3 oszlopos termékjellemzők és árak, helyettesítők, történet orvosi adatbázis időbélyeggel. | **Aktív** |
| **Gyógyszertár Kereső** | `https://bvo.uneb.hu/gyogyszertarak` | Térkép, szinkronizált kártyalista, GPS helymeghatározás, heti rend modal. | **Aktív** |
| **Globális Keresés** | Globális / Mobil Overlay | Instant keresés gyógyszerek, hatóanyagok és patikák között. | **Aktív** |
| **Hitelesítés & Jogosultság** | `https://bvo.uneb.hu/login` | Egyszerűsített felhasználónév és jelszó alapú bejelentkezés, elfelejtett jelszó, manuális kapcsolatfelvételi űrlap. *(Tervezet – a háttér autentikációs és SSO rendszer nem képezi a közvetlen fejlesztési scope részét).* | **Tervezet / Nem scope** |
| **Felhasználói Profil** | `https://bvo.uneb.hu/profile` | Szakterületek, preferált patika, hírlevelek, biztonság, 2FA, passkey. | **Aktív** |
| **Adminisztráció** | `https://bvo.uneb.hu/admin/*` (`/admin/users`, `/admin/pharmacies`, `/admin/pharmacies/[id]`) | Tab-navigációs keret, felhasználók kezelése, „+ Új felhasználó” rögzítés, jelszóküldés és munkamenet-bontás, gyógyszertárak felügyelete, részletes patika adatlap koordinátákkal és heti renddel, szinkronizációs mérőszámok, valamint 7 oszlopos, szűrhető-rendezhető, színkódolt darabszámos termékkészlet táblázat 25-ös lapozóval. | **Aktív** |

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
      - A szűrést és rendezést mind mobilon, mind asztali nézetben egyetlen gombbal kezelhető, lenyitható központi **Accordion szűrőpanel** biztosítja aktív szűrőszámlálóval.
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

### 2.4. Készletértesítés és Kedvenc-Értesítés Összekapcsolódás
Feliratkozás egy adott gyógyszer országos vagy helyi státuszváltozására (harang ikon). Készlethiány megszűnésekor vagy újra elérhető állapotba kerüléskor a rendszer automatikus e-mail értesítőt / hírlevelet küld.
- **Kétirányú Logikai Kapcsolat:** A készletértesítés bekapcsolása szorosan összefonódik a mentett gyógyszerekkel: a harang ikon aktiválásakor a rendszer automatikusan a mentett kedvencek közé is hozzáadja a készítményt (a csillag ikon is aktívvá válik).
- **Védelmi Megerősítő Mechanizmus (`FavoriteRemovalModal`):** Ha a felhasználó egy olyan gyógyszert kíván eltávolítani a mentett kedvencek közül, amelyre korábban aktív készletértesítést is beállított, a rendszer védelmi célból **megerősítő felugró figyelmeztető ablakot** jelenít meg (*„Értesítés is megszűnik!”*). Ezzel elkerülhető, hogy az orvos véletlenül elmulasszon egy fontos hiány- vagy készletértesítést. A törlés jóváhagyásakor mindkét állapot (kedvenc státusz és aktív értesítés feliratkozás) egyszerre törlődik.

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

### 2.13. Toast Értesítési Rendszer és Művelet-visszavonás (Undo)
A képernyő jobb alsó sarkában lebegő, nem modális (a munkafolyamatot nem blokkoló) vizuális visszajelző kártya, amely kiemelt felhasználói műveletek – elsősorban mentett kedvenc gyógyszer eltávolítása – után jelenik meg.
- **Időzített Megjelenés és Vizuális Idősáv:** Alapértelmezetten 10 másodpercig marad látható a felületen. A kártya alján egy folyamatosan és egyenletesen fogyó lineáris csík (progress bar) jelzi vissza a hátralévő időablakot.
- **Egykattintásos Visszavonás („Visszavonom”):** A felhasználó egyetlen gombnyomással visszavonhatja a törlést, azonnal visszahelyezve a gyógyszert a mentett kedvencek közé anélkül, hogy a keresőből újra elő kellene keresnie.
- **Közvetlen Adatlap Hivatkozás:** Az értesítésben a gyógyszer neve kattintható hivatkozásként funkcionál, azonnali navigációt biztosítva az adott készítmény részletes adatlapjára.

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
- **Országos Hálózati Készleteloszlás (BENU Gyógyszertárak):**
  - **Felületi Típus:** Statisztikai összesítő kártyablokk 250 gyógyszertárra vetítve
  - **Megadható Értékek:** Elérhető terméknél: `Készleten` és `Rendelésre (1-2 munkanap)` patikák száma; Hiánycikk vagy megszűnt terméknél: `Korlátozottan` és `Nem elérhető` patikák száma.
  - **Példa Érték:** `198 db BENU Gyógyszertárban készleten, 52 db rendelésre (1-2 munkanap)`
  - **Limitációk:** Közvetlen továbbnavigáló linkkel ellátva a patikakeresőre (`/gyogyszertarak`).
- **Publikus Fogyasztói Ár:**
  - **Felületi Típus:** Pénzösszeg (HUF) kiemelt magenta/bordó színnel (`#b1174e`) és megnövelt 20px betűmérettel
  - **Példa Érték:** `"4 825 Ft"`
  - **Limitációk:** Hivatalos vagy irányadó bruttó kiskereskedelmi fogyasztói ár.
- **Térítési Díj (Becsült):**
  - **Felületi Típus:** Pénzösszeg (HUF) sötétkék vastag betűs kiemeléssel
  - **Példa Érték:** `"2 171 Ft"`
  - **Limitációk:** Számított becsült betegtérítési díj a társadalombiztosítási (NEAK) támogatási kulcs levonása után.
- **Támogatási Kategória (Finanszírozás & Kiadhatóság):**
  - **Felületi Típus:** Szöveges besorolás százalékos kulccsal
  - **Példa Érték:** `"Kiemelt támogatásban részesülő (55%)"`, `"Normatív támogatás (25%)"`, `"Vényköteles (Rx)"` / `"Nem vényköteles (OTC)"`
- **Ekvivalencia Csoport:**
  - **Felületi Típus:** Orvosszakmai besorolási címke
  - **Megadható Értékek:** `Helyettesíthető bázisgyógyszer` (ha rendelkezik azonos hatóanyagú generikus alternatívával) / `Referencia készítmény` (originális referencia-gyógyszer)
  - **Példa Érték:** `"Helyettesíthető bázisgyógyszer"`
- **Hiányinformációk (Csak Készlethiány esetén):**
  - **Hiány kezdete:** Dátum (`"2026.01.15."`)
  - **Várható befejezése:** Dátum vagy `"Bizonytalan"`
  - **Hivatalos ok:** Szöveg (pl. `"Gyártási kapacitáshiány"`, `"Alapanyaghiány"`)
  - **Terápiás javaslat:** Szöveg (helyettesítő terápiás ajánlás)
- **Megszűnés Információk (Csak Megszűnt státusz esetén):**
  - **Megszűnés ideje:** Dátum (`"2026.01.01."`)
  - **Megszűnés oka:** Hivatalos szabályozói szöveg (pl. `"Forgalmazási engedély visszavonása / Forgalomból kivonva"`)
- **Státusztörténet Orvosi Adatbázis Időbélyeg:**
  - **Felületi Típus:** Információs időbélyeg a történeti napló alsó láblécében
  - **Példa Érték:** `"2026.10.21 00:35"` / `"2026.09.04 12:00"`

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
- **Számított Napi Nyitvatartási Státusz (3 állapotú):**
  - **Felületi Típus:** Valós idejű dinamikus szöveg és színkódolt státuszjelvény
  - **Megadható Értékek:**
    - `Nyitva` (zöld - `#317907` / badge-success: ha a gyógyszertár nyitva tart és a zárásig több mint 60 perc van hátra)
    - `Hamarosan zár` (sárga/olíva - `#7a6c21` / badge-warning: ha a gyógyszertár nyitva tart, de a napi zárási időpontig legfeljebb 60 perc van hátra)
    - `Zárva` (piros - `#b1174e` / badge-error: nyitvatartási időn kívül, zárás után, vagy heti pihenőnapon, pl. `Ma zárva`)
  - **Példa Érték:** `"Nyitva"`, `"Hamarosan zár"`, `"Zárva"`
  - **Limitációk:** Kliensoldali valós idejű állapotkalkuláció a helyi idő és a patika napi nyitvatartási adatai alapján.
- **Közvetlen Kapcsolattartási Elérhetőségek:**
  - **Telefonszám:** Hívható link formátum (`tel:` hivatkozás, pl. `"+36 1 234 5678"`)
  - **E-mail cím:** Kattintható levélcím (`mailto:` hivatkozás, pl. `"aranysas@benu.hu"`)
  - **Limitációk:** A kompakt kártyafelület tisztasága érdekében nem jelennek meg közvetlenül a patikakártyán; kizárólag a „Többit mutasd” linkre vagy a patikanévre kattintva felugró részletes adatlap modális ablakban (`PharmacyDetailModal`) érhetők el közvetlen interakcióval.

### 3.4. Patikai Készletrekord Adatmodell (Adminisztrációs és Polckészlet)

- **TK-szám (Törzskönyvi szám):**
  - **Felületi Típus:** Szöveges kód, oszlopfejléc szerint rendezhető és szűrhető
  - **Példa Érték:** `"OGYI-T-8898/01"`
  - **Limitációk:** Egyedi készítményazonosító.
- **Megnevezés:**
  - **Felületi Típus:** Kiemelt félkövér terméknév, oszlopfejléc szerint rendezhető és szűrhető
  - **Példa Érték:** `"Algopyrin 500 mg tabletta"`
- **Hatóanyag (INN):**
  - **Felületi Típus:** Szöveges megnevezés, rendezhető és szűrhető
  - **Példa Érték:** `"metamizol-nátrium"`
- **Kiszerelés:**
  - **Felületi Típus:** Csomagolási leírás, rendezhető és szűrhető
  - **Példa Érték:** `"10x buborékcsomagolásban"`
- **Gyártó:**
  - **Felületi Típus:** Forgalmazó vagy gyártó neve lebegő címmel, rendezhető és szűrhető
  - **Példa Érték:** `"Sanofi-Aventis Zrt."`
- **Országos Termékstátusz:**
  - **Felületi Típus:** Színkódolt státuszjelvény és legördülő szűrő
  - **Megadható Értékek:** `Elérhető` (zöld), `Készlethiány` (sárga), `Megszűnt` (piros)
  - **Példa Érték:** `"Elérhető"`
- **Készlet / Raktári darabszám (`dapieces`):**
  - **Felületi Típus:** Jobbra zárt numerikus érték, növekvő és csökkenő irányban rendezhető oszlop
  - **Színkódolt Státuszhatárok:**
    - `0 db`: piros szöveg (`text-error`) – kifogyott készlet
    - `1 – 9 db`: sárga szöveg (`text-warning`) – kritikus / alacsony készletszint
    - `≥ 10 db`: zöld szöveg (`text-success`) – bőséges, stabil raktárkészlet
  - **Példa Érték:** `14`
- **Utolsó szinkronizáció:**
  - **Felületi Típus:** Dátum és időbélyeg másodperces pontossággal
  - **Példa Érték:** `"2026.10.21 14:15:30"`

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

### 4.0. Globális Keretrendszer: Fejléc, Navigációs Sáv és Lábléc Modul

A portál minden bejelentkezett oldalán egységesen jelen lévő felső rögzített (sticky) navigációs vezérlősáv, valamint az alsó sötétkék lábléc.

#### 4.0.1. Fejléc és Főmenü Felületi Elemek és Működés
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

#### 4.0.2. Globális Lábléc (Footer)
Minden bejelentkezett belső oldalon (Dashboard, Gyógyszer nyilvántartás, Gyógyszer adatlap, Gyógyszertárak, Profilfelületek) az oldal alján megjelenő egységes zárókomponens, amely hivatalos jogi és verzió-azonosítási funkciót lát el.

1. **Vizuális Megjelenés és Színvilág:**
   - Teljes felületszélességű, prémium sötétkék (`#002664`) háttérszín kontrasztos fehér szövegezéssel és ikonográfiával.
   - Automatikusan az oldal legaljára illeszkedik (`mt-auto`), így kisebb tartalmú képernyőkön is a viewport alján zárja le az oldalt.
2. **Tartalmi Elemek és Szerkezet:**
   - **Bal oldali jogi és verzió blokk:**
     - Szerzői jogi nyilatkozat: *„Minden jog fenntartva. © 2026 BENU Magyarország Zrt”
   - **Jobb oldali készítői blokk:**
     - Szöveges megjelölés: *„Created by:”* felirat.
     - Készítői logó: A hivatalos **Color and Code** arculati partnerlogó beágyazott vektoros formátumban.
3. **Reszponzív Elrendezés és Töréspontok:**
   - **Asztali / Tablet nézet (≥640px):** Egyetlen horizontális sorban, kétoldali kifutással (`justify-between`), 48 képpontos oldalsó margóval (`px-12`) jeleníti meg a jogi és a fejlesztői információkat.
   - **Mobil nézet (<640px):** Az elemek automatikusan függőleges oszlopba rendeződnek (`flex-col`), 16 képpontos térközzel (`gap-4`) és középre zárt igazítással, így keskeny kijelzőn sem fedik el egymást és kényelmesen olvashatók maradnak.

#### 4.0.3. Bemenetek és Kimenetek
- **Bemenet:** Menüelemekre történő kattintás, Patikaválasztó megnyitása, Mentett lista lenyitása, *"Összes"* gombra kattintás.
- **Kimenet:** Útvonalváltás (URL navigáció), modális ablak vagy legördülő panel megjelenítése, kijelölt patikanév azonnali felületi frissülése, lábléc állandó megjelenítése az oldalak alján.

#### 4.0.4. Hibakezelés és Speciális Esetek
- **Hálózati késleltetés patikaválasztáskor:** A kijelölés azonnal helyi állapotba kerül, a mentés háttérben fut le, biztosítva az akadásmentes élményt.
- **Nincs mentett gyógyszer:** A Mentett gyorslista megnyitásakor üres állapotot jelző szöveg jelenik meg (*"Nincs még mentett gyógyszered."*).

#### 4.0.5. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.0.1:** A fejléc logójára kattintva a rendszer minden esetben az Irányítópultra navigál.
- **AC-4.0.2:** A Közeli patika gombra kattintva felugrik a kereső modal, és a választott patika azonnal megjelenik a fejlécben.
- **AC-4.0.3:** A Mentett gyorslistában az "Összes" linkre kattintva a felület a gyógyszerlistára navigál kizárólag a mentett kedvencekre szűrve (`onlyFavorites=true`).
- **AC-4.0.4:** A Profil menü Kijelentkezés gombjára kattintva a munkamenet azonnal érvényét veszti és a login oldal nyílik meg.
- **AC-4.0.5:** Minden oldal lapfülcíme kötelezően a `"{lap neve} | BENUvény Orvosi Portál"` formátumban jelenik meg.
- **AC-4.0.6:** A globális sötétkék lábléc (`Footer`) minden bejelentkezett oldalon az oldal alján megjelenik, hiánytalanul feltüntetve a szerzői jogi nyilatkozatot (*„Minden jog fenntartva. © 2026 BENU Magyarország Zrt”*), az érvényes verziószámot (`v6.1.0`), valamint a hivatalos készítői megjelölést és Color and Code logót; mobil képernyőn az elemek automatikusan függőlegesen egymás alá törnek.

#### 4.0.6. Desktop vs. Mobil Felületi Eltérések a Fejlécben, Navigációban és Láblécben

| Funkció / Felületi Elem | Asztali / Laptop Nézet (≥1024px) | Mobil / Tablet Portré Nézet (<1024px) |
| :--- | :--- | :--- |
| **Főmenü Elrendezése** | Vízszintesen elhelyezkedő ikonos gombok az oldal tetején (Irányítópult, Gyógyszer, Gyógyszertár, Mentett, Profil). | Bal oldali Hamburger menügombbal előhívható, függőlegesen gördülő menüpanel. |
| **Központi Intelligens Kereső** | Közvetlenül gépelhető beviteli mező a fejléc közepén, lebegő azonnali találati ablakkal. | Kisméretű érintőgomb (nagyító ikon), amely teljes képernyős keresőfelületet (Overlay) nyit meg a képernyő tetején. |
| **Közeli Patika Kijelzése és Módosítása** | A fejléc jobb oldalán folyamatosan látható felirat és zöld aláhúzott patikanév; kattintásra felugró modal. | A hamburger menü fejlécében elhelyezett kiemelt információs kártya patikanévvel és „Módosítás” akciógombbal. |
| **Mentett Gyógyszerek Gyorselérése** | Lebegő gyorsablak a fejlécből kék számláló jelvénnyel, tetején közvetlen „Összes” hivatkozással. | A mobil hamburger menüben önálló „Mentett gyógyszerek” sor az aktuális darabszámot mutató kék jelvénnyel. |
| **Profil és Munkamenet Kezelés** | Jobb szélső profil avatar legördülő menüvel (Profil adatok, Adminisztráció, Kijelentkezés). | A mobil hamburger menü alsó szekciójába integrált profilbeállítások és piros kiemelt Kijelentkezés gomb. |
| **Globális Lábléc (Footer)** | Egyetlen vízszintes sorban elhelyezkedő sáv (bal oldalon a szerzői jog és a verziószám, jobb oldalon a készítői logó). | Függőlegesen egymás alá rendeződő (flex-col) blokkok középre zárt térközzel, biztosítva a kis képernyős olvashatóságot. |

---

### 4.1. Irányítópult (Dashboard)

A sikeres bejelentkezést követő központi orvosi áttekintő felület, amely egyidejűleg biztosítja az országos piaci készletmozgások és a preferált helyi gyógyszertár készletváltozásainak valós idejű monitorozását.

**Útvonal:** [https://bvo.uneb.hu/dashboard](https://bvo.uneb.hu/dashboard)

#### 4.1.1. Működés és Képernyőfelépítés

Az Irányítópult kétoszlopos, modern, asztali és hordozható képernyőkhöz optimalizált elrendezést alkalmaz (Figma tervek alapján):

##### Fejléc Sáv és Időszak-választó Kapszula (Dropdown)
A lap tetején a bal oldalon az oldal címe (*„Irányítópult”*) és grafikus ikonja látható, a jobb oldalon pedig egy lekerekített kapszula (pill) formájú **legördülő menü (dropdown)** kapott helyet:
- **Nem különálló gombok sora**, hanem egy kompakt, lebegő vezérlőelem lenyíló nyílikonnal.
- **Kiválasztható időablakok:**
  - `Elmúlt 1 nap`
  - `Elmúlt 3 nap` (a rendszer alapértelmezett beállítása a belépéskor)
  - `Elmúlt 7 nap`
  - `Elmúlt 30 nap`
- **Interakció és állapotmegőrzés:** Az aktuálisan aktív időszak kiemelt sötétkék háttérrel és fehér vastag betűvel jelenik meg a lenyíló menüben. Új időszak kiválasztásakor a böngésző URL paramétere azonnal szinkronizálódik (`?period=X`), és mind a bal oldali piaci, mind a jobb oldali patikai statisztikai kártyák és listák azonnal, oldalújratöltés nélkül újraszámolódnak. A menü a választás után automatikusan bezáródik, és a képernyőn kívülre kattintva is becsukódik.

##### 1. Bal Oldali Oszlop: Globális Készletinformációk
1. **Globális Készletösszesítő Kártya:**
   - Kiemelt krémsárga hátterű figyelmeztető doboz.
   - Fejlécében a *„Globális készletváltozás”* cím és az *„elmúlt X nap változása”* felirat látható a beállított időablaknak megfelelően.
   - Középen nagyméretű, figyelemfelkeltő össz-darabszám számláló jelzi az adott időszakban bekövetkezett összes országos termékmozgást (pl. `14 db`).
   - Alatta három kategóriabontás szerepel kerek ikonokkal és pontos darabszámokkal:
     - **Megszűnt:** Piros ikon, darabszám (pl. `1 db megszűnt`).
     - **Készlethiány:** Sárga ikon, darabszám (pl. `12 db készlethiány`). A hiányszámlálóra kattintva a rendszer azonnal a gyógyszerlistára navigál automatikusan bekapcsolt `Készlethiány` szűrővel.
     - **Újra elérhető:** Zöld ikon, darabszám (pl. `1 db újra elérhető`).
2. **Globális Legutóbbi Készletváltozások Listája:**
   - Fehér hátterű, lekerekített sarkú kártya, fejlécében: *„Legutóbbi 20 készletváltozás”*, alatta magyarázó alcímmel: *„Élő készletinformációk és beérkező termékek állapota”*.
   - A legfrissebb 20 piaci készletmozgást jeleníti meg időrendi sorrendben visszafelé, kétszintes kompakt kártyasorokban:
     - *Felső szint (1. sor):* A gyógyszer teljes hivatalos kereskedelmi neve a teljes kártyaszélességet megkapja, legfeljebb 2 soros intelligens szövegtördeléssel, sötétkék kiemeléssel és közvetlen hivatkozással a gyógyszer részletes adatlapjára (`/gyogyszerek/adatlap?tk=...`).
     - *Alsó szint (2. sor):* Letisztult metainfó sáv: bal oldalon a színkódolt országos státuszjelvény (`Elérhető` zöld, `Hiány` sárga, `Megszűnt` piros jelvény), jobb oldalon a készletváltozás pontos időbélyege (ÉÉÉÉ-HH-NN ÓÓ:PP).
3. **„Összes változás” Navigációs Link a lista láblécében:**
   - A kártya alsó szegélyében egy vékony elválasztó vonallal lezárt lábléc található.
   - A láblécben elhelyezett vastag betűs, nyíllal ellátott *„Összes változás →”* linkre kattintva az orvos közvetlenül a teljes gyógyszerlista oldalra jut, a legutolsó módosítás szerint csökkenő időrendben rendezve (`/gyogyszerek?sort=lastUpdate&order=desc`).

##### 2. Jobb Oldali Oszlop: Közeli Gyógyszertár Állapota és Készlete
A jobb oldali oszlop funkcionális tartalma automatikusan igazodik ahhoz, hogy a felhasználó rendelkezik-e beállított preferált gyógyszertárral:

###### A) Nincs preferált patika kiválasztva (Alapértelmezett állapot)
Amennyiben a felhasználó még nem jelölt ki közeli patikát (vagy törölte a kijelölést):
1. **Fejléc és Gyorskereső Mező:**
   - Kártyacím: *„Közeli gyógyszertár kiválasztása”*.
   - Tájékoztató felirat: *„Válasszon egy gyógyszertárat, hogy láthassa a készletváltozásait!”*.
   - **Közvetlen Gyorskereső Mező:** A fejléc alatt egy azonnal gépelhető beviteli mező található (*„Gyógyszertár gyorskeresése (pl. Allee, Szeged, Kossuth út)...”*).
     - Gépelés közben a rendszer lebegő (dropdown) találati listát nyit meg a legrelevánsabb patikákkal (patikanév, irányítószám, település, utcanév és házszám).
     - A találati sorban található zöld *„Kiválasztás”* gombra kattintva a felhasználó egyetlen kattintással beállíthatja a preferált patikát, ami azonnal átváltja a felületet a patika készletmozgási adataira.
   - **„Gyorskereső” Akciógomb:** A fejléc jobb szélén elhelyezett gomb, amely felugró modális ablakban nyitja meg a keresőt, szűrőkkel és teljes patikalistával.
2. **Beágyazott Interaktív Térképes Modul:**
   - A kártyába integrált, nagyméretű, görgethető, mozgatható és nagyítható térképes felület, amelyen megjelennek a hálózati partner gyógyszertárak arculati Pin jelölői. (A térképi megjelenítés technológiai megvalósítása a kivitelező fejlesztő partner hatásköre).
3. **Helyszíni Patikakijelölés és Adatlap Megtekintés a Térképen:**
   - Bármelyik térképi pinre kattintva a térképen helyben felugrik a patika információs kártyája (patikanév, pontos cím, távolság km-ben a felhasználó pozíciójától, a hét adott napjára vonatkozó nyitvatartási idő és pillanatnyi státusz: *„Nyitva”*, *„Hamarosan zár”*, *„Zárva”*).
   - A felugró kártya alján található kétállású *„Közelinek jelölöm”* akciógombra kattintva a felhasználó közvetlenül, a Dashboard elhagyása nélkül kijelölheti a patikát.
   - A patika nevére vagy a *„Többit mutasd”* linkre kattintva helyben megnyílik a patika részletes heti adatlapja (modális ablakban) a teljes heti nyitvatartással, telefonos és e-mailes elérhetőséggel, ahonnan szintén közvetlenül kijelölhető a patika.
   - A kijelölés pillanatában a jobb oldali oszlop azonnal és zökkenőmentesen átvált a kijelölt patika készletösszesítő és lista állapotára.
4. **Lábléc Hivatkozások:**
   - Bal oldalon a *„Tovább a gyógyszertárkeresőre →”* hivatkozás, amely a teljes értékű, listás és szűrős gyógyszertárkereső főoldalra (`/gyogyszertarak`) navigál.
   - Jobb oldalon a *„Teljes lista megnyitása”* gomb, amely modális ablakban nyitja meg a keresőt.

###### B) Van kijelölt preferált patika
Amikor a felhasználó rendelkezik kijelölt gyógyszertárral, a jobb oldali oszlop a patika helyi ellátottsági dinamikájára vált:
1. **Patikai Készletösszesítő Kártya:**
   - Kiemelt krémsárga hátterű doboz, fejlécében a kiválasztott gyógyszertár hivatalos nevével (pl. *„BENU Gyógyszertár Budapest Allee”*) és az *„elmúlt X nap változása”* felirattal.
   - **Közvetlen Módosítási és Törlési Műveletek:** A fejlécben a patikanév alatt két azonnali műveleti lehetőség biztosított:
     - *„Másik patika választása”*: felugró választó modális ablakot nyit meg, ahol az orvos kereséssel vagy térképről azonnal új gyógyszertárat jelölhet ki.
     - *„Kijelölés törlése”*: egyetlen kattintással eltávolítja a preferált patika kijelölését, és azonnal visszaállítja az Irányítópulton az alapértelmezett interaktív térképes és gyorskeresős állapotot.
   - Középen a gyógyszertárban a vizsgált időszakban bekövetkezett összesített készletmozgások darabszáma látható (pl. `24 db`).
   - A globális kártyával ellentétben itt **kifejezetten 2 helyi mutató** szerepel (mivel lokális polcszinten a gyógyszerek vagy elfogynak, vagy újra készletre érkeznek):
     - **Elfogyott:** Piros kerek ikon és pontos darabszám (pl. `7 db elfogyott`).
     - **Újra elérhető:** Zöld kerek ikon és pontos darabszám (pl. `1 db újra elérhető`).
   - *(Megjegyzés: A patika címe és részletes heti nyitvatartási rendje a fejléc navigációs patikaindikátorából vagy a patikakeresőből érhető el; a Dashboardon a helyi készletmozgások számszerűsített és listázott követése kap elsőbbséget).*
2. **Patikai Legutóbbi Készletváltozások Listája:**
   - Fehér hátterű kártya a bal oldali listával megegyező kétszintes kompakt kialakításban.
   - Fejlécében: *„Legutóbbi 20 készletváltozás”*, alatta személyre szabott alcímmel: *„Élő készletinformációk és beérkező termékek itt: [Kijelölt patika neve]”*.
   - A kijelölt gyógyszertár polckészletének legutóbbi legfeljebb 20 készletmozgását sorolja fel időrendben (felső szinten kattintható terméknév, alsó szinten helyi státuszjelvény és pontos időbélyeg).
3. **„Összes változás” Navigációs Link a patikai lista láblécében:**
   - A patikai lista alján található *„Összes változás →”* hivatkozásra kattintva a rendszer a gyógyszerlista oldalra navigál, miközben **automatikusan bekapcsolja a közeli patika készletszűrőjét és a legutolsó frissítés szerinti csökkenő rendezést** (`/gyogyszerek?nearbyOnly=true&sort=lastUpdate&order=desc`).
   - Ezáltal az orvos egyetlen kattintással a preferált patikájának teljes készletmozgási listájához jut.

#### 4.1.2. Bemenetek és Kimenetek
- **Bemenetek:**
  - Időszak-választó kapszula legördülő menü (dropdown) lenyitása és időintervallum (1, 3, 7, 30 nap) kiválasztása.
  - Globális összesítő kártyán a készlethiány számlálóra kattintás.
  - Készletváltozási lista sorában a terméknév linkre kattintás.
  - A globális készletváltozási lista láblécében az *„Összes változás →”* linkre kattintás.
  - A patikai készletváltozási lista láblécében az *„Összes változás →”* linkre kattintás.
  - Gyorskereső mezőbe gépelés és a legördülő találati listából a *„Kiválasztás”* gombra kattintás.
  - Kártya fejlécében a *„Gyorskereső”* vagy a láblécben a *„Teljes lista megnyitása”* gombra kattintás.
  - Térképi interakciók (nincs patika kiválasztva): térkép mozgatása, zoomolása, patika pinre kattintás az információs kártya megnyitásához.
  - Térképi felugró kártyán a *„Közelinek jelölöm”* gombra kattintás.
  - Térképi felugró kártyán a patikanévre vagy a *„Többit mutasd”* linkre kattintva a részletes heti adatlap megnyitása modálban.
  - Kijelölt patika esetén a *„Másik patika választása”* gombra kattintás.
  - Kijelölt patika esetén a *„Kijelölés törlése”* gombra kattintás.
  - Térkép alatti láblécben a *„Tovább a gyógyszertárkeresőre →”* linkre kattintás.
- **Kimenetek:**
  - Időszakváltáskor a statisztikák és a listák azonnali frissülése az URL paraméter szinkronizálásával (`?period=X`).
  - Globális hiányszámlálóra kattintva átnavigálás a gyógyszerlistára bekapcsolt `Készlethiány` szűrővel.
  - Gyógyszernévre kattintva átnavigálás az adott gyógyszer részletes adatlapjára (`/gyogyszerek/adatlap?tk=...`).
  - Globális *„Összes változás”* gomb hatására navigáció a `/gyogyszerek?sort=lastUpdate&order=desc` oldalra.
  - Patikai *„Összes változás”* gomb hatására navigáció a `/gyogyszerek?nearbyOnly=true&sort=lastUpdate&order=desc` oldalra.
  - Gyorskeresőből vagy térképről történő kijelölés után a jobb oldali oszlop azonnali átváltása a kiválasztott patika 2-mutatós készletösszesítő kártyájára és 20 tételes készletmozgási listájára.
  - *„Másik patika választása”* esetén választó modális ablak megjelenítése.
  - *„Kijelölés törlése”* esetén a preferált patika azonnali eltávolítása és visszaváltás az interaktív térképes és gyorskeresős alapállapotra.
  - *„Tovább a gyógyszertárkeresőre”* kattintás után navigáció a `/gyogyszertarak` útvonalra.

#### 4.1.3. Hibakezelés a Dashboardon
- **Nincs készletváltozás az adott időszakban:** A lista sorai helyén diszkrét, tiszta információs sáv jelenik meg: *„Nincs megjeleníthető készletváltozás az adott időszakban.”*
- **Térkép betöltési állapota:** A térkép aszinkron betöltése közben szürke hátterű betöltőpanel jelenik meg központi töltésjelző spinnerrel és *„Térkép betöltése...”* tájékoztatással.
- **Kieső patikaadatok:** Amennyiben a kiválasztott preferált patika készletadatai átmenetileg nem elérhetők, a felület nem omlik össze: a rendszer alapértelmezett készletértékeket jelenít meg, miközben a navigációs és patikakereső hivatkozások továbbra is működőképesek maradnak.

#### 4.1.4. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.1.1:** A fejléc jobb szélén található lekerekített kapszula formájú időszakválasztó legördülő menüből (dropdown) kiválasztva az 1, 3, 7 vagy 30 napos intervallumot, a bal és jobb oldali kártyák és listák adatai oldalújratöltés nélkül azonnal frissülnek, a böngésző URL-je pedig kiegészül a `?period=X` paraméterrel.
- **AC-4.1.2:** A globális összesítő kártyán a készlethiány számlálóra kattintva a gyógyszerlista oldal nyílik meg, automatikusan bekapcsolt `Készlethiány` szűrővel.
- **AC-4.1.3:** Amennyiben a felhasználó még nem választott preferált patikát, a jobb oldali oszlopban beágyazott interaktív térképes felület és beépített autocompleter gyorskereső mező jelenik meg. A gyógyszertárak a gyorskereső találati listájából közvetlenül, vagy a térképi jelölőkre kattintva felugró információs kártyán a „Közelinek jelölöm” gombbal helyben, oldalváltás nélkül kijelölhetők, azonnal átváltva a felületet a patikai készletösszesítőre.
- **AC-4.1.4:** A térképes modul alsó láblécében elhelyezett „Tovább a gyógyszertárkeresőre” hivatkozásra kattintva a rendszer a `/gyogyszertarak` oldalra navigál, a „Teljes lista megnyitása” gomb pedig felugró modális ablakban nyitja meg a keresőt.
- **AC-4.1.5:** Kijelölt preferált patika esetén a jobb oldali oszlop a patika nevével és az időszakkal ellátott készletösszesítő kártyát jeleníti meg pontosan 2 helyi mutatóval (*„X db elfogyott”* és *„Y db újra elérhető”*), alatta pedig a patika saját legutóbbi 20 helyi készletmozgását kétszintes kompakt kártyasorokban.
- **AC-4.1.6:** Mind a globális készletváltozási lista, mind a patikai készletváltozási lista alsó láblécében működik az „Összes változás” hivatkozás, amely a globális listából a `/gyogyszerek?sort=lastUpdate&order=desc`, a patikai listából pedig a `/gyogyszerek?nearbyOnly=true&sort=lastUpdate&order=desc` oldalra navigál.
- **AC-4.1.7:** Az Irányítópulton megjelenő adatok kizárólag az OTC és vényköteles humán gyógyszerek készletmozgásait tartalmazzák; egyéb nem gyógyszer cikkek nem jelenhetnek meg.
- **AC-4.1.8:** A legutóbbi készletváltozások listájában a hosszú terméknevek a rendelkezésre álló teljes kártyaszélességben, levágás nélkül legfeljebb 2 sorba tördelődnek, közvetlenül az adatlapra navigálnak, alattuk pedig egységesen látható a státuszjelvény és az időbélyeg.
- **AC-4.1.9:** Kijelölt preferált patika esetén a készletösszesítő kártya fejlécében megjelenő „Másik patika választása” linkkel a felhasználó felugró ablakban új patikát választhat, a „Kijelölés törlése” linkre kattintva pedig a kijelölés azonnal megszűnik, és a felület oldalújratöltés nélkül visszavált a térképes és gyorskeresős választó állapotra.

---

### 4.2. Gyógyszer Nyilvántartás (Lista és Adatlap)

A portál központi munkafelülete a gyógyszerek keresésére, szűrésére és az adatlapi információk megtekintésére.

#### 4.2.1. Gyógyszerlista Oldal
**Útvonal:** [https://bvo.uneb.hu/gyogyszerek](https://bvo.uneb.hu/gyogyszerek)

1. **Fluid (Teljes Képernyőszélességű) Elrendezés:**
   - A táblázat a rendelkezésre álló teljes monitor-szélességet kihasználja (`w-full`), minimalizálva a szükségtelen vízszintes görgetést nagyméretű monitorokon.
2. **Keresési és Szűrési Vezérlősáv (Toolbar):**
   - Élő szöveges szűrő: azonnal keres gyógyszernévben, hatóanyagban és TK-számban.
   - Kétállású Nézetváltó Gomb: Kényelmes váltás a kártyás (`Kártyák`) és a sokoszlopos táblázatos (`Táblázat`) megjelenítés között.
   - Gyorskapcsolók asztali nézetben: *"Csak mentett"* és *"Közeli patikában elérhető"* jelölőnégyzetek közvetlen szűréshez.
   - Oszlopkezelő Menü: Az „Oszlopok” gombra kattintva lebegő menü jelenik meg, ahol a 15 oszlop bármelyike egyénileg ki-be kapcsolható.
3. **Központi Accordion Szűrő- és Rendezési Panel (Asztali és Mobil Nézetben Egyaránt):**
   - A címsor és keresősáv alatt elhelyezkedő, egyetlen kattintással lenyitható és becsukható összefoglaló vezérlőpanel (`isFilterAccordionOpen`), amely **nem csak mobilon (<1024px), hanem asztali nézetben (≥1024px) is közvetlenül elérhető a táblázat felett**.
   - **Fejléc sáv és dinamikus visszajelzés:**
     - Szűrőikon és *„Szűrés és rendezés”* felirat nyitási/zárási állapotjelző piktogrammal.
     - **Aktív szűrő számláló jelvény:** Bármely szűrési vagy rendezési feltétel érvényesülésekor kék számláló jelvény mutatja az aktív feltételek darabszámát (pl. *„3 aktív szűrő”*).
     - **„Szűrők törlése” funkciógomb:** Aktív szűrő esetén a fejléc jobb oldalán közvetlenül megjelenik az egykattintásos törlési lehetőség, amely azonnal alaphelyzetbe állítja az összes szűrőt és az 1. oldalra ugrik.
   - **Integrált szűrőmezők kinyitott állapotban (4 hasábos elrendezésben):**
     - *1. Rendezés:* Legutóbb frissült elöl (alapértelmezett), Legrégebben frissült elöl, Gyógyszer neve (A → Z), Gyógyszer neve (Z → A), Közeli patikában elérhető elöl.
     - *2. Országos státusz:* Mindegyik státusz, Elérhető, Készlethiány, Megszűnt.
     - *3. Gyorsszűrők:* Csak mentett gyógyszerek, Közeli patikában elérhető tételek jelölőnégyzetekkel.
     - *4. Frissítés dátuma:* Kezdő dátum és záró dátum naptár választó mezők a módosítási időablak szűkítésére.
4. **Interaktív Fluid Adattáblázat és Oszlopkezelés:**
   - **Teljes körű 15 oszlopos törzskönyvi struktúra:** A rendszer összesen 15 adatmezőt kezel: `Dátum / idő`, `Státusz`, `Termék neve`, `Hatóanyag`, `Kiszerelés`, `Gyártó`, `Közeli patika`, `Közeli patika frissítve`, `TK szám`, `Csomagolás`, `Kiadhatóság`, `Kiadhatósági alcsoport`, `Biztonsági elemek`, `Engedély dátuma`, `Műveletek`.
   - **Alapértelmezett oszlopok (7 aktív oszlop):** Új munkamenetben és alaphelyzetben a 15 oszlopból pontosan **7 oszlop aktív és látható**:
     1. `Dátum / idő` (Utolsó módosítás időpontja)
     2. `Státusz` (Országos piaci elérhetőség: Elérhető, Készlethiány, Megszűnt)
     3. `Termék neve` (Hivatalos kereskedelmi megnevezés közvetlen adatlap hivatkozással)
     4. `Hatóanyag` (INN nemzetközi szabadnév)
     5. `Kiszerelés` (Csomagolási darabszám és forma)
     6. `TK szám` (Hatósági törzskönyvi azonosító)
     7. `Műveletek` (Jobb szélen fixált akciógombok: kedvenc csillag, készletértesítő harang, Részletek adatlap gomb).
   - **Automatikus oszlopmegjelenítés patikaválasztáskor:** Amennyiben a felhasználónak van kijelölt közeli patikája, a táblázatban a `Közeli patika` (elérhetőségi állapot) és a `Közeli patika frissítve` (patikai készlet frissítési ideje) oszlopok **automatikusan bekapcsolódnak és megjelennek a táblázatban**, biztosítva a helyi polckészlet azonnali orvosi áttekintését manuális oszlopkonfiguráció nélkül.
   - **Háromállapotú (3-state) Oszlopfejléc Rendezés:** A rendezhető oszlopok fejléceire kattintva a sorba rendezés ciklikusan három állapotot követ:
     1. Első kattintás: **Növekvő sorrend** (megjelenik a felfelé mutató `▲` ikon).
     2. Második kattintás: **Csökkenő sorrend** (megjelenik a lefelé mutató `▼` ikon).
     3. Harmadik kattintás: **Alaphelyzet / rendezés törlése** (a nyílikon eltűnik, a lista visszaáll az alapértelmezett sorrendre).
   - **Drag & Drop Oszlopátrendezés:** Az oszlopfejlécek fogantyújuknál fogva tetszőleges sorrendbe húzhatók; a beállított egyedi oszlopsorrend megőrződik a böngésző helyi tárolójában (`localStorage`).
   - **Rögzített (Sticky) Műveletek Oszlop:** A jobb szélső műveleti oszlop (Adatlap link, Kedvenc csillag, Értesítő harang) vízszintes görgetés esetén is folyamatosan rögzítve marad a képernyő jobb szélén.
   - **Oszlopszintű Gyorsszűrők Fejlécsora:** A táblázat fejlécében minden adatmező alatt közvetlen beviteli mező, státusz és patika legördülő, vagy naptári dátumválasztó (tól-ig) biztosítja a gyors helyszíni szűrést.
5. **Kártyás Nézet (`MedicineCard`) és Reszponzív Rácselrendezés:**
   - **Automatikus és kézi nézetváltás:** 1024 képpont alatti képernyőszélesség esetén a felület automatikusan átvált az ergonomikus kártyás megjelenítésre, de a fejlécben elhelyezett kétállású kapcsolóval (`Kártyák` / `Táblázat`) asztali nézetben is bármikor bekapcsolható a kártyarács.
   - **Reszponzív kártyarács oszlopszám:**
     - *Nagy képernyő / asztali nézet (≥1280px / XL):* **3 oszlopos kártyarács** (`xl:grid-cols-3`).
     - *Közepes kijelző / tablet fekvő nézet (768px – 1279px):* **2 oszlopos kártyarács** (`md:grid-cols-2`).
     - *Mobil / okostelefon nézet (<768px):* **1 oszlopos függőleges kártyafolyam** (`grid-cols-1`).
   - **Közeli Patika Készletindikátor (`NearbyPharmacyStockIndicator`):**
     - A gyógyszerkártya fejlécében (az országos státuszbadge mellett/alatt) elhelyezett információs blokk, amely kijelölt preferált gyógyszertár esetén jelenik meg.
     - Megjeleníti a választott közeli patika hivatalos nevét dőlt betűvel, zárójelben (pl. *„(BENU Gyógyszertár Budapest Corvin)”*).
     - Helyi elérhetőségi státuszjelvényt mutat: zöld színű *„Közeli patikában elérhető”* (pipa ikonnal) vagy szürke színű *„Közeli patikában nem elérhető”* (tiltás ikonnal).
     - Óra/perc pontossággal feltünteti a patikai adat utolsó szinkronizálási/frissítési idejét időikonnal kísérve: *„Frissítve: ÉÉÉÉ-HH-NN ÓÓ:PP”* (pl. *„Frissítve: 2026-10-21 00:35”*).
   - **Kártya Törzsadatok és Másodlagos Mezők:**
     - Fejléc jobb felső sarok: Konstans látható országos adatmódosítási időpont (*„Utolsó frissítés: ÉÉÉÉ-HH-NN ÓÓ:PP”*).
     - Elsődleges törzsadatok: Kereskedelmi név (legfeljebb 2 sorban tördelve, közvetlen adatlap hivatkozással), Hatóanyag (INN), Kiszerelés, Gyártó és termékazonosító (TK-szám).
     - Lenyitható szekció: *„További adatok megjelenítése”* gombbal kibontható csomagolás, kiadhatóság, kiadhatósági alcsoport, biztonsági elemek, engedély dátuma.
     - Kártya lábléc: Nagyméretű érintőgombok a Kedvenc mentéshez, Készletértesítés feliratkozáshoz és az Adatlap megnyitásához.
6. **Alsó Lapozó Sáv és Oldalankénti Találatszám Választó:**
   - A táblázat és a kártyarács alján elhelyezkedő integrált alsó sáv egységesen szolgálja ki mindkét megjelenítési módot.
   - **Numerikus oldalléptetés:** Előző oldal (`<`), közvetlen lapszámgombok, kihagyási indikátorok (`...`), utolsó oldal és Következő oldal (`>`).
   - **Oldalankénti Találatszám Választó Legördülő Menü:**
     - A lapozósáv jobb oldalán elhelyezett lekerekített kapszula formájú legördülő menü nyíl piktogrammal.
     - **Választható opciók:**
       - `10 találat / oldal`
       - `20 találat / oldal` (**Rendszerszintű alapértelmezett beállítás**)
       - `50 találat / oldal`
       - `100 találat / oldal`
     - A találatszám megváltoztatásakor a lista automatikusan az 1. oldalra ugrik az új tételszámítás szerint, a legördülő menü pedig azonnal bezáródik.

#### 4.2.1.4. Desktop vs. Mobil Felületi Eltérések a Gyógyszerkeresőben

| Funkció / Képernyőelem | Asztali / Laptop Nézet (≥1024px) | Mobil Nézet (<1024px) |
| :--- | :--- | :--- |
| **Elsődleges Megjelenítés** | Teljes képernyős, 15 oszlopos fluid adattáblázat horizontális görgetéssel (alapértelmezetten 7 aktív oszloppal és 3-állapotú rendezéssel), vagy kézi váltással 3 oszlopos kártyarács (≥1280px). | 1 vagy 2 oszlopos érintésbarát gyógyszerkártya-rács (`MedicineCard`). |
| **Nézet Felülbírálása** | Alapértelmezett a táblázat, de a fejléc Nézetváltó gombjával kártyás nézetre is kapcsolható. | Alapértelmezett a kártyás rács, de a Nézetváltó gombbal táblázatra váltható. |
| **Szűrési Felület** | A táblázat felett elérhető egy kattintással lenyitható központi **Accordion szűrőpanel**, valamint a táblázat oszlopfejlécei alatt közvetlenül elérhető oszlopszintű gyorsszűrők és dátumválasztók. | A fejléc alatti egy kattintással lenyitható **Accordion szűrőpanel** aktív szűrőszámlálóval és egykattintásos szűrőtörléssel. |
| **Szűrőpanel Beviteli Mezői** | • **Rendezés:** Legutóbb frissült, Legrégebben frissült, Név A-Z, Név Z-A, Közeli patika készlet elöl.<br>• **Státusz:** Mindegyik, Elérhető, Készlethiány, Megszűnt.<br>• **Gyorskapcsolók:** Csak mentett, Közeli patikában elérhető.<br>• **Frissítés dátuma:** Kezdő és záró dátum.<br>• **Szűrők törlése:** Egykattintásos alaphelyzetbe állítás. | Megegyezik az asztali nézettel: integrált 4-funkciós beállítópanel egyérintéses szűrőtörléssel és aktív számlálóval. |
| **Aktív Szűrők Visszajelzése** | Az Accordion gombon számláló jelvény (`X aktív szűrő`), a fejléc kapcsolókon és a táblázat oszlopszűrő mezőiben kitöltöttség. | Az Accordion szűrőgombon számláló jelvény jelenik meg (pl. *"3 aktív szűrő"*), mellette közvetlen *"Szűrők törlése"* gombbal. |
| **Oszlopkezelés & Testreszabás** | Drag & Drop oszlopátrendezés, Oszlopok menü (alapértelmezetten 7 aktív oszlop), patikaválasztáskor a 2 közeli patika oszlop automatikus aktiválása. | Kártyás nézetben a kártyák „További adatok megjelenítése” gombjával egy érintéssel kinyithatók a részletes másodlagos mezők. |
| **Műveleti Gombok Elhelyezése** | A táblázat jobb szélén folyamatosan rögzített (sticky) fix oszlop (Mentés, Értesítés, Részletek). | A gyógyszerkártya alján elhelyezett, nagyméretű ujjal kényelmesen érinthető gombsor (Mentés, Értesítés, Részletek). |
| **Lapozó és Eredménysor** | Lapozósáv lapszámozó gombokkal és legördülő oldalankénti találatszám választóval (10, 20 [alapértelmezett], 50, 100 találat / oldal). | Kártyaszerű alsó lapozó sáv azonos funkciókkal és találatszám választóval (10, 20, 50, 100 találat / oldal). |

#### 4.2.2. Gyógyszer Részletes Adatlap
**Hivatalos Elérési Útvonal:** [https://bvo.uneb.hu/gyogyszerek/adatlap?tk=[tkSzam]](https://bvo.uneb.hu/gyogyszerek/adatlap) (Példa: `/gyogyszerek/adatlap?tk=OGYI-T-8898/01`)  
**Visszafelé Kompatibilis Dinamikus Útvonal:** `/gyogyszerek/[...id]` (Példa: `/gyogyszerek/OGYI-T-8898/01` automatikus HTTP átirányítással a query paraméteres címre)

A részletes gyógyszeradatlap az orvosi döntéstámogató munkafolyamat legfontosabb vizsgálati felülete, amely egy kiválasztott készítmény valamennyi törzskönyvi adatát, aktuális piaci státuszát, országos hálózati és helyi preferált patikai készletelérhetőségét, hivatalos fogyasztói és becsült térítési árait, valamint a terápiás helyettesíthetőséget mutatja be egyetlen áttekinthető, strukturált képernyőn.

1. **Visszanavigálás és Fejléc Műveletek:**
   - **„← Részletek” Navigációs Gomb:** Az oldal tetején elhelyezett diszkrét visszalépési vezérlő (`/gyogyszerek`), amellyel a felhasználó egyetlen kattintással visszatérhet a gyógyszerkereső főoldalra, megőrizve az ott korábban aktív szűrési és lapozási állapotot.
   - **Elsődleges Termékazonosítók:**
     - **Gyógyszer Hivatalos Neve:** Kiemelt méretű cím (pl. *„Xyzal 5 mg filmtabletta”*).
     - **Hatóanyag és ATC Kód Sor:** Közvetlenül a név alatt elhelyezett leíró adatsáv (pl. *„Hatóanyag: levocetirizin-dihidroklorid | ATC Kód: R06AE09”*).
   - **Fejléc Akciógombok:**
     - **Mentés Gomb (Csillag ikon):** Egykattintásos elmentés a helyi kedvencek közé, azonnali fejléc-számláló növekedéssel.
     - **Értesítés Kérése Gomb (Harang ikon):** Feliratkozás a készítmény készletváltozási riasztásaira (egyidejűleg automatikusan elmenti a gyógyszert a kedvencek közé is).

2. **Készlethiány Figyelmeztető Doboz (Csak Készlethiány státusz esetén):**
   - Ha a készítmény piaci státusza `Készlethiány`, a fejléc alatt egy sárga hátterű (`#fffce9`), aranybarna szegélyű (`#f5e8a3`) figyelmeztető kártya jelenik meg.
   - **Fejléc:** Figyelmeztető ikon és kiemelt *„Készlethiány”* felirat.
   - **3 Oszlopos Adatmező Elrendezés:**
     - **Készlethiány kezdete:** A hiány beálltának hivatalos bejelentési dátuma (formátum: `ÉÉÉÉ.HH.NN.`, pl. `2026.01.15.`).
     - **Tervezett vége:** A hiány megszűnésének várható ideje (formátum: `ÉÉÉÉ.HH.NN.`, pl. `2026.12.31.` vagy ismeretlen esetben *„Bizonytalan”*).
     - **Hiány oka:** Hivatalos indoklás (pl. *„Gyártási kapacitáshiány”*, *„Alapanyaghiány”*).
   - **Javaslat a pótlásra:** A kártya alsó leválasztott sávjában megjelenő szakmai helyettesítési ajánlás.

3. **Megszűnt Termék Figyelmeztető Doboz (Csak Megszűnt státusz esetén):**
   - Amennyiben a termék piaci státusza `Megszűnt`, a sárga hiánybanner helyett egy különálló halványpiros hátterű (`#fef7f8`), diszkrét piros kerettel (`#fbd3db`) ellátott figyelmeztető kártya jelenik meg.
   - **Fejléc:** Piros információs/figyelmeztető ikon és kiemelt *„Megszűnt termék”* cím (`text-[#002664] text-[22px] font-bold`).
   - **2 Oszlopos Adatmező Elrendezés:**
     - **Ideje:** A készítmény törzskönyvből való törlésének, forgalomból történő kivonásának vagy az utolsó piaci státuszmódosításnak a pontos ideje (formátum: `ÉÉÉÉ.HH.NN.`, pl. `2026.01.01.`).
     - **Megszűnés oka:** A forgalmazás megszűnésének hivatalos szakmai és szabályozói oka (pl. *„Forgalmazási engedély visszavonása / Forgalomból kivonva”*).

4. **Országos Hálózati Készletblokk (`BENU GYÓGYSZERTÁRAK`):**
   - A `KÖZELI GYÓGYSZERTÁR` szekció közvetlen felett elhelyezkedő, nagybetűs kékesszürke felirattal (`BENU GYÓGYSZERTÁRAK`) bevezetett országos hálózati eloszlási sáv.
   - A rendszer a teljes BENU gyógyszertári hálózat **250 patikájára vetítve** reprezentálja az aktuális készlethelyzetet a 4 állapotú készletbesorolás szerint:
     - **Elérhető státuszú termék esetén:**
       - **Készleten:** Zöld pipás készletjelvény mellett mutatja, hogy pontosan hány patikában van a gyógyszer azonnal, fizikailag raktáron (pl. `198 db BENU Gyógyszertárban`). A patikaszám aláhúzott interaktív hivatkozás, amely közvetlenül a Gyógyszertár Kereső (`/gyogyszertarak`) oldalra navigál.
       - **Rendelésre (1-2 munkanap):** Kék körbefutó nyilas készletjelvény mellett jelzi, hány patikába rendelhető meg nagykereskedelmi raktárból rövid szállítási idővel (pl. `52 db BENU Gyógyszertárban (1-2 munkanap)`), szintén közvetlen továbbnavigáló linkkel a patikakeresőre.
     - **Készlethiány vagy Megszűnt státuszú termék esetén:**
       - **Korlátozottan:** Sárga készletjelvény mutatja azon patikák számát, ahol a termékhiány ellenére még fellelhető maradék polckészlet (pl. `42 db BENU Gyógyszertárban`), közvetlen linkkel a `/gyogyszertarak` felületre.
       - **Nem elérhető:** Szürke/piros készletjelvény mutatja a készlettel nem rendelkező patikák számát (pl. `208 gyógyszertárban`).

5. **Közeli Gyógyszertár Helyi Készletblokk (`KÖZELI GYÓGYSZERTÁR`):**
   - Nagybetűs kékesszürke címkével (`KÖZELI GYÓGYSZERTÁR`) megjelölt kiemelt blokk.
   - **Ha a felhasználónak van kijelölt közeli patikája:**
     - A 4 szintű készletstátusz jelvény (`Készleten`, `Korlátozottan`, `Rendelésre (1-2 munkanap)`, `Nem elérhető`).
     - A kijelölt preferált patika hivatalos megnevezése (pl. *„BENU Gyógyszertár Budapest Corvin”*).
     - **Interaktív Modál Megnyitás:** A patika nevére kattintva helyben felugrik a **Gyógyszertár Részletek Modális Ablak (`PharmacyDetailModal`)**, ahol a felhasználó az adatlap elhagyása nélkül áttekintheti a patika heti nyitvatartási rendjét, pontos címét és elérhetőségeit.
   - **Ha nincs kijelölt közeli patika:**
     - Dőlt betűs tájékoztató szöveg: *„Nincs beállítva közeli gyógyszertár.”*
     - Közvetlen link: *„Gyógyszertár kiválasztása”* hivatkozás a `/gyogyszertarak` keresőoldalra.

6. **Termékjellemzők és Árak 3 Oszlopos Rács:**
   - A profilkártya alsó részén vízszintes szürke választóvonal alatt elhelyezkedő háromhasábos strukturált információs mátrix:
     - **1. oszlop – Gyártási és Kiszerelési Adatok:**
       - `FORGALMAZÓ / GYÁRTÓ`: A forgalomba hozatali engedély jogosultjának és a gyártó üzemnek a megnevezése (pl. `KRKA, d.d., Novo mesto (Szlovénia)`).
       - `KISZERELÉS MÉRETE`: A gyógyszer formai és csomagolási adatai (pl. `90x - buborékcsomagolásban`).
     - **2. oszlop – Finanszírozási és Ekvivalencia Adatok:**
       - `TÁMOGATÁSI KATEGÓRIA`: A Nemzeti Egészségbiztosítási Alapkezelő (NEAK) által nyújtott társadalombiztosítási támogatás mértéke (pl. `Kiemelt támogatásban részesülő (55%)`, `Normatív támogatás (25%)` vagy `Nem támogatott`).
       - `EKVIVALENCIA CSOPORT`: Orvosszakmai helyettesíthetőségi csoportbesorolás:
         - *„Helyettesíthető bázisgyógyszer”*: Amennyiben a készítmény hatóanyaga (INN) alapján elérhető egyenértékű bioekvivalens alternatíva.
         - *„Referencia készítmény”*: Originális innovatív készítmény vagy referencia-alapú gyógyszer.
     - **3. oszlop – Fogyasztói és Térítési Árak:**
       - `PUBLIKUS FOGYASZTÓI ÁR`: A készítmény hivatalos bruttó kiskereskedelmi fogyasztói ára, megnövelt (20px) betűmérettel és kiemelt magenta színnel (`#b1174e`) megjelenítve (pl. `4 825 Ft`).
       - `TÉRÍTÉSI DÍJ (BECSÜLT)`: A támogatás levonása után a beteg által ténylegesen fizetendő, becsült térítési díj sötétkék vastag betűkkel kiemelve (pl. `2 171 Ft`).

7. **Helyettesíthetőség és Terápiás Alternatívák (`SimilarMedicines`):**
   - Az adatlapon a fő termékkártya alatt elhelyezkedő különálló szekció, amely az azonos hatóanyagú (INN), jelenleg piacilag `Elérhető` készítményeket listázza ki.
   - Asztali nézetben 6 oszlopos táblázatban jelenik meg: *Kereskedelmi név*, *Kiszerelés*, *Gyártó*, *Státusz*, *Közeli patika készlet*, *Műveletek* (Mentés, Értesítés, Részletek link).
   - Mobil nézetben (<1024px) automatikusan kártyás listává alakul át, teljes szélességű érintőgombokkal.

8. **Státuszváltozási Előzmények és Adatbázis-lekérdezési Időbélyeg (`MedicineStatusHistory`):**
   - Fehér hátterű kártya *„Státusz változások”* fejlécfelirattal.
   - Időrendi lista a gyógyszer korábbi készlet- és forgalmazási állapotváltozásairól (dátum és státuszjelvény: `Elérhető`, `Hiány`, `Megszűnt`), legfelül a legfrissebb állapottal.
   - **Alsó Lábléc (Footer sáv):**
     - A kártya legalsó élén elhelyezett diszkrét szürke sáv (`bg-slate-50 border-t border-[#e7e8ec]`).
     - Bal oldalon: *„Utolsó lekérdezés orvosi adatbázisból:”* felirat.
     - Jobb oldalon: Kiemelt sötétkék vastag betűs időbélyeg formátumban: `{dátum}` (pl. `2026.10.21 00:35` vagy `2026.09.04 12:00`), amely hitelesíti a gyógyszeradatok frissességét.

#### 4.2.2.6. Desktop vs. Mobil Felületi Eltérések a Gyógyszer Adatlapon

| Funkció / Képernyőelem | Asztali / Laptop Nézet (≥1024px) | Mobil Nézet (<1024px) |
| :--- | :--- | :--- |
| **Kártya Elrendezés és Margók** | Kényelmes, nagyméretű 32px belső margó; többhasábos vízszintes információs blokkok. | Kompakt 16px belső margó a képernyőszélesség maximális kihasználásához; egymás alá rendeződő függőleges blokkok. |
| **Fejléc Akciógombok** | Jobb felső sarokba igazított gombok (Mentés, Értesítés kérése). | A gyógyszernév alatt automatikusan új sorba törő, kényelmes teljes szélességű gombsor. |
| **Készlethiány és Megszűnés Bannerek** | Készlethiánynál 3 oszlopos (Kezdet, Vége, Indoklás), Megszűnésnél 2 oszlopos (Ideje, Megszűnés oka) strukturált adatelrendezés. | Egymás alá törő kártyasor, kiemelt vastag betűs olvashatósággal. |
| **Országos Hálózati Készletblokk (BENU)** | Vízszintes sorok státuszjelvénnyel és aláhúzott interaktív hivatkozással a patikakeresőre. | Teljes szélességű, nagy érintési felülettel ellátott linksor közvetlen hálózati patikanavigációval. |
| **Gyógyszertári Készletjelvények és Modál** | Szöveges leírás mellett elhelyezett státusz pill-ek; patikanévre kattintva felugró részletes nyitvatartási ablak. | Ujjbegyre optimalizált készletjelvények és modális nyitvatartás megnyitó linkek. |
| **Termékjellemzők és Árak Rács** | 3 oszlopos párhuzamos adatrács: 1. Forgalmazó és Kiszerelés, 2. Támogatási kategória és Ekvivalencia csoport, 3. Kiemelt Publikus ár és Térítési díj. | 1 oszlopos, egymás alá törő kártyablokkok jól elkülönülő címkékkel és nagyméretű kiemelt ármegjelenítéssel. |
| **Státuszváltozási Előzmények Lábléce** | Kétoldalra igazított lábléc (balra a leíró felirat, jobbra a vastag betűs orvosi adatbázis időbélyeg). | Kompakt elrendezés az orvosi adatbázis lekérdezési dátumának feltüntetésével. |
| **Helyettesítő Készítmények (SimilarMedicines)** | 6 oszlopos táblázat (Név, Kiszerelés, Gyártó, Státusz, Közeli Patika, Műveletek). | **Mobil Kártyás Lista:** Minden helyettesítő gyógyszer önálló kis kártyaként jelenik meg hatóanyaggal, készletjelvénnyel és egyérintéses Mentés/Értesítés/Részletek gombokkal. |

#### 4.2.3. Kedvenc-kezelési Munkafolyamat, Törlés-megerősítő Modál és Toast Visszavonás
A portál orvosi döntéstámogatásának egyik leggyakrabban használt funkciója a releváns gyógyszerek gyorselérése és készletváltozásaik figyelemmel kísérése. A rendszer a véletlen adatvesztés és értesítésvesztés elkerülése érdekében szigorúan szabályozott kétlépcsős védőmechanizmust alkalmaz.

1. **Gyógyszer Mentése a Kedvencek Közé:**
   - A táblázat műveleti oszlopában található csillag ikonra, a mobil gyógyszerkártya „Mentés” gombjára vagy az adatlap fejlécében található Mentés akciógombra kattintva a készítmény azonnal bekerül a helyileg tárolt kedvencek közé (`localStorage`).
   - A fejléc Mentett számláló jelvénye (badge) azonnal frissül és mutatja az új darabszámot.
2. **Készletértesítés Feliratkozás (Harang ikon) és Automatikus Mentés:**
   - Amennyiben az orvos feliratkozik egy termék készletváltozásaira (harang ikonra kattint a táblázatban, a kártyán vagy az adatlapon), a rendszer **automatikusan menti a gyógyszert a kedvencek közé is** (a csillag ikon is azonnal aktív, mentett állapotra vált), amennyiben korábban még nem szerepelt a mentettek között.
3. **Kedvenc Gyógyszer Eltávolítása és a Megerősítő Modális Védőablak (`FavoriteRemovalModal`):**
   - **A eset – Nincs aktív készletértesítés a gyógyszeren:** Ha a felhasználó egy olyan készítmény mentését vonja vissza (csillag ikonra kattintva), amelyre nem állított be értesítést, a gyógyszer azonnal kikerül a mentettek közül, és közvetlenül megjelenik a jobb alsó Toast értesítés (lásd 4. pont).
   - **B eset – Van aktív készletértesítés a gyógyszeren (Védelmi megerősítő mechanizmus):**
     - Mivel az értesítés feliratkozása a mentett állapothoz kapcsolódik, a mentés törlésekor a rendszer **nem távolítja el azonnal a tételt**, hanem a képernyő közepén felugrasztja a **Megerősítő Modális Ablakot (`FavoriteRemovalModal`)**.
     - **A modális ablak funkcionális felépítése:**
       - **Fejléc:** Figyelmeztető sárga/piros ikon és kiemelt figyelmeztető cím: *„Értesítés is megszűnik!”*
       - **Fő üzenet:** Kiemelt vastag figyelmeztetés: *„Ha kiveszi a mentett gyógyszerek közül a terméket, nem kap több értesítést!”*
       - **Kiegészítő kérdés:** *„Biztosan szeretné kivenni a mentett gyógyszerek közül és ezzel nem kap a termékről több értesítést sem?”*
       - **Műveleti gombok:**
         - **„Mégsem” gomb:** Kék színű, alapértelmezett billentyűzet-fókusszal ellátott elsődleges gomb. Rákattintva (vagy az ablak melletti elsötétített háttérre / backdrop-ra kattintva) a modál bezárul, a törlési folyamat megszakad; mind a mentett kedvenc állapot, mind a készletértesítési feliratkozás változatlanul aktív marad.
         - **„Igen, biztosan” gomb:** Figyelmeztető stílusú (piros hover kiemelésű) másodlagos gomb. Megnyomásakor a felhasználó kifejezetten megerősíti szándékát: a rendszer egyszerre törli a készítményt a mentett kedvencek közül (`removeFavorite`), visszavonja az aktív készletértesítést (`unsubscribe`), bezárja a modált, és elindítja a visszavonási Toast időablakot.
4. **Toast Értesítési Rendszer és „Visszavonom” (Undo) Funkció:**
   - **Elhelyezkedés:** A képernyő jobb alsó sarkában fixen rögzített (`fixed bottom-4 right-4`), a többi felületi réteg felett lebegő (`z-[100]`), árnyékolt információs kártya, amely elegáns jobbról becsúszó animációval jelenik meg.
   - **Megjelenített Adatok és Funkciók:**
     - **Információs piktogram:** Kék/sárga információs ikon.
     - **Kattintható Terméknév és Kiszerelés:** Szöveges visszajelzés: *„{Gyógyszernév} ({Kiszerelés}) eltávolítva a mentett gyógyszerek közül.”* A gyógyszer neve közvetlenül kattintható link, amellyel a felhasználó azonnal a készítmény részletes adatlapjára juthat.
     - **„Visszavonom” akciógomb:** Kiemelt gomb, amelyre kattintva a törlési művelet azonnal megsemmisül: a rendszer a gyógyszert haladéktalanul visszahelyezi a mentett kedvencek közé, a Toast pedig azonnal bezárul.
     - **Manuális Bezáró Gomb („X”):** A kártya jobb felső sarkában elhelyezett diszkrét bezáró gombbal a felhasználó azonnal eltüntetheti az értesítést, ha nem kíván élni a visszavonási lehetőséggel.
     - **Vizuális Visszaszámláló Csík (Progress Bar):** A kártya legalsó élén elhelyezett kék állapotjelző sáv, amely 10 másodperc (10 000 ms) alatt egyenletesen és folyamatosan nullára fogy. Amikor a csík lejár, a Toast automatikusan elhalványul és eltűnik a felületről.
     - **Többszörös törlés kezelése (Stacking):** Ha a felhasználó gyors egymásutánban több kedvencet töröl, a Toast kártyák egymás fölé rendeződve (oszlopban) jelennek meg, mindegyik önálló 10 másodperces időzítővel, egyedi gyógyszernévvel és saját „Visszavonom” gombbal.

#### 4.2.4. Bemenetek és Kimenetek
- **Bemenet:** Keresési karakterek beírása, szűrőpill-ek váltása, oszlopok áthúzása, könyvjelző/értesítés ikonok kattintása, mobil accordion szűrők és nézetváltó érintése, megerősítő modális ablak gombjainak megnyomása („Mégsem” / „Igen, biztosan”), Toast „Visszavonom” gombjára kattintás, adatlapon a „← Részletek” navigációs gomb megnyomása, országos BENU patikaszám linkre vagy a közeli patika nevére kattintás (modális ablak megnyitása).
- **Kimenet:** Valós idejű táblázatszűrés vagy kártyarács-frissülés, nézetváltás (grid/table), adatlap megnyitása, megerősítő modális ablak felugrása aktív értesítésnél, lebegő visszavonási Toast megjelenítése a jobb alsó sarokban dinamikus időcsíkkal, kedvenc és értesítési állapotok szinkronizált frissülése, könyvjelző számláló frissülése a fejlécben, adatlapon a hiány és megszűnt figyelmeztető dobozok dinamikus megjelenítése, 250 patikás országos hálózati készleteloszlás, 3 oszlopos termékjellemzők és árak megjelenítése, státusztörténet orvosi adatbázis időbélyegzője, dinamikus útvonalak automatikus átirányítása.

#### 4.2.5. Hibakezelés a Gyógyszer Modulban
- **Nincs találat a szűrésre:** A táblázatban és a kártyás nézetben is megjelenik a *"Nem található a keresésnek megfelelő gyógyszer"* felirat, valamint a *"Szűrők törlése"* akciógomb.
- **Érvénytelen TK-szám az adatlapon:** Ha az URL query paraméterben nem létező azonosító szerepel (`/gyogyszerek/adatlap?tk=...`), a rendszer strukturált információs hibaállapotot jelenít meg: *"Gyógyszer nem található"*, feltüntetve a hibás törzskönyvi számot és felkínálva a *"Vissza a gyógyszerek listájához"* gombot.
- **Régi vagy külső dinamikus útvonal használata (`/gyogyszerek/[...id]`):** Nem eredményez 404-es hibát vagy törött oldalt; a rendszer transzparens átirányítással közvetlenül a megfelelő lekérdezési paraméteres címre (`/gyogyszerek/adatlap?tk=...`) vezeti a felhasználót.
- **Véletlen kedvenc- és értesítéstörlés megelőzése:** Kétlépcsős védelmi ellenőrzés óvja meg az orvost a téves kattintásoktól: aktív értesítésnél a `FavoriteRemovalModal` megerősítés nélkül nem engedi a törlést, míg a lefutott törléseknél a 10 másodperces Toast „Visszavonom” gombja biztosít azonnali helyreállítást.

#### 4.2.6. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.2.1:** Az oszlopok Drag & Drop átrendezése azonnal működik és az új sorrend újratöltés után is megmarad.
- **AC-4.2.2:** A Műveletek oszlop vízszintes görgetés esetén is folyamatosan látható marad a monitor jobb szélén rögzítve.
- **AC-4.2.3:** Az adatlapon a preferált patika nevére kattintva a nyitvatartási modal helyben, oldalváltás nélkül megnyílik.
- **AC-4.2.4:** Készlethiány esetén az adatlapon a sárga figyelmeztető doboz hiánytalanul tartalmazza a hiány kezdetét, tervezett végét, a hivatalos indoklást és a szakmai pótlási javaslatot.
- **AC-4.2.5:** A gyógyszernyilvántartásban kizárólag OTC és vényköteles humán gyógyszerek szerepelnek; nem gyógyszer termékek státuszkövetése kizárt.
- **AC-4.2.6:** 1024px alatti képernyőszélesség esetén a gyógyszerek oldalon automatikusan a kártyás nézet jelenik meg, az Accordion szűrőpanel pedig egy érintéssel lenyitható és az aktív szűrők számát jelvénnyel mutatja.
- **AC-4.2.7:** A gyógyszerkártyán a „További adatok megjelenítése” gombra kattintva a másodlagos adatok (csomagolás, kiadhatóság, engedély dátuma) oldalváltás nélkül kibomlanak.
- **AC-4.2.8:** A gyógyszerkártya fejlécének jobb felső sarkában az utolsó adatmódosítás/szinkronizálás pontos dátuma és ideje (`Utolsó frissítés: ÉÉÉÉ-HH-NN ÓÓ:PP`, pl. `Utolsó frissítés: 2026-10-21 00:35`) konstans módon, a másodlagos adatok lenyitása nélkül is közvetlenül és folyamatosan olvasható, míg a termékazonosító (TK-szám) az elsődleges törzsadatok között kap helyet.
- **AC-4.2.9:** Mentett gyógyszer eltávolításakor a felület jobb alsó sarkában 10 másodpercig megjelenik a lebegő Toast értesítés folyamatosan fogyó vizuális visszaszámláló sávval (progress bar), közvetlen termékadatlap-linkkel és „Visszavonom” akciógombbal, amellyel a törlés azonnal visszafordítható.
- **AC-4.2.10:** Amennyiben a felhasználó olyan mentett gyógyszert próbál eltávolítani a kedvencek közül, amelyhez aktív készletértesítés (harang) tartozik, a rendszer kötelező megerősítő modális ablakot jelenít meg (*„Értesítés is megszűnik!”*). A „Mégsem” gomb megnyomásakor a művelet megszakad és mindkét állapot változatlan marad, míg az „Igen, biztosan” gomb választásakor mind a mentés, mind az értesítés törlődik, és felugrik a visszavonást biztosító Toast értesítés.
- **AC-4.2.11:** A „Szűrés és rendezés” Accordion szűrőpanel mind asztali (`≥1024px`), mind mobil nézetben elérhető a gyógyszerlista felett, egyetlen kattintással lenyitható és becsukható, aktív szűrés esetén dinamikusan jelzi a feltételek darabszámát (`X aktív szűrő`), és közvetlen „Szűrők törlése” egykattintásos alaphelyzetbe állító gombot biztosít.
- **AC-4.2.12:** A gyógyszertáblázat 15 oszlopából alapértelmezetten pontosan 7 aktív (`Dátum / idő`, `Státusz`, `Termék neve`, `Hatóanyag`, `Kiszerelés`, `TK szám`, `Műveletek`). Amennyiben a felhasználó rendelkezik kijelölt közeli patikával, a `Közeli patika` és a `Közeli patika frissítve` oszlopok automatikusan bekapcsolódnak és megjelennek a táblázatban.
- **AC-4.2.13:** A táblázat oszlopfejléceire kattintva a rendezés háromállapotú ciklust követ (1. kattintás: növekvő `▲` -> 2. kattintás: csökkenő `▼` -> 3. kattintás: alaphelyzet / rendezés törlése).
- **AC-4.2.14:** A gyógyszerkártya (`MedicineCard`) fejlécében a `NearbyPharmacyStockIndicator` megjeleníti a kijelölt közeli patika nevét, az elérhetőségi státuszjelvényt és a patikai adat frissítési idejét (`Frissítve: ÉÉÉÉ-HH-NN ÓÓ:PP`); a kártyarács nagy képernyőn (`≥1280px`) 3 oszlopos, közepes kijelzőn 2 oszlopos, mobilon 1 oszlopos elrendezésben jelenik meg.
- **AC-4.2.15:** A lapozó sávban elhelyezett legördülő találatszám-választó menüből kiválasztható a `10`, `20` (alapértelmezett), `50` vagy `100 találat / oldal` beállítás; a találatszám módosításakor a felület azonnal az 1. oldalra ugrik az új lapszámok szerint.
- **AC-4.2.16:** Megszűnt piaci státuszú gyógyszer adatlapján a hiánybanner helyett egy különálló halványpiros figyelmeztető kártya jelenik meg (*„Megszűnt termék”*), amely hiánytalanul feltünteti a készítmény megszűnésének pontos idejét (dátumát) és hivatalos szakmai okát (*„Forgalmazási engedély visszavonása / Forgalomból kivonva”*).
- **AC-4.2.17:** Az adatlapon a közeli patika szekció felett elhelyezkedő országos hálózati készletblokk (`BENU GYÓGYSZERTÁRAK`) a teljes hálózat 250 gyógyszertárára vetítve reprezentálja az aktuális készletmegoszlást (elérhető termékeknél `Készleten` és `Rendelésre [1-2 munkanap]`, hiánycikk vagy megszűnt termék esetén `Korlátozottan` és `Nem elérhető`), és a patikaszámra kattintva közvetlen hivatkozást biztosít a Gyógyszertárak keresőoldalra (`/gyogyszertarak`).
- **AC-4.2.18:** A termékjellemzők és árak 3 oszlopos elrendezésű rácsa hiánytalanul megjeleníti a `FORGALMAZÓ / GYÁRTÓ`, `KISZERELÉS MÉRETE`, `TÁMOGATÁSI KATEGÓRIA`, `EKVIVALENCIA CSOPORT` (*Helyettesíthető bázisgyógyszer* vagy *Referencia készítmény*), valamint a kiemelt magenta színű `PUBLIKUS FOGYASZTÓI ÁR` és sötétkék `TÉRÍTÉSI DÍJ (BECSÜLT)` mezőket.
- **AC-4.2.19:** A státuszváltozási előzmények kártya (`MedicineStatusHistory.tsx`) alsó szürke zárósávjában a rendszer állandó jelleggel feltünteti az *„Utolsó lekérdezés orvosi adatbázisból: {dátum}”* időbélyeget, igazolva az orvosi törzsadatok frissességét.
- **AC-4.2.20:** A korábbi vagy külső forrásból érkező dinamikus útvonalakat (`/gyogyszerek/[...id]`, pl. `/gyogyszerek/OGYI-T-8898/01`) a rendszer zökkenőmentesen és automatikusan átirányítja az új szabványos query paraméteres címre (`/gyogyszerek/adatlap?tk=...`).

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
   - **Asztali nézet (≥1024px):** Kétpaneles elrendezés: bal oldalon 476px széles gördülő sáv a patikák adataival (név, cím, mai nyitvatartási idősáv, 3 állapotú nyitvatartási státusz, távolság km-ben, „Többit mutasd” link, „Közelinek jelölöm +” / „✓ Közeli gyógyszertár” toggle akciógomb; a telefonszám és e-mail a felugró részletes adatlap modálban érhető el), a tartózkodási hely és a közeli patika kártyákkal a lista elején; jobb oldalon a teljes fennmaradó területet kitöltő OpenStreetMap térkép.
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
6. **Patikakártya Felépítése és 50 Elemes Találati Renderelési Korlát:**
   - **Kártyán megjelenő adatok:**
     - A patika neve aláhúzott kék hivatkozásként (rákattintva megnyitja a részletes modális adatlapot).
     - Pontos cím (irányítószám, település, utca, házszám).
     - Légvonalbeli távolság a tartózkodási helytől (vagy budapesti referencia-ponttól), pl. `~1.2 km`.
     - Aktuális napi nyitvatartási információ: a mai nap neve magyarul (pl. `Kedd:`), a mai nyitvatartási idősáv (pl. `08:00 - 18:00` vagy `Ma zárva`), mellette óra ikon.
     - **3 állapotú nyitvatartási státusz:**
       - `Nyitva` (zöld színnel, `#317907`): a gyógyszertár nyitva tart, és a zárásig több mint 60 perc van hátra.
       - `Hamarosan zár` (sárga/olíva színnel, `#7a6c21`): a gyógyszertár nyitva tart, de a napi zárási időpontig legfeljebb 60 perc van hátra.
       - `Zárva` (piros színnel, `#b1174e`): a gyógyszertár az adott időpontban zárva tart (nyitás előtt, zárás után, vagy heti zárva tartási napon).
     - **„Többit mutasd” részletező hivatkozás:** aláhúzott kék link a kártya alsó sávjában, amelyre kattintva felugrik a részletes adatlap modális ablak (`PharmacyDetailModal`).
     - **Preferált patika akciógomb (Kétállású Toggle):**
       - Alapállapotban: lekerekített halványzöld kapszula **„Közelinek jelölöm +”** felirattal és plusz (`+`) ikonnal.
       - Kijelölt állapotban: telt zöld kapszula **„✓ Közeli gyógyszertár”** felirattal és pipa (`check`) ikonnal.
       - Újabb kattintásra a kijelölés azonnal visszavonható (törlődik), a gomb pedig visszaáll az alapállapotba.
     - **Elérhetőségek elhelyezése:** A patika telefonszáma és e-mail címe közvetlenül nem szerepel a kártyán a vizuális tisztaság és ergonómia megőrzése érdekében; ezek a „Többit mutasd” linkre vagy a patikanévre kattintva felugró részletes modális ablakban érhetők el.
   - **Maximális Találati Renderelési Korlát (50 patika):**
     - A patikalista mind asztali sávban, mind a mobil alsó lapon a folyamatos gördülékenység és a böngésző DOM-terhelésének minimalizálása érdekében **egyszerre legfeljebb 50 patikakártyát renderel le** a térképen látható találatok közül (`visiblePharmacies.slice(0, 50)`).
     - Amennyiben a térképi látóterületen 50-nél több patika található (pl. országos nézetben), a fejléc számlálója a teljes látható darabszámot jelzi ki (pl. `248 BENU gyógyszertár a térképen`), az orvos a térkép zoomolásával, mozgatásával vagy szűrőkkel szűkítheti a listát.

#### 4.3.2. Preferált Gyógyszertár Kijelölése (Kétállású Toggle Funkció)
- Minden patikakártyán és a felugró részletes adatlap modális ablakban is megtalálható a kijelölő akciógomb.
- Alapállapotban a gombon a **„Közelinek jelölöm +”** felirat látható halványzöld háttérrel és hozzáadás ikonnal.
- Rákattintva a rendszer azonnal preferált státuszba lépteti a patikát:
  - A gomb felirata azonnal átvált: **„✓ Közeli gyógyszertár”** (telt zöld háttér, fehér pipa ikon).
  - A választott gyógyszertár azonnal, az oldal újratöltése nélkül megjelenik a felső navigációs fejléc állandó információs sávjában és az Irányítópulton is.
- **Kijelölés visszavonása (Toggle):** Amennyiben a felhasználó egy már kijelölt patika **„✓ Közeli gyógyszertár”** gombjára ismételten rákattint, a rendszer törli a kijelölést, a gomb visszavált a kiinduló „Közelinek jelölöm +” állapotba, a fejlécből és az Irányítópultról pedig eltávolításra kerül a patika.

#### 4.3.3. Részletes Gyógyszertár Adatlap Modál és Elérhetőségek (PharmacyDetailModal)
- A patika címére, aláhúzott nevére vagy a kártya alján lévő **„Többit mutasd”** linkre kattintva felugró modális ablak részletesen bemutatja a gyógyszertár teljes profilját a kereső elhagyása nélkül:
  - **Fejléc:** Gyógyszertár hivatalos neve, belső azonosítója (pl. `BF001`), kijelölt állapot esetén kiemelt „Közeli gyógyszertár” házikó jelvénnyel, valamint „Bezárás” (X) gombbal.
  - **3 állapotú nyitvatartási és státuszblokk:**
    - Színes státuszjelvény pulzáló ponttal: `Nyitva` (zöld jelvény), `Hamarosan zár` (sárga jelvény – a zárási idő előtt legfeljebb 60 perccel), vagy `Zárva` (piros jelvény).
    - Aktuális napi nyitvatartási idősáv (pl. `08:00 - 18:00` vagy `Ma zárva`).
  - **Pontos cím:** Irányítószám, település, utca, házszám térképjelölő ikonnal.
  - **Közvetlen Kapcsolattartási Elérhetőségek (kizárólag a modálban):**
    - **Telefonszám:** Közvetlenül hívható link formátumban (`tel:` hivatkozás, pl. `+36 1 234 5678`), amellyel mobilkészüléken egyetlen érintéssel közvetlen telefonhívás indítható a patikába.
    - **E-mail cím:** Közvetlenül kattintható levél hivatkozás (`mailto:` link, pl. `patika@benu.hu`), amely azonnal megnyitja az alapértelmezett levelezőprogramot.
  - **Heti Nyitvatartási Rend:**
    - Részletes táblázat Hétfőtől Vasárnapig a napi nyitási és zárási időpontokkal.
    - Az aktuális naptári nap automatikusan kiemelést kap diszkrét háttérszínnel és `Ma` jelvénnyel.
    - A heti pihenő- vagy zárva tartó napok dőlt betűs `ZÁRVA` felirattal jelennek meg.
  - **Lábléc Akciógombok:**
    - **„Mutasd térképen” gomb:** Térkép ikonnal ellátott akciógomb, amely bezárja a modális ablakot, a háttérben lévő OpenStreetMap térképet azonnal az adott gyógyszertár koordinátáira centrálja, és automatikusan kinyitja a patika térképi adatbuborékját (popup).
    - **„Közeli patikának jelölöm” / „Közeli jelölés eltávolítása” gomb:** A felugró ablakból helyben is elvégezhető vagy visszavonható a preferált patika kijelölése.
    - **„Bezárás” gomb:** Elrejti a modális ablakot (amely az Escape billentyű leütésére vagy a sötétített háttér kattintására is bezáródik).

#### 4.3.4. Mélylinkelés (Deep Linking) Támogatása
- Az oldal támogatja a közvetlen azonosítóval történő hivatkozást: `/gyogyszertarak?id=BF133`.
- Ilyen link megnyitásakor a térkép automatikusan a hivatkozott gyógyszertárra fókuszál (centrálás és zoom), a kártya kiemelést kap, és a nyitvatartási modal automatikusan felugrik.

#### 4.3.5. Bemenetek és Kimenetek
- **Bemenet:** Cím vagy település gépelése, nyitvatartási pill szűrők kattintása, "Keresés és szűrők" accordion gomb megnyomása, GPS gomb megnyomása, térkép görgetése/kattintása, Bottom Sheet fogantyú húzása/koppintása, `"Összes (n db)"` linkre kattintás, patikanév link vagy „Többit mutasd” link kattintása, „Közelinek jelölöm +” / „✓ Közeli gyógyszertár” toggle gomb megnyomása, modál „Mutasd térképen” gombjának megnyomása, telefonhívás (`tel:`) és e-mail küldés (`mailto:`) kezdeményezése a modálból.
- **Kimenet:** Szűrt patikalista legfeljebb 50 renderelt kártyával, térképi jelölők frissülése, preferált patika kétállású beállítása/törlése és globális szinkronizációja, dinamikus számláló felirat frissülése, térképi nézet visszaállítása országos méretre, keresősáv animált kinyitása/összecsukása, aktív szűrőszámláló badge kijelzése, 3 állapotú nyitvatartási jelvény (`Nyitva`, `Hamarosan zár`, `Zárva`), részletes adatlap modális ablak megjelenítése heti renddel és elérhetőségekkel, térkép közvetlen fókuszálása a modálból.

#### 4.3.6. Hibakezelés a Gyógyszertár Modulban
- **GPS helymeghatározás megtagadása:** Ha a felhasználó böngészőjében letiltja a helymeghatározást, a rendszer nem dob hibát, hanem diszkrét értesítést ad, és megtartja az alapértelmezett budapesti referencia-helyzetet.
- **Nincs patika a megadott szűrésre:** A lista helyén megjelenik az *"A megadott feltételekkel nem található gyógyszertár"* üzenet és a szűrők egykattintásos törlésének gombja.

#### 4.3.7. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.3.1:** A keresőmezőbe beírt településnévre (pl. "Szeged") a kártyalista és a térkép jelölői késlekedés nélkül kizárólag a szegedi patikákat jelenítik meg.
- **AC-4.3.2:** A patikakártyán és a részletes modális ablakban a "Közelinek jelölöm +" gombra kattintva a választott patika azonnal megkapja az aktív preferált státuszt ("✓ Közeli gyógyszertár"), és újratöltés nélkül megjelenik a fejlécben és az Irányítópulton is. Kijelölt állapotban a gombra történő újbóli kattintás törli a kijelölést, visszaállítva az alapállapotot és törölve a patikát a fejlécből és az Irányítópultról.
- **AC-4.3.3:** Mélylinkkel érkezve (`/gyogyszertarak?id=BF133`) a térkép automatikusan a megadott patikára fókuszál, és a heti nyitvatartási modal felugrik.
- **AC-4.3.4:** Mobil nézetben (<1024px) a gyógyszertár kereső fejlécében a nézetválasztó (`[Térkép | Osztott | Lista]`) közvetlenül a címsorral egy sorban helyezkedik el. A 'Lista' gombra kattintva a lista 100%-ban kitakarja a címsor alatti részt, a lista tetején kompakt gyorskeresővel és szűrőkapszulákkal. 'Osztott' állapotban a felület 50% térkép és 50% lista arányban oszlik meg a keresősáv alatt, 'Térkép' állapotban pedig a lap minimalizált (~92px) betekintő szintre csukódik. A fogantyú húzásával vagy a címsori vezérlővel a szintek szabadon válthatók. A tartózkodási hely és a közeli patika kártyák a lap görgethető listájának elején helyezkednek el, így lefelé görgetve elgördülnek a képernyőről, maximális helyet adva a patikáknak. A listában lévő patikára koppintva a térkép odaugrik a patika koordinátájára és kinyitja annak információs buborékját; térképi marker érintésekor pedig a lap automatikusan legalább 50%-ra nyílik.
- **AC-4.3.5:** A patikalista fejlécében a számláló kizárólag a térkép aktuális nézetében látható patikák számát jelzi ki (`"{X} BENU gyógyszertár a térképen"` formátumban zöld pont nélkül). Az `"Összes ({n} db)"` szöveges linkre kattintva a térkép nézete azonnal visszaáll a teljes országos nézetre.
- **AC-4.3.6:** A Gyógyszertár Kereső fejlécében a "Keresés és szűrők" gombra kattintva a keresőmező és a pill szűrők panelje animáltan összecsukható és kinyitható (accordion). Összecsukott állapotban a keresősáv nem foglal helyet a képernyőből (viewport). Ha legalább egy szűrési feltétel aktív (beírt keresőszöveg vagy bekapcsolt nyitvatartási pill), a gombon egy számláló jelvény (badge) jelzi az aktív szűrők darabszámát nyitott és csukott állapotban egyaránt. A szűrők törlésekor a jelvény automatikusan eltűnik.
- **AC-4.3.7:** A rendszer a patikák nyitvatartását a helyi idő és a napi nyitási-zárási idő alapján valós időben 3 állapotú státuszként kezeli és jelzi ki mind a patikakártyán, mind a felugró modális ablakban: `Nyitva` (zöld színnel), `Hamarosan zár` (sárga/olíva színnel – ha a zárás időpontjáig legfeljebb 60 perc van hátra), valamint `Zárva` (piros színnel).
- **AC-4.3.8:** A patikakártyán a részletező hivatkozás pontos felirata „Többit mutasd”. A patika telefonszáma és e-mail címe közvetlenül nem a kártyán, hanem a „Többit mutasd” linkre vagy a patikanévre kattintva felugró `PharmacyDetailModal` ablakban érhető el kattintható formátumban (`tel:`, `mailto:`). A modál tartalmaz egy „Mutasd térképen” akciógombot is, amely a felugró ablak bezárásával egyidejűleg a térképet közvetlenül az adott patikára centrálja és kinyitja annak jelölő popupját.
- **AC-4.3.9:** A patikalista mind asztali, mind mobil nézetben a térképi kivágatban látható patikák közül egyszerre legfeljebb 50 patikakártyát renderel le (`visiblePharmacies.slice(0, 50)`), miközben a lista fejlécében lévő számláló a teljes látható darabszámot jelzi ki.

#### 4.3.8. Desktop vs. Mobil Felületi Eltérések a Gyógyszertár Keresőben (Bottom Sheet)

| Funkció / Képernyőelem | Asztali / Laptop Nézet (≥1024px) | Mobil Nézet (<1024px) |
| :--- | :--- | :--- |
| **Képernyőelrendezés** | Bal oldalon 476px széles fix sáv (legfeljebb 50 patikakártyát renderelve), mellette a monitor teljes fennmaradó részét kitöltő nagy térkép. | Teljes képernyős térkép a háttérben, felette interaktív, érintéssel húzható **Bottom Sheet (alsó felhúzható lap)** legfeljebb 50 kártyával. |
| **Kereső és Szűrősáv Megjelenése** | A fejlécben accordionnal összecsukható/kinyitható sáv; aktív szűrők esetén a címsor gombján számláló jelvény (badge) jelzi a darabszámot, így összecsukva is biztosított a maximális térképi viewport. | A címsorban lévő gombbal bármikor összecsukható; alapértelmezetten csukott állapotban nyílik meg a mobil képernyőterület maximalizálására, aktív szűrő badge jelzéssel. |
| **Nézetvezérlő Lehetőségek** | Nincs szükség lapváltásra; a lista és a nagy térkép egymás mellett folyamatosan látható. | A címsorral egy sorban elhelyezett 3-állású **nézetválasztó gomb** (`[Térkép | Osztott | Lista]`): Lista nézetben a lista kitakarja a címsor alatti teljes területet (100% magasság beépített keresővel); Osztott nézetben 50/50 felosztás; Térkép módban betekintő lap (~92px). A lap alsó fogantyúja érintéses húzással is szinkronban vezérli az állapotokat. |
| **Információs Kártyák Elhelyezése** | A bal oldali sáv görgethető listájának elején, így kisebb monitorokon is elúsznak a patikák elől. | A Bottom Sheet görgethető listájának legtetején (nem sticky): lefelé görgetve elúsznak, így a teljes sheet-magasság a patikáké marad. |
| **Interakció és Térképszinkron** | Patikakártyára kattintva a jobb oldali térkép simán odagördül a markerre és kinyitja az adatbuborékot. | Az alsó kártyalistában koppintva a háttértérkép azonnal odaugrik; a térképi markerre koppintva a lap automatikusan Fél (~50%) magasságra ugrik és kijelöli a patikát. |
| **Preferált Patika Kijelölése** | A kártya jobb szélén lévő „Közelinek jelölöm +” kétállású toggle gomb (újrakattintva a „✓ Közeli gyógyszertár” gomb törli a kijelölést). | Ujjbegyre optimalizált nagyméretű érintőgomb a mobil kártya alsó részén kétállású toggle működéssel („Közelinek jelölöm +” / „✓ Közeli gyógyszertár”). |
| **Nyitvatartási Részletek és Elérhetőségek** | A „Többit mutasd” linkre vagy patikanévre kattintva felugró `PharmacyDetailModal`: 3 állapotú nyitvatartási jelvény, közvetlenül kattintható telefonszám (`tel:`) és e-mail cím (`mailto:`), heti táblázat és „Mutasd térképen” gomb. | Érintésre felugró, mobil képernyőre optimalizált részletes heti táblázat, 3 állapotú nyitvatartás, közvetlen egyérintéses telefonhívás (`tel:`) és e-mail indítás, valamint „Mutasd térképen” gomb. |

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

> [!NOTE]
> **Hatóköri Rendelkezés (Nem Fejlesztési Scope Nyilatkozat):**
> A végfelhasználók (orvosok, gyógyszerészek, adminisztrátorok) tényleges hitelesítése, a központi orvosi kamarai vagy intézményi azonosítás (Single Sign-On / SSO), a munkamenet-tokenek kiadása és a komplex többlépcsős biztonsági eljárások a megrendelő meglévő vagy külső orvosi azonosító infrastruktúrájának hatáskörébe tartoznak, így **nem képezik a közvetlen webes felületfejlesztési scope részét**.
>
> A prototípus és a jelen specifikáció a fenti külső integrációt modellezve egy **egyszerűsített, letisztult felhasználónév / jelszó alapú bejelentkezési felületet** biztosít a rendszer zárt funkcióinak (Irányítópult, Gyógyszer Nyilvántartás, Gyógyszertár Kereső, Adminisztráció) eléréséhez és bemutatásához. A háttérben a forráskódban a meglévő autentikációs segédfüggvények megőrzésre kerülnek a stabil prototípus-működés érdekében.

#### 4.5.1. Képernyőfelépítés és Felületi Elemek (Egyszerű Jelszavas Bejelentkezés)

A bejelentkezési oldal egy reszponzív, tiszta fehér hátterű munkafelület, melynek központi fókuszában a következők helyezkednek el:

1. **Fejléc Blokkolás:**
   - Képernyő közepére zárt hivatalos színes **BENU VÉNY** logó (`214x33px`).
   - Alatta 22px-es sötétkék félkövér alcím: **„Orvosoknak”**.
2. **Bejelentkezési Kártya:**
   - 479px maximális szélességű, `16px` saroklekerekítésű, finom szürke hátterű (`#F9F9FB`), szegéllyel ellátott központi panel.
3. **Nem Fejlesztési Scope Tájékoztató Jelvény (Banner):**
   - A kártya legfelső elemeként egy sárga/borostyán tónusú információs blokk (`#FFF8E6`, szegély: `#FFE082`), benne információs ikonnal és a következő szöveggel:  
     *„Tervezet – Jelenleg nem fejlesztési scope: A bejelentkezési és hitelesítési rendszer meglévő orvosi azonosítóból / SSO-ból érkezik. A prototípus az egyszerű felhasználónév és jelszó alapú bejelentkezési felületet szemlélteti.”*
4. **Kártya Címsor:**
   - 22px-es sötétkék (`#002664`) félkövér cím: **„Bejelentkezés”**.
5. **Értesítési és Visszajelző Sávok:**
   - Piros hibaüzenet doboz hibás adatok vagy hálózati probléma esetén (`#FEEAED`).
   - Zöld visszajelző doboz sikeres művelet esetén (`#E8F8E2`).
6. **Egyszerűsített Bejelentkezési Űrlap:**
   - Egymás alatt elhelyezkedő 56px magas beviteli mezők az azonosító és a jelszó rögzítésére.
   - Teljes szélességű, 56px magas, sötétkék (`#002664`) **„Bejelentkezés”** akciógomb jobbra mutató fehér nyíl ikonnal.
   - Balra zárt kék **„Elfelejtett jelszó”** szöveges hivatkozás, amely a `/forgot-password` útvonalra navigál.

#### 4.5.2. Beviteli Mezők Részletes Specifikációja

A bejelentkezési űrlapon kizárólag az alábbi két beviteli mező szerepel:

| Mező Megnevezése és Célja | Adattípus és Formátum | Konkrét Példaérték | Kötelezőség | Érvényességi Korlátok és Limitációk |
| :--- | :--- | :--- | :--- | :--- |
| **E-mail cím vagy felhasználónév:** A szakmai felhasználó vagy adminisztrátor fiókazonosítója. | Szöveges e-mail cím vagy alfanumerikus azonosító string. | `"demo@example.com"` | **Kötelező** | 56px magasság, szürke körvonal (`#D8D9E0`), fókuszban kék kiemelés. Nem lehet üres, minimum 3, maximum 100 karakter. |
| **Jelszó:** A fiókhoz tartozó titkos hitelesítési karaktersorozat. | Maszkolt jelszó string (pontokkal megjelenítve). | `"vény123"` | **Kötelező** | 56px magasság. Nem lehet üres, böngésző jelszókezelővel és vágólappal kompatibilis. Minimum 6, maximum 64 karakter. |

#### 4.5.3. Elfelejtett Jelszó Oldal

**Útvonal:** [https://bvo.uneb.hu/forgot-password](https://bvo.uneb.hu/forgot-password)

Amennyiben a felhasználó elfelejtette belépési jelszavát:
1. Az „Elfelejtett jelszó” linkre kattintva a jelszó-visszaállítási segédoldal nyílik meg.
2. A regisztrált e-mail cím megadása után a felület tájékoztatja az orvost a jelszó-helyreállítási folyamat lépéseiről.
3. A prototípus felületén tájékoztató doboz emlékezteti a tesztelőket a működő demó hozzáférési adatokra (`vény123`).
4. A felületről a „Vissza a bejelentkezéshez” gombbal közvetlenül visszatérhet a `/login` oldalra.

#### 4.5.4. Manuális Regisztrációs Igény és Kapcsolatfelvételi Folyamat

A zárt szakmai és jogszabályi megfelelőség miatt a portálon **nincs automatikus, önkiszolgáló regisztrációs felület**:
- **Kapcsolatfelvételi Igény:** Az új orvos vagy gyógyszerész a bejelentkezési környezetből elérhető kapcsolatfelvételi űrlapon keresztül jelzi regisztrációs szándékát.
- **Rögzítendő Adatok:** Teljes név, szakmai e-mail cím, telefonszám, orvosi/gyógyszerészi pecsétszám, szakterület / intézmény, adatkezelési szabályzat elfogadása.
- **Adminisztrátori Jóváhagyás:** A beküldött igényt a rendszer rögzíti, majd a rendszeradminisztrátor a hivatalos kamarai nyilvántartásban (pl. ENKK/OKFŐ) ellenőrzi az orvosi jogosultságot, és az Adminisztrációs modulban (`/admin/users`) manuálisan aktiválja a felhasználói fiókot.

#### 4.5.5. Bemenetek és Kimenetek

1. **Felhasználói Bemenetek:**
   - E-mail cím vagy felhasználónév beírása.
   - Jelszó beírása.
   - „Bejelentkezés” gombra kattintás vagy `Enter` billentyű lenyomása.
   - „Elfelejtett jelszó” hivatkozásra kattintás.
2. **Rendszer Kimenetek:**
   - **Sikeres bejelentkezés:** Betöltési animáció a gombon (*„Azonosítás...”*), a munkamenet inicializálása, majd azonnali átirányítás az Irányítópultra (`/dashboard`).
   - **Hibás adatok:** A beviteli mezők felett piros hibaüzenet sáv jelenik meg (*„Hibás e-mail cím vagy jelszó!”*), a jelszómező fókuszba kerül.
   - **Inaktív / Felfüggesztett fiók:** Piros hibaüzenet: *„A fiók felfüggesztésre került. Kérjük, keresse az adminisztrátort.”*
   - **Kötelező mező hiánya:** Böngésző natív validációs figyelmeztetése (*„Kérjük, töltse ki ezt a mezőt”*).

#### 4.5.6. Felhasználói Hibakezelés és Biztonsági Visszajelzések

- **Érvénytelen azonosítási adatok:** Amennyiben a megadott e-mail/felhasználónév vagy jelszó nem egyezik a nyilvántartott adatokkal, a rendszer nem fedi fel, hogy melyik adat volt hibás (biztonsági jó gyakorlat), hanem egységes hibaüzenetet ad:  
  `„Hibás e-mail cím vagy jelszó!”`
- **Felfüggesztett fiók:** Felfüggesztett vagy archivált státuszú fiók esetén (pl. teszt fiók: `teszt@example.com`) a rendszer a belépést azonnal megtagadja:  
  `„A fiók felfüggesztésre került. Kérjük, keresse az adminisztrátort.”`
- **Túlterhelés vagy hálózati kiesés:** Hálózati hiba esetén a rendszer diszkrét üzenettel tájékoztat:  
  `„Azonosítási hiba történt a belépés során. Kérjük, próbálja újra később!”`

#### 4.5.7. Desktop vs. Mobil Felületi Eltérések a Bejelentkezési Felületen

| Felületi Terület | Asztali Munkaállomás (≥1024px) | Mobil Érintőképernyő (<1024px) |
| :--- | :--- | :--- |
| **Kártya szélesség és margók** | Fix 479px szélesség, képernyő közepére zárt lebegő kártya, 24px belső margóval. | 100% szélesség (max. 479px), 16px oldalsó margók a képernyőszélekhez képest. |
| **Beviteli mezők és gombok** | Egérkattintásos fókusz, billentyűzet `Tab` és `Enter` navigáció. | 56px érintésbarát touch target, virtuális billentyűzet felugrásakor a kártya automatikusan a képernyő fókuszába görgül. |
| **Tájékoztató jelvény (Scope note)** | Kártyán belüli felső sáv 12px-es betűmérettel. | Automatikusan 3 sorba tördelődő, kompakt figyelmeztető doboz. |
| **Logó és fejléc** | `214x33px` logó, 22px-es alcím 24px-es alsó térközzel. | Kompaktabb elrendezés 16px-es térközzel a függőleges helytakarékosságért. |

#### 4.5.8. Elfogadási Kritériumok (Acceptance Criteria)

- **AC-4.5.1:** A bejelentkezési felületen kizárólag egyszerű felhasználónév/e-mail cím és jelszó beviteli mezők, valamint a Bejelentkezés gomb és az Elfelejtett jelszó link látható; semmilyen biometrikus Passkey vagy e-mail kódos fülválasztó nem jelenik meg.
- **AC-4.5.2:** A bejelentkezési kártya tetején jól láthatóan és folyamatosan megjelenik a sárga információs jelvény, amely egyértelműen rögzíti, hogy a bejelentkezési rendszer egy tervezet, és a tényleges orvosi autentikáció nem képezi a fejlesztési scope részét.
- **AC-4.5.3:** Érvényes szakmai felhasználói adatok (`demo@example.com` / `vény123`) vagy adminisztrátori adatok (`admin@example.com` / `vény123`) megadásakor a rendszer azonnal belépteti a felhasználót és közvetlenül a Dashboardra (`/dashboard`) navigál.
- **AC-4.5.4:** Inaktív vagy felfüggesztett fiókkal történő belépési kísérlet esetén (`teszt@example.com`) a rendszer a belépést megtagadja, és megjeleníti a felfüggesztésre figyelmeztető hibaüzenetet.
- **AC-4.5.5:** Az „Elfelejtett jelszó” linkre kattintva a rendszer a jelszó-helyreállító aloldalra (`/forgot-password`) irányít át.

---

### 4.6. Adminisztráció (Felhasználók és Gyógyszertárak Felügyelete)

Kizárólag `Admin` szerepkörű felhasználók számára engedélyezett, védett adminisztrációs modulcsoport.

> [!IMPORTANT]
> **Hozzáférés-védelem és Jogosultságkezelés:**
> Az `/admin/*` útvonalak közvetlen elérése szigorúan jogosultságfüggő:
> - Nem hitelesített (kijelentkezett) felhasználó kísérlete esetén a rendszer azonnal a bejelentkező felületre (`https://bvo.uneb.hu/login`) irányítja át a látogatót.
> - Normál szakmai felhasználó (`User` / Orvos) jogosulatlan belépési kísérlete esetén a rendszer megtagadja a hozzáférést és transzparensen visszairányítja a munkamenetet az Irányítópultra (`https://bvo.uneb.hu/dashboard`).

#### 4.6.1. Adminisztrációs Keretrendszer és Lapfül (Tab) Navigáció
**Elsődleges felületi keret:** `https://bvo.uneb.hu/admin/*`
- **Fejléc:**
  - Sötétkék címsorban adminisztrációs pajzs ikon (`admin_panel_settings`), **„Adminisztrációs felület”** főcím és *„Rendszerfelhasználók és gyógyszertárak kezelése”* funkcióleíró alcím.
- **Felső Lapfül (Tab) Navigációs Sáv:**
  - Kiemelt lapfül-struktúra a két fő adminisztrációs felületcsoport közötti azonnali navigációhoz:
    1. **„Felhasználók” lapfül:** Közvetlen hivatkozás a felhasználókezelő felületre (`/admin/users`). Automatikusan aktív állapotba kerül a `/admin/users` és az alapértelmezett `/admin` gyökérútvonal megnyitásakor.
    2. **„Gyógyszertárak” lapfül:** Közvetlen hivatkozás a gyógyszertár-felügyeleti modulra (`/admin/pharmacies`). Automatikusan aktív állapotba kerül az áttekintő lista (`/admin/pharmacies`) és bármely részletes gyógyszertári adatlap (`/admin/pharmacies/[id]`) böngészésekor.

#### 4.6.2. Felhasználókezelés (Felhasználók Listája és Műveletek)
**Útvonal:** [https://bvo.uneb.hu/admin/users](https://bvo.uneb.hu/admin/users)

- **Üzleti cél és folyamat:**
  A rendszer orvosi és adminisztrátori felhasználói fiókjainak központi adminisztrációja. Mivel a portál zártkörű és nem rendelkezik publikus önkiszolgáló regisztrációval, az új szakemberek manuális rögzítését (a kamarai pecsétszám ellenőrzése után), az adatok karbantartását, a jelszavak újraküldését és a biztonsági fiókkizárásokat az adminisztrátor innen vezérli.

- **Fejléc és Gyorsműveletek:**
  - Csoport ikonnal ellátott címsor: **„Felhasználók listája”**.
  - **„+ Új felhasználó” létrehozó gomb:** Kiemelt elsődleges gomb hozzáadás ikonnal (`person_add`). Rákattintva azonnal felugrik a felhasználókezelő modális ablak üres adatbeviteli űrlappal, alapértelmezetten `Orvos (User)` szerepkörrel és `Aktív` státusszal.

- **Felhasználói Adattáblázat:**
  Strukturált, sávos színezésű táblázat az alábbi oszlopokkal:
  1. **Név / Email:** Kétszintes cellaelrendezés: felül kiemelt félkövér teljes név (pl. `Dr. Kovács István`), alatta szürke kisméretű e-mail cím (pl. `demo@example.com`). Amennyiben a sor az éppen bejelentkezett adminisztrátor saját fiókja, a teljes sor diszkrét kék kiemelést kap.
  2. **Szerepkör:** Színkódolt azonosító jelvény: `Admin` (kiemelt másodlagos színnel) vagy `Orvos` (szürke jelvénnyel).
  3. **Státusz:** Állapotjelző jelvény: `Aktív` (zöld) vagy `Inaktív` (piros).
  4. **Szakterületek:** Az orvoshoz rendelt orvosi szakvizsgák címkéi. A felületi tisztaság érdekében az első 2 szakterület teljes névvel jelenik meg körvonalas jelvényként (pl. `Háziorvostan`, `Belgyógyászat`), míg 2-nél több szakterület esetén a többi tétel egy kompakt számláló jelvénybe tömörül (pl. `+3`).
  5. **Műveletek:** Jobbra zárt, függőleges hárompontos műveleti menügomb (`⋮`).

- **Műveleti Menü (`⋮`) és Végrehajtható Akciók:**
  A műveleti ikonra kattintva lenyíló lebegő gyorsmenü az alábbi opciókat biztosítja:
  1. **„Szerkesztés” (Kék szerkesztő ikon):** Megnyitja a felhasználó adatait tartalmazó 3 lapfüles szerkesztő modált.
  2. **„Új jelszó küldése” (Sárga kulcs ikon):**
     - Kiválasztásakor felugrik a **Megerősítés szükséges** modális ablak az alábbi kérdéssel:  
       *„Biztosan küldesz egy új jelszót {Felhasználó Neve} részére?”*
     - A megerősítő gombra kattintva a rendszer értesítési folyamatban új jelszót generál és küld a felhasználó elsődleges e-mail címére.
  3. **„Kijelentkeztetés” (Piros kijelentkezés ikon):**
     - Kényszerített munkamenet-lezárás (Force Logout). Megerősítő kérdés:  
       *„Biztosan ki szeretnéd jelentkeztetni {Felhasználó Neve} felhasználót minden eszközről?”*
     - Jóváhagyáskor a rendszer azonnal növeli a felhasználó munkamenet-verziószámát, aminek következtében a célfelhasználó következő kattintásakor a rendszer automatikusan kilépteti őt és a bejelentkező ablakot jeleníti meg.
  4. **„Deaktiválás” / „Aktiválás”:**
     - Dinamikusan a fiók aktuális státuszához igazodó funkció:
       - Aktív fiók esetén piros tiltás ikonnal ellátott **„Deaktiválás”** menüpont jelenik meg. Megerősítés után a felhasználó státusza `Inaktív` lesz és aktív munkamenetei azonnal megszakadnak (újabb belépése letiltva).
       - Inaktív fiók esetén zöld pipa ikonnal ellátott **„Aktiválás”** menüpont jelenik meg. Megerősítés után a felhasználó státusza `Aktív` lesz, így ismét bejelentkezhet.
     - **Admin önvédelmi korlát:** A bejelentkezett adminisztrátor a saját sora esetén **nem látja** a deaktiválási opciót, megelőzve az önkizárást.

#### 4.6.3. Felhasználó Létrehozó és Szerkesztő Modális Ablak (3 Lapfül)
A felhasználó hozzáadásakor vagy szerkesztésekor felugró, nagyméretű, 3 lapfülre tagolt modális párbeszédablak:

- **1. Lapfül: „Alapadatok”**
  - **Teljes név:** Kötelező szöveges beviteli mező (pl. `"Dr. Minta János"`).
  - **Email cím:** Kötelező e-mail formátumú beviteli mező (pl. `"minta.janos@korhaz.hu"`). Belépési felhasználónévként funkcionál.
  - **Szerepkör:** Legördülő menü választható opciókkal: `Orvos (User)` vagy `Adminisztrátor`.
  - **Státusz:** Legördülő menü választható opciókkal: `Aktív` vagy `Inaktív`.

- **2. Lapfül: „Profil & Szakterületek”**
  - **Másodlagos Email:** Opcionális e-mail mező személyes vagy alternatív értesítési cím megadására (pl. `"magan@orvos.hu"`).
  - **Szakterületek:** Görgethető keretben megjelenő kétoszlopos jelölőnégyzet (checkbox) lista az orvosi szakvizsgákból (pl. Aneszteziológia, Bőrgyógyászat, Belgyógyászat, Háziorvostan, Kardiológia, Neurológia, Onkológia, Ortopédia, Szemészet, Urológia). Az orvoshoz rendelt szakterületek egykattintásos bejelöléssel módosíthatók.

- **3. Lapfül: „Hírlevél beállítások”**
  - Két al-lapfülre osztott konfiguráció: **„Elsődleges Email”** és **„Másodlagos Email”**.
  - **Készletinfó Értesítési Szekció:**
    - Fő be/ki kapcsoló (toggle).
    - Bekapcsolt állapotban szerkeszthető paraméterek:
      - *Kiküldés ideje (óra):* numerikus mező (0–23).
      - *Rendszeresség:* legördülő választó (`Napi`, `Heti`, `Havi`).
      - *Követett Témák:* független kattintható címkegombok: `Újra elérhető`, `Készlethiány`, `Megszűnt`.
      - *Hatókör:* legördülő választó (`Minden`, `Szakterület + mentett gyógyszerek`, `Csak szakterület`, `Csak mentett gyógyszer`).

- **Modál Műveletek:**
  - *„Mégsem” gomb:* Bezárja az ablakot az adatok elvetésével.
  - *„Mentés” gomb:* Rögzíti az új felhasználót vagy a meglévő fiók módosításait, azonnal frissítve a táblázatot.

#### 4.6.4. Gyógyszertárak Karbantartása és Áttekintése (Listaoldal)
**Útvonal:** [https://bvo.uneb.hu/admin/pharmacies](https://bvo.uneb.hu/admin/pharmacies)

- **Üzleti cél és folyamat:**
  A hálózatban működő összes gyógyszertár adatkapcsolati állapotának, nyitvatartásának és szinkronizációs időbélyegeinek központi felügyelete.
  > [!NOTE]
  > **Központi Törzsadat-kezelés:**
  > A portálon **nincs patika-szerkesztő űrlap**, mivel a gyógyszertárak alapadatainak (cím, nyitvatartás, telefonszám) forrása a külső központi Patika Kezelő rendszer. A portál kizárólag felügyeleti és készletellenőrzési funkciókat lát el.

- **Fejléc és Gyorskereső:**
  - Cím és összesítő: **„Gyógyszertárak áttekintése”**, alatta a teljes patikaszám megjelenítésével (*„Összesen {X} gyógyszertár a rendszerben”*).
  - **Azonnali Keresőmező:** Kereső ikonnal és egykattintásos törlés (X) gombbal ellátott beviteli mező.
    - Keresési feltételek: patika neve, települése, címe, vagy egyedi BF azonosító kódja.
    - Szűrési visszajelzés: aktív szűrés esetén kék információs sáv mutatja a szűrt találatok darabszámát (*„{N} találat a keresésre: ...”*).

- **Gyógyszertárak Áttekintő Táblázata (8 Oszlop):**
  1. **BF kód:** Monospace kódkiemeléssel megjelenített belső azonosító (pl. `BF001`).
  2. **Név:** Gyógyszertár hivatalos elnevezése (pl. `BENU Gyógyszertár Arany Sas`).
  3. **Település:** Település megnevezése helyszín ikonnal (pl. `Budapest`).
  4. **Cím:** Irányítószám és utca, házszám (pl. `1052 Károly körút 1.`).
  5. **Nyitvatartás (ma):** Valós idejű 3 állapotú színkódolt státuszjelvény (`Nyitva` - zöld, `Hamarosan zár` - sárga, `Zárva` - piros), kiegészítve az aktuális napi nyitvatartási idősávval (pl. `08:00 - 19:00` vagy `Ma zárva`).
  6. **Utolsó adatszinkron:** Dátum és időbélyeg (`ÉÉÉÉ.HH.NN. ÓÓ:PP`), amely a patikai alapadatok utolsó frissülését igazolja.
  7. **Utolsó készletszinkron:** Dátum és időbélyeg (`ÉÉÉÉ.HH.NN. ÓÓ:PP`), amely a raktárkészlet utolsó LogiNet middleware szinkronizációját mutatja.
  8. **Művelet:** Jobbra zárt **„Részletek”** akciógomb szem ikonnal (`visibility`), amelyre kattintva megnyílik az adott gyógyszertár dedikált részletes admin adatlapja (`/admin/pharmacies/[id]`).

#### 4.6.5. Gyógyszertár Admin Részletes Adatlap
**Útvonal:** [https://bvo.uneb.hu/admin/pharmacies/[id]](https://bvo.uneb.hu/admin/pharmacies/[id]) (pl. `/admin/pharmacies/BF001`)

- **Üzleti cél és folyamat:**
  A kiválasztott gyógyszertár részletes profiljának, heti nyitvatartásának, pontos földrajzi koordinátáinak és szinkronizációs állapotának áttekintése, valamint a patika teljes, több száz tételes helyi termékkészletének oszloponkénti szűrése, rendezése és készletszintjeinek darabszámos ellenőrzése.

- **Visszanavigáció:**
  - Az oldal bal felső sarkában elhelyezett **„← Vissza a listához”** akciógomb, amely közvetlenül visszavezet a `/admin/pharmacies` gyógyszertárlistára.

- **Felső Információs Zóna (2/3 + 1/3 Elrendezés):**
  - **Bal Oldali Kártya: Gyógyszertár Alapadatok és Heti Nyitvatartás (2/3 szélesség):**
    - Fejléc: Patika neve gyógyszertár ikonnal, alatta monospace belső azonosító (`BF kód: BF001`), jobb felső sarokban a valós idejű 3 állapotú nyitvatartási jelvény (`Nyitva` / `Hamarosan zár` / `Zárva`).
    - *Elérhetőségek és Pozíció (bal oszlop):*
      - Cím: Irányítószám, település, közterület és házszám helyszín ikonnal.
      - Telefon: Helyi telefonszám (pl. `+36 1 234 5678`) telefon ikonnal.
      - Email: Hivatalos e-mail cím levél ikonnal.
      - **Földrajzi Koordináták:** Földgömb ikonnal és monospace szedéssel kiemelt pontos GPS koordináták 4 tizedesjegy pontossággal (pl. `47.4979, 19.0543`).
    - *Heti Nyitvatartási Rend (jobb oszlop):*
      - Hétfőtől Vasárnapig tételes naponkénti lista az adott nap nyitási és zárási idejével (pl. `Hétfő: 08:00 - 19:00`, `Vasárnap: Zárva`).
    - *Adatforrás Megjegyzés:* Kék információs doboz rögzíti: *„Az adatok szerkesztése a Patika Kezelő rendszerben történik. Itt csak áttekintő nézet érhető el.”*
  - **Jobb Oldali Kártya: Szinkronizációs Mérőszámok (1/3 szélesség):**
    - Fejléc: Szinkronizáció (`sync`) kártyacím.
    - 3 kiemelt információs blokk:
      1. **Utolsó adatszinkron:** Pontos másodperces időbélyeggel (`ÉÉÉÉ.HH.NN. ÓÓ:PP:MP`) a patikai alapadatok utolsó frissítéséről adatbázis ikonnal (`database`).
      2. **Utolsó készletszinkron:** Pontos másodperces időbélyeggel (`ÉÉÉÉ.HH.NN. ÓÓ:PP:MP`) a helyi készletadatok utolsó frissítéséről raktár ikonnal (`inventory_2`).
      3. **Készleten lévő termékek:** Kiemelt nagyméretű numerikus számláló (pl. **`100`**), alatta *„db különböző termék”* felirattal, amely a patikában nyilvántartott egyedi készítmények számát jelzi.

- **Alsó Képernyőblokk: 7 Oszlopos Termékkészlet Táblázat:**
  - **Fejléc:**
    - Cím: **„Termékkészlet”** raktár ikonnal és dinamikus tételszámláló jelvénnyel (amely az aktív szűrésnek megfelelő tételek darabszámát mutatja).
    - **„Szűrők törlése” gomb:** Amennyiben bármely oszlopszűrőben adat szerepel, azonnal megjelenik a szűrőtörlő gomb, amely egyetlen kattintással visszaállítja az alapállapotot.
  - **Oszlopstruktúra és Szűrősor:**
    A táblázat rögzített fejlécű (`table-pin-rows`), minden oszlopa fejléc-kattintással **kétirányúan rendezhető** (növekvő `arrow_upward` / csökkenő `arrow_downward`), alatta pedig dedikált, mezőspecifikus szűrősor helyezkedik el:
    1. **TK-szám:** Gyógyszer törzskönyvi száma (pl. `OGYI-T-8898/01`). Szöveges szűrőmezővel ellátva.
    2. **Megnevezés:** Készítmény kereskedelmi neve félkövér kiemeléssel (pl. `Algopyrin 500 mg tabletta`). Szöveges szűrőmezővel ellátva.
    3. **Hatóanyag (INN):** Nemzetközi szabadnév (pl. `metamizol-nátrium`). Szöveges szűrőmezővel ellátva.
    4. **Kiszerelés:** Csomagolási leírás (pl. `10x buborékcsomagolásban`). Szöveges szűrőmezővel ellátva.
    5. **Gyártó:** Termék gyártója vagy forgalmazója lebegő címmel ellátva. Szöveges szűrőmezővel ellátva.
    6. **Státusz:** Országos hatósági termékstátusz jelvénye (`Elérhető` - zöld, `Készlethiány` - sárga, `Megszűnt` - piros). **Legördülő szűrővel** választható opciók: `Mind`, `Elérhető`, `Készlethiány`, `Megszűnt`.
    7. **Készlet (db) (`dapieces`):** A gyógyszertárban fizikai polckészleten lévő darabszám, jobbra zárt monospace formázással és **3 szintű színkódolással**:
       - `0 db`: piros szöveg (`text-error`) – a termék kifogyott a patikában.
       - `1 – 9 db`: sárga szöveg (`text-warning`) – kritikus / alacsony készletszint.
       - `≥ 10 db`: zöld szöveg (`text-success`) – bőséges, stabil raktárkészlet.
       A darabszám oszlopfejlécére kattintva a lista növekvő vagy csökkenő darabszám szerint rendezhető.
  - **25 Elemes Lapozó (Pagination):**
    - A készletlista oldalanként fixen **25 terméket** jelenít meg a gördülékeny böngészés érdekében.
    - Bal oldalon tételinformáció látható: *„Összesen {X} termék ({mettől} - {meddig})”*.
    - Jobb oldalon lapozógombok találhatók: előző lap (`chevron_left`), közvetlen oldalszám-választók aktív oldal kiemeléssel, valamint következő lap (`chevron_right`).
    - Bármely oszlopszűrő módosítása esetén a lapozó automatikusan visszaugrik az 1. oldalra.

#### 4.6.6. Bemenetek és Kimenetek az Adminisztrációban
- **Bemenet:**
  - Admin lapfülre kattintás (`Felhasználók` / `Gyógyszertárak`).
  - „+ Új felhasználó” gomb megnyomása.
  - Műveleti menü (`⋮`) megnyitása és akció kiválasztása (`Szerkesztés`, `Új jelszó küldése`, `Kijelentkeztetés`, `Deaktiválás`, `Aktiválás`).
  - Felhasználói űrlap kitöltése (Név, E-mail, Szerepkör, Státusz, Másodlagos e-mail, Szakterület checkboxok, Készletértesítő toggle, időpont, gyakoriság, témák, hatókör).
  - Megerősítő modál gombjainak megnyomása (`Mégsem`, `Folytatás`).
  - Gyógyszertár keresőmezőbe gépelés, keresés törlése (X).
  - Patika táblázatban a „Részletek” gomb megnyomása.
  - Gyógyszertár adatlapon a „Vissza a listához” link kattintása.
  - Készlettáblázat oszlopfejléceinek kattintása (rendezés irányváltása), oszlopszűrőkbe gépelés, státusz legördülő választás, „Szűrők törlése” gomb kattintása, lapozógombok használata.
- **Kimenet:**
  - Lapfülek közötti váltás, megfelelő felület renderelése.
  - Felhasználó létrehozó/szerkesztő modál megjelenítése, mentés után táblázat azonnali frissülése.
  - Új jelszó generálása és mock kiküldése e-mailben.
  - Kijelentkeztetéskor munkamenet azonnali terminálása.
  - Fiók státuszváltása (`Aktív` ↔ `Inaktív`), belépési engedély módosulása.
  - Szűrt gyógyszertárlista megjelenítése találati számláló sávval.
  - Dedikált gyógyszertári adatlap nyitása GPS koordinátákkal, heti renddel, szinkronizációs adatokkal és készlettel.
  - Rendezett és oszloponként szűrt 7 oszlopos termékkészlet táblázat 25-ös lapozással, színkódolt darabszámokkal.

#### 4.6.7. Felhasználói Hibakezelés az Adminisztrációban
- **Jogosulatlan hozzáférés:** Ha szakmai felhasználó (`User`) kísérel meg belépni bármely `/admin/*` felületre, a rendszer azonnal átirányítja az Irányítópultra (`https://bvo.uneb.hu/dashboard`). Nem bejelentkezett látogató a `/login` oldalra kerül.
- **Kötelező mezők hiánya új felhasználó felvitelekor:** A Teljes név és az E-mail cím kitöltése kötelező. Kitöltetlen mező esetén a böngésző natív validációs figyelmeztetést ad és a mentés nem fut le.
- **Admin önkizárásának védelme:** Az adminisztrátor nem deaktiválhatja a saját fiókját a felületen.
- **Nem létező gyógyszertár azonosító (`/admin/pharmacies/[id]`):** Ha az URL-ben megadott BF kód nem található az adatbázisban, a rendszer *"Gyógyszertár nem található"* hibaüzenetet és piros figyelmeztető ikont jelenít meg, a keresett BF kód kiírásával és egykattintásos *"Vissza a listához"* navigációs gombbal.
- **Nincs találat a szűrésekre:**
  - Gyógyszertárlistánál: *"Nincs találat"* információs üzenet.
  - Készlettáblázatnál: *"Nincs a szűrőknek megfelelő termék"* információs sor, mellette a *"Szűrők törlése"* gomb megjelenésével.

#### 4.6.8. Desktop vs. Mobil Felületi Eltérések az Adminisztrációban

| Funkció / Képernyőelem | Asztali / Laptop Nézet (≥1024px) | Mobil Nézet (<1024px) |
| :--- | :--- | :--- |
| **Admin Keret és Tabok** | Tágas konténer (max. 1440px), jól látható lifted lapfülekkel. | Teljes képernyőszélességű kompakt tabok, ujjbeggyel érinthető lapfülváltókkal. |
| **Felhasználók Táblázata** | Teljes szélességű táblázat, minden oszlop (Név, Szerepkör, Státusz, Szakterületek, Műveletek) egyben áttekinthető. | Vízszintesen gördíthető táblázat, a műveleti menü (`⋮`) könnyen elérhető lebegő felugró panellel. |
| **Gyógyszertár Kereső és Lista** | Keresőmező a fejléc jobb szélén egymás mellett, 8 oszlopos táblázat azonnali adatszinkron oszlopokkal. | Keresőmező a fejléc alá tördelve 100% szélességben, vízszintesen lapozható áttekintő táblázat. |
| **Gyógyszertár Részletes Nézet** | 2/3 (Alapadatok + Nyitvatartás) és 1/3 (Szinkronizációs mérőszámok) egymás melletti kétoszlopos rács. | Egymás alá rendezett (1 oszlopos) kártyák: felül az alapadatok és GPS pozíció, alatta a heti rend, majd a szinkronizációs kártya. |
| **7 Oszlopos Készlettáblázat** | Teljes oszloprács fejlécek alatti szűrőmezőkkel, oszlopfejléc rendezési ikonokkal és 25-ös lapozóval. | Érintéssel vízszintesen gördíthető készlettáblázat rögzített fejléc-sorral, kompakt beviteli szűrőkkel és ujjbarát lapozógombokkal. |

#### 4.6.9. Elfogadási Kritériumok (Acceptance Criteria)
- **AC-4.6.1:** Normál szakmai felhasználó (`User`) nem érheti el az `/admin/*` útvonalakat; jogosulatlan próbálkozás esetén a rendszer visszairányítja a Dashboardra (`https://bvo.uneb.hu/dashboard`). Kijelentkezett látogató a `/login` oldalra kerül.
- **AC-4.6.2:** Az adminisztrációs felület tetején megjelenő lapfülekkel (`Felhasználók` / `Gyógyszertárak`) a felhasználó azonnal és hibamentesen tud váltani a `/admin/users` és `/admin/pharmacies` oldalak között.
- **AC-4.6.3:** A `/admin/users` oldalon elhelyezett „+ Új felhasználó” gombra kattintva felugrik a felhasználókezelő modál, amelyen az Alapadatok, Profil és Hírlevél lapfüleken keresztül új orvos rögzíthető a rendszerben.
- **AC-4.6.4:** A felhasználói lista műveleti menüjében (`⋮`) az „Új jelszó küldése” gombra kattintva megerősítő modális ablak jelenik meg a felhasználó nevével, amelynek jóváhagyásakor a rendszer kiküldi a helyreállító jelszót.
- **AC-4.6.5:** A felhasználói lista műveleti menüjében a „Kijelentkeztetés” (Force Logout) funkció megerősítésekor a célfelhasználó aktív munkamenete azonnal érvénytelenítésre kerül, így a következő interakciókor megjelenik számára a bejelentkező felület.
- **AC-4.6.6:** Az adminisztrátor nem deaktiválhatja a saját fiókját; a saját sora esetén a műveleti menüben a Deaktiválás opció nem jelenik meg.
- **AC-4.6.7:** A `/admin/pharmacies` listaoldalon a keresőmezőbe beírt településnév, patikanév, cím vagy BF kód alapján a táblázat valós időben szűrődik és tájékoztató sáv jelzi a találatok darabszámát.
- **AC-4.6.8:** A gyógyszertárak táblázatában a „Részletek” gombra kattintva megnyílik az adott patika részletes admin adatlapja (`/admin/pharmacies/[id]`), amely feltünteti a patika nevét, BF kódját, címét, elérhetőségeit, 4 tizedesjegy pontosságú GPS koordinátáit, heti nyitvatartási rendjét és a 3 állapotú napi nyitvatartási státuszt.
- **AC-4.6.9:** A gyógyszertár részletes adatlapon a szinkronizációs blokk másodperces pontossággal megjeleníti az Utolsó adatszinkron és Utolsó készletszinkron időpontját, valamint a készleten lévő egyedi termékek darabszámát.
- **AC-4.6.10:** A gyógyszertár részletes adatlapon megjelenő 7 oszlopos Termékkészlet táblázat minden oszlopa (TK-szám, Megnevezés, Hatóanyag, Kiszerelés, Gyártó, Státusz, Készlet db) fejlécre kattintva növekvő és csökkenő irányban rendezhető, oszloponként szűrhető, a készletdarabszám (`dapieces`) pedig színkóddal jelzi a készletszintet (0 db: piros, 1–9 db: sárga, ≥10 db: zöld). A táblázat oldalanként 25 tételt jelenít meg működő lapozóval és szűrőtörlő gombbal.
- **AC-4.6.11:** Érvénytelen patikaazonosító (`/admin/pharmacies/[nem_létező_id]`) megnyitásakor a rendszer nem omlik össze, hanem „Gyógyszertár nem található” figyelmeztetést és „Vissza a listához” gombot jelenít meg.

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
8. **Biometrikus Passkey és E-mail Kódos (Magic Code) Bejelentkezés:**
   - *Státusz:* Külső rendszerbe átsorolva / Nem fejlesztési scope.
   - *Részletek:* A beléptetés és jogosultságkezelés a megrendelő meglévő központi azonosítási rendszerében (külső Identity Provider / orvosi SSO) valósul meg. A portál webes felületén nem készül egyedi biometrikus Passkey vagy Magic code hitelesítési mechanizmus; a prototípus és a specifikáció az egyszerűsített felhasználónév / jelszó alapú bejelentkezési felületre szűkül le.

---

## 6. Tesztfiókok és Hozzáférések

A működő prototípus élő kipróbálására szolgáló tesztfiókok a [https://bvo.uneb.hu/login](https://bvo.uneb.hu/login) oldalon.

> **Egységes jelszó minden tesztfiókhoz:** `vény123`  
> *(Egyszerű felhasználónév/jelszó bejelentkezés a prototípusban)*

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
| **v1.16.0** | 2026.10.21. | Funkcionális Bővítés & Ergonómiai Javítás | **Irányítópult Közeli gyógyszertár választás teljes körű funkcionális megerősítése (4.1):**<br>• **Közvetlen Gyorskereső mező lebegő autocompleter panellel (`PharmacyStockWidget`):** A kártya fejlécében közvetlen gyorskereső mező került kialakításra patikanév, település vagy cím szerinti kereséshez. Gépelés közben lebegő találati panel nyílik meg, ahonnan a felhasználó egyetlen kattintással kiválaszthatja a preferált patikát.<br>• **Interaktív térképi funkciók és részletes adatlap:** A térképi markerekre kattintva felugró kártyán a kétállású *„Közelinek jelölöm”* funkciógomb garantáltan működik, a patikanévre vagy a *„Többit mutasd”* linkre kattintva pedig helyben megnyílik a patika részletes heti adatlapja (modális ablakban) nyitvatartással és elérhetőségekkel.<br>• **Preferált állapot módosítása és törlése a Dashboardról:** Kijelölt patika esetén a készletösszesítő kártyán közvetlen **„Másik patika választása”** és **„Kijelölés törlése”** műveleti linkek állnak rendelkezésre, így a preferált patika a Dashboard elhagyása nélkül bármikor módosítható vagy törölhető.<br>• **Technológiai semlegesség:** A specifikáció szövegéből eltávolításra kerültek a konkrét külső könyvtárnevek (OpenStreetMap, Leaflet), rögzítve, hogy a térképtechnológia kiválasztása a fejlesztőpartner hatásköre.<br>• Új és frissített elfogadási kritériumok (AC-4.1.3, AC-4.1.4, AC-4.1.9). |
| **v1.15.0** | 2026.10.21. | Funkcionális Tisztítás & Scope Pontosítás | **Bejelentkezési felület átalakítása egyszerű felhasználónév/jelszó bejelentkezésre és az autentikációs rendszer fejlesztési hatókörön kívüli (out of scope) rögzítése (4.5):**<br>• **Egyszerűsített felhasználónév/jelszó felület (`/login`):** A korábbi 3 lapfüles (Jelszó, Passkey, Magic Code) összetett bejelentkezési választó kivezetésre került a felületről. A bejelentkezési kártya letisztult, 2 mezős (E-mail cím vagy felhasználónév, Jelszó) űrlappá alakult át 56px-es beviteli mezőkkel, „Bejelentkezés” akciógombbal és „Elfelejtett jelszó” hivatkozással.<br>• **Nem fejlesztési scope hivatalos nyilatkozat és felületi jelvény:** Rögzítésre került a specifikációban és a bejelentkezési kártya fejlécében elhelyezett sárga tájékoztató jelvényben, hogy a felhasználói azonosítás, beléptetés és SSO kezelés meglévő külső orvosi azonosító infrastruktúrából érkezik, így az autentikációs háttérrendszer nem képezi a közvetlen fejlesztési scope részét.<br>• **Részletes beviteli mező és folyamatspecifikáció:** Teljes körű mezőtáblázat rögzítése adatformátumokkal, kötelezőséggel és validációval; bemenetek és kimenetek, valamint felhasználói hibakezelési forgatókönyvek specifikálása.<br>• **Desktop vs. Mobil felületi összehasonlító táblázat:** Érintőképernyős (56px touch target, viewport fókusz) és asztali (billentyűzet navigáció) felületi különbségek rögzítése.<br>• **Korábban tervezett funkciók (5. fejezet) bővítése:** A biometrikus Passkey és Magic code belépési mechanizmusok áthelyezése az 5. fejezetbe (külső rendszerbe átsorolt funkciók).<br>• Új és frissített elfogadási kritériumok (AC-4.5.1 – AC-4.5.5). |
| **v1.14.0** | 2026.10.21. | Funkcionális Bővítés & Pontosítás | **Adminisztráció (/admin/users, /admin/pharmacies, /admin/pharmacies/[id]) modulok teljes körű specifikációja a prototípus működése alapján (4.6):**<br>• **Felső lapfül (Tab) navigációs keretrendszer (`admin/layout.tsx`):** Felső tab-navigáció rögzítése a `Felhasználók` (`/admin/users`) és a `Gyógyszertárak` (`/admin/pharmacies`) felületek közötti azonnali váltáshoz, adminisztrációs jogosultság-ellenőrzéssel.<br>• **Felhasználókezelés új funkciói (`/admin/users`):** Specifikálásra került a fejlécben elhelyezett kiemelt **„+ Új felhasználó”** létrehozó gomb (3 lapfüles felugró űrlappal), valamint a műveleti menü (`⋮`) **„Új jelszó küldése”** (`reset-pw`) funkciója megerősítő modális ablakkal, a kényszerített munkamenet-bontás (Force Logout), valamint az adminisztrátori önkizárás védelme.<br>• **Gyógyszertár Admin Részletes Adatlap (`/admin/pharmacies/[id]`):** A listaoldalról a *„Részletek”* gombbal megnyíló dedikált admin adatlap specifikálása: patika alapadatok, 4 tizedesjegy pontosságú GPS koordináták, heti nyitvatartási rend és valós idejű 3 állapotú nyitvatartási jelvény; Szinkronizációs mérőszám-kártya (`Utolsó adatszinkron`, `Utolsó készletszinkron` másodperces pontossággal és `Készleten lévő termékek` száma); valamint **7 oszlopos, oszloponként szűrhető és kétirányúan rendezhető Termékkészlet táblázat** 25-ös lapozóval, szűrőtörlő gombbal és **3 szintű színkódolt darabszámmal** (`dapieces`: 0 db piros, 1–9 db sárga, ≥10 db zöld).<br>• Új és frissített elfogadási kritériumok (AC-4.6.1 – AC-4.6.11). |
| **v1.13.0** | 2026.10.21. | Funkcionális Pontosítás | **Gyógyszertár Kereső (/gyogyszertarak, PharmacyFinder, PharmacyCard, PharmacyDetailModal) teljes körű pontosítása a prototípus működése alapján (4.3):**<br>• **3 állapotú nyitvatartási státusz (`pharmacy-utils.ts`):** Rögzítésre került a valós idejű, 3 állapotú nyitvatartási logikát követő státuszjelzés a patikakártyán és a modálban: `Nyitva` (zöld), **`Hamarosan zár`** (sárga/olíva – a napi zárás előtt legfeljebb 60 perccel), valamint `Zárva` (piros).<br>• **Patikakártya feliratok és funkciók (`PharmacyCard.tsx`):** A kártyán a részletező link pontos felirata **„Többit mutasd”**; a preferált patika kijelölő gomb kétállású kapcsolóként (toggle) működik: alapállapotban **„Közelinek jelölöm +”** (halványzöld), aktív állapotban **„✓ Közeli gyógyszertár”** (sötétzöld), amelyre ismételten rákattintva a kijelölés azonnal törlődik.<br>• **Részletes adatlap modál és elérhetőségek (`PharmacyDetailModal.tsx`):** Tisztázásra került, hogy a patika telefonszáma és e-mail címe a zsúfoltság elkerülése érdekében nem a kártyán, hanem a felugró modális ablakban érhető el közvetlenül kattintható (`tel:`, `mailto:`) formában, a modál láblécében pedig helyet kapott a **„Mutasd térképen”** akciógomb is (amely a modál bezárása mellett közvetlenül a patikára centrálja a térképet és kinyitja az adatbuborékot).<br>• **50 elemes renderelési korlát:** A patikalista a gördülékeny felületi teljesítmény megőrzése érdekében egyszerre legfeljebb 50 patikakártyát renderel le a térképen látható találatokból (`visiblePharmacies.slice(0, 50)`).<br>• Új és frissített elfogadási kritériumok (AC-4.3.2, AC-4.3.7, AC-4.3.8, AC-4.3.9). |
| **v1.12.0** | 2026.10.21. | Funkcionális Pontosítás | **Gyógyszer Részletes Adatlap (/gyogyszerek/adatlap és /gyogyszerek/[...id]) teljes körű pontosítása a prototípus működése alapján (4.2.2):**<br>• **Megszűnt termék figyelmeztető doboz:** `Megszűnt` piaci státusz esetén a sárga hiánybanner helyett egy halványpiros figyelmeztető kártya jelenik meg (*„Megszűnt termék”*), amely 2 oszlopos strukturált elrendezésben feltünteti a termék megszűnésének pontos idejét és hivatalos szabályozói okát (*„Forgalmazási engedély visszavonása / Forgalomból kivonva”*).<br>• **Országos hálózati készletblokk (`BENU GYÓGYSZERTÁRAK`):** A közeli patika szekció felett elhelyezkedő új hálózati készletblokk rögzítése, amely a teljes hálózat 250 BENU gyógyszertárára vetítve mutatja a megoszlást (elérhető terméknél `Készleten` és `Rendelésre [1-2 munkanap]`, hiánycikk vagy megszűnt terméknél `Korlátozottan` és `Nem elérhető`), közvetlen kattintható továbbnavigációval a gyógyszertárkeresőre (`/gyogyszertarak`).<br>• **Termékjellemzők és Árak 3 oszlopos rács:** A termékprofil kártya alsó sávjának specifikálása a `FORGALMAZÓ / GYÁRTÓ`, `KISZERELÉS MÉRETE`, `TÁMOGATÁSI KATEGÓRIA`, **`EKVIVALENCIA CSOPORT`** (*„Helyettesíthető bázisgyógyszer”* / *„Referencia készítmény”*), kiemelt magenta `PUBLIKUS FOGYASZTÓI ÁR` és sötétkék **`TÉRÍTÉSI DÍJ (BECSÜLT)`** mezőkkel.<br>• **Státuszváltozási előzmények lábléce (`MedicineStatusHistory.tsx`):** A státusztörténeti napló alsó szürke zárósávjában rögzítésre került az *„Utolsó lekérdezés orvosi adatbázisból: {dátum}”* időbélyeg megjelenítése.<br>• **Visszafelé kompatibilis dinamikus útvonalátirányítás:** A korábbi vagy külső `/gyogyszerek/[...id]` útvonalkérések automatikus és transzparens átirányításának rögzítése az új lekérdezési paraméteres `/gyogyszerek/adatlap?tk=...` formátumra.<br>• Új elfogadási kritériumok (AC-4.2.16 – AC-4.2.20). |
| **v1.11.0** | 2026.10.21. | Funkcionális Pontosítás | **Gyógyszer Nyilvántartás (/gyogyszerek) és kártyás megjelenítés részletes pontosítása a prototípus alapján (4.2):**<br>• **Accordion szűrőpanel asztali nézetben is:** A *„Szűrés és rendezés”* accordion panel nemcsak mobilon (<1024px), hanem asztali nézetben is elérhető a táblázat felett, dinamikus aktív szűrőszámlálóval és egykattintásos szűrőtörléssel.<br>• **Automatikus oszlopmegjelenítés patikaválasztáskor:** Amennyiben a felhasználó rendelkezik kijelölt közeli patikával, a táblázatban automatikusan bekapcsolódik és megjelenik a `Közeli patika` (elérhetőség) és a `Közeli patika frissítve` (időbélyeg) oszlop.<br>• **Alapértelmezett oszlopok és 3-állapotú rendezés:** A 15 törzskönyvi oszlopból alapértelmezetten pontosan 7 aktív (`Dátum / idő`, `Státusz`, `Termék neve`, `Hatóanyag`, `Kiszerelés`, `TK szám`, `Műveletek`). Az oszlopfejlécekre kattintva a rendezés háromállapotú ciklust követ (növekvő `▲` -> csökkenő `▼` -> alaphelyzet).<br>• **Kártyás nézet (`MedicineCard`) közeli patika kijelzése és rácselrendezése:** A kártya fejlécében a `NearbyPharmacyStockIndicator` megjeleníti a kijelölt közeli patika nevét, elérhetőségi jelvényét és a helyi készletadat frissítési idejét (`Frissítve: ÉÉÉÉ-HH-NN ÓÓ:PP`). Nagy képernyőn (≥1280px) 3 oszlopos kártyarács (`xl:grid-cols-3`) jelenik meg.<br>• **Oldalankénti találatszám választó:** A lapozó sávban elhelyezett legördülő menüből választható `10`, `20` (alapértelmezett), `50` vagy `100 találat / oldal` érték.<br>• Új és frissített elfogadási kritériumok (AC-4.2.11 – AC-4.2.15). |
| **v1.10.0** | 2026.10.21. | Funkcionális Pontosítás | **Irányítópult (Dashboard) működésének teljes körű pontosítása a prototípus és tervek alapján (4.1):**<br>• **Nincs kijelölt patika állapot (`PharmacyStockWidget`):** A korábbi statikus térkép-illusztráció leírás helyett rögzítésre került, hogy a felületen teljes értékű interaktív OpenStreetMap térkép (`PharmacyMap`) működik BENU jelölőkkel, ahol a felugró patikakártyáról helyben, az oldal elhagyása nélkül kijelölhető a közeli patika, alatta közvetlen „Tovább a gyógyszertárkeresőre →” továbbnavigáló hivatkozással (`/gyogyszertarak`).<br>• **Kijelölt preferált patika állapot (`PharmacyStockWidget`):** A korábbi általános nyitvatartási leírás helyett specifikálásra került a patika nevével és az adott periódussal ellátott, 2 mutatóból (*„elfogyott”* és *„újra elérhető”*) álló sárga összesítő kártya (`StockNotificationCard`) és a patika saját 20 tételes készletváltozási listája (`StockChangesWidget`).<br>• **„Összes változás” navigációs gyorslinkek:** Rögzítésre került a globális (`/gyogyszerek?sort=lastUpdate&order=desc`) és a patikai (`/gyogyszerek?nearbyOnly=true&sort=lastUpdate&order=desc`) készletváltozási kártyák alsó láblécében elhelyezkedő továbbnavigáló hivatkozások pontos funkcionális viselkedése és céloldalai.<br>• **Időszak-választó kapszula dropdown (`PeriodSelector`):** Gombok sora helyett lekerekített kapszula formájú legördülő menüként (dropdown) történő pontosítás (1, 3, 7, 30 nap), azonnali URL paraméter szinkronizációval (`?period=X`).<br>• Frissített és új elfogadási kritériumok (AC-4.1.1 – AC-4.1.8). |
| **v1.9.0** | 2026.10.21. | Funkcionális Pontosítás & Védőmechanizmusok | **Globális Lábléc, Toast Undo rendszer és Értesítésmegszűnési megerősítő modál specifikálása:**<br>• **Globális Lábléc (Footer):** Minden bejelentkezett oldalon az oldal alján megjelenő sötétkék (`#002664`) zárósáv rögzítése a hivatalos szerzői jogi nyilatkozattal (*„Minden jog fenntartva. © 2026 BENU Magyarország Zrt”*), verziószámmal (`v6.1.0`), valamint készítői megjelöléssel (*„Created by:”*) és Color and Code logóval (4.0.2 és AC-4.0.6).<br>• **Toast értesítési rendszer és „Visszavonom” (Undo) funkció:** Kedvenc gyógyszer eltávolításakor a jobb alsó sarokban megjelenő, 10 másodperces vizuális visszaszámláló csíkkal (progress bar) ellátott lebegő Toast specifikálása kattintható gyógyszernévvel és azonnali egykattintásos visszaállítást biztosító „Visszavonom” gombbal (2.13, 4.2.3 és AC-4.2.9).<br>• **Értesítésmegszűnési megerősítő modális ablak (`FavoriteRemovalModal`):** Védőmechanizmus specifikálása azon esetekre, amikor az orvos olyan gyógyszert kísérel meg törölni a mentettek közül, amelyhez aktív készletértesítés (harang) tartozik. Figyelmeztető dialógus (*„Értesítés is megszűnik!”*) fókuszált „Mégsem” és megerősítő „Igen, biztosan” opciókkal, a feliratkozás és kedvenc állapot együttes törlésével (2.4, 4.2.3 és AC-4.2.10). |
| **v1.8.2** | 2026.10.21. | Termékkártya Ergonómia | **Gyógyszer termékkártya fejléc és adatelrendezés optimalizálása:**<br>• A gyógyszerkereső oldal kártyás nézetében (`MedicineCard`) az **Utolsó frissítés** dátuma és időpontja (pl. `Utolsó frissítés: 2026-10-21 00:35`) a kártya jobb felső sarkába került, így közvetlenül a kártya fejlécében, a státuszjelvény mellett biztosít állandó, kiemelt olvashatóságot.<br>• A korábban jobb felül lévő törzskönyvi azonosító (`Azonosító:` / `tkSzam`) lekerült az elsődleges törzsadatok közé (a Hatóanyag, Kiszerelés és Gyártó mezők mellé).<br>• Frissített elfogadási kritérium: AC-4.2.8. |
| **v1.8.1** | 2026.10.20. | Ergonómiai Optimalizálás | **Dashboard készletváltozási lista kétszintes kompakt optimalizálása:**<br>• A korábbi merev 3 oszlopos táblázat (amelyben a hosszú terméknevek lebegve csonkán, 20-30 karakter után levágódtak) felváltása modern kétszintes kártyasorokkal a `StockChangesWidget` komponensben.<br>• **Felső szint (1. sor):** A terméknév a teljes rendelkezésre álló kártyaszélességet (több mint 500px) megkapja, intelligens legfeljebb 2 soros szövegtördeléssel (`line-clamp-2`), közvetlen kattintható linkkel az adatlapra és lebegő címmel (`title`).<br>• **Alsó szint (2. sor):** Letisztult, szuper kompakt metainfó sáv bal oldalon az országos státuszjelvénnyel (`Elérhető`, `Hiány`, `Megszűnt`), jobb oldalon a pontos időbélyeggel.<br>• A merev táblázatfejléc elhagyásával ~42px függőleges hely takarítható meg, a sorok pedig diszkrét hover kiemelést kaptak a könnyebb pásztázásért.<br>• Új elfogadási kritérium (AC-4.1.5). |
| **v1.8.0** | 2026.10.20. | Mobil Nézet és Helyszíni Vizit Támogatás | **Teljes körű reszponzív és mobil ergonómiai optimalizálás:**<br>• Új koncepció bevezetése (1.9. fejezet): Asztali/laptop fókuszú rendelői környezet mellett a helyszíni orvosi betegvizit (ambuláns használat) teljes körű támogatása.<br>• **Gyógyszerkereső mobil nézet (<1024px):** Automatikus átváltás ergonomikus gyógyszerkártyákra (`MedicineCard`), kétállású kézi Nézetváltó gomb (`Kártyák` / `Táblázat`), lenyitható egyérintéses **Accordion szűrőpanel** beépített rendezési opciókkal, aktív szűrőszámláló jelvénnyel és egykattintásos szűrőtörléssel.<br>• **Gyógyszertár Kereső Címsori Nézetválasztó, Összecsukható Kereső és Bottom Sheet:** Mobilon (<1024px) a 3-állású nézetválasztó (`[Térkép | Osztott | Lista]`) közvetlenül a címsorral egy sorban helyezkedik el. A „Lista” elemre kattintva a lista felülete kitakarja a címsor alatti teljes részt (100% képernyőkitöltés a térkép és szűrősáv felett, beépített in-sheet gyorskeresővel és gyorsszűrőkkel), míg az „Osztott” (50/50) és „Térkép” (92px peek) állapotok megőrzik a térkép interaktív elérését. A címsorban helyet kapott az **összecsukható kereső és szűrőpanel (Accordion)** gombja, amely aktív szűrés esetén számláló jelvénnyel (badge) jelzi a feltételek darabszámát nyitott és csukott állapotban is. A patikalistában a számláló dinamikusan a térképen látható patikákat jelzi (`"{X} BENU gyógyszertár a térképen"`), mellette tiszta szöveges linkkel (`Összes ({n} db)`). A tartózkodási hely és a közeli patika kártyák a lap görgethető listájának elejére kerültek (nem sticky), így lefelé görgetve elúsznak és a teljes sheet-magasság a patikakártyáké marad.<br>• **Mobil Navigáció és Keresés:** Hamburger menübe integrált „Mentett gyógyszerek” számlálóval, azonnali közeli patika adatkijelzés és módosítási akciógomb, valamint teljes képernyős keresőfelület (Mobil Kereső Overlay).<br>• **Helyettesítő gyógyszerek:** Az adatlapon mobil nézetben a helyettesítő készítmények táblázata automatikusan kártyás listává alakul át.<br>• Részletes **Desktop vs. Mobil összehasonlító táblázatok** elhelyezése minden érintett felületi modulban (4.0.5, 4.2.1.4, 4.2.2.6, 4.3.8) és új elfogadási kritériumok (AC-4.2.6, AC-4.2.7, AC-4.3.4, AC-4.3.5, AC-4.3.6). |
| **v1.7.0** | 2026.10.20. | Hatókör Tisztítás (Scope Alignment) | **Közösségi funkciók és Képzési program teljes kivezetése a funkcionális specifikációból:**<br>• A dokumentáció teljes mértékben szinkronba került a prototípus aktív fejlesztési scope-jával; a felületen csak koncepciótervként létező funkciók (Közösségi fórum, képzések listája és LMS integráció, admin moderáció) kivezetésre kerültek a specifikációból.<br>• Az adatmodellek (3. fejezet) és a funkcionális modulok (4. fejezet) újraszámozása (4.4 Globális Keresés, 4.5 Hitelesítés, 4.6 Adminisztráció, 4.7 Profil).<br>• Az Elfogadási Kritériumok (AC) frissítése és beépített újraszámozása a funkcionális modulokban.<br>• Profil és admin felületi hírlevél/értesítési beállítások szűkítése a valós készletértesítési funkcionalitásra. |
| **v1.6.1** | 2026.10.20. | Funkcionális Hatókör & Irányelvek Pontosítása | **Gyógyszer státuszkövetés, WCAG és böngésző title követelmények rögzítése:**<br>• Rögzítésre került, hogy a portál gyógyszerkészlet- és hiánystátuszkövetési funkciói kizárólag a humán gyógyszerek két csoportjára korlátozódnak: **OTC (vény nélkül kapható)** és **vényköteles (Rx)** készítmények; egyéb nem gyógyszer cikkek (étrend-kiegészítők, kozmetikumok, tápszerek, gyógyászati segédeszközök) státuszai kívül esnek a hatókörön.<br>• **WCAG 2.2 irányelvek:** Törekedni kell az alapvető sztenderdek betartására, de zárt szakmai rendszer lévén és a nem akadályoztatott orvosi célcsoport miatt nem követelmény a maximális szintű megfelelőség.<br>• **Technikai SEO és lapfül title formátum:** Zárt rendszer lévén klasszikus SEO elvárások nincsenek, de a böngészést segítő lapfülcím kötelezően a `"{lap neve} \| BENUvény Orvosi Portál"` formátumban kell megjelenjen (új 1.8 fejezet és AC-4.0.5). |
| **v1.6.0** | 2026.10.19. | Átfogó Revízió & FRS Bővítés | **Prototípus működés szerinti teljes körű funkcionális szinkronizáció és követelménybővítés:**<br>• Minden fő funkcionális modul kiegészítése strukturált **Bemenetek és Kimenetek**, felhasználói szintű **Hibakezelés** és pontosan ellenőrizhető **Elfogadási Kritériumok (Acceptance Criteria - AC)** fejezetekkel a globális követelményszabályoknak megfelelően.<br>• A 4 szintű készletstátusz (`Készleten`, `Korlátozottan`, `Rendelésre (1-2 munkanap)`, `Nem elérhető`) és a hozzá tartozó hálózati / helyi felületi megjelenítés megerősítése.<br>• A Gyógyszertárak modul SubHeader keresőjének, pill szűrőinek (`Most nyitva`, `Hétvégén nyitva`, `0-24`), GPS helymeghatározó paneljének, valamint a heti nyitvatartási modal és mélylinkelés (`/gyogyszertarak?id=...`) leírásának véglegesítése.<br>• A fejléc Mentett gyorslista "Összes" gombjának navigációs viselkedése (`onlyFavorites=true` szinkron) a gyógyszerlista oldallal.<br>• Manuális regisztrációs kapcsolatfelvételi űrlap, 2FA és passkey biztonsági folyamatok pontosítása. |
| **v1.5.1** | 2026.09.08. | Módosítás | **Gyógyszerlista táblázat fluid (teljes képernyőszélességű) elrendezése:**<br>• A gyógyszerek oldal és az adatáblázat fix maximális szélességi korlátja (1440px) feloldásra került; a felület dinamikusan kitölti a teljes képernyőszélességet.<br>• Nagyobb monitorokon jelentősen javult az adatok átláthatósága és olvashatósága, minimalizálva a vízszintes görgetés szükségességét.<br>• Frissítésre került a 4.2.1. pont (Fluid elrendezés). |
| **v1.4.1** | 2026.08.24. | Kiegészítés | **Manuális felhasználói regisztráció és kapcsolatfelvételi űrlap rögzítése:**<br>• Tisztázásra került, hogy a felhasználók regisztrációja kézzel (manuálisan) történik az adminisztrátor által.<br>• Az új szakmai felhasználó a bejelentkezési felületről elérhető űrlapon veszi fel a kapcsolatot az adminisztrációval (pecsétszám, szakterület megadásával).<br>• Új adatmodell (3.6) és új funkcionális leírás (4.6.4), elvetett funkciók (5.9) és Változásnapló (7) bevezetése. |

<!-- DOKUMENTUM VÉGE -->
