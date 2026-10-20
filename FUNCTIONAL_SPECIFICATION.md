# Funkcionális Specifikáció - Orvosi Portál Rendszer

**Dátum:** 2026. február 12.
**Státusz:** Tervezet (Prototípus)
**Verzió:** 1.1

## 1. Bevezetés
Jelen dokumentum az Orvosi Portál Rendszer (továbbiakban: Rendszer) részletes funkcionális specifikációját tartalmazza. A dokumentum célja, hogy pontos, műszaki és üzleti szintű leírást adjon a rendszer képességeiről, működéséről és a felhasználói igények kiszolgálásáról, amely alapjául szolgálhat ajánlattételi (tender) dokumentációknak.

A Rendszer egy modern, webes alapú alkalmazás, amely orvosok és egészségügyi szakemberek számára nyújt naprakész információkat gyógyszerkészletekről, gyógyszertárakról, valamint szakmai kapcsolattartási lehetőséget biztosít egy közösségi fórumon keresztül.

> **Megjegyzés:** A jelenlegi verzió prototípus. A gyógyszertárak alapadatait és a gyógyszertári termékstátuszokat egy meglévő Middleware rendszer fogja biztosítani API-n keresztül. A gyógyszer-terméklista forrása jelenleg még nem véglegesített (lásd 3.7. szekció). Az éles üzemben a mock adatgenerálást a tényleges adatforrások fogják kiváltani.

## 2. Rendszer Áttekintés
A Rendszer egy reszponzív webalkalmazás, amely asztali és mobil eszközökön egyaránt teljes funkcionalitást biztosít. A rendszer kiemelt figyelmet fordít a felhasználói élményre, a gyors információelérésre és a személyre szabhatóságra.

**Főbb Modulok:**
1.  **Irányítópult (Dashboard):** Azonnali áttekintés a legfontosabb változásokról.
2.  **Gyógyszertár Kereső és Térkép:** Patikák lokáció alapú keresése és információszolgáltatás.
3.  **Gyógyszer Nyilvántartás:** Részletes gyógyszeradatbázis készletinformációkkal.
4.  **Közösségi Fórum:** Szakmai diskurzus platform anonimitás lehetőségével.
5.  **Felhasználói Profil és Beállítások:** Személyre szabott funkciók (kedvencek, közeli patika, hírlevél).
6.  **Autentikáció:** Bejelentkezés és jelszó-visszaállítás.

## 3. Részletes Funkcionális Követelmények

### 3.1. Irányítópult (Dashboard)
Az irányítópult a belépési pont, amely a felhasználó számára legrelevánsabb, friss információkat aggregálja.

*   **Időszak Választó:**
    *   A felhasználó kiválaszthatja a megjelenített adatok időtávját: Elmúlt 1 nap (Mai), 3 nap, 1 hét, 2 hét, 1 hónap.
    *   Az alapértelmezett érték 1 nap.
*   **Készletváltozások Widget:**
    *   Megjeleníti a kiválasztott időszak legfontosabb gyógyszerstátusz-változásait.
    *   Összesítő statisztikát ad a megszűnt, hiánycikk és újra elérhető gyógyszerekről (kattintható linkek a szűrt gyógyszerlistához).
    *   Listázza a legutóbbi 10 konkrét változást dátummal és státusszal.
    *   Közvetlen linket biztosít a teljes gyógyszerlistához.
*   **Közeli Patika Készlet Widget:**
    *   Kijelzi a felhasználó által beállított "Közeli Patika" készletváltozásait.
    *   Ha nincs beállítva közeli patika, térképes nézetet és választási lehetőséget kínál.
    *   Statisztikát mutat a kiválasztott patikában elérhető és hiánycikké vált termékekről (kattintható linkek).
    *   Listázza a legutóbbi készletváltozásokat dátummal és státusszal a közeli patikában.
*   **Közösségi Aktivitás Widget:**
    *   Listázza a fórum legfrissebb (legfeljebb 10) témáit.
    *   Megjeleníti a téma címét, szerzőjét, szakterületi badge-ét és a hozzászólások számát.
    *   Közvetlen navigáció az egyes fórumtémákhoz és a Közösség oldalra.

### 3.2. Gyógyszertár Kereső Modul
A modul célja a gyógyszertárak gyors és hatékony megtalálása, valamint azok adatainak megjelenítése.

*   **Keresés és Szűrés:**
    *   Szabadszavas keresés (név, cím, település).
    *   Szűrők: "Most nyitva", "Hétvégén nyitva", "0-24 órában nyitva".
*   **Térképes Megjelenítés:**
    *   Interaktív térkép (Leaflet alapú) a patikák elhelyezkedésével.
    *   Marker-re kattintva információs ablak (Popup) megjelenítése: név, cím, nyitvatartás, "Közeli patikának jelölöm" gomb.
    *   A térkép nézete szinkronban van a listás találatokkal: a lista dinamikusan frissül a térkép látható területe alapján.
    *   Találati számok kijelzése: összes találat vs. térképen látható találatok.
    *   „Mutasd az összest" funkció a térkép visszaállítására.
*   **Listanézet:**
    *   A találatok kártya formátumú megjelenítése a térkép mellett.
    *   Mobilon váltógomb (Lista/Térkép) segítségével az egyes nézetek között válthat a felhasználó.
    *   Nyitvatartási státusz (Nyitva/Zárva/Hamarosan zár) valós idejű kijelzése színkódokkal.
*   **Kiemelt Szerepkör - "Közeli Patika":**
    *   A felhasználó egy patikát "Közeli"-ként jelölhet meg.
    *   A rendszer ezt a beállítást perzisztensen tárolja (`localStorage`).
    *   A közeli patika készletadatai kiemelten jelennek meg a gyógyszerlistákban, az adatlapon és a navigációs sávban.
*   **Adatforrás:**
    *   A gyógyszertárak alapadatait (név, cím, koordináták, nyitvatartás) és a gyógyszertári termékstátuszokat egy meglévő Middleware rendszer biztosítja REST API-n keresztül.
    *   A prototípusban a `/api/pharmacies` végpont mock adatokkal szolgál.

### 3.3. Gyógyszer Nyilvántartás és Készletfigyelés
A rendszer központi eleme a gyógyszerek adatbázisa és azok státuszának követése.

> **Státuszkövetési Hatókör:** A rendszerben a státuszok (piaci hiányok, kivonások és készletelérhetőségek) követése **kizárólag az OTC (vény nélkül kapható) és vényköteles (Rx) humán gyógyszerekre** terjed ki. Nem gyógyszer kategóriák (pl. étrend-kiegészítők, gyógyhatású készítmények, kozmetikumok, gyógyászati segédeszközök) státuszait a rendszer nem monitorozza.

*   **Tábla Nézet:**
    *   Részletes táblázatos megjelenítés (Név, TK-szám, Hatóanyag, Kiszerelés, Gyártó, Státusz, Utolsó frissítés, stb.).
    *   Oszlopok rendezhetősége kattintással (növekvő/csökkenő).
    *   Oszlopok testreszabhatósága:
        *   Láthatóság ki/bekapcsolása.
        *   Sorrend módosítása drag & drop (fogd és vidd) átrendezéssel. A „Műveletek" oszlop fix pozícióban marad.
    *   Oszlopszintű szűrők: Egyes oszlopok fejlécében inline szűrőmezők (pl. státusz dropdown, közeli patika elérhetőség).
    *   A beállítások `localStorage`-ban mentésre kerülnek.
    *   **"Közeli Patika" Oszlopok:** Két dedikált oszlop: a termék elérhetőségi státusza és az adatfrissítés ideje a felhasználó választott patikájában.
    *   Lapozás (pagination): Az eredmények tördelése a gyorsabb betöltés és áttekinthetőség érdekében.
*   **Keresés és Szűrés:**
    *   Összetett keresőmező (név, hatóanyag, gyártó).
    *   Státusz szűrő: Elérhető, Készlethiány, Megszűnt.
    *   "Közeli Patikában elérhető" szűrő.
    *   URL-paraméter alapú szűrés (a dashboard widgetek linkjei átirányítanak a megfelelő szűrőkkel).
*   **Gyógyszer Adatlap:**
    *   Teljes körű termékinformáció (Név, TK-szám, Hatóanyag/INN, Márkanév, ATC kód, Kiszerelés, Gyártó, Utolsó frissítés).
    *   **Kattintható Hatóanyag (INN):** A hatóanyag nevére kattintva a gyógyszerlistára navigál az adott hatóanyag keresőkifejezéssel.
    *   Státusz vizuális jelzése (Badge + színkód).
    *   **Közeli Patika indikátor:** A felhasználó választott patikájának készletállapota kiemelten megjelenik.
    *   **Készletinformáció:** A "Készleten" lévő és "Rendelésre elérhető" patikák számának elkülönített megjelenítése.
    *   **"Megnézem hol" funkció:** Modális ablakban térképen mutatja azokat a patikákat, ahol a termék készleten vagy rendelhető.
    *   **Hasonló hatóanyagú termékek:** Az adatlap az azonos hatóanyagú (INN), elérhető termékek listáját is megjeleníti - különösen hasznos készlethiány vagy megszűnés esetén a helyettesítő készítmények azonosításához.
    *   **Státusz-előzmények:** Az adatlap alján a gyógyszer korábbi státuszváltozásainak kronologikus listája.
    *   "Vissza a listához" navigáció.
    *   (Tervezett) Betegtájékoztató letöltése/megnyitása.
*   **Kedvencek és Értesítések:**
    *   Gyógyszerek kedvencnek jelölése gyors eléréshez (csillag ikon az adatlapon és a listában).
    *   Feliratkozás készletváltozási értesítésekre (Értesítés kérése/törlése).
    *   Biztonsági figyelmeztetés kedvenc eltávolításakor, ha aktív értesítés van beállítva (megerősítő modális ablak).
*   **Adatforrás:**
    *   A gyógyszer-termékadatok és készletstátusz-frissítések forrása a prototípusban még nem véglegesített; további egyeztetés szükséges.
    *   Jelenleg a `/api/medicines` végpont mock adatokkal szolgál, amelyeket a `src/lib/data.ts` modul generál.
    *   **Lehetséges adatforrások éles üzemben:**
        1.  **NNGYK (OGYEI) adatbázis:** Az [ogyei.gov.hu/gyogyszeradatbazis](https://ogyei.gov.hu/gyogyszeradatbazis) oldalon elérhető "Összes engedéllyel rendelkező készítmény" és "Összes termékhiány" listák letöltése és napi szintű frissítése. A prototípus mock adatai ezek alapján készültek.
        2.  **BENU / Phoenix Middleware átalakítása:** A meglévő Middleware rendszer kiterjesztése, hogy ne csak a webshopban elérhető termékeket, hanem a teljes termékportfóliót kezelje.

### 3.4. Közösségi Fórum
Szakmai diskurzus platform ellenőrzött felhasználók (orvosok) számára.

*   **Témák Kezelése:**
    *   Új téma létrehozása modális ablakban: cím, leírás, címkék és szakterület megjelölése.
    *   Szakterület-specifikus vagy általános témák támogatása.
    *   **Anonim Posztolás:** Lehetőség a név elrejtésére ("Anonim" megjelenítés) érzékeny szakmai kérdések esetén — témáknál és hozzászólásoknál egyaránt.
*   **Téma Részletek Oldal:**
    *   A teljes téma tartalmának megjelenítése szerzővel, dátummal, szakterülettel, címkékkel.
    *   Hozzászólások listázása és hozzászólás hozzáadása (anonim opcióval).
    *   Reakciók (Like/Dislike) témákra és hozzászólásokra. A Like és Dislike kölcsönösen kizárják egymást.
*   **Keresés és Navigáció:**
    *   Szűrés szakterületek szerint ("Saját szakterületem", "Kardiológia", stb.) — multi-select.
    *   Címke alapú szűrés (legördülő menü/dropdown).
    *   Keresés a témák címében, opcionálisan a tartalmában is (checkbox).
    *   Rendezési opciók (legújabb, ABC sorrend).
    *   Címkék és szakterületek a kártyákon kattinthatók, és az adott szűrővel nyitják meg a fórum főoldalt.

### 3.5. Globális Kereső és Navigáció
*   **Navigációs Sáv:**
    *   Minden oldalról elérhető, fix pozícióban.
    *   Tartalmazza a "Közeli Patika" gyorsinformációját: a kiválasztott patika neve megjelenik; kattintásra teljes képernyős modális ablakban nyílik meg a Gyógyszertár Kereső.
    *   Gyorselérés a kedvenc gyógyszerekhez (dropdown menü a csillag ikonra kattintva).
*   **Globális Kereső:**
    *   Intelligens keresőmező, amely egyszerre keres az aktívan használt tartalmakban:
        *   Gyógyszerek között (név, hatóanyag).
        *   Gyógyszertárak között (név, település, cím).
        *   BENU Képzési Program tanfolyamai között (cím, leírás, kategória).
    *   Kategóriák szerinti találati lista (ikonokkal jelölve a típust: `medication`, `local_pharmacy`, `school`).
    *   A keresés kis- és nagybetű érzéketlen.

### 3.6. Autentikáció és Profil

*   **Bejelentkezés:**
    *   Email és jelszó alapú bejelentkezés.
    *   Hibaüzenet megjelenítése sikertelen belépés esetén.
    *   Sikeres belépés után automatikus átirányítás az irányítópultra.
    *   Fejlesztői környezetben az adatok előre kitöltődnek a gyorsabb tesztelés érdekében.
*   **Elfelejtett Jelszó:**
    *   Email cím megadása után mágikus kód generálása.
    *   A prototípusban valódi emailt nem küld a rendszer; a kód a felületen jelenik meg.
    *   Visszalépési lehetőség a bejelentkezéshez.
*   **Profil Oldal:**
    *   A felhasználó alapadatainak megjelenítése és szerkesztése (név, szakterületek).
    *   **Hírlevél beállítások:** Két email címhez (elsődleges és másodlagos) konfigurálható hírlevél feliratkozások:
        *   Közösségi hírlevél: feliratkozás, gyakoriság (napi/heti), küldési idő.
        *   Készletváltozási hírlevél: feliratkozás, gyakoriság, témakörök (pl. hatóanyag, gyártó, gyógyszertár), hatókör (Minden / Szakterület + kedvenc / Csak szakterület / Csak kedvenc).
    *   Kijelentkezés.
*   **Kedvencek Kezelő Oldal (`/profile/favorites`):**
    *   A kedvencnek jelölt gyógyszerek táblázatos listája (név, TK-szám, státusz, értesítés állapot, hozzáadás ideje).
    *   Közvetlen navigáció a gyógyszer adatlapjára.
    *   Kedvenc eltávolítása; ha aktív értesítés van beállítva, megerősítő figyelmeztetés jelenik meg.
    *   Értesítésre feliratkozás és leiratkozás.
*   **Értesítések Kezelő Oldal (`/profile/notifications`):**
    *   Az aktív készletváltozási értesítés-feliratkozások listája (név, TK-szám, státusz, feliratkozás ideje).
    *   Leiratkozás.
    *   Üres állapot kezelése.

### 3.7. Technikai Követelmények és Adatkezelés (Non-funkcionális)

*   **Technológiai Stack:**
    *   **Frontend keretrendszer:** Next.js (App Router, React Server Components és Client Components).
    *   **UI könyvtár:** Tailwind CSS + DaisyUI — modern megjelenés, mobil-first megközelítés.
    *   **Ikonok:** Material Symbols (Google).
    *   **Térkép:** Leaflet (dinamikusan importálva SSR problémák elkerülése érdekében).
*   **Kliens-oldali Állapotkezelés:**
    *   A rendszer a `localStorage`-ot használja a felhasználói beállítások perzisztens tárolására:
        *   Kedvencek (`FavoriteContext`)
        *   Közeli patika (`NearbyPharmacyContext`)
        *   Fórum reakciók és saját témák
        *   Nézet testreszabások (oszlopok, sorrend)
    *   React Context providerek biztosítják az alkalmazás-szintű állapotot: `AuthContext`, `FavoriteContext`, `NearbyPharmacyContext`, `NotificationContext`, `ToastContext`.
*   **Adatforrások (Prototípus):**
    *   **Gyógyszertárak és termékstátusz:** A prototípusban mock adatok. Éles üzemben egy meglévő Middleware rendszer REST API-ja biztosítja a gyógyszertárak alapadatait (név, cím, koordináták, nyitvatartás) és a gyógyszertári termékstátusz-információkat.
    *   **Gyógyszerek (terméklista):** A prototípusban a `src/lib/data.ts` modul generálja a termékadatokat az NNGYK/OGYEI adatbázis mintájára. A végleges adatforrás még nem eldöntött (lásd 3.3. Adatforrás szekció).
    *   **Fórum:** LocalStorage-ban tárolt mock adatok; első betöltéskor automatikusan generálódnak.
*   **Sebesség és Optimalizáció:**
    *   Dinamikus importok (`next/dynamic`) használata a nehéz komponensek (pl. térkép) esetén az oldalbetöltés optimalizálása érdekében.
    *   `useMemo` és `useEffect` hook-ok a szükségtelen újrarenderelés minimalizálására.
*   **Visszajelzések:** `ToastContext` alapú felugró értesítések (toast) a felhasználói műveletek visszajelzésére.

## 4. Jogosultságkezelés
*   A rendszer alapvetően autentikált felhasználók (orvosok) számára készült.
*   A "vendég" vagy nem bejelentkezett felhasználók a bejelentkező felületre irányítódnak.
*   A jelenlegi prototípus verzióban a kliens oldali állapotkezelés (`AuthContext`) szimulálja a bejelentkezett felhasználót.
*   A prototípusban fix bejelentkezési adatok érvényesek (fejlesztői környezetben előre kitöltve).
