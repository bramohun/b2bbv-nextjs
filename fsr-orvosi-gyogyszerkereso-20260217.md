# Orvosi Portál Rendszer - Funkcionális Specifikáció

> **Verzió:** 2.2 (Code-Based Generation)
> **Dátum:** 2026-02-17
> **Státusz:** 🏳️ Aktív
> **Fájl:** fsr-orvosi-gyogyszerkereso-20260217.md

---

## 1. BEVEZETÉS (BRIEF)

A rendszer egy szakmai orvosi portál, amelynek elsődleges célja a hiteles gyógyszerinformációk szolgáltatása, a gyógyszertári készletek nyomon követése, valamint egy zárt szakmai közösségi tér biztosítása orvosok számára.

**Fő pillérek:**
1.  **Gyógyszerinformáció:** Részletes, kereshető adatbázis valós idejű készletinformációkkal.
2.  **Gyógyszertárkereső:** "Közeli patika" funkcióval támogatott elérhetőségi rendszer.
3.  **Szakmai Fórum:** Moderált, szakosított kommunikációs felület.

---

## 2. FOGALMAK (CONCEPTS)

A rendszerben használt adatszerkezetek és entitások definíciója a kódbázis (`types/index.ts`, `types/forum.ts`, `user-service.ts`) alapján.

### 2.1. Felhasználó (User)
A rendszerbe regisztrált orvos vagy adminisztrátor.
*   **[Azonosító (id)](#felhasználó-azonosító):** Egyedi belső azonosító (pl. `user-1`).
*   **[Név (name)](#felhasználó-név):** A felhasználó teljes neve.
*   **[Email (email)](#felhasználó-email):** Elsődleges kapcsolattartási és belépési cím.
*   **[Másodlagos Email (secondaryEmail)](#felhasználó-másodlagos-email):** Alternatív értesítési cím.
*   **[Szerepkör (role)](#felhasználó-szerepkör):** `admin` (Rendszergazda) vagy `user` (Orvos).
*   **[Státusz (status)](#felhasználó-státusz):** `active` vagy `inactive`.
*   **[Szakterületek (specialties)](#orvosi-szakterület):** A felhasználó orvosi szakképesítéseinek listája.
*   **[Hírlevél Beállítások (newsletterSettings)](#hírlevél-beállítások):**
    *   *Közösségi értesítések:* Gyakoriság, téma, saját témák szűrése.
    *   *Készletértesítések:* Gyakoriság, témák (pl. "Újra elérhető"), hatókör (pl. "Szakterület + kedvenc").
*   **[Munkamenet Verzió (sessionVersion)](#munkamenet-verzió):** Biztonsági számláló a kijelentkeztetéshez.

### 2.2. Gyógyszer (Medicine)
A rendszer központi adata, a gyógyszerkészítmény.
*   **[TK-szám (tkSzam)](#tk-szám):** Egyedi Törzskönyvi Azonosító (elsődleges kulcs).
*   **[Név (nev)](#gyógyszer-név):** A készítmény kereskedelmi neve.
*   **[Hatóanyag (activeSubstance)](#hatóanyag):** A gyógyszer aktív összetevője (INN).
*   **[Státusz (status)](#gyógyszer-státusz):** `Elérhető`, `Készlethiány` vagy `Megszűnt`.
*   **[Ár (price)](#gyógyszer-ár):** Fogyasztói ár.
*   **[Frissítés Dátuma (lastUpdate)](#frissítés-dátuma):** Az adat utolsó módosításának ideje.
*   **[Hiány Információ (shortageInfo)](#hiány-információ):** Objektum, ha hiánycikk (Kezdete, Vége, Ok, Helyettesítő javaslat).
*   **További tulajdonságok:** Gyártó, Kiszerelés, Csomagolás, Kiadhatóság, Biztonsági elemek.

### 2.3. Gyógyszertár (Pharmacy)
Gyógyszertári szolgáltató pont.
*   **[Patika Név (nev)](#patika-név):** A gyógyszertár neve.
*   **[Cím Adatok](#cím-adatok):** Irányítószám, Város, Utca, Házszám, Geolokáció (GPS).
*   **[Nyitvatartás](#nyitvatartás):** Hétfőtől vasárnapig tartó nyitási és zárási idők.

### 2.4. Fórum Téma (ForumTopic)
Szakmai beszélgetés indító bejegyzése.
*   **[Szerző (author)](#szerző):** Kapcsolat a [Felhasználóhoz](#21-felhasználó-user). Lehet `Anonim`.
*   **[Szakterület (specialties)](#orvosi-szakterület):** Mely szakterületeket érinti (pl. "Kardiológia").
*   **[Moderálási Státuszok](#moderálási-státuszok):**
    *   `isHidden`: Admin által elrejtve.
    *   `isLocked`: Admin által lezárva (nem kommentelhető).
    *   `isAuthorAnonymized`: A szerző neve admin által elrejtve (GDPR/kérés).

### 2.5. Hozzászólás (ForumComment)
Reakció egy [Fórum Témára](#24-fórum-téma-forumtopic).
*   **Tulajdonságok:** Szöveg, Szerző, Dátum.
*   **Moderálási Státuszok:** Hasonló a témához (`isHidden`, `isAuthorAnonymized`).

### 2.6. Nézet Beállítások (ViewSettings)
A felhasználó egyéni beállításai a táblázatok megjelenítéséhez.
*   **[Látható Oszlopok (tableColumns)](#látható-oszlopok):** Mely oszlopok jelenjenek meg (Boolean map).
*   **[Oszlop Sorrend (tableColumnOrder)](#oszlop-sorrend):** Az oszlopok azonosítóinak rendezett listája.

### 2.7. Orvosi Szakterület (MedicalSpecialty)
Előre definiált lista (Enum).
*   *Értékek:* Háziorvos, Belgyógyász, Kardiológus, stb.

---

## 3. FELÜLETEK (SURFACES)

A rendszer felhasználói felületeinek specifikációja a `src/app` struktúra alapján.

### 3.1. Gyógyszerek Lista Oldal
**Útvonal:** `/gyogyszerek`
A központi felület a gyógyszeradatbázis böngészésére.

**Elemek:**
*   **[Keresőmező](#kereső):** Szabadszavas keresés (Név, Hatóanyag, TK-szám).
*   **[Szűrési Panel](#szűrési-panel):**
    *   *[Kedvencek Toggle](#kedvencek-szűrő):* Csak a kedvencnek jelölt elemek mutatása.
    *   *[Közeli Patika Toggle](#közeli-patika-szűrő):* Csak a kiválasztott patikában elérhető elemek.
    *   *[Nézet Gomb](#nézet-gomb):* Legördülő menü az oszlopok ki/bekapcsolásához.
*   **[Találati Táblázat](#találati-táblázat):**
    *   *Fejléc:* Kattintható (rendezés), Vonszolható (Drag & Drop átrendezés).
    *   *Sorok:* Egy gyógyszer adatai. Különleges oszlopok:
        *   `Közeli patika`: Elérhetőség kijelzése (zöld/szürke badge).
        *   `Közeli patika frissítve`: Mikor frissült az adat a kiválasztott patikában.
        *   `Műveletek`: Kedvenc (csillag), Értesítés (csengő), Részletek gomb.
    *   *Oszlop Szűrők:* Minden oszlop alatt specifikus beviteli mező (Text, Dropdown, Date Range).

**Interakciók:**
*   **[Rendezés](#lista-rendezés):** Oszlopfejlécre kattintva (Növekvő/Csökkenő/Visszaállítás). Támogatja a patika-specifikus adatokat is.
*   **[Átrendezés (D&D)](#oszlop-átrendezés):** Fejléc megragadásával az oszlopok sorrendje módosítható.
*   **[Lapozás](#lapozás):** Oldalszám választó a lista alján.

### 3.2. Fórum Adminisztráció
**Útvonal:** `/admin/forum`
Az adminisztrátorok moderációs felülete.

**Elemek:**
*   **[Téma Lista](#téma-lista):** Táblázatos nézet, amely tartalmazza a rejtett elemeket is.
*   **[Műveleti Gombok](#műveleti-gombok):** Minden sor végén dropdown menü.
    *   *Szerkesztés:* Szöveges tartalom módosítása.
    *   *Lezárás/Feloldás:* Hozzászólások tiltása/engedélyezése.
    *   *Elrejtés/Megjelenítés:* Láthatóság kapcsolása.
    *   *Anonimizálás:* Szerző nevének végleges törlése.
*   **[Részletek (Lenyitható)](#részletes-nézet):** A sorra kattintva megjelennek a témához tartozó hozzászólások, hasonló moderációs lehetőségekkel.

**Modális Ablakok:**
*   **[Megerősítő Modal](#megerősítő-modal):** Kritikus műveletek (pl. Anonimizálás, Elrejtés) előtt kér jóváhagyást.
*   **[Szerkesztő Modal](#szerkesztő-modal):** Szövegdoboz a tartalom átírásához.

### 3.3. Fejléc (Navbar)
Globális navigációs komponens.
*   **Elemek:** Menüpontok (Gyógyszerek, Patikák, Fórum), Profil legördülő, [Közeli Patika Widget](#közeli-patika-widget).

---

## 4. FUNKCIÓK (FUNCTIONS)

A rendszer üzleti logikájának és folyamatainak leírása.

### 4.1. Gyógyszer Lista Kezelése
Ez a funkció biztosítja a rugalmas adatmegjelenítést.

*   **[Keresés és Szűrés](#keresés-logika):**
    *   A keresőmező egyszerre keres a `Név`, `Hatóanyag` és `TK-szám` mezőkben.
    *   A szűrés kombinatív (ÉS kapcsolat): Keresőszó ÉS Státusz ÉS Oszlop szűrők ÉS Kedvenc/Patika kapcsolók.
    *   *Dátum Szűrés:* Intervallum alapú (tól-ig) szűrés a `lastUpdate` és `nearbyPharmacyLastUpdate` mezőkre.
*   **[Oszlop Átrendezés](#oszlop-átrendezés-logika):**
    *   A felhasználó "Drag and Drop" módszerrel áthelyezheti a táblázat oszlopait.
    *   Az új sorrend automatikusan mentésre kerül a böngésző `localStorage`-ba (`medicineViewSettings`).
    *   A "Műveletek" oszlop mindig a sor végén marad fixálva.

### 4.2. Közeli Patika Logika
A rendszer perszonalizációs eleme.

*   **[Kiválasztás](#patika-kiválasztás):** A felhasználó a Patikakeresőben kiválaszt egy "Közeli patikát".
*   **[Hatás a Gyógyszerlistára](#patika-hatás):**
    *   Ha van kiválasztott patika, megjelennek a `nearbyPharmacyStock` és `nearbyPharmacyLastUpdate` adatok.
    *   Lehetővé válik a szűrés kifejezetten a patikában elérhető termékekre.
    *   A listában megjelenik egy vizuális jelzés (Badge), hogy az adott gyógyszer elérhető-e a választott patikában.

### 4.3. Kedvencek és Értesítések
Összekapcsolt kényelmi funkciók.

*   **[Feliratkozás](#feliratkozás-folyamat):**
    *   Ha a felhasználó értesítést kér (csengő ikon) egy gyógyszerre, az automatikusan `Kedvenc`-cé is válik.
*   **[Eltávolítás](#eltávolítás-folyamat):**
    *   Ha a felhasználó törölni akar egy Kedvencet, amire aktív Értesítése van, a rendszer **figyelmeztető megerősítést** kér (`FavoriteRemovalModal`).
    *   Megerősítés esetén a Kedvenc státusz és az Értesítés is törlődik.

### 4.4. Fórum Moderálás (Admin)
Az adminisztrátorok jogkörei a tartalom felett.

*   **[Elrejtés](#téma-elrejtés):** A tartalom (Téma vagy Komment) megmarad az adatbázisban, de a publikus felületen nem jelenik meg (`isHidden = true`).
*   **[Lezárás](#téma-lezárás):** A Téma látható marad, de új hozzászólás nem írható hozzá (`isLocked = true`).
*   **[Anonimizálás](#szerző-anonimizálás):**
    *   A szerző neve felülírásra kerül (`Anonim`-ra), az `isAuthorAnonymized` flag `true` lesz.
    *   Ez a lépés visszafordíthatatlan (GDPR megfelelőség).
*   **[Tartalom Szerkesztés](#tartalom-szerkesztés):** Az admin átírhatja a bejegyzés szövegét (pl. trágár kifejezések eltávolítása).

### 4.5. Bejelentkezés és Jogosultság
*   **Hitelesítés:** Simple email/password check (`UserService.validateCredentials`).
*   **Demo Jelszó:** A prototípus minden felhasználónál a `vény123` jelszót fogadja el.
*   **Munkamenet:** `localStorage` alapú munkamenet kezelés verziószámmal (`sessionVersion`). Ha a verzió szerver oldalon (mock) nő, a kliens kijelentkeztet.
