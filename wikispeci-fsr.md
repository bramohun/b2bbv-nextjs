# Orvosi Portál Rendszer - Wikispeci

> **Verzió:** 2.1 (Code-Based)
> **Dátum:** 2026-02-17
> **Státusz:** 🏳️ Aktív

---

## 1. BRIEF

A rendszer egy átfogó orvosi portál alkalmazás, melynek célja, hogy naprakész információt biztosítson gyógyszerekről és gyógyszertárakról a felhasználói számára.

**Célcsoport:** Orvosok, gyógyszerészek és egészségügyi szakemberek.
**Technológia:** Web alapú alkalmazás (Next.js), reszponzív megjelenítéssel.
**Akadálymentesség és SEO Irányelvek:** Törekedni kell a WCAG 2.2 alapelvekre, de zárt rendszer lévén a maximális megfelelőség és a klasszikus keresőoptimalizálás nem követelmény. A böngésző lapfül címének kötelező egységes formátuma: `"{lap neve} | BENUvény Orvosi Portál"`.

---

## 2. CÉLOK (EPICS)

Az alábbi stratégiai célokat fogalmaztuk meg a rendszerrel kapcsolatban:

*   **Naprakész Gyógyszerinformáció:** A felhasználók azonnal értesüljenek a készlethiányokról, megszűnésekről és elérhető helyettesítő termékekről.
*   **Gyógyszertár Elérhetőség:** A felhasználók könnyen találjanak nyitva tartó és készlettel rendelkező gyógyszertárakat, különös tekintettel a saját "közeli patikájukra".
*   **Hatékony Adminisztráció:** A rendszer karbantartása és a felhasználók kezelése központi felületen.

---

## 3. FOGALMAK (ADATBÁZIS)

Ebben a fejezetben definiáljuk a rendszerben előforduló entitásokat és azok tulajdonságait, szinkronban a `types/index.ts` és `lib/user-service.ts` definíciókkal.

### 3.1. Felhasználó (User)
A rendszerbe regisztrált személy.
*   **Azonosító (id):** Egyedi belső azonosító (pl. `user-1`).
*   **Név (name):** Felhasználó teljes neve.
*   **Email cím (email):** Egyedi azonosító, belépéshez szükséges (elsődleges).
*   **Másodlagos email (secondaryEmail):** Opcionális alternatív email cím.
*   **Jelszó:** Titkosított hitelesítési adat (Demo: fix "vény123").
*   **Szerepkör (role):** [Jogosultság](#36-jogosultság) (`admin` vagy `user`).
*   **Státusz (status):** `active` (Aktív) vagy `inactive` (Inaktív).
*   **Munkamenet verzió (sessionVersion):** Belső számláló a felhasználó érvényes bejelentkezéseinek kezeléséhez. Kijelentkeztetéskor növekszik.
*   **Utolsó bejelentkezés (lastLogin):** Az utolsó sikeres belépés időbélyege.
*   **Szakterületek (specialties):** Orvosi/szakmai érdeklődési körök listája (pl. 'Kardiológus', 'Belgyógyász').
*   **Hírlevél beállítások (newsletterSettings):** Összetett konfiguráció:
    *   **Elsődleges (primary) és Másodlagos (secondary):** Külön-külön állítható.
        *   *Készletinfó (stock):* Feliratkozva (igen/nem), Időpont (óra), Gyakoriság (Napi/Heti/Havi), Témák (pl. 'Újra elérhető', 'Készlethiány'), Hatókör (Minden/Szakterület + kedvenc/Csak szakterület/Csak kedvenc).
*   **Kapcsolódó adatok:** [Kedvenc Gyógyszerek](#32-gyógyszer-medicine), [Közeli Patika](#33-gyógyszertár-pharmacy), [Értesítések](#34-értesítés-notification).

### 3.2. Gyógyszer (Medicine)
A rendszerben nyilvántartott gyógyszerkészítmény.
*   **TK-szám (tkSzam):** Törzskönyvi szám (elsődleges kulcs).
*   **Belső azonosító (internalId):** Opcionális belső rendszerazonosító.
*   **Név (nev):** A gyógyszer kereskedelmi neve.
*   **Márkanév (brand):** A gyógyszer márkája.
*   **Hatóanyag (activeSubstance / inn):** Nemzetközi szabadnév.
*   **ATC-kód (atcKod):** Anatómiai, gyógyászati és kémiai osztályozás kódja.
*   **Gyártó (gyarto):** A gyógyszer gyártója.
*   **Kiszerelés (kiszereles):** Csomagolási egység és forma.
*   **Csomagolás részletei (packagingDetails):** Részletes leírás.
*   **Ár (price):** Bruttó eladási ár (numerikus).
*   **Státusz (status):** [Gyógyszer Státusz](#37-státuszok) (Elérhető, Készlethiány, Megszűnt). Kizárólag OTC és vényköteles készítményeknél követett.
*   **Kiadhatóság (dispensability):** Vényköteles vagy vény nélküli (OTC). A rendszer kizárólag ezen két kategória státuszait követi.
*   **Kiadhatóság alcsoport (dispensabilitySub):** Részletesebb besorolás.
*   **Biztonsági elemek (safetyFeatures):** Pl. szerializációs követelmények.
*   **Engedélyezés dátuma (authorizationDate):** Forgalomba hozatali engedély dátuma.
*   **Frissítés dátuma (lastUpdate):** Az adat utolsó módosításának ideje.
*   **Készlethiány infó (shortageInfo):** Opcionális objektum (kezdet, vég, ok, javaslat).
*   **Származtatott adatok:**
    *   *Közeli patika készlet (nearbyPharmacyStock):* Dinamikusan számított, ha van kiválasztott patika.

### 3.3. Gyógyszertár (Pharmacy)
Fizikai gyógyszertári egység.
*   **Azonosító (id):** Belső azonosító.
*   **Név (nev):** A gyógyszertár megnevezése.
*   **Cím:** Irányítószám (irsz), Város (telepules), Vármegye (varmegye), Utca, Házszám (cim).
*   **Geolokáció:** Térképi koordináták (latitude, longitude).
*   **Elérhetőség:** Telefonszám (telefon), Email cím (email).
*   **Nyitvatartás:** Napi nyitás/zárás (mondayOpen, mondayClose ... sundayClose).

### 3.4. Értesítés (Notification)
Rendszer által generált jelzés. Kontextusból (NotificationContext) kezelve.
*   **Feliratkozás (isSubscribed):** Gyógyszer TK-szám alapján.

### 3.5. Státuszok
*   **Gyógyszer Státusz (Kizárólag OTC és vényköteles termékeknél):**
    *   🟢 *Elérhető*
    *   🟡 *Készlethiány*
    *   🔴 *Megszűnt*
    *(Nem gyógyszer kategóriájú termékek, pl. étrend-kiegészítők, gyógytermékek, kozmetikumok státuszait a rendszer nem követi.)*
*   **Patika Nyitvatartás:** Nyitva / Hamarosan zár / Zárva (dinamikusan számított).

### 3.6. Jogosultság (UserRole)
*   **admin:** Teljes hozzáférés.
*   **user:** Alapvető funkciók.

### 3.7. Nézet Beállítások (ViewSettings)
A [Gyógyszer Lista](#45-gyógyszer-lista) testreszabásához.
*   **tableColumns:** Mely oszlopok láthatóak (Record<Column, boolean>).
*   **tableColumnOrder:** Oszlopok sorrendje tömbben.

---

## 4. FELÜLETEK

A rendszer felhasználói felületeinek (UI) definíciója a `src/app` struktúra alapján.

### 4.1. Bejelentkezési Felület
Útvonal: `/login` (AuthContext kezeli az átirányítást).
*   **Elemek:** Email, Jelszó mezők, Belépés gomb.
*   **Logika:** Sikeres belépés -> `AuthContext.login()` -> Redirect `/dashboard`.

### 4.2. Fejléc (Navbar)
Globális komponens.
*   **Elemek:**
    *   Navigáció: Irányítópult, Gyógyszerek, Gyógyszertárak.
    *   Profil menü: [Felhasználó](#31-felhasználó-user) adatok, Kijelentkezés.
    *   [Közeli Patika](#33-gyógyszertár-pharmacy) widget (ha van beállítva).

### 4.4. Irányítópult (Dashboard)
Útvonal: `/dashboard`
*   **Widgetek:**
    *   Készletváltozások (LegacySource adatokból).
    *   Közeli Patika státusz.

### 4.5. Gyógyszer Lista
Útvonal: `/gyogyszerek`
*   **Implementáció:** `src/app/(dashboard)/gyogyszerek/page.tsx`
*   **Adatforrás:** `/api/medicines`
*   **Oszlopok (MedicineTableColumn):**
    *   Alapértelmezett sorrend: Utolsó frissítés, Státusz, Név, Hatóanyag, Kiszerelés, Gyártó, Közeli patika készlet, Közeli patika frissítés, TK-szám, Csomagolás, Kiadhatóság, Kiad. Alcsop., Biztonsági elemek, Eng. Dátum, Műveletek.
*   **Funkciók:**
    *   **Keresés:** Szabadszavas (Név, INN, TK-szám).
    *   **Szűrés:**
        *   Státusz (dropdown: Mindegy, Elérhető, Készlethiány, Megszűnt).
        *   Oszloponkénti szöveges szűrők.
        *   Dátum intervallum szűrők (Utolsó frissítés, Közeli patika frissítés).
        *   Közeli patika készlet (Elérhető / Nem elérhető).
        *   "Csak kedvencek" toggle.
        *   "Közeli patikában elérhető" toggle.
    *   **Rendezés:**
        *   Fejlécre kattintva (ASC/DESC).
        *   Támogatott: Minden mező (kivéve műveletek), beleértve a dinamikus közeli patika adatokat is.
    *   **Nézet testreszabása:**
        *   Oszlopok ki/bekapcsolása (dropdown).
        *   Sorrend módosítása **Drag & Drop** módszerrel (fejléc megragadásával).
        *   Mentés `localStorage`-ba (`medicineViewSettings`).
    *   **Műveletek:**
        *   Kedvencnek jelölés (csillag).
        *   Értesítés kérése (csengő).
        *   Részletek megtekintése.

### 4.6. Gyógyszer Adatlap
Útvonal: `/gyogyszerek/[cikkId]`
*   **Részletes adatok:** Minden [Gyógyszer](#32-gyógyszer-medicine) mező megjelenítése.
*   **Hasonló termékek:** Azonos hatóanyag (activeSubstance) alapján.
*   **Státusz előzmények:** Timeline nézet.

### 4.7. Gyógyszertárak Oldal
Útvonal: `/gyogyszertarak`
*   **Nézetek:** Térkép (Leaflet) és Lista.
*   **Funkció:** "Közeli patikának jelölöm" (Context-be menti).

### 4.10. Adminisztráció
Útvonal: `/admin`
*   **Jogosultság:** Csak `role: 'admin'` esetén (middleware + layout check).
*   **Modulok:**
    *   Felhasználók (`/admin/users`): Lista, Szerkesztés (Modal), Deaktiválás.
    *   Gyógyszertárak (`/admin/pharmacies`): Lista, Részletek.

### 4.15. Profil Oldal
Útvonal: `/profile`
*   **Szekciók:**
    *   Adataim (Név, Email szerkesztés).
    *   Szakterületek (Multi-select).
    *   Hírlevél beállítások (Részletes Primary/Secondary config).

---

## 5. FUNKCIÓK (USER STORIES)

### 5.3. Gyógyszer Lista Kezelése
*   **5.3.4. Oszlop Testreszabás és Drag & Drop**
    *   *Működés:* A felhasználó a "Nézet" menüben kapcsolhatja az oszlopokat. A táblázat fejlécében az oszlopok (kivéve "Műveletek") egérrel megfoghatók és áthelyezhetők.
    *   *Technikai háttér:* HTML5 Drag and Drop API.
    *   *Perzisztencia:* `medicineViewSettings` kulcs alatt JSON-ként a `localStorage`-ban.

*   **5.3.7. Kedvencek és Értesítések Logikája**
    *   *Logika:* Ha a felhasználó feliratkozik egy gyógyszerre (Értesítés), az automatikusan bekerül a Kedvencek közé is.
    *   *Védelmi mechanizmus:* Ha a felhasználó törölni akar egy Kedvencet, amire van aktív Értesítése, a rendszer figyelmeztető modalt dob (`FavoriteRemovalModal`), hogy az értesítés is törlődni fog.

### 5.7. Hitelesítés és Profil
*   **5.7.1. Bejelentkezés**
    *   *Implementáció:* `UserService.validateCredentials`.
    *   *Jelszó:* Jelenleg minden aktív felhasználónak: `vény123`.
    *   *Session:* `auth_session` localStorage kulcsban tárolva verziószámmal.

*   **5.7.3. Profil és Értesítési Beállítások**
    *   *Adatmodell:* `User` interfész `newsletterSettings` mezője.
    *   *Felület:* Tab-os elrendezés a profil oldalon és az admin szerkesztőben is. Külön fül az Elsődleges és Másodlagos email beállításoknak.
