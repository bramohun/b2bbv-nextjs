# Konszolidált Funkcionális Specifikáció

> **Generálva:** 2026-02-16  
> **Verzió:** 2.0  
> **Forrás:** A kódbázis `FUNKCIONÁLIS SPECIFIKÁCIÓ` kommentjeiből  
> **Cél:** Pályázati / tender anyagok, illetve átfogó rendszerdokumentáció alapjául szolgáló dokumentum.

---

## Tartalomjegyzék

1. [Rendszer áttekintés](#1-rendszer-áttekintés)
2. [Modul specifikációk](#2-modul-specifikációk)
   - 2.1. [Irányítópult (Dashboard)](#21-irányítópult-dashboard)
   - 2.2. [Gyógyszer Nyilvántartás](#22-gyógyszer-nyilvántartás)
   - 2.3. [Gyógyszertár Kereső](#23-gyógyszertár-kereső)
   - 2.4. [Közösségi Fórum](#24-közösségi-fórum)
   - 2.5. [Globális Keresés](#25-globális-keresés)
   - 2.6. [Hitelesítés (Autentikáció)](#26-hitelesítés-autentikáció)
   - 2.7. [Adminisztráció](#27-adminisztráció)
   - 2.8. [Felhasználói Profil és Beállítások](#28-felhasználói-profil-és-beállítások)
3. [Specifikációk (Context Működés)](#3-specifikációk-context-működés)
   - 3.1. [Kedvencek Kezelése (FavoriteContext)](#31-kedvencek-kezelése-favoritecontext)
   - 3.2. [Közeli Gyógyszertár Kezelése (NearbyPharmacyContext)](#32-közeli-gyógyszertár-kezelése-nearbypharmacycontext)
   - 3.3. [Értesítés Kezelése (NotificationContext)](#33-értesítés-kezelése-notificationcontext)
   - 3.4. [Toast Üzenetek (ToastContext)](#34-toast-üzenetek-toastcontext)

---

## 1. Rendszer áttekintés

A rendszer egy orvosi portál alkalmazás, amely a következő fő modulokból áll:

| Modul | Leírás |
|---|---|
| **Irányítópult** | Aggregált nézet a készletváltozásokról, közeli patika állapotáról és közösségi aktivitásról |
| **Gyógyszer Nyilvántartás** | Gyógyszerek keresése, szűrése, részletes adatlap, kedvencek és értesítések kezelése |
| **Gyógyszertár Kereső** | Térképes és listás gyógyszertár kereső, „Közeli patika" funkció |
| **Közösségi Fórum** | Szakmai témák, hozzászólások, reakciók |
| **Globális Keresés** | Egységes keresés gyógyszerek, gyógyszertárak és fórum témák között |
| **Hitelesítés** | Bejelentkezés, elfelejtett jelszó, munkamenet kezelés |
| **Adminisztráció** | Felhasználók, fórum moderálás, gyógyszertárak kezelése (admin jogosultsággal) |
| **Felhasználói Profil** | Profiladatok, szakterületek, hírlevél beállítások, kedvencek és értesítések kezelése |

**Technológiai háttér:** Next.js (App Router), React (Server/Client Components), Tailwind CSS + DaisyUI, Leaflet (térkép), localStorage (kliens oldali perzisztencia), Context API (globális állapotkezelés).

---

## 2. Modul specifikációk

---

### 2.1. Irányítópult (Dashboard)


#### User Story
Felhasználóként egy gyors áttekintést szeretnék kapni a rendszer legfontosabb adatairól: készletváltozások, közeli patika készletadatok, és a legfrissebb közösségi aktivitás. Az irányítópult összesíti a legfontosabb információkat egyetlen nézetben.

#### Funkciók
- Összesített nézet három widgettel:
  - **Készletváltozások Widget** (StockChangesWidget)
  - **Közeli Patika Készlet Widget** (PharmacyStockWidget)
  - **Közösségi Aktivitás Widget** (CommunityActivityWidget)
- Időszak szűrő a megjelenített adatokhoz.
- A widgetek a fő oldalakra vezető linkeket tartalmaznak.

---

#### 2.1.1. Készletváltozások Widget (StockChangesWidget)


##### User Story
Felhasználóként szeretném látni, hogy az általam figyelt időszakban milyen készletváltozások történtek (megszűnés, készlethiány, elérhetőség), és gyorsan el szeretnék jutni a részletekhez.

##### Funkciók
- Összesítő statisztikák megjelenítése (Megszűnt, Készlethiány, Elérhető darabszámok).
- Az egyes státuszokra kattintva a gyógyszerlistára navigálás a megfelelő szűrőkkel.
- Időszak-szűrt lista a legfrissebb készletváltozásokról (max. 20 elem).
- A lista elemei linkelnek a termék adatlapokra.

##### Működési logika
- A widget a kapott gyógyszerlistát szűri a kiválasztott időszak (`period`) alapján.
- A `lastUpdate` mező alapján dönti el, hogy egy gyógyszer beleesik-e az időszakba.
- Kattintható statisztikák, amelyek URL paraméterekkel (`status`, `lastUpdate_from`) szűrik a gyógyszer listát.

---

#### 2.1.2. Közeli Patika Készlet Widget (PharmacyStockWidget)


##### User Story
Felhasználóként szeretném látni a beállított közeli patikám készletváltozásait, vagy ha nincs beállítva, egy térképet a kiválasztáshoz.

##### Funkciók
- **Ha van beállított közeli patika:**
  - Összesítő statisztikák (Készleten, Nem elérhető darabszámok) a közeli patikára vonatkozóan.
  - Az egyes státuszokra kattintva a gyógyszerlistára navigálás, szűrve a közeli patika elérhetőségre (`nearbyOnly=true` és `nearbyPharmacyStock`).
  - Legfrissebb készletváltozások listája a kiválasztott patikában (max. 10 elem), Státusz, Név, Dátum oszlopokkal.
  - „Összes gyógyszertári változás" link, amely a `nearbyPharmacyLastUpdate` szerint rendezett listára visz.
- **Ha nincs beállított közeli patika:**
  - Térképes nézet megjelenítése.
  - Felkérés a közeli patika beállítására.

##### Működési logika
- A `NearbyPharmacyContext`-ből olvassa a beállított patikát.
- Az `isAvailableInPharmacy` mock függvénnyel szimulálja a készletinformációt.
- A `getNearbyPharmacyStatusUpdate` függvénnyel generálja az utolsó frissítés időpontját.

---

#### 2.1.3. Közösségi Aktivitás Widget (CommunityActivityWidget)


##### User Story
Felhasználóként szeretném látni a legfrissebb fórum aktivitásokat, hogy könnyen kapcsolódhassak a szakmai beszélgetésekhez.

##### Funkciók
- **Összesített változásszám:** A beállított időszak összes aktivitása (új bejegyzések + új kommentek) kiemelten megjelenítve.
- **Statisztikai bontás:** Új bejegyzések és új kommentek száma külön-külön.
- Legfrissebb fórum témák megjelenítése (cím, szerző, hozzászólás szám, dátum).
- Kattintásra navigálás a téma részletes oldalára.
- „Tovább a Közösség oldalra" link a fő fórum oldalra.

---

### 2.2. Gyógyszer Nyilvántartás

---

#### 2.2.1. Gyógyszer Lista Oldal


##### User Story
Felhasználóként egy központi áttekintő felületen szeretném böngészni az összes nyilvántartott gyógyszert, amelyet hatékony kereséssel, szűréssel, rendezéssel és testreszabható nézettel használhatok.

##### Funkciók
- **Keresés:** Szabad szöveges keresés név, TK-szám, hatóanyag, ATC-kód és gyártó alapján.
- **Szűrés státusz alapján:** Elérhető / Készlethiány / Megszűnt.
- **Szűrés közeli patika elérhetőség alapján:** Csak a közeli patikában elérhető / nem elérhető termékek.
- **Rendezés:** Támogatott mezők: Név, TK-szám, Státusz, Utolsó frissítés, Közeli patika elérhetősége, Közeli patika frissítés időpontja. Emelkedő és csökkenő irány.
- **Nézet váltás:** Táblázatos nézet és kártya nézet között.
- **Oszlop/mező testreszabás:** Felhasználó kiválaszthatja a látható oszlopokat/mezőket, átrendezheti őket drag & drop módszerrel. A „Műveletek" oszlop mindig fix az utolsó helyen. Beállítások `localStorage`-ban tárolódnak.
- **Lapozás:** 24 elem/oldal (rácsbarát).
- **Kedvencek kezelése:** Gyógyszerek hozzáadása/eltávolítása a kedvencek közül. Ha az eltávolítandó termékre értesítés is van, figyelmeztető modal megjelenítése.
- **Értesítés kezelése:** Feliratkozás/leiratkozás készletváltozás értesítésekre. Feliratkozáskor automatikusan kedvenc is lesz.
- **URL paraméterek támogatása:** `search`, `status`, `nearbyOnly`, `sort`, `order`, `lastUpdate_from`, `lastUpdate_to`, `nearbyPharmacyStock`, `nearbyPharmacyLastUpdate_from` paraméterek a szűrők és rendezés közvetlen beállítására.

##### Működési logika
- Kliens oldali szűrés és rendezés a betöltött adatokon.
- `useMemo` a szűrt és rendezett listák hatékony kiszámításához.
- Nézet beállítások (oszlop sorrend, láthatóság) `localStorage`-ban perzisztálódnak (`medicineViewSettings`).
- **Közeli patika logika:** Ha közeli patika van beállítva, a "Közeli patika" és "Közeli patika frissítve" oszlopok automatikusan megjelennek a táblázatban.

---

#### 2.2.2. Gyógyszer Adatlap


##### User Story
Felhasználóként a kiválasztott gyógyszer összes részletes adatát szeretném egy helyen látni, beleértve a készletinformációkat, státusz előzményeket, és elérhető helyettesítő termékeket.

##### Funkciók
- **Termékadatok megjelenítése:** Név, TK-szám, INN (hatóanyag, kattintható link), ATC-kód, Kiszerelés, Gyártó, Kiadhatóság, Forgalmazhatóság dátuma.
- **Kedvenc és Értesítési műveletek (MedicineDetailActions).**
- **Készletinformációk (MedicineStockInfo):** Készleten/Rendelésre hány gyógyszertárban. „Megnézem hol" funkció.
- **Készlethiány részletei:** Hiány kezdete, tervezett vége, oka, javaslat a pótlásra (ha van).
- **Hasonló hatóanyagú termékek (SimilarMedicines).**
- **Státusz előzmények (MedicineStatusHistory).**
- **Közeli patika elérhetőség (NearbyPharmacyStockIndicator).**

##### Működési logika
- Server Component, amely a dinamikus route paraméterből (`[...id]`) nyeri ki a TK-számot URL-dekódolással.
- A `getMedicineByTk` függvénnyel lekéri az adatokat.
- A `getMedicinesBySubstance` függvénnyel lekéri a hasonló termékeket (max. 20 db, diverzitás logikával).

---

#### 2.2.3. Gyógyszer Kártya (MedicineCard)


##### User Story
Felhasználóként a gyógyszerlista kártya nézetében szeretném látni a legfontosabb termék adatokat és gyorsan hozzáférni a kedvenc/értesítés funkciókhoz.

##### Funkciók
- Termék alapvető adatainak megjelenítése a nézet beállítások (visibleFields) szerint.
- Státusz badge (Elérhető/Készlethiány/Megszűnt).
- Kedvencekhez adás / eltávolítás gomb.
- Értesítés kérése / lemondása gomb.
- „Részletek" link a termék adatlapra.
- Közeli patika készlet indikátor (amennyiben be van állítva közeli patika).

---

#### 2.2.4. Termék Adatlap Műveletek (MedicineDetailActions)


##### User Story
Felhasználóként a termék adatlapján szeretném kezelni a kedvenc státuszt és az értesítés feliratkozást.

##### Funkciók
- Kedvencekhez adás / eltávolítás.
- Értesítés kérése / lemondása.
- Kedvenc eltávolítása esetén figyelmeztetés, ha értesítés is aktív (FavoriteRemovalModal).

---

#### 2.2.5. Készletinformáció (MedicineStockInfo)


##### User Story
Felhasználóként látni szeretném a termék készletinformációit és a „Megnézem hol" linkre kattintva egy térképes listát a patikákról.

##### Funkciók
- Készlet / Rendelés információk megjelenítése (hány gyógyszertárban elérhető készleten, hány helyen rendelésre).
- „Megnézem hol" gomb: Modal megnyitása a megfelelő szűréssel (PharmacyStockModal).

##### Működési logika
- Determinisztikus mock gyógyszertár-azonosítók generálása a termékazonosító alapján (seeded pseudo-random).
- Készleten lévő és rendelésre elérhető patikák elkülönítése.

---

#### 2.2.6. Közeli Patika Készlet Indikátor (NearbyPharmacyStockIndicator)


##### User Story
Felhasználóként szeretném látni a termékoldalon, hogy a kedvencnek jelölt közeli patikámban elérhető-e az adott gyógyszer, hogy tudjam, érdemes-e oda mennem.

##### Funkciók
- Közeli patika azonosítása a `NearbyPharmacyContext` segítségével.
- Készletinformáció szimulálása determinisztikus mock logikával.
- Státuszjelző badge megjelenítése (Elérhető – Zöld, Nem elérhető – Szürke).
- **Utolsó frissítés időpontja:** A státusz mellett megjelenik az adat frissítésének időpontja is, hogy a felhasználó lássa az információ aktualitását.

##### Működési logika
- Ha nincs beállítva közeli patika, a komponens nem jelenik meg.
- Az `isAvailableInPharmacy` függvény dönti el a státuszt.
- A `getNearbyPharmacyStatusUpdate` függvény adja az utolsó frissítés időpontját.

---

#### 2.2.7. Hasonló Hatóanyagú Termékek (SimilarMedicines)


##### User Story
Felhasználóként szeretném látni a kiválasztott gyógyszerrel megegyező hatóanyagú, de jelenleg elérhető egyéb készítményeket, hogy készlethiány esetén alternatívát találhassak, vagy összehasonlíthassam a lehetőségeket.

##### Funkciók
- Hasonló termékek táblázatos megjelenítése.
- Csak az „Elérhető" státuszú termékek szűrése és megjelenítése.
- Gyors navigáció a helyettesítő termék adatlapjára (kattintható név link és „Megtekintés" gomb).
- **Kedvenc funkció:** A hasonló termékek is kedvencnek jelölhetők a listában. Eltávolítás esetén figyelmeztetés (FavoriteRemovalModal), ha értesítés is aktív.
- **Közeli patika elérhetőség:** Megmutatjuk, hogy az adott termék elérhető-e a felhasználó kedvenc patikájában (zöld pipa vagy tiltó ikon).

##### Működési logika
- A komponens kap egy hatóanyag nevet és egy előre leszűrt listát.
- Ha a lista üres, a komponens nem jelenik meg.
- Táblázatos elrendezés: Kedvenc, Név, Kiszerelés, Gyártó, Státusz, Közeli patika, Művelet.
- A közeli patika státuszát az `isAvailableInPharmacy` függvény határozza meg.

##### Kapcsolódó elemek
- `app/(dashboard)/gyogyszerek/[...id]/page.tsx`: Felhasználó oldal
- `lib/data.ts`: Adatlekérdezés (`getMedicinesBySubstance`)

---

#### 2.2.8. Kedvenc Eltávolítás Figyelmeztetés (FavoriteRemovalModal)


##### User Story
Felhasználóként szeretnék figyelmeztetést kapni, ha egy olyan terméket veszek ki a kedvencek közül, amelyre értesítést kértem, mert az értesítés is meg fog szűnni.

##### Funkciók
- Figyelmeztető üzenet megjelenítése.
- Megerősítés (Kedvenc + Értesítés eltávolítása).
- Megszakítás (Visszatérés az eredeti állapothoz).

##### Üzleti/működési logika
- Ha a termék kedvenc ÉS van rá aktív értesítés feliratkozás, akkor a kedvenc eltávolítása gombra kattintva ez a modal jelenik meg.
- „Mégsem" a nézet elsődleges gombja (visszavonás).
- „Igen, biztosan" az eltávolítást hajtja végre.

---

### 2.3. Gyógyszertár Kereső

---

#### 2.3.1. Gyógyszertárak Oldal


##### User Story
Felhasználóként szeretnék gyógyszertárak után keresni és látni az elhelyezkedésüket.

##### Funkciók
- A `PharmacyFinder` komponens megjelenítése teljes oldal nézetben.

---

#### 2.3.2. Gyógyszertár Kereső Komponens (PharmacyFinder)


##### User Story
Felhasználóként keresni szeretnék a gyógyszertárak között, látni azok elhelyezkedését térképen és listában. Ezt a felületet használom a fő gyógyszertár kereső oldalon és a termék-specifikus készlet modalban is.

##### Funkciók
- **Gyógyszertár kereső:** Cím, név, város alapján.
- **Kétnézetes megjelenítés:** Térkép / Lista (mobilon váltható).
- **Szűrhető patika lista:** Kereső szöveg, térkép láthatóság, nyitvatartás alapján.
- **Speciális filterek:** „Most nyitva", „Hétvégén nyitva", „0-24 órában nyitva".
- **Térkép szinkronizáció:** A lista csak a térképen látható patikákat mutatja.
- **Találati számok kijelzése:** Összes találat vs. térképen látható találatok.
- **„Mutasd az összest" funkció:** Térkép visszaállítása az összes találat megjelenítéséhez.

##### Paraméterek
- `filterIds?`: Csak ezeket a patikákat mutassa (pl. készleten lévők).
- `title?`: Egyedi címsor a kereső felett.
- `description?`: Opcionális leírás a cím alatt.

---

#### 2.3.3. Gyógyszertár Térkép (PharmacyMap)


##### User Story
Felhasználóként vizuálisan szeretném látni a gyógyszertárak elhelyezkedését egy térképen, hogy földrajzi közelség alapján választhassak közülük, és egy kattintással „Közeli gyógyszertárnak" jelölhessem bármelyiket.

##### Funkciók
- Leaflet térkép megjelenítése OpenStreetMap réteggel.
- Gyógyszertárak megjelenítése markerként.
- Marker-re kattintva felugró ablak (Popup) a patika adataival és napi nyitvatartással.
- „Közeli patikának jelölöm" funkció a popup-ból.
- Térkép automatikus mozgatása (FlyTo) a kívülről kiválasztott patikára.
- Látható patikák detektálása: eseményküldés a látható markerek listájával a szülőnek.

##### Technológia
- `react-leaflet` (Leaflet wrapper React-hez).
- SSR tiltása szükséges (`dynamic import`).

##### Kapcsolódó elemek
- Parent: `PharmacyFinder`, `PharmaciesPage`
- Context: `NearbyPharmacyContext`

---

#### 2.3.4. Gyógyszertár Kártya (PharmacyCard)


##### User Story
Felhasználóként látni szeretném egy gyógyszertár alapvető adatait (név, cím, nyitvatartás, elérhetőség) egy listaelemként, hogy kiválaszthassam a számomra legmegfelelőbbet, és megjelölhessem mint „Közeli gyógyszertár".

##### Funkciók
- Gyógyszertár adatainak megjelenítése (név, cím, irányítószám, település, telefon).
- Nyitvatartási státusz (Nyitva / Hamarosan zár / Zárva) és napi nyitvatartási idő megjelenítése.
- „Mutasd térképen" gomb, amely a térképen az adott patikára ugrik.
- Kiválasztott állapot vizuális jelzése (szegély kiemelés).
- „Közeli patikának jelölöm" gomb (Home ikon).

##### Kapcsolódó elemek
- Parent: `PharmacyFinder`
- Context: `NearbyPharmacyContext`

---

#### 2.3.5. Gyógyszertári Készlet Modal (PharmacyStockModal)


##### User Story
Felhasználóként szeretném látni egy konkrét termék elérhetőségét (készlet vagy rendelés) gyógyszertárakra lebontva, térképes és listás nézetben egy modalban.

##### Funkciók
- Teljes képernyős modal.
- Bezárás gomb.
- `PharmacyFinder` beágyazása a termék-specifikus szűréssel.
- Cím: „[Termék neve] készleten/rendelésre az alábbi gyógyszertárakban".
- Leírás: „Kizárólag a készlettel rendelkező/rendelést fogadó patikák láthatóak."

---

### 2.4. Közösségi Fórum

---

#### 2.4.1. Fórum Főoldal


##### User Story
Felhasználóként szakmai témákat szeretnék böngészni, keresni és új témákat indítani a közösségi fórumon.

##### Funkciók
- Fórum témák listázása kártya formátumban.
- Szabad szöveges keresés (cím és tartalom alapján is).
- Szűrés szakterület és címke alapján.
- Rendezés: dátum (legújabb/legrégebbi), cím (A-Z/Z-A).
- Új téma létrehozása (CreateTopicModal) gomb.
- URL paraméterek támogatása: `specialty`, `tag`.

##### Működési logika
- Mock adatok betöltése `localStorage`-ból (`forum-service.ts`).
- Kliens oldali szűrés és rendezés.

---

#### 2.4.2. Téma Részletek Oldal


##### User Story
Felhasználóként egy kiválasztott fórum téma minden részletét szeretném látni (cím, leírás, szerző, reakciók), valamint hozzászólásokat olvasni és írni.

##### Funkciók
- Téma részletes adatainak megjelenítése (cím, leírás, szerző, dátum, szakterületek, címkék).
- Reakciók kezelése (like/dislike) témákra és hozzászólásokra.
- Hozzászólások megjelenítése (CommentSection).
- Új hozzászólás írása anonim opcióval.
- Vissza navigálás a fő fórum oldalra.

##### Működési logika
- Adatok kezelése `localStorage`-on keresztül (`forum-service.ts`).
- Reakciók felhasználónként nyomon követhetők.

---

#### 2.4.3. Téma Kártya (TopicCard)


##### User Story
Felhasználóként át szeretném tekinteni a fórum témákat listában, és szeretném látni, ha egy bejegyzés anonim módon készült.

##### Funkciók
- Kattintás a kártyára a részletek megtekintéséhez.
- Szakterület és címke badge-ek megjelenítése (kattinthatóak, szűrőbe navigálnak).
- Szerző, dátum és reakció statisztikák (like, dislike, komment szám).
- Leírás előnézet (max. 150 karakter).

##### Üzleti/működési logika
- Anonim szerző esetén vizuális megkülönböztetés (dőlt betű, halványabb szín).

---

#### 2.4.4. Új Téma Létrehozása Modal (CreateTopicModal)


##### User Story
Felhasználóként új szakmai témát szeretnék indítani a fórumon, és szeretném anonim módon közzétenni a bejegyzésemet, hogy ne legyen azonosítható a személyazonosságom.

##### Funkciók
- Cím és leírás megadása (kötelező).
- Címkék hozzáadása vesszővel elválasztva.
- Szakterületek kiválasztása (többszörös, checkbox grid) vagy „Általános" megjelölés.
- Anonim mód kapcsoló.
- Validáció: kötelező mezők (cím, leírás) ellenőrzése.

##### Üzleti/működési logika
- Az anonim mód bekapcsolásával a szerző neve „Anonim"-ként jelenik meg.
- „Általános" jelölés esetén a szakterület választó inaktív.

---

#### 2.4.5. Hozzászólások Szekció (CommentSection)


##### User Story
Felhasználóként hozzá szeretnék szólni egy témához, és anonim módon is hozzá szeretnék szólni, hogy ne látszódjon a nevem.

##### Funkciók
- Kommentek listájának megtekintése időrendben (legrégebbi elöl).
- Új komment írása szöveges mezőben.
- Anonim hozzászólás opció.
- Kommentek kedvelése/nem kedvelése (ReactionButtons).

##### Üzleti/működési logika
- Az anonim opció kiválasztásakor a komment beküldője „Anonim" néven jelenik meg.

---

### 2.5. Globális Keresés


#### User Story
Felhasználóként gyorsan szeretnék keresni a rendszer teljes tartalmában (gyógyszerek, gyógyszertárak, fórum témák), hogy egyetlen bemeneti mezőből elérhessem a keresett információt.

#### Funkciók
- Szabad szöveges keresés a navigációs sávból.
- Eredmények kategóriákra bontva: Gyógyszerek (Név, TK-szám, INN), Gyógyszertárak (Név, Település, Cím), Közösség (Cím, Szakterületek).
- Kategória szűrő fülek: Összesített, Gyógyszerek, Gyógyszertárak, Közösség.
- Automatikus debouncing, azonnali keresés.
- Kattintásra navigáció a megfelelő adatlapra.

#### Működési logika
- A keresés kliens oldalon történik, az összes gyógyszert, gyógyszertárat és fórum témát memóriában tartva.
- A gyógyszerek az API-ból, a patikák a `/api/pharmacies`-ból, a fórum témák a háttérrendszerből töltődnek be.
- A találatokat kategóriánként csoportosítja.

---

### 2.6. Hitelesítés (Autentikáció)

---

#### 2.6.1. Navigációs Sáv (Navbar)


##### User Story
Felhasználóként intuitív navigációs sávot szeretnék, amelyen gyorsan elérem a keresőt, a kedvenceimet, a közeli patikámat és a profilomat.

##### Funkciók
- Navigációs linkek (Dashboard, Gyógyszerek, Gyógyszertárak, Közösség).
- Globális keresés (GlobalSearch) beágyazása.
- **Közeli patika információ:** A beállított patika nevének megjelenítése. Kattintásra a patikaválasztó modal nyílik meg.
- **Kedvencek dropdown:** A kedvencnek jelölt gyógyszerek gyorslistája (Név, TK-szám, Státusz badge).
- Felhasználói profil menü (felhasználó név, kijelentkezés).

##### Működési logika
- A patikaválasztó modal `React Portal` segítségével a `document.body`-ra kerül renderelésre, így biztosítva, hogy ne korlátozza a navigációs sáv (z-index/overflow) a megjelenését.

---

#### 2.6.2. Hitelesítési Context (AuthContext)


##### User Story
Felhasználóként szeretném, ha a rendszer védett lenne, így csak az illetékesek láthatnák a szenzitív adatokat. Egy egyszerű bejelentkező felületen keresztül szeretnék belépni az email címemmel és egy fix jelszóval.

##### Funkciók
- Bejelentkezési állapot kezelése (`isAuthenticated`).
- Bejelentkezés (`login`) és kijelentkezés (`logout`).
- Felhasználói szerepkörök kezelése (`UserRole`: admin / user).
- Munkamenet érvényességének ellenőrzése (`sessionVersion`).
- Adatok perzisztenciája (`localStorage`) a munkamenet megőrzéséhez.
- Automatikus átirányítás a bejelentkező oldalra, ha a felhasználó nincs belépve.

##### Működési logika
- A bejelentkezési állapotot az `auth_session` kulcs alatt tároljuk a `localStorage`-ban (id, email, sessionVersion, timestamp).
- A `UserService.validateCredentials` függvénnyel ellenőrzi a bejelentkezési adatokat.
- Munkamenet érvényesítés: a `checkAuth` összeveti a tárolt `sessionVersion`-t a rendszer aktuális értékével. Ha eltérnek (pl. admin kikényszerített kijelentkeztetés), a munkamenet érvénytelenítésre kerül.
- Deaktivált felhasználó (`status !== 'active'`) nem jelentkezhet be.
- A `logout` törli a munkamenetet és a login oldalra irányít.

---

#### 2.6.3. Bejelentkezés Oldal


##### User Story
Felhasználóként szeretnék bejelentkezni a rendszerbe az email címemmel és jelszavammal, hogy hozzáférjek a belső funkciókhoz.

##### Funkciók
- Email és jelszó mezők megjelenítése.
- Bejelentkezés gomb betöltési állapottal.
- Hibaüzenet megjelenítése sikertelen belépés esetén.
- Fejlesztői környezetben (`development`) automatikus kitöltés a gyorsabb teszteléshez.
- „Elfelejtett jelszó?" link a jelszó-visszaállítás oldalra.

##### Működési logika
- Az `useAuth` hook `login` függvényét hívja a beküldéskor.
- Sikeres belépés után a dashboard oldalra irányít.
- Fejlesztői környezetben az adatok előre ki vannak töltve (demo@example.com / vény123).

---

#### 2.6.4. Elfelejtett Jelszó Oldal


##### User Story
Felhasználóként, ha elfelejtem a jelszavamat, szeretnék lehetőséget kapni a belépésre egy egyszer használatos kód vagy mágikus link segítségével.

##### Funkciók
- Email cím megadása.
- Mágikus link/kód küldésének szimulációja.
- Visszajelzés a felhasználónak a szimulált kiküldésről.
- Visszalépési lehetőség a bejelentkezéshez.

##### Működési logika
- Prototípus: valódi emailt nem küld, a generált 6 jegyű kódot a felületen jeleníti meg.
- Gombnyomásra szimulált késleltetéssel (800ms) generálódik a kód.
- Tájékoztató üzenet jelzi, hogy a prototípusban a kóddal nem lehet ténylegesen belépni.

---

### 2.7. Adminisztráció

---

#### 2.7.1. Admin Elrendezés (AdminLayout)


##### User Story
Adminisztrátorként egy elkülönített felületen szeretném kezelni a rendszer adminisztratív funkcióit, ahol fülekkel navigálhatok a különböző kezelési területek között.

##### Funkciók
- Jogosultság ellenőrzés: csak `admin` szerepkörű felhasználók férhetnek hozzá.
- Ha nem bejelentkezett → átirányítás a login oldalra.
- Ha nem admin → átirányítás a dashboard oldalra.
- Füles navigáció: Felhasználók, Gyógyszertárak, Fórum Moderálás.
- Betöltési állapot jelzése jogosultság-ellenőrzés közben.

---

#### 2.7.2. Felhasználók Kezelése


##### User Story
Adminisztrátorként szeretném kezelni a rendszer felhasználóit: listázni, hozzáadni, szerkeszteni, deaktiválni, kijelentkeztetni és jelszavakat visszaállítani.

##### Funkciók
- **Felhasználók listázása:** Táblázatos nézet az összes felhasználóval (név, email, szerep, státusz, utolsó belépés).
- **Új felhasználó hozzáadása:** Modal űrlap (név, email, szerep, státusz).
- **Felhasználó szerkesztése:** Modal füles felülettel:
  - *Alapadatok fül:* Név, email, szerep, státusz módosítása.
  - *Profil fül:* Másodlagos email, szakterületek kezelése (MEDICAL_SPECIALTIES listából).
  - *Hírlevél fül:* Elsődleges és másodlagos email hírlevél beállításai (Közösség/Fórum és Készletinfó kategóriák).
- **Felhasználó deaktiválása/aktiválása:** Státusz kapcsolás megerősítő modallal.
- **Felhasználó kijelentkeztetése:** Munkamenet érvénytelenítés (`sessionVersion` növelése) megerősítő modallal.
- **Jelszó visszaállítás:** Visszaállítási email szimulálása megerősítő modallal.

##### Működési logika
- A rendszer végzi az összes adatműveletet (CRUD, session revoke, password reset).
- Szerkesztés közben a változtatások lokálisan tárolódnak, mentéskor frissül a `localStorage`.
- Megerősítő modalok minden érzékeny művelet előtt.

---

#### 2.7.3. Fórum Moderálás


##### User Story
Adminisztrátorként szeretném moderálni a fórum tartalmakat: témákat elrejteni, lezárni, szerkeszteni és anonimizálni, valamint a hozzászólásokat kezelni.

##### Funkciók
- **Összes téma listázása:** Beleértve a rejtett témákat is (vizuális megkülönböztetés).
- **Téma műveletek:**
  - Elrejtés / megjelenítés.
  - Lezárás / feloldás.
  - Leírás szerkesztése – szerkesztő modal.
  - Szerző anonimizálása – visszafordíthatatlan művelet.
- **Hozzászólások kezelése:** Kinyitható sorok témánként.
  - Hozzászólás elrejtése / megjelenítése.
  - Hozzászólás szövegének szerkesztése.
  - Szerző anonimizálása.
- **Megerősítő modalok** minden moderációs művelet előtt.

##### Működési logika
- A rendszer adminisztrációs funkcióit használja.
- A rejtett elemek is lekérhetők.
- Az anonimizálás beállít egy `isAuthorAnonymized` flag-et, de az eredeti szerzőt nem törli.

---

#### 2.7.4. Gyógyszertárak Áttekintése


##### User Story
Adminisztrátorként szeretném áttekinteni a rendszerben nyilvántartott gyógyszertárakat, keresni közöttük, és megtekinteni az alapvető információkat (nyitvatartás, szinkronizálási állapot).

##### Funkciók
- **Gyógyszertárak listázása:** Táblázatos nézet (azonosító, név, település, nyitvatartási státusz, utolsó adatszinkron, utolsó készletszinkron).
- **Keresés:** Szabad szöveges keresés név, település és cím alapján, törlés gombbal.
- **Nyitvatartási státusz:** Valós idejű megjelenítés (Nyitva/Zárva/Hamarosan zár) a `getPharmacyOpeningStatus` segítségével.
- **Navigáció:** Részletes gyógyszertár nézetre navigálás.

##### Működési logika
- Adatok lekérése a `/api/pharmacies` API végpontról.
- Utolsó szinkronizálási dátumok demonstrációs célú mock adatok.

---

### 2.8. Felhasználói Profil és Beállítások

---

#### 2.8.1. Profil Oldal


##### User Story
Felhasználóként szeretném megtekinteni és kezelni a saját profiladataimat, hogy naprakészen tarthassam az adataimat, valamint biztonsági és kényelmi funkciókat érhessek el (jelszókezelés, kijelentkezés).

##### Funkciók
- **Alapadatok megjelenítése:** Név (nem szerkeszthető), email cím (nem szerkeszthető), másodlagos email cím.
- **Szakterületek módosítása:** Több is választható a `MEDICAL_SPECIALTIES` fix listából. Keresés a szakterületek között. Szerkesztés mód kapcsolása.
- **Jelszó módosítási szekció:** Jelszókezelés gomb (prototípusban nem funkcionális).
- **Hírlevél beállítások kezelése:** Elsődleges és másodlagos email címre külön-külön:
  - *Közösség/Fórum:* Feliratkozás/leiratkozás, kiküldés ideje, rendszeresség (Napi/Heti/Havi), téma szűrés (Minden/Csak szakterület), saját témák kezelése.
  - *Készletinfó:* Feliratkozás/leiratkozás, rendszeresség, kiküldés ideje, téma multi-select (Újra elérhető, Készlethiány, Megszűnt), téma kör (Minden/Szakterület+kedvenc/Csak szakterület/Csak kedvenc).
- **Kijelentkezés gomb.**

##### Működési logika
- A név és email címek a prototípus szintjén nem módosíthatók.
- Ha egy hírlevél kategóriában a felhasználó leiratkozik, a részletes beállítások elrejtésre kerülnek animációval.
- A kijelentkezés az `AuthContext` `logout` függvényét hívja.

---

#### 2.8.2. Kedvencek Oldal


##### User Story
Felhasználóként szeretném egy külön felületen látni az összes kedvencnek jelölt gyógyszeremet, hogy gyorsan elérhessem őket és szükség esetén eltávolíthassak elemeket a listából, illetve feliratkozhassak értesítésekre.

##### Funkciók
- **Kedvenc gyógyszerek listázása:** Táblázatos nézet (név, TK-szám, státusz, értesítés, hozzáadás ideje, műveletek).
- **Közvetlen navigáció** a gyógyszer adatlapjára (kattintható név).
- **Eltávolítás** a kedvencek közül. Kedvenc eltávolítása esetén figyelmeztetés (`FavoriteRemovalModal`), ha értesítés is aktív.
- **Értesítés** feliratkozás / leiratkozás gomb.
- **Üres állapot kezelése:** Tájékoztató szöveg és navigáció a gyógyszerlista oldalra.

---

#### 2.8.3. Értesítések Oldal


##### User Story
Felhasználóként szeretném áttekinteni az összes aktív értesítés-feliratkozásomat, hogy szükség esetén leiratkozhassak róluk.

##### Funkciók
- **Feliratkozott gyógyszerek listázása:** Táblázatos nézet (név, TK-szám, státusz, feliratkozás ideje, műveletek).
- **Közvetlen navigáció** a gyógyszer adatlapjára (kattintható név).
- **Leiratkozás** gomb.
- **Üres állapot kezelése:** Tájékoztató szöveg és navigáció a gyógyszerlista oldalra.

---

## 3. Specifikációk (Context Működés)

---

### 3.1. Kedvencek Kezelése (FavoriteContext)


#### User Story
Felhasználóként szeretném a számomra fontos gyógyszereket kedvencnek jelölni, hogy később gyorsan elérhessem őket a listában anélkül, hogy értesítéseket kapnék a változásaikról.

#### Funkciók
- Gyógyszerek hozzáadása a kedvencekhez.
- Gyógyszerek eltávolítása a kedvencekből (Toast üzenettel és Visszavonás lehetőséggel).
- Kedvenc státusz ellenőrzése (`isFavorite`).
- Adatok perzisztenciája (`localStorage` – `medicine_favorites` kulcs).

#### Működési logika
- Csak a legszükségesebb adatokat tároljuk (tkSzam, név, státusz, kiszerelés, hozzáadás dátuma).
- A Context API biztosítja az adatok elérhetőségét az egész alkalmazásban.
- Eltávolítás esetén Toast értesítés jelenik meg „Visszavonom" gombbal.

---

### 3.2. Közeli Gyógyszertár Kezelése (NearbyPharmacyContext)


#### User Story
Felhasználóként szeretnék beállítani egy „Közeli gyógyszertárat", ami számomra kiemelt fontosságú (pl. az orvosi rendelőmhöz legközelebbi), hogy gyorsan elérhessem annak adatait a navigációs sávban.

#### Funkciók
- Közeli gyógyszertár beállítása (`setNearbyPharmacy`).
- Közeli gyógyszertár törlése (`clearNearbyPharmacy`).
- Adatok perzisztenciája (`localStorage` – `nearby_pharmacy` kulcs).

#### Működési logika
- Egyszerre csak egy gyógyszertár jelölhető meg „közeli"-nek.
- Ha új gyógyszertárat jelölünk meg, az felülírja a korábbit.
- A Context API biztosítja, hogy a Navbar és a térkép/lista nézetek is azonnal értesüljenek a változásról.

---

### 3.3. Értesítés Kezelése (NotificationContext)


#### User Story
Felhasználóként szeretnék értesítéseket kérni bizonyos gyógyszerek készletváltozásairól, hogy időben értesüljek a státuszváltozásokról.

#### Funkciók
- Feliratkozás készletváltozás értesítésre (`subscribe`).
- Leiratkozás (`unsubscribe`).
- Feliratkozási státusz ellenőrzése (`isSubscribed`).
- Adatok perzisztenciája (`localStorage` – `medicine_subscriptions` kulcs).

#### Működési logika
- A feliratkozáskor a gyógyszer alapadatait (tkSzam, név, státusz) és az időbélyeget tárolja.
- A feliratkozás automatikusan kedvencet is hozzáad (feldolgozás a hívó komponensben).

---

### 3.4. Toast Üzenetek (ToastContext)


#### User Story
Felhasználóként szeretnék visszajelzést kapni bizonyos műveletek után (pl. kedvenc eltávolítása), és lehetőséget kapni a művelet visszavonására egy rövid időablakon belül.

#### Funkciók
- Toast üzenetek megjelenítése egymás felett sorakozva.
- Időzített eltűnés (alapértelmezetten 10 másodperc).
- Vizuális visszajelzés a hátralévő időről (progress bar).
- Visszavonás (Undo) gomb támogatása.
- Manuális bezárás lehetősége.

#### Működési logika
- A toastok egy globális context-ben vannak tárolva.
- Minden toast saját időzítővel rendelkezik.
- A progress bar animációja JS-szel vezérelt (50ms intervallumon frissül).

---

## Összesítő: localStorage kulcsok

| Kulcs | Típus | Modul | Leírás |
|---|---|---|---|
| `medicine_favorites` | `Favorite[]` | Kedvencek | Kedvenc gyógyszerek listája |
| `medicine_subscriptions` | `Subscription[]` | Értesítések | Feliratkozott gyógyszerek listája |
| `nearby_pharmacy` | `Pharmacy` | Közeli patika | Beállított közeli gyógyszertár |
| `auth_session` | `{id, email, sessionVersion, timestamp}` | Hitelesítés | Bejelentkezési munkamenet |
| `medicine_visible_columns` | `string[]` | Gyógyszerlista | Látható oszlopok konfigurációja |
| `medicine_column_order` | `string[]` | Gyógyszerlista | Oszlopok sorrendje |
| `medicine_card_visible_fields` | `string[]` | Gyógyszerlista | Kártya nézet látható mezők |
| `medicine_card_field_order` | `string[]` | Gyógyszerlista | Kártya nézet mezők sorrendje |
| `forumTopics` | `ForumTopic[]` | Fórum | Témák listája |
| `forumComments` | `ForumComment[]` | Fórum | Összes hozzászólás |
| `forumUserReactions` | `UserReactions` | Fórum | Felhasználói reakciók |
| `forumDataVersion` | `string` | Fórum | Adatverzió |
| `portal_users` | `User[]` | Felhasználókezelés | Felhasználók listája (admin) |

---

