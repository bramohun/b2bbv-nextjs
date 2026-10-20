# BENUvény Orvosi Portál – Elfogadási Kritériumok Jegyzéke (Acceptance Criteria Matrix)

---

> **Dokumentum azonosító:** AC-BVO-20261020  
> **Verzió:** 1.6.1  
> **Dátum:** 2026.10.20.  
> **Forrásdokumentum:** [FUNCTIONAL_SPECS_WIKISPEC.md](file:///c:/Users/abramov.gabor/GitHub/b2bbv-nextjs/FUNCTIONAL_SPECS_WIKISPEC.md) (v1.6.1)  
> **Élő tesztelhető prototípus:** [https://bvo.uneb.hu/](https://bvo.uneb.hu/)  
> **Státusz:** Hatályos / Jóváhagyott  

---

## 1. Vezetői Összefoglaló és Áttekintő Mátrix

Jelen dokumentum a **BENUvény Orvosi Portál** moduljaihoz és felhasználói felületeihez (URL-jeihez) tartozó összesített **Elfogadási Kritérium (Acceptance Criteria - AC)** jegyzéke. A kritériumok a rendszer funkcionális működését és felhasználói szemszögű elfogadási feltételeit rögzítik a minőségbiztosítás, tesztelés és átadás-átvétel támogatására.

| Modul Száma | Modul Megnevezése | Felületi Útvonal (URL) | Jogosultság | Kritériumok Kódja | Felületi Státusz |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **4.0** | **Fejléc & Navigációs Sáv** | Globális komponens | User / Admin | `AC-4.0.1` – `AC-4.0.5` | **Aktív** |
| **4.1** | **Irányítópult (Dashboard)** | `https://bvo.uneb.hu/dashboard` | User / Admin | `AC-4.1.1` – `AC-4.1.4` | **Aktív** |
| **4.2A** | **Gyógyszer Nyilvántartás (Lista)** | `https://bvo.uneb.hu/gyogyszerek` | User / Admin | `AC-4.2.1`, `AC-4.2.2`, `AC-4.2.5` | **Aktív** |
| **4.2B** | **Gyógyszer Adatlap** | `https://bvo.uneb.hu/gyogyszerek/adatlap?tk=...` | User / Admin | `AC-4.2.3`, `AC-4.2.4`, `AC-4.2.5` | **Aktív** |
| **4.3** | **Gyógyszertár Kereső és Térkép** | `https://bvo.uneb.hu/gyogyszertarak` | User / Admin | `AC-4.3.1` – `AC-4.3.3` | **Aktív** |
| **4.4** | **Képzési Program (LMS)** | `https://bvo.uneb.hu/kepzesek` | User / Admin | `AC-4.4.1`, `AC-4.4.2` | ⚠️ **Nem fejlesztési scope, prototípusban sem látható** |
| **4.5** | **Globális Keresés (Asztali / Mobil)** | Globális keresősáv / Mobil Overlay | User / Admin | `AC-4.5.1`, `AC-4.5.2` | **Aktív** |
| **4.6** | **Hitelesítés & Jogosultságok** | `https://bvo.uneb.hu/login` | Nyilvános / Vendég | `AC-4.6.1` – `AC-4.6.3` | **Aktív** |
| **4.7** | **Adminisztráció** | `https://bvo.uneb.hu/admin/*` | Kizárólag Admin | `AC-4.7.1`, `AC-4.7.2` | **Védett Admin** |
| **4.8** | **Felhasználói Profil & Értesítések** | `https://bvo.uneb.hu/profile` | User / Admin | `AC-4.8.1`, `AC-4.8.2` | **Aktív** |
| **4.9** | **Közösség és Szakmai Fórum** | `https://bvo.uneb.hu/kozosseg` | User / Admin | `AC-4.9.1`, `AC-4.9.2` | **Közvetlen URL** |

### 1.1. Általános Nem-Funkcionális Irányelvek: WCAG 2.2 és Technikai SEO

- **Akadálymentesség (WCAG 2.2):** A felületfejlesztés során **törekedni kell a modern WCAG 2.2 ergonómiai sztenderdek betartására** (jó kontrasztok, olvasható betűméretek, egyértelmű billentyűzet-fókusz), de ez **nem kötelező érvényű szigorú követelmény**. Tekintettel arra, hogy a portál publikusan nem elérhető (zárt szakmai orvosi rendszer) és a célcsoport (orvosok, gyógyszerészek) jellemzően nincsen akadályoztatva, nem szükséges a maximális (pl. AAA) szintű akadálymentességre törekedni.
- **Technikai SEO és Böngészőtámogatás:** Zárt megoldásként a klasszikus keresőmotor-optimalizálási (SEO) technikák (indexelés, meta tagek robotoknak, sitemap) betartása **nem kötelező**. Kizárólag a böngészést segítő felületi megoldások elvártak.
- **Kötelező Lapfül Cím (`<title>`) Formátum:** A böngészőfül gyors azonosíthatóságának biztosítására minden oldal `<title>` mezője kötelezően a `"{lap neve} | BENUvény Orvosi Portál"` formátumot követi (lásd: `AC-4.0.5`).

---

## 2. Modulonkénti Részletes Elfogadási Kritériumok

### 4.0. Fejléc és Navigációs Sáv Modul
- **Felületi Elhelyezkedés / URL:** Globális rögzített komponens minden belső oldalon
- **Érintett Szerepkörök:** Szakmai Felhasználó (`User`), Rendszeradminisztrátor (`Admin`)

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.0.1** | **Főoldali Navigáció** | A bal felső sarokban elhelyezett hivatalos sötétkék/zöld **BENU VÉNY** logóra kattintva a rendszer minden esetben azonnal az Irányítópultra (`https://bvo.uneb.hu/dashboard`) navigál. |
| **AC-4.0.2** | **Közeli Patika Gyorsválasztó** | A fejléc jobb oldalán lévő kiemelt közeli gyógyszertár blokkra kattintva felugrik a teljes képernyős interaktív **Patikaválasztó Modális Ablak** (`PharmacyFinder`). Új preferált gyógyszertár kiválasztásakor a fejléc azonnal, oldalújratöltés nélkül frissül a választott patika nevével. |
| **AC-4.0.3** | **Mentett Gyorslista "Összes" gomb** | A fejléc *"Mentett"* gyorslistáját lenyitva és az *"Összes"* linkre kattintva a felület a gyógyszerlistára (`https://bvo.uneb.hu/gyogyszerek`) navigál, ahol automatikusan bekapcsolódik a *"Csak mentett gyógyszerek"* szűrő (`onlyFavorites=true`), kizárólag a könyvjelzőzött tételeket mutatva. |
| **AC-4.0.4** | **Biztonságos Kijelentkezés** | A felhasználói profil menüben a *"Kijelentkezés"* opcióra kattintva a rendszer azonnal érvényteleníti a helyi és szerveroldali munkamenetet, törli a hitelesítési sütit/tokent, és a bejelentkezési oldalra (`https://bvo.uneb.hu/login`) irányít át. |
| **AC-4.0.5** | **Böngésző Lapfül Cím (<title>)** | Minden felületi oldal HTML `<title>` címkéje egységesen a `"{lap neve} \| BENUvény Orvosi Portál"` struktúrát jeleníti meg (pl. `"Irányítópult \| BENUvény Orvosi Portál"`), biztosítva a böngészőlapok egyértelmű azonosíthatóságát a párhuzamos lapfüles orvosi munkavégzés során. |

---

### 4.1. Irányítópult (Dashboard)
- **Felületi Elhelyezkedés / URL:** [https://bvo.uneb.hu/dashboard](https://bvo.uneb.hu/dashboard)
- **Érintett Szerepkörök:** Szakmai Felhasználó (`User`), Rendszeradminisztrátor (`Admin`)

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.1.1** | **Dinamikus Időszakváltás** | Az időszak-választó kapszulában (`Elmúlt 3 nap`, `Elmúlt 1 nap / Mai nap`, `Elmúlt 7 nap`, `Elmúlt 30 nap`) történő módosítás azonnal, a böngésző oldalának újratöltése nélkül újraszámolja az összesített kártya darabszámait és frissíti a legfrissebb készletváltozások listáját. |
| **AC-4.1.2** | **Gyorsszűrt Átnavigálás** | A figyelmeztető sárga összesítő kártyán a készlethiány számára (vagy bármely szöveges számlálójára) kattintva a rendszer a gyógyszerlistára navigál, ahol a státuszszűrő automatikusan `Készlethiány` (vagy a kattintott státusz) értékre van előszűrve. |
| **AC-4.1.3** | **Preferált Patika Készletmozgások** | Amennyiben a felhasználó rendelkezik beállított preferált patikával, a jobb hasábban lévő widgetben a helyi készletmozgások kizárólag az adott gyógyszertár BF kódjára szűrt valós készletváltozásokat jelenítik meg. Ha nincs patika beállítva, felhívás és patikakereső gomb jelenik meg. |
| **AC-4.1.4** | **Termékköri Státuszkövetés (OTC + Rx)** | Az Irányítópulton megjelenő összesítő kártya és a legutóbbi 20 készletváltozás táblázata **kizárólag az OTC és vényköteles humán gyógyszerek** státuszváltozásait számolja és jeleníti meg; egyéb patikai árucikkek (pl. étrend-kiegészítők, vitaminok, kozmetikumok, tápszerek) nem szerepelhetnek a készletmozgásokban. |

---

### 4.2. Gyógyszer Nyilvántartás (Gyógyszerlista és Adatlap)
- **Felületi Elhelyezkedés / URL:**
  - Gyógyszerlista: [https://bvo.uneb.hu/gyogyszerek](https://bvo.uneb.hu/gyogyszerek)
  - Gyógyszer Adatlap: [https://bvo.uneb.hu/gyogyszerek/adatlap?tk=[tkSzam]](https://bvo.uneb.hu/gyogyszerek/adatlap)
- **Érintett Szerepkörök:** Szakmai Felhasználó (`User`), Rendszeradminisztrátor (`Admin`)

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.2.1** | **Drag & Drop Oszlopátrendezés** | A gyógyszer táblázat oszlopfejlécei az egérrel szabadon áthúzhatók (Drag & Drop), és a testreszabott sorrend az oldal újratöltésekor, lapozáskor és új szűrés lefuttatásakor is stabilan megőrződik a lokális beállításokban. |
| **AC-4.2.2** | **Rögzített (Sticky) Műveletek Oszlop** | A táblázat jobb szélén található "Műveletek" oszlop vízszintes görgetés esetén is folyamatosan rögzítve (sticky) látható marad a monitor jobb szélén, elkülönítő finom árnyékkal, biztosítva a kedvenc, értesítés és adatlap gombok azonnali elérését. |
| **AC-4.2.3** | **Adatlapi Helyi Patika Modális Megtekintés** | A gyógyszer részletes adatlapon a "Közeli gyógyszertár" nevére kattintva azonnal helyben felugrik a Gyógyszertár Részletek modális ablak a nyitvatartással és elérhetőségekkel anélkül, hogy a böngésző elnavigálna a gyógyszer adatlapjáról. |
| **AC-4.2.4** | **Hiányinformációs Bannerek Megjelenítése** | Készlethiányos státuszú gyógyszer esetén a hiány kezdete, várható befejezése, hivatalos oka és a szakmai pótlási/helyettesítési javaslat jól láthatóan, strukturált sárga figyelmeztető dobozban jelenik meg az adatlapon. |
| **AC-4.2.5** | **Kizárólagos OTC és Vényköteles Státuszkövetés** | A gyógyszer-nyilvántartásban és a készletstátuszok (Elérhető / Készlethiány / Megszűnt) követésében **kizárólag OTC (vény nélkül kapható) és vényköteles (Rx)** gyógyszerkészítmények vesznek részt. Nem gyógyszer termékek (étrend-kiegészítők, gyógyhatású termékek, kozmetikumok, gyógyászati segédeszközök) státuszait a rendszer nem monitorozza és nem jeleníti meg státuszkövetett tételként. |

---

### 4.3. Gyógyszertár Kereső és Térkép
- **Felületi Elhelyezkedés / URL:** [https://bvo.uneb.hu/gyogyszertarak](https://bvo.uneb.hu/gyogyszertarak)
- **Érintett Szerepkörök:** Szakmai Felhasználó (`User`), Rendszeradminisztrátor (`Admin`)

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.3.1** | **Valós Idejű Keresés és Térképi Szinkron** | A SubHeader keresőmezőjébe beírt településnévre (pl. *"Szeged"*), utcára vagy irányítószámra a kártyalista és a térkép jelölői késlekedés nélkül, valós időben szűkülnek, kizárólag az egyező gyógyszertárakat mutatva. |
| **AC-4.3.2** | **Közeli Patika Kijelölésének Hatása** | A patika kártyáján a *"Közelinek jelölöm"* gombra kattintva a választott patika azonnal aktív zöld pipás státuszt kap, és neve azonnal megjelenik a felső navigációs fejlécben és az Irányítópulton is oldalújratöltés nélkül. |
| **AC-4.3.3** | **Mélylinkelt Patikamegnyitás (Deep Linking)** | Amennyiben a felhasználó közvetlen mélylinkkel érkezik az oldalra (pl. `/gyogyszertarak?id=BF133`), a térkép automatikusan a hivatkozott gyógyszertárra fókuszál (centrálás és zoom), és a heti nyitvatartási modális adatlap automatikusan felugrik. |

---

### 4.4. Képzési Program (LMS Integráció) *(⚠️ Nem fejlesztési scope, prototípusban sem látható)*
- **Felületi Elhelyezkedés / URL:** [https://bvo.uneb.hu/kepzesek](https://bvo.uneb.hu/kepzesek)
- **Érintett Szerepkörök:** Szakmai Felhasználó (`User`), Rendszeradminisztrátor (`Admin`)
- **Státusz Megjegyzés:** **Nem fejlesztési scope, prototípusban sem látható.** A felület kivezetésre került a fő navigációból és a keresőből; az alábbi kritériumok kizárólag az esetleges későbbi reaktiválás esetére, specifikációs nyilvántartásként érvényesek.

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.4.1** | **Képzési Kategória Szűrés** | A kurzuskártyák kategória szerinti szűrőgombjaira (`Minden`, `Akkreditált`, `Gyártói`, `Eladásösztönző`) kattintva a lista azonnal és pontosan kiszűri a feltételnek meg nem felelő tananyagokat. |
| **AC-4.4.2** | **Zárolt Akkreditált Kurzus és LMS Átirányítás** | A kreditpontos akkreditált kurzus kártyájára kattintva a felület modális ablakban tájékoztatást ad az LMS belépési kötelezettségről, és felkínálja a biztonságos átirányítást a külső BENU LMS továbbképzési rendszerbe. |

---

### 4.5. Globális Keresés Modul
- **Felületi Elhelyezkedés / URL:** Globális fejléci komponens (asztali legördülő panel / mobil teljes képernyős overlay)
- **Érintett Szerepkörök:** Szakmai Felhasználó (`User`), Rendszeradminisztrátor (`Admin`)

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.5.1** | **Instant Találati Eredmények** | A keresőbe történő gépeléskor (minimum 2 karakter) azonnal megjelennek a releváns gyógyszer- és patikatalálatok, a gyógyszereknél feltüntetve a kereskedelmi nevet, hatóanyagot, TK-számot és az aktuális készletstátuszt. A találatra kattintva közvetlen navigáció valósul meg az adatlapra. |
| **AC-4.5.2** | **Mobil Keresési Overlay Viselkedés** | Mobileszközön a keresőikon megérintésekor a teljes képernyős overlay nyílik meg, a képernyő-billentyűzet automatikusan felugrik (auto-focus), a háttér görgetése letiltásra kerül, és a jobb felső "Bezárás" gombbal az overlay bezárható. |

---

### 4.6. Hitelesítés, Jogosultságok és Kapcsolatfelvétel
- **Felületi Elhelyezkedés / URL:**
  - Bejelentkezés: [https://bvo.uneb.hu/login](https://bvo.uneb.hu/login)
  - Kétfaktoros megerősítés: `https://bvo.uneb.hu/verify-2fa`
  - Jelszó-visszaállítás: `https://bvo.uneb.hu/forgot-password`
  - Kapcsolatfelvételi űrlap: `https://bvo.uneb.hu/register` (vagy login modál)
- **Érintett Szerepkörök:** Vendég / Nyilvános hozzáférés

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.6.1** | **Sikeres Hitelesítés és Irányítás** | Érvényes bejelentkezési adatok (e-mail és jelszó vagy Magic Code / Passkey) megadásakor a rendszer sikeresen belépteti a felhasználót és közvetlenül az Irányítópultra (`/dashboard`) irányítja át. |
| **AC-4.6.2** | **Megbízható Eszköz 30 Napos Megjegyzése** | Kétfaktoros azonosítás (2FA) esetén, ha a felhasználó bepipálja a *"Megbízható eszköz megjegyzése (ne kérjen kódot 30 napig)"* opciót, a rendszer a megadott böngészőben 30 napig mentesíti a fiókot az újbóli OTP kód megadásától. |
| **AC-4.6.3** | **Inaktív / Felfüggesztett Fiók Kizárása** | Inaktív vagy felfüggesztett fiókkal (pl. `teszt@example.com`) történő bejelentkezési kísérlet esetén a rendszer azonnal megtagadja a belépést, és tájékoztató hibaüzenetet ad: *"A fiók felfüggesztésre került. Kérjük, keresse az adminisztrátort."* |

---

### 4.7. Adminisztráció (Felhasználók, Patikák, Moderálás)
- **Felületi Elhelyezkedés / URL:**
  - Felhasználókezelés: [https://bvo.uneb.hu/admin/users](https://bvo.uneb.hu/admin/users)
  - Patikafelügyelet: [https://bvo.uneb.hu/admin/pharmacies](https://bvo.uneb.hu/admin/pharmacies)
  - Fórum Moderálás: [https://bvo.uneb.hu/admin/forum](https://bvo.uneb.hu/admin/forum)
- **Érintett Szerepkörök:** Kizárólag Rendszeradminisztrátor (`Admin`)

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.7.1** | **Admin Felületek Jogosultságvédelme** | Normál szakmai felhasználó (`User` szerepkör) nem érheti el az `/admin/*` védett útvonalakat sem közvetlen URL beírással, sem belső hivatkozással; jogosulatlan próbálkozás esetén a rendszer azonnal visszairányítja a Dashboardra (`/dashboard`). |
| **AC-4.7.2** | **Kényszerített Kijelentkeztetés (Force Logout)** | Amikor az adminisztrátor az adminisztrációs felhasználói táblázatban kiadja a *"Munkamenet lezárása (Force Logout)"* parancsot egy fiókra, az érintett felhasználó böngészőjében a legközelebbi hálózati műveletkor/kattintáskor a munkamenet azonnal érvényét veszti, és a rendszer a bejelentkező felületre dobja a felhasználót. |

---

### 4.8. Felhasználói Profil és Értesítéskezelés
- **Felületi Elhelyezkedés / URL:**
  - Profil Alapadatok: [https://bvo.uneb.hu/profile](https://bvo.uneb.hu/profile)
  - Mentett Kedvencek: [https://bvo.uneb.hu/profile/favorites](https://bvo.uneb.hu/profile/favorites)
  - Készletértesítések: [https://bvo.uneb.hu/profile/notifications](https://bvo.uneb.hu/profile/notifications)
- **Érintett Szerepkörök:** Szakmai Felhasználó (`User`), Rendszeradminisztrátor (`Admin`)

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.8.1** | **Értesítési Beállítások Perzisztenciája** | A Készletinfó hírlevél és értesítési szabályok (gyakoriság, időpont, témakörök, hatókör) módosításakor a *"Beállítások mentése"* gombra kattintva az adatok azonnal elmentésre kerülnek a profilban, és a felületen megerősítő zöld visszajelzés jelenik meg. |
| **AC-4.8.2** | **Megbízható Eszközök Globális Törlése** | A profil biztonsági szekciójában az *"Eszközök elfelejtése"* gombra kattintva a rendszer azonnal visszavonja az összes korábban megjegyzett 30 napos böngésző engedélyét, és a megbízható eszközök számlálója nullázódik. |

---

### 4.9. Közösség és Szakmai Fórum Modul
- **Felületi Elhelyezkedés / URL:** [https://bvo.uneb.hu/kozosseg](https://bvo.uneb.hu/kozosseg)
- **Érintett Szerepkörök:** Szakmai Felhasználó (`User`), Rendszeradminisztrátor (`Admin`)

| Kritérium Azonosító | Megnevezés / Interakció | Elvárt Működés és Elfogadási Feltétel |
| :--- | :--- | :--- |
| **AC-4.9.1** | **Anonim Bejegyzés Szerzői Védelme** | Új fórumtéma indításakor vagy hozzászólás beküldésekor az *"Anonim közzététel"* opció bejelölése esetén a rendszer a szerző valódi nevét és azonosítóját teljesen elrejti; a felületen minden más szakmai felhasználó számára kizárólag az `"Anonim Felhasználó"` megnevezés jelenik meg. |
| **AC-4.9.2** | **Lezárt Témák Hozzászólási Blokkolása** | Adminisztrátor által vagy moderáció során *"Lezárt"* státuszba állított fórumtéma esetén a felület letiltja az új hozzászólás beviteli mezőjét és küldés gombját, világos figyelmeztetéssel jelezve a lezártságot. |

---

## 3. Tesztelési Hozzáférések a Kritériumok Ellenőrzéséhez

A kritériumok az élő prototípus felületén az alábbi tesztfiókokkal ellenőrizhetők:

| Szerepkör / Felhasználó | E-mail Cím | Jelszó | Ellenőrizhető Főbb Kritériumok |
| :--- | :--- | :--- | :--- |
| **Rendszeradminisztrátor** | `admin@example.com` | `vény123` | `AC-4.7.1`, `AC-4.7.2` (Force Logout), moderáció, felhasználókezelés |
| **Szakmai Felhasználó** | `demo@example.com` | `vény123` | `AC-4.0.*`, `AC-4.1.*`, `AC-4.2.*`, `AC-4.3.*`, `AC-4.8.*`, `AC-4.9.*` |
| **Inaktív Felhasználó** | `teszt@example.com` | `vény123` | `AC-4.6.3` (felfüggesztett fiók belépési elutasítása) |

> **2FA Teszt Ellenőrző Kód:** `123456`
