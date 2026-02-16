# Konszolidált Funkcionális Specifikáció

> **Verzió:** 2.0  
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
   - 2.6. [Hitelesítés és Jogosultságok](#26-hitelesítés-és-jogosultságok)
   - 2.7. [Adminisztráció](#27-adminisztráció)
   - 2.8. [Felhasználói Profil és Beállítások](#28-felhasználói-profil-és-beállítások)
3. [Rendszerszintű Funkciók](#3-rendszerszintű-funkciók)
   - 3.1. [Kedvencek Kezelése](#31-kedvencek-kezelése)
   - 3.2. [Közeli Gyógyszertár Kezelése](#32-közeli-gyógyszertár-kezelése)
   - 3.3. [Értesítés Kezelése](#33-értesítés-kezelése)
   - 3.4. [Rendszerüzenetek](#34-rendszerüzenetek)

---

## 1. Rendszer áttekintés

A rendszer egy orvosi portál alkalmazás, amely a következő fő modulokból áll:

| Modul | Leírás |
|---|---|
| **Irányítópult** | Aggregált nézet a készletváltozásokról, közeli patika állapotáról és közösségi aktivitásról. |
| **Gyógyszer Nyilvántartás** | Gyógyszerek keresése, szűrése, részletes adatlap, kedvencek és értesítések kezelése. |
| **Gyógyszertár Kereső** | Térképes és listás gyógyszertár kereső, „Közeli patika" funkció. |
| **Közösségi Fórum** | Szakmai témák, hozzászólások, reakciók. |
| **Globális Keresés** | Egységes keresés gyógyszerek, gyógyszertárak és fórum témák között. |
| **Hitelesítés** | Bejelentkezés, elfelejtett jelszó, munkamenet kezelés. |
| **Adminisztráció** | Felhasználók, fórum moderálás, gyógyszertárak kezelése (admin jogosultsággal). |
| **Felhasználói Profil** | Profiladatok, szakterületek, hírlevél beállítások, kedvencek és értesítések kezelése. |

---

## 2. Modul specifikációk

---

### 2.1. Irányítópult (Dashboard)

#### Felhasználói igény
Felhasználóként egy gyors áttekintést szeretnék kapni a rendszer legfontosabb adatairól: készletváltozások, közeli patika készletadatok, és a legfrissebb közösségi aktivitás. Az irányítópult összesíti a legfontosabb információkat egyetlen nézetben.

#### Funkciók
- Összesített nézet három fő információs blokkal:
  - **Készletváltozások:** A legfrissebb piaci változások nyomon követése.
  - **Közeli Patika Készlet:** A kiválasztott gyógyszertár státuszának figyelése.
  - **Közösségi Aktivitás:** A fórum legújabb eseményeinek megjelenítése.
- Időszak szűrő a megjelenített adatokhoz.
- A blokkok a fő oldalakra vezető linkeket tartalmaznak a részletes megtekintéshez.

---

#### 2.1.1. Készletváltozások Blokk

##### Felhasználói igény
Felhasználóként szeretném látni, hogy az általam figyelt időszakban milyen készletváltozások történtek (megszűnés, készlethiány, elérhetőség), és gyorsan el szeretnék jutni a részletekhez.

##### Funkciók
- Összesítő statisztikák megjelenítése (Megszűnt, Készlethiány, Elérhető darabszámok).
- Az egyes státuszokra kattintva a gyógyszerlistára navigálás a megfelelő szűrőkkel.
- Időszak-szűrt lista a legfrissebb készletváltozásokról.
- A lista elemei közvetlenül linkelnek a termék adatlapokra.

##### Működési elv
- A rendszer a kapott gyógyszerlistát szűri a felhasználó által kiválasztott időszak alapján.
- Kattintható statisztikák, amelyek előszűrt állapotban nyitják meg a gyógyszer listát.

---

#### 2.1.2. Közeli Patika Készlet Blokk

##### Felhasználói igény
Felhasználóként szeretném látni a beállított közeli patikám készletváltozásait, vagy ha nincs beállítva, egy térképet a kiválasztáshoz.

##### Funkciók
- **Ha van beállított közeli patika:**
  - Összesítő statisztikák (Készleten, Nem elérhető darabszámok) a közeli patikára vonatkozóan.
  - Az egyes státuszokra kattintva a gyógyszerlistára navigálás, szűrve a közeli patika elérhetőségre.
  - Legfrissebb készletváltozások listája a kiválasztott patikában.
  - „Összes gyógyszertári változás" link, amely a rendezett listára visz.
- **Ha nincs beállított közeli patika:**
  - Térképes nézet megjelenítése.
  - Felkérés a közeli patika beállítására.

##### Működési elv
- A rendszer nyilvántartja a felhasználó által beállított preferált patikát.
- Valós idejű vagy szimulált készletinformációk megjelenítése.

---

#### 2.1.3. Közösségi Aktivitás Blokk

##### Felhasználói igény
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

##### Felhasználói igény
Felhasználóként egy központi áttekintő felületen szeretném böngészni az összes nyilvántartott gyógyszert, amelyet hatékony kereséssel, szűréssel, rendezéssel és testreszabható nézettel használhatok.

##### Funkciók
- **Keresés:** Szabad szöveges keresés név, TK-szám, hatóanyag, ATC-kód és gyártó alapján.
- **Szűrés státusz alapján:** Elérhető / Készlethiány / Megszűnt.
- **Szűrés közeli patika elérhetőség alapján:** Csak a közeli patikában elérhető / nem elérhető termékek.
- **Rendezés:** Név, TK-szám, Státusz, Utolsó frissítés, Közeli patika elérhetősége szerint.
- **Nézet váltás:** Táblázatos nézet és kártya nézet között.
- **Oszlop/mező testreszabás:** Felhasználó kiválaszthatja a látható oszlopokat/mezőket, átrendezheti őket. A beállításokat a rendszer megjegyzi.
- **Lapozás:** Oldalankénti bontás a könnyebb áttekinthetőségért.
- **Kedvencek kezelése:** Gyógyszerek hozzáadása/eltávolítása a kedvencek közül.
- **Értesítés kezelése:** Feliratkozás/leiratkozás készletváltozás értesítésekre. Feliratkozáskor automatikusan kedvenc is lesz.
- **URL paraméterek támogatása:** A szűrő feltételek megosztható URL-ként működnek.

##### Működési elv
- Gyors, kliens oldali szűrés és rendezés a betöltött adatokon.
- A nézet beállítások (oszlop sorrend, láthatóság) tartósan tárolódnak a felhasználó eszközén.
- **Közeli patika logika:** Ha közeli patika van beállítva, a releváns oszlopok automatikusan megjelennek.

---

#### 2.2.2. Gyógyszer Adatlap

##### Felhasználói igény
Felhasználóként a kiválasztott gyógyszer összes részletes adatát szeretném egy helyen látni, beleértve a készletinformációkat, státusz előzményeket, és elérhető helyettesítő termékeket.

##### Funkciók
- **Termékadatok megjelenítése:** Név, TK-szám, INN (hatóanyag, kattintható link), ATC-kód, Kiszerelés, Gyártó, Kiadhatóság, Forgalmazhatóság dátuma.
- **Kedvenc és Értesítési műveletek.**
- **Készletinformációk:** Készleten/Rendelésre hány gyógyszertárban. „Megnézem hol" funkció.
- **Készlethiány részletei:** Hiány kezdete, tervezett vége, oka, javaslat a pótlásra (ha van).
- **Hasonló hatóanyagú termékek:** Helyettesítő termékek listája.
- **Státusz előzmények:** A termék életútjának megjelenítése.
- **Közeli patika elérhetőség.**

##### Működési elv
- A rendszer az egyedi azonosító alapján tölti be az adatokat.
- Automatikus lekérdezés a hasonló termékek megjelenítéséhez.

---

#### 2.2.3. Gyógyszer Kártya Nézet

##### Felhasználói igény
Felhasználóként a gyógyszerlista kártya nézetében szeretném látni a legfontosabb termék adatokat és gyorsan hozzáférni a kedvenc/értesítés funkciókhoz.

##### Funkciók
- Termék alapvető adatainak megjelenítése a nézet beállítások szerint.
- Státusz jelölő (Elérhető/Készlethiány/Megszűnt).
- Kedvencekhez adás / eltávolítás gomb.
- Értesítés kérése / lemondása gomb.
- „Részletek" link a termék adatlapra.
- Közeli patika készlet indikátor (amennyiben be van állítva közeli patika).

---

#### 2.2.4. Termék Adatlap Műveletek

##### Felhasználói igény
Felhasználóként a termék adatlapján szeretném kezelni a kedvenc státuszt és az értesítés feliratkozást.

##### Funkciók
- Kedvencekhez adás / eltávolítás.
- Értesítés kérése / lemondása.
- Kedvenc eltávolítása esetén figyelmeztetés, ha értesítés is aktív.

---

#### 2.2.5. Készletinformáció

##### Felhasználói igény
Felhasználóként látni szeretném a termék készletinformációit és a „Megnézem hol" linkre kattintva egy térképes listát a patikákról.

##### Funkciók
- Készlet / Rendelés információk megjelenítése (hány gyógyszertárban elérhető készleten, hány helyen rendelésre).
- „Megnézem hol" gomb: Felugró ablak megnyitása a megfelelő szűréssel.

---

#### 2.2.6. Közeli Patika Készlet Indikátor

##### Felhasználói igény
Felhasználóként szeretném látni a termékoldalon, hogy a kedvencnek jelölt közeli patikámban elérhető-e az adott gyógyszer, hogy tudjam, érdemes-e oda mennem.

##### Funkciók
- Közeli patika azonosítása.
- Készletinformáció megjelenítése.
- Státuszjelző megjelenítése (Elérhető – Zöld, Nem elérhető – Szürke).
- **Utolsó frissítés időpontja:** A státusz mellett megjelenik az adat frissítésének időpontja is, hogy a felhasználó lássa az információ aktualitását.

---

#### 2.2.7. Hasonló Hatóanyagú Termékek

##### Felhasználói igény
Felhasználóként szeretném látni a kiválasztott gyógyszerrel megegyező hatóanyagú, de jelenleg elérhető egyéb készítményeket, hogy készlethiány esetén alternatívát találhassak, vagy összehasonlíthassam a lehetőségeket.

##### Funkciók
- Hasonló termékek táblázatos megjelenítése.
- Csak az „Elérhető" státuszú termékek szűrése és megjelenítése.
- Gyors navigáció a helyettesítő termék adatlapjára.
- **Kedvenc funkció:** A hasonló termékek is kedvencnek jelölhetők a listában.
- **Közeli patika elérhetőség:** Megmutatjuk, hogy az adott termék elérhető-e a felhasználó kedvenc patikájában.

##### Működési elv
- A rendszer a termék hatóanyaga alapján keres helyettesítőket.
- Csak releváns, elérhető találatok jelennek meg.

---

#### 2.2.8. Kedvenc Eltávolítás Figyelmeztetés

##### Felhasználói igény
Felhasználóként szeretnék figyelmeztetést kapni, ha egy olyan terméket veszek ki a kedvencek közül, amelyre értesítést kértem, mert az értesítés is meg fog szűnni.

##### Funkciók
- Figyelmeztető üzenet megjelenítése.
- Megerősítés (Kedvenc + Értesítés eltávolítása).
- Megszakítás (Visszatérés az eredeti állapothoz).
- „Mégsem" opció a visszavonáshoz, „Igen" az eltávolításhoz.

---

### 2.3. Gyógyszertár Kereső

---

#### 2.3.1. Gyógyszertárak Oldal

##### Felhasználói igény
Felhasználóként szeretnék gyógyszertárak után keresni és látni az elhelyezkedésüket.

##### Funkciók
- A központi gyógyszertár kereső felület megjelenítése térképpel és listával.

---

#### 2.3.2. Gyógyszertár Kereső Modul

##### Felhasználói igény
Felhasználóként keresni szeretnék a gyógyszertárak között, látni azok elhelyezkedését térképen és listában. Ezt a felületet használom a fő gyógyszertár kereső oldalon és a termék-specifikus készlet nézetben is.

##### Funkciók
- **Gyógyszertár kereső:** Cím, név, város alapján.
- **Kétnézetes megjelenítés:** Térkép / Lista (mobilon váltható).
- **Szűrhető patika lista:** Kereső szöveg, térkép láthatóság, nyitvatartás alapján.
- **Speciális szűrők:** „Most nyitva", „Hétvégén nyitva", „0-24 órában nyitva".
- **Térkép szinkronizáció:** A lista csak a térképen látható patikákat mutatja.
- **Találati számok kijelzése.**
- **„Mutasd az összest" funkció:** Térkép visszaállítása az összes találat megjelenítéséhez.

---

#### 2.3.3. Gyógyszertár Térkép

##### Felhasználói igény
Felhasználóként vizuálisan szeretném látni a gyógyszertárak elhelyezkedését egy térképen, hogy földrajzi közelség alapján választhassak közülük, és egy kattintással „Közeli gyógyszertárnak" jelölhessem bármelyiket.

##### Funkciók
- Interaktív térkép megjelenítése.
- Gyógyszertárak jelölése a térképen.
- Jelölőre kattintva információs ablak a patika adataival és nyitvatartással.
- „Közeli patikának jelölöm" funkció az ablakból.
- Térkép automatikus mozgatása a kiválasztott patikára.

---

#### 2.3.4. Gyógyszertár Listaelem

##### Felhasználói igény
Felhasználóként látni szeretném egy gyógyszertár alapvető adatait (név, cím, nyitvatartás, elérhetőség) egy listaelemként, hogy kiválaszthassam a számomra legmegfelelőbbet, és megjelölhessem mint „Közeli gyógyszertár".

##### Funkciók
- Gyógyszertár adatainak megjelenítése (név, cím, irányítószám, település, telefon).
- Nyitvatartási státusz (Nyitva / Hamarosan zár / Zárva) és napi nyitvatartási idő megjelenítése.
- „Mutasd térképen" gomb, amely a térképen az adott patikára ugrik.
- Kiválasztott állapot vizuális jelzése.
- „Közeli patikának jelölöm" gomb.

---

#### 2.3.5. Gyógyszertári Készlet Nézet

##### Felhasználói igény
Felhasználóként szeretném látni egy konkrét termék elérhetőségét (készlet vagy rendelés) gyógyszertárakra lebontva, térképes és listás nézetben.

##### Funkciók
- Teljes képernyős vagy felugró megjelenítés.
- A gyógyszertár kereső funkcióinak biztosítása termék-specifikus szűréssel.
- Kizárólag a készlettel rendelkező vagy rendelést fogadó patikák megjelenítése.

---

### 2.4. Közösségi Fórum

---

#### 2.4.1. Fórum Főoldal

##### Felhasználói igény
Felhasználóként szakmai témákat szeretnék böngészni, keresni és új témákat indítani a közösségi fórumon.

##### Funkciók
- Fórum témák listázása.
- Szabad szöveges keresés (cím és tartalom alapján is).
- Szűrés szakterület és címke alapján.
- Rendezés: dátum és cím szerint.
- Új téma létrehozása gomb.
- Megosztható URL paraméterek támogatása.

---

#### 2.4.2. Téma Részletek Oldal

##### Felhasználói igény
Felhasználóként egy kiválasztott fórum téma minden részletét szeretném látni (cím, leírás, szerző, reakciók), valamint hozzászólásokat olvasni és írni.

##### Funkciók
- Téma részletes adatainak megjelenítése.
- Reakciók kezelése (like/dislike) témákra és hozzászólásokra.
- Hozzászólások megjelenítése.
- Új hozzászólás írása anonim opcióval.
- Vissza navigálás a fő fórum oldalra.

---

#### 2.4.3. Téma Kártya

##### Felhasználói igény
Felhasználóként át szeretném tekinteni a fórum témákat listában, és szeretném látni, ha egy bejegyzés anonim módon készült.

##### Funkciók
- Kattintás a kártyára a részletek megtekintéséhez.
- Szakterület és címke jelölők megjelenítése (szűrhető linkek).
- Szerző, dátum és reakció statisztikák.
- Leírás előnézet.
- Anonim szerző esetén vizuális megkülönböztetés.

---

#### 2.4.4. Új Téma Létrehozása

##### Felhasználói igény
Felhasználóként új szakmai témát szeretnék indítani a fórumon, és szeretném anonim módon közzétenni a bejegyzésemet, hogy ne legyen azonosítható a személyazonosságom.

##### Funkciók
- Cím és leírás megadása.
- Címkék hozzáadása.
- Szakterületek kiválasztása vagy „Általános" megjelölés.
- Anonim mód kapcsoló.
- Kötelező mezők ellenőrzése.
- Az anonim mód bekapcsolásával a szerző neve rejtve marad.

---

#### 2.4.5. Hozzászólások Kezelése

##### Felhasználói igény
Felhasználóként hozzá szeretnék szólni egy témához, és anonim módon is hozzá szeretnék szólni, hogy ne látszódjon a nevem.

##### Funkciók
- Kommentek listájának megtekintése időrendben.
- Új komment írása szöveges mezőben.
- Anonim hozzászólás opció.
- Kommentek kedvelése/nem kedvelése.

---

### 2.5. Globális Keresés

#### Felhasználói igény
Felhasználóként gyorsan szeretnék keresni a rendszer teljes tartalmában (gyógyszerek, gyógyszertárak, fórum témák), hogy egyetlen bemeneti mezőből elérhessem a keresett információt.

#### Funkciók
- Szabad szöveges keresés a navigációs sávból.
- Eredmények kategóriákra bontva: Gyógyszerek, Gyógyszertárak, Közösségi témák.
- Kategória szűrő fülek.
- Azonnali keresés és találatmegjelenítés.
- Kattintásra navigáció a megfelelő adatlapra.

---

### 2.6. Hitelesítés és Jogosultságok

---

#### 2.6.1. Navigációs Sáv

##### Felhasználói igény
Felhasználóként intuitív navigációs sávot szeretnék, amelyen gyorsan elérem a keresőt, a kedvenceimet, a közeli patikámat és a profilomat.

##### Funkciók
- Navigációs linkek a fő modulokhoz.
- Globális keresés beágyazása.
- **Közeli patika információ:** A beállított patika nevének megjelenítése és gyors elérése.
- **Kedvencek menü:** A kedvencnek jelölt gyógyszerek gyorslistája.
- Felhasználói profil menü.

---

#### 2.6.2. Hitelesítés Kezelése

##### Felhasználói igény
Felhasználóként szeretném, ha a rendszer védett lenne, így csak az illetékesek láthatnák a szenzitív adatokat. Egy egyszerű bejelentkező felületen keresztül szeretnék belépni.

##### Funkciók
- Bejelentkezési állapot és jogosultságok biztonságos kezelése.
- Felhasználói szerepkörök kezelése (Adminisztrátor / Felhasználó).
- Munkamenet érvényességének folyamatos ellenőrzése.
- Adatok perzisztenciája a kényelmes használat érdekében.
- Automatikus átirányítás a bejelentkező oldalra, ha a felhasználó nincs belépve.

---

#### 2.6.3. Bejelentkezés Oldal

##### Felhasználói igény
Felhasználóként szeretnék bejelentkezni a rendszerbe az email címemmel és jelszavammal, hogy hozzáférjek a belső funkciókhoz.

##### Funkciók
- Email és jelszó mezők megjelenítése.
- Hibaüzenet megjelenítése sikertelen belépés esetén.
- „Elfelejtett jelszó?" funkció elérhetősége.

---

#### 2.6.4. Elfelejtett Jelszó

##### Felhasználói igény
Felhasználóként, ha elfelejtem a jelszavamat, szeretnék lehetőséget kapni a belépésre egy egyszer használatos kód vagy mágikus link segítségével.

##### Funkciók
- Email cím megadása.
- Jelszó-visszaállítási folyamat indítása.
- Visszajelzés a felhasználónak a sikeres kérésről.

---

### 2.7. Adminisztráció

---

#### 2.7.1. Adminisztrációs Felület

##### Felhasználói igény
Adminisztrátorként egy elkülönített felületen szeretném kezelni a rendszer adminisztratív funkcióit, ahol fülekkel navigálhatok a különböző kezelési területek között.

##### Funkciók
- Jogosultság ellenőrzés: csak adminisztrátorok férhetnek hozzá.
- Navigáció a Felhasználók, Gyógyszertárak és Fórum Moderálás területek között.

---

#### 2.7.2. Felhasználók Kezelése

##### Felhasználói igény
Adminisztrátorként szeretném kezelni a rendszer felhasználóit: listázni, hozzáadni, szerkeszteni, deaktiválni, kijelentkeztetni és jelszavakat visszaállítani.

##### Funkciók
- **Felhasználók listázása:** Részletes lista a rendszer felhasználóiról.
- **Új felhasználó hozzáadása:** Űrlap az adatok megadásával.
- **Felhasználó szerkesztése:** Személyes adatok, szakterületek és hírlevél beállítások módosítása.
- **Jelszó visszaállítás:** Lehetőség a felhasználó jelszavának alaphelyzetbe állítására.
- **Felhasználó deaktiválása/aktiválása:** Hozzáférés megvonása vagy visszaadása.
- **Felhasználó kényszerített kijelentkeztetése.**

---

#### 2.7.3. Fórum Moderálás

##### Felhasználói igény
Adminisztrátorként szeretném moderálni a fórum tartalmakat: témákat elrejteni, lezárni, szerkeszteni és anonimizálni, valamint a hozzászólásokat kezelni.

##### Funkciók
- **Összes téma listázása:** Beleértve a rejtett témákat is.
- **Téma műveletek:** Elrejtés, lezárás, tartalom szerkesztése, szerző anonimizálása.
- **Hozzászólások kezelése:** Moderálás, szerkesztés, elrejtés.
- **Megerősítés:** Biztonsági kérdések a visszafordíthatatlan műveletek előtt.
- **Anonimizálás:** A tartalom megmarad, de a szerző kiléte törlődik.

---

#### 2.7.4. Gyógyszertárak Áttekintése

##### Felhasználói igény
Adminisztrátorként szeretném áttekinteni a rendszerben nyilvántartott gyógyszertárakat, keresni közöttük, és megtekinteni az alapvető információkat.

##### Funkciók
- **Gyógyszertárak listázása:** Alapadatok és szinkronizációs státuszok megjelenítése.
- **Keresés:** Gyorskeresés a listában.
- **Nyitvatartási státusz:** Aktuális állapot kijelzése.

---

### 2.8. Felhasználói Profil és Beállítások

---

#### 2.8.1. Profil Oldal

##### Felhasználói igény
Felhasználóként szeretném megtekinteni és kezelni a saját profiladataimat, hogy naprakészen tarthassam az adataimat, valamint biztonsági és kényelmi funkciókat érhessek el.

##### Funkciók
- **Alapadatok megjelenítése.**
- **Szakterületek módosítása:** Érdeklődési körök beállítása.
- **Jelszó módosítási lehetőség.**
- **Hírlevél beállítások kezelése:**
  - *Közösség/Fórum:* Értesítések gyakorisága, témakörök.
  - *Készletinfó:* Értesítések készlethiányról, újra elérhető termékekről.
- **Kijelentkezés.**

---

#### 2.8.2. Kedvencek Oldal

##### Felhasználói igény
Felhasználóként szeretném egy külön felületen látni az összes kedvencnek jelölt gyógyszeremet, hogy gyorsan elérhessem őket és szükség esetén eltávolíthassak elemeket a listából, illetve feliratkozhassak értesítésekre.

##### Funkciók
- **Kedvenc gyógyszerek listázása.**
- **Közvetlen navigáció** a gyógyszer adatlapjára.
- **Kezelés:** Eltávolítás, értesítés feliratkozás.

---

#### 2.8.3. Értesítések Oldal

##### Felhasználói igény
Felhasználóként szeretném áttekinteni az összes aktív értesítés-feliratkozásomat, hogy szükség esetén leiratkozhassak róluk.

##### Funkciók
- **Feliratkozott gyógyszerek listázása.**
- **Közvetlen navigáció** a gyógyszer adatlapjára.
- **Leiratkozás** lehetősége.

---

## 3. Rendszerszintű Funkciók

---

### 3.1. Kedvencek Kezelése

#### Felhasználói igény
Felhasználóként szeretném a számomra fontos gyógyszereket kedvencnek jelölni, hogy később gyorsan elérhessem őket a listában anélkül, hogy értesítéseket kapnék a változásaikról.

#### Funkciók
- Gyógyszerek hozzáadása a kedvencekhez.
- Gyógyszerek eltávolítása a kedvencekből visszavonási lehetőséggel.
- A rendszer tartósan megjegyzi a felhasználó választásait az eszközön.

---

### 3.2. Közeli Gyógyszertár Kezelése

#### Felhasználói igény
Felhasználóként szeretnék beállítani egy „Közeli gyógyszertárat", ami számomra kiemelt fontosságú (pl. az orvosi rendelőmhöz legközelebbi), hogy gyorsan elérhessem annak adatait a navigációs sávban.

#### Funkciók
- Közeli gyógyszertár beállítása és törlése.
- Egyszerre csak egy kiemelt gyógyszertár kezelése.
- A kiválasztás azonnal érvényesül minden felületen (térkép, listák, fejléc).

---

### 3.3. Értesítés Kezelése

#### Felhasználói igény
Felhasználóként szeretnék értesítéseket kérni bizonyos gyógyszerek készletváltozásairól, hogy időben értesüljek a státuszváltozásokról.

#### Funkciók
- Feliratkozás és leiratkozás készletváltozás értesítésre.
- A feliratkozáskor a rendszer automatikusan kedvencként is megjelöli a terméket.
- A beállításokat a rendszer megőrzi.

---

### 3.4. Rendszerüzenetek

#### Felhasználói igény
Felhasználóként szeretnék visszajelzést kapni bizonyos műveletek után (pl. kedvenc eltávolítása), és lehetőséget kapni a művelet visszavonására egy rövid időablakon belül.

#### Funkciók
- Rövid ideig megjelenő üzenetek (Toast) használata.
- Időzített automatikus eltűnés.
- Vizuális visszajelzés az üzenet élettartamáról.
- Visszavonás funkció támogatása kritikus műveleteknél.
