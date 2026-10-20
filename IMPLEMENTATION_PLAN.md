# Implementációs Terv: Benuveny B2B Next.js Migráció

Ez a dokumentum részletezi a meglévő "Orvosi Gyógyszerkészlet Portál" prototípus átalakítását modern Next.js alkalmazássá.

## 1. Projekt Inicializálás és Technológiai Stack

**Cél:** Stabil, modern fejlesztői környezet kialakítása.

*   **Framework:** Next.js 14+ (App Router).
*   **Nyelv:** TypeScript (a típusbiztonság és könnyebb fenntarthatóság érdekében).
*   **Stílus:** Tailwind CSS + DaisyUI (a meglévő design megőrzése és modernizálása érdekében).
*   **Ikonok:** Lucide React vagy Heroicons (a meglévő SVG-k helyett/mellett).
*   **Térkép:** React Leaflet.
*   **Adatkezelés:** Server Actions és React Context.

### Lépések:
1.  `create-next-app` futtatása TypeScript és Tailwind opciókkal.
2.  DaisyUI telepítése és konfigurálása (`tailwind.config.ts`).
3.  Design tokenek (színek, betűtípusok) átmigrálása a `src/app/globals.css`-be.
4.  Alapvető Layout-ok létrehozása (`RootLayout`, `DashboardLayout`, `AuthLayout`).

## 2. Architektúra és Adatkezelés Migrációja

**Cél:** A jelenlegi "kliens-oldali CSV feldolgozó" logikát modern, szerver-oldali adatkezelésre cserélni.

### 2.1 Statikus Adatok (Gyógyszerek, Patikák)
A jelenlegi rendszer kliens oldalon tölti be és parsolja a CSV-ket. Ezt átalakítjuk:
*   **Szerver oldal:** A CSV fájlok (`tk_lista.csv`, `pharmacy_list.csv`) beolvasása build időben vagy szerver oldali kérésnél történik.
*   **JSON API:** A Next.js API Route-ok (`/api/medicines`, `/api/pharmacies`) szolgálják ki a feldolgozott JSON adatot, így a kliensnek nem kell CSV-t parsolnia.
*   **Előny:** Gyorsabb betöltés, kisebb adatforgalom a kliens felé.

### 2.2 Dinamikus Adatok (Felhasználó, Kedvencek)
A jelenlegi LocalStorage alapú "mock" backendet React Context-be és Custom Hook-okba szervezzük.
*   **AuthContext:** Kezeli a bejelentkezett felhasználót, regisztrációt (mock) és jogosultságokat.
*   **StorageService:** Egy absztrakciós réteg a LocalStorage fölött, hogy később könnyen lecserélhető legyen valódi adatbázisra.
*   **Store:** (Opcionális) Zustand vagy React Context a globális állapotokhoz (pl. aktív szűrők, kosár/értesítések).

## 3. Komponens Könyvtár Kialakítása

**Cél:** Újrafelhasználható, típusos React komponensek létrehozása a "spagetti" HTML/JS helyett.

*   **UI Alapok:** `Button`, `Input`, `Card`, `Badge`, `Modal`, `Toast`.
*   **Specifikus Komponensek:**
    *   `MedicineCard`: Gyógyszer kártya megjelenítése.
    *   `PharmacyDetailCard`: Patika adatok.
    *   `StatusBadge`: Készletstátusz színes jelzése.
    *   `StockHistoryTable`: Reszponzív táblázat/kártya nézet.
    *   `PharmacyMap`: Térkép komponens (kliens oldali betöltéssel).

## 4. Oldalak Implementálása (App Router)

A meglévő HTML oldalak átültetése Next.js Route-okká:

| Régi HTML | Új Route | Leírás |
| :--- | :--- | :--- |
| `index.html` (Login) | `/login` és `/register` | Autentikációs oldalak. |
| `top_index.html` (Landing) | `/` | Főoldal (opcionális, átirányítás loginra ha nincs auth). |
| `dashboard.html` | `/dashboard` | Vezérlőpult widgetekkel. |
| `medicines.html` | `/medicines` | Gyógyszerlista szűrőkkel és keresővel. |
| `medicine-detail.html` | `/medicines/[id]` | Dinamikus részletező oldal. |
| `favorites.html` | `/favorites` | Kedvencek kezelése. |
| `notifications.html` | `/notifications` | Értesítések kezelése. |
| `stock-history.html` | `/stock-history` | Készletváltozások naplója. |
| `pharmacy-locator.html` | `/pharmacies` | Patikakereső térképpel. |
| `pharmacy-detail.html` | `/pharmacies/[id]` | Patika részletek. |
| `profile.html` | `/profile` | Felhasználói profil. |

## 5. Funkcionalitások Migrációja (Business Logic)

A `assets/js/*.js` fájlok logikájának átírása TypeScript-be:

1.  **Szűrés és Keresés:**
    *   A `medicines.js` és `medicine.js` szűrő logikáját (`filterMedicines`) egy `useMedicineFilter` hook-ba szervezzük.
    *   URL alapú állapottárolás (Query Params) implementálása a megoszthatóság érdekében (pl. `/medicines?status=hiány&q=aspirin`).

2.  **Készletkövetés:**
    *   A `stock-history.js` generáló logikáját átültetjük egy service rétegbe.

3.  **Térkép:**
    *   A Leaflet integrációt (ami jelenleg jQuery-szerűen manipulálja a DOM-ot) React-Leaflet komponensekre cseréljük.

## 6. Adatok Előkészítése (Migration Scripts)

*   A `legacy_source/data/*.csv` fájlokat átmásoljuk a Next.js projekt `public/data` vagy `data` mappájába.
*   Létrehozunk egy utility-t (`lib/csv-parser.ts`), ami típusosan olvassa be ezeket.

## 7. Minőségbiztosítás

*   **Típusok:** Minden adatmodell (Medicine, Pharmacy, User) `interface`-szel definiálva.
*   **Linting:** ESLint és Prettier konfigurálása.
*   **SEO:** Metadata API használata minden oldalon (címek, leírások dinamikus generálása).

## Ütemterv (Prioritások)

1.  **Fázis (Alapok):** Next.js setup, Layout, Auth Context, Home/Login oldal.
2.  **Fázis (Adat):** Gyógyszerlista (`/medicines`) és Részletek (`/medicines/[id]`) CSV adatokkal.
3.  **Fázis (Patikák):** Patikakereső és Térkép.
4.  **Fázis (User Features):** Kedvencek, Értesítések, Profil (LocalStorage alapon).
5.  **Fázis (Extra):** Készletelőzmények.

Készen áll a fejlesztés megkezdésére?
