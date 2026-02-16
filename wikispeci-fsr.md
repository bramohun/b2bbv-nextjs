# Orvosi Portál Rendszer - Wikispeci

> **Verzió:** 2.0 (FSR)
> **Dátum:** 2026-02-16
> **Státusz:** 🏳️ Folyamatban

---

## 1. BRIEF

A rendszer egy átfogó orvosi portál alkalmazás, melynek célja, hogy naprakész információt biztosítson gyógyszerekről, gyógyszertárakról és szakmai közösségi teret nyújtson felhasználói számára.

**Célcsoport:** Orvosok, gyógyszerészek és egészségügyi szakemberek.
**Technológia:** Web alapú alkalmazás (Next.js), reszponzív megjelenítéssel.

---

## 2. CÉLOK (EPICS)

Az alábbi stratégiai célokat fogalmaztuk meg a rendszerrel kapcsolatban:

*   **Naprakész Gyógyszerinformáció:** A felhasználók azonnal értesüljenek a készlethiányokról, megszűnésekről és elérhető helyettesítő termékekről.
*   **Gyógyszertár Elérhetőség:** A felhasználók könnyen találjanak nyitva tartó és készlettel rendelkező gyógyszertárakat, különös tekintettel a saját "közeli patikájukra".
*   **Szakmai Közösségépítés:** Lehetőséget biztosítani szakmai diskurzusra, anonimitás lehetőségével a kényes témákban.
*   **Hatékony Adminisztráció:** A rendszer karbantartása, felhasználók és tartalom moderálása központi felületen.

---

## 3. FOGALMAK (ADATBÁZIS)

Ebben a fejezetben definiáljuk a rendszerben előforduló entitásokat és azok tulajdonságait.

### 3.1. Felhasználó (User)
A rendszerbe regisztrált személy.
*   **Email cím (elsődleges):** Egyedi azonosító, belépéshez szükséges.
*   **Email cím (másodlagos):** Opcionális alternatív email cím hírlevél fogadásra.
*   **Jelszó:** Titkosított hitelesítési adat.
*   **Név:** Felhasználó teljes neve (Vezetéknév, Keresztnév).
*   **Szakterület:** Orvosi/szakmai érdeklődési körök listája (pl. Kardiológia, Általános Orvostan stb.).
*   **Szerepkör:** [Jogosultság](#38-jogosultság) (pl. Admin, Felhasználó).
*   **Státusz:** Aktív vagy Inaktív.
*   **Munkamenet verzió (sessionVersion):** Belső számláló a felhasználó érvényes bejelentkezéseinek kezeléséhez. Admin által növelhető a kijelentkeztetéshez.
*   **Hírlevél beállítások:** Email-címenként (elsődleges, másodlagos) külön konfigurálható:
    *   *Közösségi értesítések:* Feliratkozás be/ki, kiküldés ideje (óra), rendszeresség (Napi/Heti/Havi), téma (Minden/Csak szakterület), csak saját témák kapcsoló.
    *   *Készletinfó értesítések:* Feliratkozás be/ki, kiküldés ideje (óra), rendszeresség (Napi/Heti/Havi), követett témák (Újra elérhető/Készlethiány/Megszűnt), hatókör (Minden/Szakterület + kedvenc/Csak szakterület/Csak kedvenc).
*   **Kapcsolódó adatok:** [Kedvenc Gyógyszerek](#32-gyógyszer-medicine), [Közeli Patika](#33-gyógyszertár-pharmacy), [Értesítések](#36-értesítés-notification).

### 3.2. Gyógyszer (Medicine)
A rendszerben nyilvántartott gyógyszerkészítmény.
*   **Név:** A gyógyszer kereskedelmi neve.
*   **TK-szám:** Törzskönyvi szám (egyedi azonosító).
*   **Hatóanyag (INN):** Nemzetközi szabadnév (kattintható, szűrhető — kattintásra a [Gyógyszer Listára](#42-gyógyszer-lista) visz, INN-re szűrve).
*   **ATC-kód:** Anatómiai, gyógyászati és kémiai osztályozás kódja.
*   **Gyártó:** A gyógyszer gyártója.
*   **Kiszerelés:** Csomagolási egység és forma.
*   **Státusz:** [Gyógyszer Státusz](#37-státuszok) (Elérhető, Készlethiány, Megszűnt).
*   **Kiadhatóság:** Vényköteles vagy vény nélküli (alkategóriákkal).
*   **Frissítés dátuma:** Az adat utolsó módosításának ideje.
*   **Készletadatok:**
    *   *Raktáron:* Hány patikában érhető el azonnal.
    *   *Rendelésre:* Hány patikában kérhető rendelésre.
*   **Helyettesítő termékek:** Azonos hatóanyagú [Gyógyszerek](#32-gyógyszer-medicine) listája.

### 3.3. Gyógyszertár (Pharmacy)
Fizikai gyógyszertári egység.
*   **BF kód:** Egyedi azonosító.
*   **Név:** A gyógyszertár megnevezése.
*   **Cím:** Irányítószám, Város, Utca, Házszám.
*   **Geolokáció:** Térképi koordináták (latitude, longitude).
*   **Elérhetőség:** Telefonszám, email cím.
*   **Nyitvatartás:** Napi nyitvatartási idősávok (hétfő-vasárnap külön), ünnepi nyitvatartás.
*   **Státusz:** Jelenlegi állapot (Nyitva, Zárva, Hamarosan zár) — automatikusan számított a nyitvatartás alapján.
*   **Szinkronizáció:**
    *   *Utolsó adatszinkron:* Mikor frissültek a patikai alapadatok.
    *   *Utolsó készletszinkron:* Mikor frissült a készletadat.

### 3.4. Fórum Téma (Forum Topic)
Egy szakmai beszélgetés indító bejegyzése.
*   **Cím:** A téma megnevezése.
*   **Leírás:** A téma részletes kifejtése.
*   **Szerző:** [Felhasználó](#31-felhasználó-user) (vagy Anonim).
*   **Dátum:** Létrehozás ideje.
*   **Címkék:** Témához kapcsolódó kulcsszavak.
*   **Szakterület:** Milyen szakterülethez tartozik (pl. Kardiológia, Általános).
*   **Státusz:** Aktív, Lezárt, Rejtett (Moderált).
*   **Moderálási állapotok:**
    *   *Rejtett (isHidden):* Admin által elrejtett téma, felhasználók nem látják.
    *   *Lezárt (isLocked):* Admin által lezárt téma, nem lehet új hozzászólást írni.
    *   *Szerző anonimizálva (isAuthorAnonymized):* Admin által anonimizált szerző, visszavonhatatlan művelet.
*   **Statisztika:** Megtekintések, Hozzászólások száma, Like/Dislike számlálók.

### 3.5. Hozzászólás (Comment)
Egy [Fórum Témához](#34-fórum-téma-forum-topic) fűzött válasz.
*   **Tartalom:** Szöveges üzenet.
*   **Szerző:** [Felhasználó](#31-felhasználó-user) (vagy Anonim).
*   **Dátum:** Közzététel ideje.
*   **Reakciók:** Like/Dislike számlálók (kölcsönösen kizáró: egy felhasználó vagy like-ol, vagy dislike-ol).
*   **Moderálási állapotok:**
    *   *Rejtett (isHidden):* Admin által elrejtett hozzászólás.
    *   *Szerző anonimizálva (isAuthorAnonymized):* Admin által anonimizált szerző.

### 3.6. Értesítés (Notification)
Rendszer által generált jelzés a felhasználó számára.
*   **Típus:** Készletváltozás, Fórum válasz, Rendszerüzenet.
*   **Tárgy:** Pl. [Gyógyszer](#32-gyógyszer-medicine) neve.
*   **Üzenet:** Az értesítés szövege.
*   **Dátum:** Keletkezés ideje.

### 3.7. Státuszok
*   **Gyógyszer Státusz:**
    *   🟢 *Elérhető:* Van készleten vagy rendelhető.
    *   🟡 *Készlethiány:* Országos vagy tartós hiánycikk.
    *   🔴 *Megszűnt:* Forgalomból kivont termék.
*   **Patika Nyitvatartás:**
    *   🟢 *Nyitva*
    *   🟡 *Hamarosan zár*
    *   🔴 *Zárva*

### 3.8. Jogosultság
*   **Adminisztrátor:** Teljes hozzáférés, [Adminisztráció](#410-adminisztráció---felhasználókezelés) modul elérése.
*   **Felhasználó:** Alapvető funkciók elérése (Keresés, Fórum, Profil).

### 3.9. Kedvenc (Favorite)
Felhasználó által mentett [Gyógyszer](#32-gyógyszer-medicine) hivatkozás.
*   **Gyógyszer azonosító (TK-szám):** A kedvencelt gyógyszer.
*   **Gyógyszer neve:** Megjelenítendő név.
*   **Státusz:** Az aktuális gyógyszer státusz.
*   **Hozzáadás ideje:** Mikor lett kedvencnek jelölve.

### 3.10. Feliratkozás (Subscription)
Felhasználó által kért készletváltozás-értesítés egy [Gyógyszerhez](#32-gyógyszer-medicine).
*   **Gyógyszer azonosító (TK-szám):** A figyelt gyógyszer.
*   **Gyógyszer neve:** Megjelenítendő név.
*   **Státusz:** Az aktuális gyógyszer státusz.
*   **Feliratkozás ideje:** Mikor történt a feliratkozás.
*   **Szabály:** Feliratkozáskor a termék automatikusan [Kedvenc](#39-kedvenc-favorite) is lesz.

---

## 4. FELÜLETEK

A rendszer felhasználói felületeinek (UI) definíciója.

### 4.1. Bejelentkezési Felület
Az alkalmazásba való belépés felülete. Bejelentkezés nélkül nem érhető el más felület.
*   **Elemek:**
    *   Email cím beviteli mező.
    *   Jelszó beviteli mező.
    *   „Bejelentkezés" gomb.
    *   „Elfelejtett jelszó?" link → [Elfelejtett Jelszó Felület](#42-elfelejtett-jelszó-felület).
    *   Hibaüzenet megjelenítése sikertelen belépésnél (pl. „Hibás email cím vagy jelszó!").
*   **Működés:** Sikeres belépés után az [Irányítópultra](#44-irányítópult-dashboard) irányít.
*   **Kapcsolódó funkció:** [Bejelentkezés és Regisztráció](#571-bejelentkezés).

### 4.2. Elfelejtett Jelszó Felület
Jelszó-visszaállítási folyamat.
*   **Elemek (1. lépés):**
    *   Email cím beviteli mező.
    *   „Belépési kód küldése" gomb.
    *   „Mégis emlékszem a jelszavamra" link → vissza a [Bejelentkezési Felületre](#41-bejelentkezési-felület).
*   **Elemek (2. lépés — kód elküldve):**
    *   Generált belépési kód megjelenítése (prototípusban a felületen jelenik meg).
    *   Visszalépés a Bejelentkezéshez gomb.
*   **Kapcsolódó funkció:** [Elfelejtett jelszó folyamat](#572-elfelejtett-jelszó-folyamat).

### 4.3. Fejléc (Navbar)
Visszatérő elem, minden belső oldalon megjelenik. Az alkalmazás fő navigációs sávja.
*   **Elemek:**
    *   Logó (kattintásra [Irányítópultra](#44-irányítópult-dashboard) visz).
    *   **Globális keresőmező:** Szabad szavas keresés a rendszer egészében (gyógyszerek, gyógyszertárak stb.).
    *   **Navigációs linkek:** Irányítópult, Gyógyszerek, Gyógyszertárak, Közösség.
    *   **Közeli Patika státusz:** Ha be van állítva [Közeli Patika](#33-gyógyszertár-pharmacy), annak neve és aktuális nyitvatartási állapota (színkódolt badge).
    *   **Profil menü (dropdown):**
        *   Felhasználó neve, email címe.
        *   „Profilom" link → [Felhasználói Profil](#415-felhasználói-profil).
        *   „Kedvencek" link → [Kedvencek Oldal](#416-kedvencek-oldal).
        *   „Értesítések" link → [Értesítések Oldal](#417-értesítések-oldal).
        *   „Admin" link (csak [Adminisztrátor](#38-jogosultság) számára).
        *   „Kijelentkezés" gomb.
*   **Reszponzivitás:** Mobilon hamburger menüben összecsukódik.

### 4.4. Irányítópult (Dashboard)
A kezdőoldal belépés után. Aggregált információkat tartalmaz.
*   **Elemek:**
    *   [Készletváltozások Widget](#521-készletváltozások-figyelése): Lista a piaci változásokról (Megszűnt, Hiány, Újra elérhető). Linkek a [Gyógyszer Listára](#45-gyógyszer-lista).
    *   [Közeli Patika Widget](#522-közeli-patika-követése): A beállított [Gyógyszertár](#33-gyógyszertár-pharmacy) státusza és készletváltozásai. Ha nincs beállítva, felkérés beállításra.
    *   [Közösségi Aktivitás Widget](#523-közösségi-aktivitás-megtekintése): Összesített változás szám, új posztok/kommentek száma. Link a [Fórumra](#48-fórum-főoldal).
*   **Szűrők:** Időszak választó (Mai nap, Elmúlt 3 nap, Elmúlt hét). URL-alapú állapotkezelés (`?period=`).
*   **Elrendezés:** 3 oszlopos grid asztali nézetben, 1 oszlopos (egymás alá rendezett) mobilon.

### 4.5. Gyógyszer Lista
A központi kereső és listázó felület.
*   **Nézet:** Táblázatos (alapértelmezett).
*   **Oszlopok (alapértelmezett sorrend):** Utolsó frissítés, Státusz, Név, Hatóanyag (INN), Kiszerelés, Gyártó, Közeli patika készlet, Közeli patika utolsó frissítés.
*   **Oszloponkénti szűrők:** A fejléc alatti sorban minden oszlophoz tartozik szűrő mező (szöveges vagy dropdown a Státusz oszlopnál).
*   **Rendezés:** Kattintás az oszlop fejlécére rendezi a listát (növekvő/csökkenő). Rendezhető: Név, TK-szám, Hatóanyag, Státusz, Utolsó frissítés.
*   **Lapozás (Pagination):** Az eredmények lap-alapon jelennek meg (oldalankénti elemszám konfigurálható). Navigációs gombok és oldalszám-választó.
*   **Nézet testreszabása:**
    *   Oszlopok láthatóságának ki/be kapcsolása (dropdown menüben).
    *   Oszlopok sorrendjének változtatása drag & drop segítségével.
    *   A beállítások mentése `localStorage`-ba, így újratöltésnél megmaradnak.
*   **Műveletek soronként:** [Kedvencnek jelölés](#534-kedvencek-kezelése), [Értesítés kérése](#535-értesítés-kezelése), Részletek megtekintése (→ [Gyógyszer Adatlap](#46-gyógyszer-adatlap)).
*   **URL-kezelés:** A szűrőparaméterek az URL-ben tárolódnak, így a keresés megosztható.

### 4.6. Gyógyszer Adatlap
Egy konkrét [Gyógyszer](#32-gyógyszer-medicine) részletes nézete.
*   **Fejléc:** Név, Gyártó, Státusz címkék.
*   **Műveleti gombok:** [Kedvencnek jelölés](#534-kedvencek-kezelése) (csillag), [Értesítés kérése](#535-értesítés-kezelése) (csengő).
*   **Információs blokk:** TK-szám, ATC, Kiszerelés, Kiadhatóság, hivatkozás a [Hatóanyagra](#32-gyógyszer-medicine) (kattintható link — a [Gyógyszer Listára](#45-gyógyszer-lista) visz, INN szűrővel).
*   **Készletinformáció blokk:** Országos elérhetőség (Raktáron / Rendelésre számok), „Megnézem hol" gomb → [Gyógyszertári Készlet Térkép](#49-gyógyszertári-készlet-térkép).
*   **Közeli Patika blokk:** Ha be van állítva, mutatja az elérhetőséget (Zöld: Elérhető / Szürke: Nem elérhető) és a frissítés idejét.
*   **Hasonló termékek blokk:** Azonos hatóanyagú helyettesítő termékek listája (csak Elérhető státuszúak). Elemei:
    *   Gyógyszer neve (kattintható link → az adott termék [Adatlapjára](#46-gyógyszer-adatlap)).
    *   Kedvencnek jelölés lehetőség.
    *   Közeli patika elérhetőség (Elérhető / Nem elérhető).
*   **Státusz előzmények:** Idővonal az elmúlt státuszváltásokról (dátum + státusz).

### 4.7. Gyógyszertárak Oldal
Gyógyszertárak keresési és lokációs felülete.
*   **Kereső:** Szabad szavas keresés (cím, név, város).
*   **Nézetek:**
    *   *Térkép nézet:* Interaktív térkép (Leaflet), patikák pin jelölőkkel.
    *   *Lista nézet:* Kártyák a patikák adataival (elérhetőség, távolság, készlet).
*   **Reszponzivitás:** Mobilon váltógomb a Térkép és Lista nézet között.
*   **Interakció:** Kártyára kattintva a térkép az adott patikára fókuszál.
*   **Szűrők:** Nyitva tartás, Készleten van.
*   **Kapcsolódó funkció:** [Közeli Patika Beállítása](#542-közeli-patika-beállítása).

### 4.8. Fórum Főoldal
A szakmai közösség kezdőlapja.
*   **Kereső:** Témák és tartalom keresése (címben és opcionálisan a leírásban is). Szöveges beviteli mező.
*   **Szűrők:**
    *   Szakterület multi-select szűrő.
    *   Címke dropdown szűrő.
    *   Rendezési opciók: Legújabb, Legrégibb, ABC szerinti.
*   **Lista:** [Fórum Témák](#34-fórum-téma-forum-topic) kártyákon (Grid elrendezés, asztali nézetben 2 oszlop):
    *   Cím, Leírás (csonkolt), Szerző (vagy „Anonim"), Szakterület badge, Címkék, Kommentek száma, Dátum.
*   **Találati szám kijelzés:** „X téma találva" felirat.
*   **Művelet:** [Új téma létrehozása](#551-új-téma-indítása) gomb → Modal megnyitása.
*   **Üres állapot:** Ha nincs találat, „Nincs találat" üzenet és „Szűrők törlése" gomb.

### 4.9. Téma Részletek
Egy beszélgetés oldala.
*   **Navigáció:** „Vissza a fórumhoz" link.
*   **Téma tartalom:** Cím, Leírás, Szerző adatai (vagy „Anonim"), Szakterület, Címkék, Dátum.
*   **Téma reakciók:** Like / Dislike gombok számláló kijelzéssel. Kölcsönösen kizáró.
*   **Hozzászólások listája:** Időrendben. Minden hozzászólásnál:
    *   Szerző neve (vagy „Anonim"), Dátum.
    *   Tartalom szöveg.
    *   Like / Dislike gombok számláló kijelzéssel.
*   **Új hozzászólás panel:** Szövegdoboz, „Anonim beküldés" kapcsoló, „Hozzászólás" gomb.
*   **Lezárt téma jelzés:** Ha a téma [Lezárt](#34-fórum-téma-forum-topic), az új hozzászólás panel letiltott.

### 4.10. Adminisztráció – Felhasználókezelés
Csak [Adminisztrátor](#38-jogosultság) számára elérhető. Navigáció fül-alapú (Felhasználók | Gyógyszertárak | Fórum Moderálás).

**Felhasználók fül:**
*   **Lista táblázat:** Név/Email, Szerepkör (Admin/Orvos badge), Státusz (Aktív/Inaktív badge), Szakterületek (badge-ek, max 2 + „+N").
*   **Műveletek soronként (dropdown menüben):**
    *   Szerkesztés → [Felhasználó szerkesztés modal](#felhasználó-szerkesztéslétrehozás-modal).
    *   Új jelszó küldése (megerősítő modal).
    *   Kijelentkeztetés minden eszközről (megerősítő modal).
    *   Deaktiválás / Aktiválás (megerősítő modal, saját magukat nem tudják deaktiválni).
*   **„Új felhasználó" gomb** → [Felhasználó létrehozás modal](#felhasználó-szerkesztéslétrehozás-modal).

#### Felhasználó szerkesztés/létrehozás Modal
Tabos elrendezés:
1.  **Alapadatok tab:** Teljes név, Email cím, Szerepkör (Orvos/Admin), Státusz (Aktív/Inaktív).
2.  **Profil & Szakterületek tab:** Másodlagos email cím, Szakterület multi-select (scrollozható lista checkbox-okkal).
3.  **Hírlevél beállítások tab:** Elsődleges/Másodlagos email al-fülek. Mindkettőnél Közösségi és Készletinfó szekciók (összecsukható), feliratkozás toggle, kiküldés ideje, rendszeresség, téma/hatókör beállítások.

### 4.11. Adminisztráció – Gyógyszertárak Áttekintés
**Gyógyszertárak fül:**
*   **Összesítő:** Összesen X gyógyszertár a rendszerben.
*   **Kereső:** Szabad szavas keresés (név, település, cím, BF kód).
*   **Lista táblázat oszlopai:** BF kód, Név, Település, Cím, Nyitvatartás (ma — színkódolt badge), Utolsó adatszinkron, Utolsó készletszinkron.
*   **Műveletek soronként:** „Részletek" gomb → [Admin Gyógyszertár Részletes Nézet](#412-adminisztráció--gyógyszertár-részletes-nézet).

### 4.12. Adminisztráció – Gyógyszertár Részletes Nézet
Egy adott [Gyógyszertár](#33-gyógyszertár-pharmacy) részletes adminisztrációs oldala.
*   **Visszalépés:** „Vissza a listához" link.
*   **Alapadatok kártya:**
    *   Név, BF kód, Nyitvatartási státusz badge.
    *   Cím (irányítószám, település, utca).
    *   Telefonszám, Email, Koordináták.
    *   Nyitvatartás (hétfőtől vasárnapig, napra bontva).
    *   Info: „Az adatok szerkesztése a Patika Kezelő rendszerben történik."
*   **Szinkronizáció kártya:**
    *   Utolsó adatszinkron dátum/idő.
    *   Utolsó készletszinkron dátum/idő.
    *   Készleten lévő termékek összesített száma.
*   **Termékkészlet táblázat:**
    *   Oszlopok: TK-szám, Megnevezés, Hatóanyag (INN), Kiszerelés, Gyártó, Státusz, Készlet (db).
    *   Oszloponkénti szűrők (fejléc alatti szűrő sor): szöveges szűrők + Státusz dropdown.
    *   Rendezés: Kattintás az oszlop fejlécére.
    *   Lapozás: Oldalankénti megjelenítés (25 elem/oldal).
    *   „Szűrők törlése" gomb, ha aktív szűrő van.

### 4.13. Adminisztráció – Fórum Moderálás
**Fórum Moderálás fül:**
*   **Összesítő:** Badge az összes téma számmal.
*   **Lista táblázat:** Beleértve a rejtett és lezárt témákat is.
    *   Lenyitás gomb (téma kibontásához).
    *   Téma / Leírás (cím, csonkolt leírás, dátum, kommentek száma).
    *   Szerző (vagy „Anonim" + „Anonimizálva" badge).
    *   Státusz (Aktív / Rejtett / Lezárt badge-ek).
*   **Műveletek soronként (témára, dropdown menüben):**
    *   Szöveg szerkesztése → Szerkesztő modal.
    *   Lezárás / Feloldás.
    *   Elrejtés / Megjelenítés.
    *   Anonimizálás (csak ha nincs még anonimizálva, visszavonhatatlan).
*   **Kibontott téma — Hozzászólások nézet:**
    *   Hozzászólások listája kártyákon:
        *   Szerző, Dátum, „Rejtett" badge (ha rejtett), „Anonimizált" badge.
        *   Tartalom szöveg.
    *   **Műveletek kommentenként (dropdown menüben):**
        *   Szöveg szerkesztése → Szerkesztő modal.
        *   Elrejtés / Megjelenítés.
        *   Anonimizálás (visszavonhatatlan).
*   **Megerősítő modal:** Minden művelet előtt megerősítő kérdés jelenik meg.
*   **Szerkesztő modal:** Textarea a szöveg módosítására, Mentés/Mégse gombok.

### 4.14. Gyógyszertári Készlet Térkép
Modális vagy teljes oldalas nézet, amikor egy gyógyszer elérhetőségét keresik.
*   **Térkép:** Interaktív térkép patikák jelölésével (pin).
*   **Lista:** Patikák adatai (távolság, készlet információ).
*   **Szűrők:** Nyitva tartás, Készleten van.

### 4.15. Felhasználói Profil
Személyes beállítások oldala. A [Fejlécből](#43-fejléc-navbar) érhető el.
*   **Adataim szekció:**
    *   Név (Vezetéknév, Keresztnév) — szerkeszthető.
    *   Elsődleges email cím — szerkeszthető.
    *   Másodlagos email cím — szerkeszthető.
    *   Jelszó módosítás (jelenlegi + új jelszó).
*   **Szakterületek szekció:**
    *   Scrollozható lista az összes orvosi szakterülettel, checkbox-okkal kiválasztható.
*   **Hírlevél beállítások szekció:** Email-címenként (elsődleges, másodlagos — ha megadva) külön konfigurálható:
    *   *Közösségi értesítések:* Feliratkozás toggle, kiküldés ideje, rendszeresség, téma szűkítés, csak saját témák.
    *   *Készletinfó értesítések:* Feliratkozás toggle, kiküldés ideje, rendszeresség, követett témák (chip gombok: Újra elérhető, Készlethiány, Megszűnt), hatókör.
*   **Mentés gomb.**
*   **Kapcsolódó funkció:** [Profil Szerkesztése](#573-profil-szerkesztése).

### 4.16. Kedvencek Oldal
A felhasználó kedvenc gyógyszereinek dedikált kezelőfelülete. A [Fejlécből](#43-fejléc-navbar) vagy a [Profilból](#415-felhasználói-profil) érhető el.
*   **Lista táblázat:** Gyógyszer neve (kattintható → [Gyógyszer Adatlap](#46-gyógyszer-adatlap)), TK-szám, Státusz (színkódolt badge), Értesítés gomb, Hozzáadás ideje.
*   **Műveletek soronként:**
    *   Értesítésre feliratkozás / leiratkozás (csengő ikon gomb).
    *   Eltávolítás a kedvencekből (csillag ikon gomb).
*   **Speciális logika:** Ha a kedvencet eltávolítjuk, de aktív értesítés is tartozik hozzá, megerősítő modal jelenik meg figyelmeztetéssel, hogy az értesítés is törlődni fog.
*   **Üres állapot:** Ha nincs kedvenc, illusztráció és „Gyógyszerek böngészése" gomb.

### 4.17. Értesítések Oldal
A felhasználó aktív készletváltozás-feliratkozásainak kezelése. A [Fejlécből](#43-fejléc-navbar) vagy a [Profilból](#415-felhasználói-profil) érhető el.
*   **Lista táblázat:** Gyógyszer neve (kattintható → [Gyógyszer Adatlap](#46-gyógyszer-adatlap)), TK-szám, Státusz (színkódolt badge), Feliratkozás ideje.
*   **Műveletek soronként:** Leiratkozás gomb.
*   **Üres állapot:** Ha nincs aktív feliratkozás, illusztráció és „Gyógyszerek böngészése" gomb.

---

## 5. FUNKCIÓK (USER STORIES)


### 5.1. Általános Funkciók

*   **5.1.1. Globális Keresés**
    *   *Felület:* [Fejléc (Navbar)](#43-fejléc-navbar)
    *   *Működés:* A keresőmezőbe gépelve a rendszer az összes elérhető entitásban keres (gyógyszerek, gyógyszertárak).
    *   *Kimenet:* Találati lista gyors előnézettel, kattintásra navigáció a megfelelő oldalra.

### 5.2. Irányítópult (Dashboard)

*   **5.2.1. Készletváltozások Figyelése**
    *   *Működés:* A [Felhasználó](#31-felhasználó-user) belépéskor látja az elmúlt időszak (alapértelmezett: 1 nap) státuszváltásait.
    *   *Kimenet:* Megszűnt és Hiánycikkek száma, legutóbbi 20 változás listája. Kattintásra a [Gyógyszer Listára](#45-gyógyszer-lista) visz, a megfelelő szűrővel.

*   **5.2.2. Közeli Patika Követése**
    *   *Működés:* Ha a [Felhasználó](#31-felhasználó-user) beállított [Közeli Patikát](#33-gyógyszertár-pharmacy), a dashboardon látja annak aktuális státuszát és készletváltozásait.
    *   *Logika:* Ha nincs beállítva, a rendszer felajánlja a [Gyógyszertár Keresőt](#47-gyógyszertárak-oldal).

*   **5.2.3. Közösségi Aktivitás Megtekintése**
    *   *Működés:* A rendszer összesíti az új témákat és hozzászólásokat az elmúlt időszakból. Összes változás szám kiemelt megjelenítéssel.

### 5.3. Gyógyszer Nyilvántartás

*   **5.3.1. Gyógyszer Keresése és Szűrése**
    *   *Felület:* [Gyógyszer Lista](#45-gyógyszer-lista)
    *   *Bemenet:* Oszloponkénti szűrők (szöveges, dropdown).
    *   *Működés:* A lista valós időben frissül a szűrők módosításakor. Az URL paraméterek változnak, így a keresés megosztható.

*   **5.3.2. Gyógyszer Rendezése**
    *   *Felület:* [Gyógyszer Lista](#45-gyógyszer-lista)
    *   *Működés:* Az oszlop fejlécére kattintva a lista rendezhető az adott oszlop szerint növekvő vagy csökkenő sorrendbe.
    *   *Rendezési kulcsok:* Név, TK-szám, Státusz, Utolsó frissítés, Hatóanyag (INN).

*   **5.3.3. Gyógyszer Lista Lapozása**
    *   *Felület:* [Gyógyszer Lista](#45-gyógyszer-lista)
    *   *Működés:* Az eredmények oldalanként jelennek meg. Az oldal alján navigációs gombok (Előző, Következő, Oldalszám-választó).
    *   *Logika:* A rendezés és szűrés a lapozás előtt történik.

*   **5.3.4. Gyógyszer Lista Oszlop Testreszabás**
    *   *Felület:* [Gyógyszer Lista](#45-gyógyszer-lista)
    *   *Működés:* A felhasználó a nézet testreszabás menüben ki/be kapcsolhatja az egyes oszlopok láthatóságát, valamint drag & drop funkcióval módosíthatja az oszlopok sorrendjét.
    *   *Perzisztencia:* A beállítások `localStorage`-ba mentődnek, így a beállítás újratöltés után is megmarad.

*   **5.3.5. Gyógyszer Adatlap Megtekintése**
    *   *Működés:* Listából kattintva betöltődik a [Gyógyszer Adatlap](#46-gyógyszer-adatlap). Minden részlet megjelenik. INN kódra kattintva keresést indít azonos hatóanyagú termékekre — a [Gyógyszer Listára](#45-gyógyszer-lista) navigál, INN szűrővel.

*   **5.3.6. Hasonló Termékek Listázása**
    *   *Helyszín:* [Gyógyszer Adatlap](#46-gyógyszer-adatlap)
    *   *Logika:* Azonos INN (Hatóanyag) alapján keresés.
    *   *Szűrés:* Csak az „Elérhető" státuszú termékek jelennek meg.
    *   *Elemek:* Kattintható terméknév (link az adatlapra), Kedvencnek jelölés, Közeli patika elérhetőség.

*   **5.3.7. Kedvencek Kezelése**
    *   *Működés:* [Gyógyszer](#32-gyógyszer-medicine) hozzáadása a kedvencekhez (csillag ikon). Elérhető a [Gyógyszer Listán](#45-gyógyszer-lista), a [Gyógyszer Adatlapon](#46-gyógyszer-adatlap) és a [Hasonló Termékek](#536-hasonló-termékek-listázása) blokkban is.
    *   *Perzisztencia:* A beállítást a rendszer menti a felhasználói fiókhoz.
    *   *Dedikált kezelés:* [Kedvencek Oldalon](#416-kedvencek-oldal) listázható, módosítható.

*   **5.3.8. Értesítés Kezelése**
    *   *Működés:* Feliratkozás készletváltozásra (csengő ikon).
    *   *Szabály:* Feliratkozáskor a termék automatikusan [Kedvenc](#39-kedvenc-favorite) is lesz.
    *   *Eltávolítás:* Ha a felhasználó törli a kedvencet, de van értesítése, a rendszer megerősítő modal-t jelenít meg, hogy az értesítés is törlődni fog.
    *   *Dedikált kezelés:* [Értesítések Oldalon](#417-értesítések-oldal) listázható, leiratkozás lehetséges.

### 5.4. Gyógyszertár Kereső és Lokáció

*   **5.4.1. Patika Keresése**
    *   *Felület:* [Gyógyszertárak Oldal](#47-gyógyszertárak-oldal)
    *   *Bemenet:* Város, Cím, Név.
    *   *Megjelenítés:* Térképes nézet és Lista nézet (Mobilon váltogatható).
    *   *Interakció:* Kártyára kattintva a térkép az adott patikára fókuszál.

*   **5.4.2. Közeli Patika Beállítása**
    *   *Működés:* Bármely [Gyógyszertár](#33-gyógyszertár-pharmacy) kártyáján a „Közeli patikának jelölöm" gomb megnyomása.
    *   *Hatás:* A [Fejlécben](#43-fejléc-navbar) és az [Irányítópulton](#44-irányítópult-dashboard) ez a patika jelenik meg kiemeltként, és a [Gyógyszer Listán](#45-gyógyszer-lista) / [Gyógyszer Adatlapon](#46-gyógyszer-adatlap) megjelenik a készlet elérhetőség.

### 5.5. Közösségi Fórum

*   **5.5.1. Új Téma Indítása**
    *   *Felület:* [Fórum Főoldal](#48-fórum-főoldal) (Modal formájában)
    *   *Bemenet:* Cím, Leírás, Szakterület, Címkék.
    *   *Opció:* „Anonim beküldés". Ebben az esetben a szerző neve rejtett marad a publikus felületen.

*   **5.5.2. Hozzászólás Írása**
    *   *Felület:* [Téma Részletek](#49-téma-részletek)
    *   *Bemenet:* Szöveges tartalom.
    *   *Opció:* Anonim mód itt is elérhető.
    *   *Korlát:* Lezárt témához nem lehet hozzászólást írni.

*   **5.5.3. Reakciók (Like/Dislike)**
    *   *Felület:* [Téma Részletek](#49-téma-részletek)
    *   *Működés:* A felhasználó Like vagy Dislike reakciót adhat a [Fórum Témára](#34-fórum-téma-forum-topic) és az egyes [Hozzászólásokra](#35-hozzászólás-comment).
    *   *Szabály:* Egy felhasználó egy elemre csak Like VAGY Dislike adhat (kölcsönösen kizáró). Ismételt kattintás visszavonja a reakciót. A reakciók perzisztensen mentődnek.

*   **5.5.4. Fórum Keresés és Szűrés**
    *   *Felület:* [Fórum Főoldal](#48-fórum-főoldal)
    *   *Működés:* Szöveges keresés (cím, opcionálisan tartalom), Szakterület szűrő (multi-select), Címke szűrő (dropdown), Rendezés (dátum, ABC).
    *   *Logika:* „Általános" szakterületi témák minden szakterületi szűrőnél megjelennek.

### 5.6. Adminisztráció

*   **5.6.1. Felhasználók Menedzselése**
    *   *Felület:* [Adminisztráció – Felhasználókezelés](#410-adminisztráció--felhasználókezelés)
    *   *Funkciók:*
        *   Felhasználók listázása táblázatban.
        *   Új felhasználó hozzáadása (Modal — Alapadatok, Profil, Hírlevél tab-ok).
        *   Meglévő felhasználó szerkesztése (Modal — Alapadatok, Profil, Hírlevél tab-ok).
        *   Új jelszó küldése (megerősítő ablakkal).
        *   Felhasználó kijelentkeztetése minden eszközről (sessionVersion növelés, megerősítő ablakkal).
        *   Felhasználó deaktiválása / aktiválása (megerősítő ablakkal; saját magát nem tudja deaktiválni).

*   **5.6.2. Fórum Felügyelet (Moderálás)**
    *   *Felület:* [Adminisztráció – Fórum Moderálás](#413-adminisztráció--fórum-moderálás)
    *   *Funkciók — Témákon:*
        *   Téma elrejtése / megjelenítése (isHidden toggle).
        *   Téma lezárása / feloldása (isLocked toggle).
        *   Téma szövegének szerkesztése (modal).
        *   Szerző anonimizálása (visszavonhatatlan).
    *   *Funkciók — Hozzászólásokon:*
        *   Hozzászólás elrejtése / megjelenítése.
        *   Hozzászólás szövegének szerkesztése (modal).
        *   Szerző anonimizálása (visszavonhatatlan).

*   **5.6.3. Gyógyszertárak Adminisztrációja**
    *   *Felület:* [Adminisztráció – Gyógyszertárak Áttekintés](#411-adminisztráció--gyógyszertárak-áttekintés) és [Gyógyszertár Részletes Nézet](#412-adminisztráció--gyógyszertár-részletes-nézet)
    *   *Funkciók:*
        *   Gyógyszertárak listázása, keresése.
        *   Részletes nézet: alapadatok, nyitvatartás, szinkronizáció, termékkészlet táblázat (szűrés, rendezés, lapozás).
        *   Megjegyzés: Az adatok szerkesztése a Patika Kezelő rendszerben történik (csak olvasható nézet).

### 5.7. Hitelesítés

*   **5.7.1. Bejelentkezés**
    *   *Felület:* [Bejelentkezési Felület](#41-bejelentkezési-felület)
    *   *Működés:* Email + jelszó alapú belépés. Sikeres belépés után az [Irányítópultra](#44-irányítópult-dashboard) irányít.
    *   *Hibaeset:* Hibás adatok esetén hibaüzenet: „Hibás email cím vagy jelszó!".
    *   *Jogosultság-ellenőrzés:* Csak aktív státuszú felhasználó léphet be. Admin felületek csak [Adminisztrátor](#38-jogosultság) jogosultsággal elérhetők.

*   **5.7.2. Elfelejtett Jelszó Folyamat**
    *   *Felület:* [Elfelejtett Jelszó Felület](#42-elfelejtett-jelszó-felület)
    *   *Működés:* Email cím megadása után a rendszer belépési kódot generál. A prototípusban valódi emailt nem küld, a kód a felületen jelenik meg.
    *   *Visszalépés:* Link a [Bejelentkezési Felületre](#41-bejelentkezési-felület).

*   **5.7.3. Profil Szerkesztése**
    *   *Felület:* [Felhasználói Profil](#415-felhasználói-profil)
    *   *Működés:* [Felhasználó](#31-felhasználó-user) módosíthatja saját adatait: név, email, másodlagos email, jelszó, szakterületek.

*   **5.7.4. Hírlevél Beállítások Kezelése**
    *   *Felület:* [Felhasználói Profil](#415-felhasználói-profil)
    *   *Működés:* A felhasználó email-címenként (elsődleges, másodlagos) külön konfigurálhatja a hírlevél beállításait:
        *   Közösségi értesítések: feliratkozás toggle, rendszeresség, kiküldés ideje, téma szűkítés, csak saját témák.
        *   Készletinfó: feliratkozás toggle, rendszeresség, kiküldés ideje, követett témák (Újra elérhető / Készlethiány / Megszűnt), hatókör.

*   **5.7.5. Kijelentkezés**
    *   *Felület:* [Fejléc (Navbar)](#43-fejléc-navbar) — Profil menü.
    *   *Működés:* A felhasználó kijelentkezik a rendszerből, a munkamenet törlődik, a Bejelentkezési Felületre irányít.
