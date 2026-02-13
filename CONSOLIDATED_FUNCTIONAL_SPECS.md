# Konszolidált Funkcionális Specifikáció

> **Generálva:** 2026-02-12  
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
3. [Interfész specifikációk (Context API-k)](#3-interfész-specifikációk-context-api-k)
   - 3.1. [Kedvencek Kezelése (FavoriteContext)](#31-kedvencek-kezelése-favoritecontext)
   - 3.2. [Közeli Gyógyszertár Kezelése (NearbyPharmacyContext)](#32-közeli-gyógyszertár-kezelése-nearbypharmacycontext)
   - 3.3. [Értesítés Kezelése (NotificationContext)](#33-értesítés-kezelése-notificationcontext)
   - 3.4. [Toast Üzenetek (ToastContext)](#34-toast-üzenetek-toastcontext)
4. [Adatkezelő réteg (Service Layer)](#4-adatkezelő-réteg-service-layer)
   - 4.1. [Központi Adatkezelő (data.ts)](#41-központi-adatkezelő-datats)
   - 4.2. [Fórum Szolgáltatás (forum-service.ts)](#42-fórum-szolgáltatás-forum-servicets)
   - 4.3. [Segédfüggvények (utils.ts, pharmacy-utils.ts)](#43-segédfüggvények-utilsts-pharmacy-utilsts)
5. [Típusdefiníciók](#5-típusdefiníciók)

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
| **Hitelesítés** | Bejelentkezés, munkamenet kezelés |

**Technológiai háttér:** Next.js (App Router), React (Server/Client Components), Tailwind CSS + DaisyUI, Leaflet (térkép), localStorage (kliens oldali perzisztencia), Context API (globális állapotkezelés).

---

## 2. Modul specifikációk

---

### 2.1. Irányítópult (Dashboard)

**Forrásfájl:** `app/(dashboard)/dashboard/page.tsx`

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

**Forrásfájl:** `components/dashboard/StockChangesWidget.tsx`

##### User Story
Felhasználóként szeretném látni, hogy az általam figyelt időszakban milyen készletváltozások történtek (megszűnés, készlethiány, elérhetőség), és gyorsan el szeretnék jutni a részletekhez.

##### Funkciók
- Összesítő statisztikák megjelenítése (Megszűnt, Készlethiány, Elérhető darabszámok).
- Az egyes státuszokra kattintva a gyógyszerlistára navigálás a megfelelő szűrőkkel.
- Időszak-szűrt lista a legfrissebb készletváltozásokról (max. 10 elem).
- A lista elemei linkelnek a termék adatlapokra.

##### Működési logika
- A widget a kapott gyógyszerlistát szűri a kiválasztott időszak (`period`) alapján.
- A `lastUpdate` mező alapján dönti el, hogy egy gyógyszer beleesik-e az időszakba.
- Kattintható statisztikák, amelyek URL paraméterekkel (`status`, `lastUpdate_from`) szűrik a gyógyszer listát.

---

#### 2.1.2. Közeli Patika Készlet Widget (PharmacyStockWidget)

**Forrásfájl:** `components/dashboard/PharmacyStockWidget.tsx`

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

**Forrásfájl:** `components/dashboard/CommunityActivityWidget.tsx`

##### User Story
Felhasználóként szeretném látni a legfrissebb fórum aktivitásokat, hogy könnyen kapcsolódhassak a szakmai beszélgetésekhez.

##### Funkciók
- Legfrissebb fórum témák megjelenítése (cím, szerző, hozzászólás szám, dátum).
- Kattintásra navigálás a téma részletes oldalára.
- „Összes téma megtekintése" link a fő fórum oldalra.

---

### 2.2. Gyógyszer Nyilvántartás

---

#### 2.2.1. Gyógyszer Lista Oldal

**Forrásfájl:** `app/(dashboard)/gyogyszerek/page.tsx`

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

**Forrásfájl:** `app/(dashboard)/gyogyszerek/[...id]/page.tsx`

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

**Forrásfájl:** `components/medicines/MedicineCard.tsx`

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

**Forrásfájl:** `components/medicines/MedicineDetailActions.tsx`

##### User Story
Felhasználóként a termék adatlapján szeretném kezelni a kedvenc státuszt és az értesítés feliratkozást.

##### Funkciók
- Kedvencekhez adás / eltávolítás.
- Értesítés kérése / lemondása.
- Kedvenc eltávolítása esetén figyelmeztetés, ha értesítés is aktív (FavoriteRemovalModal).

---

#### 2.2.5. Készletinformáció (MedicineStockInfo)

**Forrásfájl:** `components/medicines/MedicineStockInfo.tsx`

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

**Forrásfájl:** `components/medicines/NearbyPharmacyStockIndicator.tsx`

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

**Forrásfájl:** `components/medicines/SimilarMedicines.tsx`

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

**Forrásfájl:** `components/medicines/FavoriteRemovalModal.tsx`

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

**Forrásfájl:** `app/(dashboard)/gyogyszertarak/page.tsx`

##### User Story
Felhasználóként szeretnék gyógyszertárak után keresni és látni az elhelyezkedésüket.

##### Funkciók
- A `PharmacyFinder` komponens megjelenítése teljes oldal nézetben.

---

#### 2.3.2. Gyógyszertár Kereső Komponens (PharmacyFinder)

**Forrásfájl:** `components/pharmacies/PharmacyFinder.tsx`

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

**Forrásfájl:** `components/pharmacies/PharmacyMap.tsx`

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

**Forrásfájl:** `components/pharmacies/PharmacyCard.tsx`

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

**Forrásfájl:** `components/pharmacies/PharmacyStockModal.tsx`

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

**Forrásfájl:** `app/(dashboard)/kozosseg/page.tsx`

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

**Forrásfájl:** `app/(dashboard)/kozosseg/[topicId]/page.tsx`

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

**Forrásfájl:** `components/forum/TopicCard.tsx`

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

**Forrásfájl:** `components/forum/CreateTopicModal.tsx`

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

**Forrásfájl:** `components/forum/CommentSection.tsx`

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

**Forrásfájl:** `components/layout/GlobalSearch.tsx`

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
- A gyógyszerek az API-ból, a patikák a `/api/pharmacies`-ból, a fórum témák a `forum-service`-ből töltődnek be.
- A találatokat kategóriánként csoportosítja.

---

### 2.6. Hitelesítés (Autentikáció)

---

#### 2.6.1. Navigációs Sáv (Navbar)

**Forrásfájl:** `components/layout/Navbar.tsx`

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

**Forrásfájl:** `context/AuthContext.tsx`

##### User Story
Felhasználóként szeretném, ha a rendszer védett lenne, így csak az illetékesek láthatnák a szenzitív adatokat. Egy egyszerű bejelentkező felületen keresztül szeretnék belépni az email címemmel és egy fix jelszóval.

##### Funkciók
- Bejelentkezési állapot kezelése (`isAuthenticated`).
- Bejelentkezés (`login`) és kijelentkezés (`logout`).
- Jelszó ellenőrzése (prototípus: fix „vény123").
- Adatok perzisztenciája (`localStorage`) a munkamenet megőrzéséhez.
- Automatikus átirányítás a bejelentkező oldalra, ha a felhasználó nincs belépve.

##### Működési logika
- A bejelentkezési állapotot az `auth_session` kulcs alatt tároljuk a `localStorage`-ban.
- Ha a felhasználó sikeresen megadja a jelszót, az `isAuthenticated` `true` lesz.
- A `logout` törli a munkamenetet és a login oldalra irányít.

---

## 3. Interfész specifikációk (Context API-k)

---

### 3.1. Kedvencek Kezelése (FavoriteContext)

**Forrásfájl:** `context/FavoriteContext.tsx`

#### User Story
Felhasználóként szeretném a számomra fontos gyógyszereket kedvencnek jelölni, hogy később gyorsan elérhessem őket a listában anélkül, hogy értesítéseket kapnék a változásaikról.

#### Interfész
```typescript
interface FavoriteContextType {
    favorites: Favorite[];
    addFavorite: (medicine: Medicine) => void;
    removeFavorite: (tkSzam: string) => void;
    isFavorite: (tkSzam: string) => boolean;
}
```

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

**Forrásfájl:** `context/NearbyPharmacyContext.tsx`

#### User Story
Felhasználóként szeretnék beállítani egy „Közeli gyógyszertárat", ami számomra kiemelt fontosságú (pl. az orvosi rendelőmhöz legközelebbi), hogy gyorsan elérhessem annak adatait a navigációs sávban.

#### Interfész
```typescript
interface NearbyPharmacyContextType {
    nearbyPharmacy: Pharmacy | null;
    setNearbyPharmacy: (pharmacy: Pharmacy) => void;
    clearNearbyPharmacy: () => void;
    isNearby: (id: string) => boolean;
}
```

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

**Forrásfájl:** `context/NotificationContext.tsx`

#### User Story
Felhasználóként szeretnék értesítéseket kérni bizonyos gyógyszerek készletváltozásairól, hogy időben értesüljek a státuszváltozásokról.

#### Interfész
```typescript
interface NotificationContextType {
    subscriptions: Subscription[];
    subscribe: (medicine: Medicine) => void;
    unsubscribe: (tkSzam: string) => void;
    isSubscribed: (tkSzam: string) => boolean;
}
```

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

**Forrásfájl:** `context/ToastContext.tsx`

#### User Story
Felhasználóként szeretnék visszajelzést kapni bizonyos műveletek után (pl. kedvenc eltávolítása), és lehetőséget kapni a művelet visszavonására egy rövid időablakon belül.

#### Interfész
```typescript
interface ToastContextType {
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
}
```

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

## 4. Adatkezelő réteg (Service Layer)

---

### 4.1. Központi Adatkezelő (data.ts)

**Forrásfájl:** `lib/data.ts`

#### User Story
Fejlesztőként szükségem van egy központi adatkezelő rétegre, amely megbízhatóan betölti és feldolgozza a rendszer működéséhez szükséges adatokat (gyógyszerek, gyógyszertárak) különböző forrásokból (pl. CSV fájlok), hogy a felhasználói felület mindig friss és konzisztens információkat jeleníthessen meg.

#### Funkciók

| Függvény | Leírás |
|---|---|
| `getMedicines()` | Gyógyszerlista betöltése CSV-ből, adattisztítás, konverzió, cache kezelés |
| `getMedicineByTk(tkSzam)` | Egyedi gyógyszer lekérése TK-szám alapján |
| `getMedicinesBySubstance(substance, excludeTk, limit)` | Hasonló hatóanyagú, „Elérhető" státuszú termékek lekérése diverzitás logikával |
| `getPharmacies()` | Gyógyszertárlista betöltése CSV-ből, geolokációs adatok és nyitvatartás kezelése |

#### Működési logika (getMedicines)
- A rendszer először a memóriában lévő cache-t ellenőrzi.
- Ha nincs cache, lemezről olvassa a `latin1` kódolású CSV-ket.
- A `PapaParse` könyvtárat használja a robusztus CSV feldolgozáshoz.
- Hibás sorok (hiányzó név vagy TK-szám) automatikus kiszűrése.
- **Státusz logika:**
  - Alapértelmezett: „Elérhető"
  - Ha `termékhiánnyal érintett = igen` VAGY a hiánylista (`shortage_lista`) tartalmazza → „Készlethiány"
  - Ha `Forgalmazható = nem` → „Megszűnt"
- **Egyedi azonosítók:** `internalId = TK-szám + index` az egyediség biztosítására.
- **Mock adatok:** Az első 20 elem speciális, demonstrációs célú adatokat kap (mai és tegnapi frissítések).

#### Működési logika (getMedicinesBySubstance)
- Szűrés hatóanyag (INN) és „Elérhető" státusz alapján.
- Ha a találatok száma meghaladja a limitet, diverzitás logikával (round-robin a márkacsoportok entre) választ.

#### Működési logika (getPharmacies)
- CSV beolvasás `utf8` kódolással.
- Nyitvatartási adatok (Hétfő-Vasárnap) parszolása nyitási/zárási időre.
- Koordináták feldolgozása, érvénytelen koordinátájú bejegyzések kiszűrése.
- Egyedi gyógyszertárak biztosítása `BF kód` alapján.

#### Kapcsolódó elemek
- `src/types/index.ts`: Adatmodellek definíciója
- `src/app/api/...`: API végpontok

---

### 4.2. Fórum Szolgáltatás (forum-service.ts)

**Forrásfájl:** `lib/forum-service.ts`

#### Cél
Kliens oldali szolgáltatás a közösségi fórum adatkezeléséhez. `localStorage`-alapú perzisztencia, mock adatok generálása.

#### User Storyk
- Mint felhasználó, témákat szeretnék létrehozni, olvasni és szűrni.
- Mint felhasználó, hozzászólásokat szeretnék írni témákhoz.
- Mint felhasználó, reakciókat szeretnék adni (like/dislike).

#### Funkciók

| Kategória | Függvény | Leírás |
|---|---|---|
| **Téma műveletek** | `getTopics()` | Témák listázása |
| | `getTopic(id)` | Egyedi téma lekérés |
| | `createTopic(input, user)` | Új téma létrehozása |
| | `updateTopic(topic)` | Téma frissítése |
| **Komment műveletek** | `getComments(topicId)` | Hozzászólások lekérése |
| | `addComment(input, user)` | Új hozzászólás |
| | `updateComment(comment)` | Hozzászólás frissítése |
| **Reakciók** | `toggleTopicLike/Dislike(topicId)` | Téma kedvelése/nem kedvelése |
| | `toggleCommentLike/Dislike(commentId)` | Komment kedvelése/nem kedvelése |
| **Szűrés** | `filterTopics(topics, filters)` | Témák szűrése és rendezése |
| | `getAllTags(topics)` | Összes címke kinyerése |
| | `getLatestForumActivity(limit)` | Legfrissebb tevékenységek |

#### Működési logika
- Minden adat a böngésző `localStorage`-ában tárolódik.
- Első betöltéskor mock adatok generálódnak (10 előre definiált szakmai téma).
- A reakciók felhasználónként követhetők.
- Szűrés: keresés (cím + tartalom), címke, szakterület, rendezés (dátum, cím).

#### Storage kulcsok
| Kulcs | Típus | Leírás |
|---|---|---|
| `forumTopics` | `ForumTopic[]` | Témák listája |
| `forumComments` | `ForumComment[]` | Összes hozzászólás |
| `forumUserReactions` | `UserReactions` | Reakciók |
| `forumDataVersion` | `string` | Verzió a frissítéshez |

---

### 4.3. Segédfüggvények (utils.ts, pharmacy-utils.ts)

**Forrásfájlok:** `lib/utils.ts`, `lib/pharmacy-utils.ts`

#### Funkciók

| Függvény | Modul | Leírás |
|---|---|---|
| `formatDate(dateStr)` | utils.ts | ISO dátum formázása `YYYY-MM-DD HH:MM` formátumra |
| `isAvailableInPharmacy(medicineId, pharmacyId)` | utils.ts | Determinisztikus mock készlet-elérhetőség szimuláció (hash-alapú, 50% valószínűség) |
| `getNearbyPharmacyStatusUpdate(medicineId, pharmacyId, baseDate)` | utils.ts | Determinisztikus mock utolsó frissítés dátum generálás (hash-alapú, max. 30 nap) |
| `getPharmacyOpeningStatus(pharmacy)` | pharmacy-utils.ts | Jelenlegi nyitvatartási státusz kiszámítása (Nyitva/Hamarosan zár/Zárva) és napi nyitvatartás formázása |

---

## 5. Típusdefiníciók

---

### 5.1. Fórum Típusok

**Forrásfájl:** `types/forum.ts`

#### Cél
TypeScript típusdefiníciók a közösségi fórum funkcióhoz.

#### Adatstruktúrák

| Típus | Leírás |
|---|---|
| `ForumTopic` | Fórumtéma: id, cím, leírás, címkék, szakterületek, szerző, anonimitás, dátum, reakciók, kommentszám |
| `ForumComment` | Hozzászólás: id, téma id, szerző, anonimitás, szöveg, dátum, reakciók |
| `UserReactions` | Felhasználói reakciók: téma like/dislike, komment like/dislike (Record<string, boolean>) |
| `TopicFilters` | Szűrési beállítások: keresés, tartalom keresés, címke, szakterületek, rendezés |
| `CreateTopicInput` | Új téma létrehozási bemenet |
| `CreateCommentInput` | Új komment létrehozási bemenet |
| `MedicalSpecialty` | Szakterületek uniótípusa (25 szakterület) |
| `MEDICAL_SPECIALTIES` | Fix szakterület lista (`const` tuple) |

#### Működési logika
- Minden adat `localStorage`-ban tárolódik.
- A szakterületek fix listából választhatók.
- Anonim hozzászólás esetén `authorId` = `null`, `authorName` = „Anonim".

---

## Összesítő: localStorage kulcsok

| Kulcs | Típus | Modul | Leírás |
|---|---|---|---|
| `medicine_favorites` | `Favorite[]` | Kedvencek | Kedvenc gyógyszerek listája |
| `medicine_subscriptions` | `Subscription[]` | Értesítések | Feliratkozott gyógyszerek listája |
| `nearby_pharmacy` | `Pharmacy` | Közeli patika | Beállított közeli gyógyszertár |
| `auth_session` | `{email, timestamp}` | Hitelesítés | Bejelentkezési munkamenet |
| `medicine_visible_columns` | `string[]` | Gyógyszerlista | Látható oszlopok konfigurációja |
| `medicine_column_order` | `string[]` | Gyógyszerlista | Oszlopok sorrendje |
| `medicine_card_visible_fields` | `string[]` | Gyógyszerlista | Kártya nézet látható mezők |
| `medicine_card_field_order` | `string[]` | Gyógyszerlista | Kártya nézet mezők sorrendje |
| `forumTopics` | `ForumTopic[]` | Fórum | Témák listája |
| `forumComments` | `ForumComment[]` | Fórum | Összes hozzászólás |
| `forumUserReactions` | `UserReactions` | Fórum | Felhasználói reakciók |
| `forumDataVersion` | `string` | Fórum | Adatverzió |

---

## Összesítő: Forrásfájl → Specifikáció

| # | Forrásfájl | Kategória | Specifikáció fejezet |
|---|---|---|---|
| 1 | `app/(dashboard)/dashboard/page.tsx` | Modul | 2.1. Irányítópult |
| 2 | `components/dashboard/StockChangesWidget.tsx` | Modul | 2.1.1. Készletváltozások Widget |
| 3 | `components/dashboard/PharmacyStockWidget.tsx` | Modul | 2.1.2. Közeli Patika Készlet Widget |
| 4 | `components/dashboard/CommunityActivityWidget.tsx` | Modul | 2.1.3. Közösségi Aktivitás Widget |
| 5 | `app/(dashboard)/gyogyszerek/page.tsx` | Modul | 2.2.1. Gyógyszer Lista |
| 6 | `app/(dashboard)/gyogyszerek/[...id]/page.tsx` | Modul | 2.2.2. Gyógyszer Adatlap |
| 7 | `components/medicines/MedicineCard.tsx` | Modul | 2.2.3. Gyógyszer Kártya |
| 8 | `components/medicines/MedicineDetailActions.tsx` | Modul | 2.2.4. Adatlap Műveletek |
| 9 | `components/medicines/MedicineStockInfo.tsx` | Modul | 2.2.5. Készletinformáció |
| 10 | `components/medicines/NearbyPharmacyStockIndicator.tsx` | Modul | 2.2.6. Közeli Patika Indikátor |
| 11 | `components/medicines/SimilarMedicines.tsx` | Modul | 2.2.7. Hasonló Termékek |
| 12 | `components/medicines/FavoriteRemovalModal.tsx` | Modul | 2.2.8. Kedvenc Eltávolítás Modal |
| 13 | `app/(dashboard)/gyogyszertarak/page.tsx` | Modul | 2.3.1. Gyógyszertárak Oldal |
| 14 | `components/pharmacies/PharmacyFinder.tsx` | Modul | 2.3.2. Gyógyszertár Kereső |
| 15 | `components/pharmacies/PharmacyMap.tsx` | Modul | 2.3.3. Gyógyszertár Térkép |
| 16 | `components/pharmacies/PharmacyCard.tsx` | Modul | 2.3.4. Gyógyszertár Kártya |
| 17 | `components/pharmacies/PharmacyStockModal.tsx` | Modul | 2.3.5. Készlet Modal |
| 18 | `app/(dashboard)/kozosseg/page.tsx` | Modul | 2.4.1. Fórum Főoldal |
| 19 | `app/(dashboard)/kozosseg/[topicId]/page.tsx` | Modul | 2.4.2. Téma Részletek |
| 20 | `components/forum/TopicCard.tsx` | Modul | 2.4.3. Téma Kártya |
| 21 | `components/forum/CreateTopicModal.tsx` | Modul | 2.4.4. Új Téma Modal |
| 22 | `components/forum/CommentSection.tsx` | Modul | 2.4.5. Hozzászólások |
| 23 | `components/layout/GlobalSearch.tsx` | Modul | 2.5. Globális Keresés |
| 24 | `components/layout/Navbar.tsx` | Modul | 2.6.1. Navigációs Sáv |
| 25 | `context/AuthContext.tsx` | Interfész | 2.6.2. Hitelesítési Context |
| 26 | `context/FavoriteContext.tsx` | Interfész | 3.1. Kedvencek |
| 27 | `context/NearbyPharmacyContext.tsx` | Interfész | 3.2. Közeli Patika |
| 28 | `context/NotificationContext.tsx` | Interfész | 3.3. Értesítések |
| 29 | `context/ToastContext.tsx` | Interfész | 3.4. Toast Üzenetek |
| 30 | `lib/data.ts` | Service | 4.1. Adatkezelő |
| 31 | `lib/forum-service.ts` | Service | 4.2. Fórum Szolgáltatás |
| 32 | `lib/utils.ts` | Service | 4.3. Segédfüggvények |
| 33 | `lib/pharmacy-utils.ts` | Service | 4.3. Segédfüggvények |
| 34 | `types/forum.ts` | Típus | 5.1. Fórum Típusok |
