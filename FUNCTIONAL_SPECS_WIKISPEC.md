<!-- 
============================================================================
FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - WIKISPEC FŐDOKUMENTUM
============================================================================

MIRE HASZNÁLJUK:
Ez a dokumentum a BENU B2B Betegútvezérlő / Orvosi Gyógyszerkereső portál 
központi funkcionális specifikációja. Részletesen leírja a rendszer üzleti célját,
az entitások adatmodelljét, az egyes modulok és felületek működését, a beviteli 
mezőkhöz tartozó adatformátumokat, példákat és limitációkat, a felhasználói 
interakciókat, valamint a tesztelési hozzáféréseket.

KAPCSOLÓDÓ USER STORY-K:
- Egészségügyi szakemberként (orvos/gyógyszerész) szeretnék naprakész információt kapni 
  a gyógyszerek piaci elérhetőségéről, készlethiányáról és a helyettesíthetőségről.
- Felhasználóként szeretném megtalálni a legközelebbi preferált gyógyszertáramat és 
  ellenőrizni annak aktuális készletét.
- Felhasználóként szeretnék szakmai és akkreditált képzéseken részt venni.
- Adminisztrátorként szeretném kezelni a felhasználókat, jogosultságokat, patikákat és tartalmakat.

KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
- Irányítópult (Dashboard): https://bvorvosi.vercel.app/dashboard
- Gyógyszer Nyilvántartás (Lista + Adatlap): https://bvorvosi.vercel.app/gyogyszerek
- Gyógyszertár Kereső (Térkép + Készlet): https://bvorvosi.vercel.app/gyogyszertarak
- Képzési Program (Képzések): https://bvorvosi.vercel.app/kepzesek
- Globális Kereső (Fejléc integráció)
- Hitelesítés & Profilkezelés: https://bvorvosi.vercel.app/login, https://bvorvosi.vercel.app/profile
- Adminisztráció (Felhasználók, Patikák, Moderálás): https://bvorvosi.vercel.app/admin/users
============================================================================
-->

# WikiSpec Funkcionális Specifikáció

> **Verzió:** 6.0  
> **Dátum:** 2026.08.10.  
> **Státusz:** Aktualizált (Felhasználói és Üzleti fókuszú, Részletes Mezőspecifikációval)  
> **Prototípus URL:** [https://bvorvosi.vercel.app/](https://bvorvosi.vercel.app/)

---

## Tartalomjegyzék
1. [Brief (Áttekintés)](#1-brief)
2. [Fogalomtár (Glossary)](#2-fogalomtár)
3. [Adatmodellek Specifikációja](#3-adatmodellek-specifikációja)
4. [Modulok és Funkciók Részletes Leírása](#4-modulok-és-funkciók-részletes-leírása)
   - [4.1. Irányítópult (Dashboard)](#41-irányítópult-dashboard)
   - [4.2. Gyógyszer Nyilvántartás](#42-gyógyszer-nyilvántartás)
   - [4.3. Gyógyszertár Kereső](#43-gyógyszertár-kereső)
   - [4.4. Képzési Program](#44-képzési-program)
   - [4.5. Globális Keresés](#45-globális-keresés)
   - [4.6. Hitelesítés és Jogosultságok](#46-hitelesítés-és-jogosultságok)
   - [4.7. Adminisztráció](#47-adminisztráció)
   - [4.8. Felhasználói Profil](#48-felhasználói-profil)
5. [Korábban tervezett, de elvetett funkciók](#5-korábban-tervezett-de-elvetett-funkciók)
6. [Tesztfiókok és Hozzáférések](#6-tesztfiókok-és-hozzáférések)

---

## 1. Brief

### Cél
Egy orvosi szakmai portál biztosítása, amely támogatja a gyógyszerészeket és orvosokat a napi munkájukban. A rendszer célja, hogy naprakész információt nyújtson a gyógyszerkészletekről, a piaci készlethiányról, a helyettesíthetőségről, a legközelebbi preferált patika elérhetőségéről, valamint akkreditált szakmai képzési lehetőségeket biztosítson.

### Live Prototípus
A működő prototípus felülete elérhető az alábbi hivatkozáson:  
🔗 [https://bvorvosi.vercel.app/](https://bvorvosi.vercel.app/)

### Felhasználói Szerepkörök
- **Szakmai Felhasználó (User):** Orvos, gyógyszerész vagy egészségügyi szakdolgozó. Hozzáfér a gyógyszer-nyilvántartáshoz, patikakeresőhöz, képzésekhez és a saját profilbeállításaihoz.
- **Rendszeradminisztrátor (Admin):** A portál működését felügyelő felhasználó, aki felhasználókat kezel, patikaadatokat tart karban és tartalommoderációt végez.

### Modulok Áttekintése
A rendszer moduláris felépítésű, központjában a biztonságos szakmai azonosítás áll. A fő funkcionális egységek:
- **[Irányítópult](#41-irányítópult-dashboard):** Központi összegző felület a piaci és patikai készletváltozásokról.
- **[Gyógyszer Nyilvántartás](#42-gyógyszer-nyilvántartás):** Gyógyszerek keresése, táblázatos szűrése és részletes adatlapja.
- **[Gyógyszertár Kereső](#43-gyógyszertár-kereső):** Patikák térképes és listás megjelenítése, készletellenőrzés.
- **[Képzési Program](#44-képzési-program):** Szakmai és akkreditált képzések böngészése, tananyagok feldolgozása.
- **[Globális Keresés](#45-globális-keresés):** Fejlécből indítható keresés a portál teljes tartalmában.
- **[Adminisztráció](#47-adminisztráció):** Felhasználók, patikák és közösségi tartalmak kezelése.

---

## 2. Fogalomtár

| Kifejezés | Definíció és Üzleti Jelentés | Konkrét Felületi Példa |
|---|---|---|
| **Közeli Patika (Preferált Patika)** | A felhasználó által megjelölt gyógyszertár. A rendszer ezen patika készletadatait és távolságát kiemelten kezeli az egész portálon. | *"BENU Gyógyszertár Arany Sas"* |
| **Kedvenc Gyógyszer** | A felhasználó által megjelölt gyógyszer, amely bekerül a mentett listába a gyors elérés érdekében. | *"Algopyrin 500 mg filmtabletta"* |
| **Készletértesítés** | Feliratkozás egy adott gyógyszer piaci vagy patikai státuszváltozására (pl. készlethiány vagy újra elérhető állapot). | Értesítés küldése hírlevélben vagy felületi üzenetben. |
| **TK-szám** | Törzskönyvi szám - a gyógyszerek hatósági egyedi azonosítója. | `"OGYI-T-8898/01"` |
| **INN** | Nemzetközi Szabadnév (International Nonproprietary Name) - a gyógyszer hatóanyaga. | `"metamizol-nátrium"` |
| **ATC-kód** | Anatómiai, Terápiás és Kémiai osztályozási rendszer kódja. | `"N02BB02"` |
| **Hírlevél Hatókör (Scope)** | A készletértesítő hírlevelek szűrési köre (pl. teljes adatbázis, csak a felhasználó szakterülete, vagy csak a mentett kedvenc gyógyszerei). | `"Szakterület + mentett gyógyszerek"` |
| **Kényszerített Munkamenet Lezárás** | Adminisztrátori vagy biztonsági művelet, amely azonnal érvényteleníti a felhasználó aktív belépését. | Felhasználó átirányítása a bejelentkezési oldalra. |

---

## 3. Adatmodellek Specifikációja

Ez a szakasz a rendszer fő üzleti entitásait mutatja be a beviteli mezők, adattípusok, megadható értékek, példák és limitációk szempontjából.

### 3.1. Felhasználó (User) Adatmodell

| Mező neve | Felületi Típus | Megadható Adatok / Formátum | Példa Érték | Üzleti & Felületi Limitációk |
|---|---|---|---|---|
| **Teljes név** | Egysoros szövegmező | Szöveg (vezetéknév + keresztnév) | `"Dr. Kovács István"` | Kötelező. Min. 3, max. 100 karakter. |
| **Elsődleges e-mail** | Egysoros email mező | Érvényes e-mail formátum (`user@domain.hu`) | `"demo@example.com"` | Kötelező. Egyedinek kell lennie a rendszerben. Belépési azonosító. |
| **Másodlagos e-mail** | Egysoros email mező | Érvényes e-mail formátum | `"kovacs.private@email.hu"` | Opcionális. Értesítések és hírlevelek másodlagos címe. |
| **Szerepkör** | Legördülő menü | `User` (Szakmai) / `Admin` (Rendszeradmin) | `User` | Kötelező. Az adminisztrátor módosíthatja. |
| **Fiók Státusz** | Legördülő menü | `Active` (Aktív) / `Inactive` (Inaktív) | `Active` | Inaktív fiókkal a bejelentkezés elutasításra kerül. |
| **Szakterületek** | Kereshető multi-select | Fix orvosi kódlista elemei | `["Háziorvos", "Belgyógyász"]` | Több opció is kiválasztható a megadott kódlistából. |
| **Hírlevél (Képzés)** | Kapcsoló + Checkboxok | Be/Ki; Kategóriák: `Akkreditált`, `Gyártói`, `Eladásösztönző` | `Feliratkozva: Akkreditált` | Külön állítható az elsődleges és másodlagos e-mailre. |
| **Hírlevél (Készlet)** | Kapcsoló + Rádió/Select | Frekvencia (`Napi`/`Heti`/`Havi`), Időpont, Események, Hatókör | `Heti, 09:00, Készlethiány` | Külön állítható az elsődleges és másodlagos e-mailre. |
| **Preferált Patika** | Kiválasztó komponens | Egy kijelölt gyógyszertár azonosítója | `"BENU Gyógyszertár Arany Sas"` | Opcionális. Bármikor módosítható vagy törölhető. |

### 3.2. Gyógyszer (Medicine) Adatmodell

| Mező neve | Felületi Típus | Megadható Adatok / Formátum | Példa Érték | Üzleti & Felületi Limitációk |
|---|---|---|---|---|
| **Kereskedelmi Név** | Megjelenítő / Szöveg | Szöveg | `"Algopyrin 500 mg filmtabletta"` | Kötelező azonosító elnevezés. |
| **TK-szám** | Megjelenítő / Szöveg | Hatósági azonosító formátum | `"OGYI-T-8898/01"` | Egyedi törzskönyvi szám. Rendszerazonosító a hivatkozásokban. |
| **INN (Hatóanyag)** | Megjelenítő / Link | Szöveg (Hatóanyag neve) | `"metamizol-nátrium"` | Kattintható hivatkozás: rákattintva a hatóanyagra szűr a listában. |
| **ATC-kód** | Megjelenítő / Szöveg | 7 karakteres kód | `"N02BB02"` | Szabványos anatómiai-terápiás osztályozás. |
| **Gyártó** | Megjelenítő / Szöveg | Cégnév | `"Sanofi-Aventis Zrt."` | A gyógyszer forgalomba hozatali engedélyese / gyártója. |
| **Márkanév** | Megjelenítő / Szöveg | Kereskedelmi márkaneve | `"Algopyrin"` | A termékcsalád márkaneve. |
| **Kiszerelés** | Megjelenítő / Szöveg | Mennyiség és csomagolási forma | `"20x filmtabletta"` | A dobozban található mennyiség. |
| **Kiadhatóság** | Megjelenítő / Címke | `Vényköteles` / `Vény nélkül kapható` | `Vényköteles` | Fő kiadhatósági kategória. |
| **Státusz** | Címke (Színkódolt) | `Elérhető` / `Készlethiány` / `Megszűnt` | `Készlethiány` | Zöld (Elérhető), Sárga (Készlethiány), Piros (Megszűnt). |
| **Hiány kezdete** | Dátum kijelző | Dátum formátum (`ÉÉÉÉ.MM.NN`) | `2026.07.15` | Kizárólag készlethiány esetén jelenik meg. |
| **Hiány várható vége**| Dátum kijelző | Dátum formátum (`ÉÉÉÉ.MM.NN`) | `2026.09.30` | Becsült lejárati dátum. Opcionális (lehet "Ismeretlen"). |
| **Hiány oka** | Szövegblokk | Szöveges leírás | `"Gyártási kapacitáshiány"` | Részletes tájékoztatás az orvos/gyógyszerész számára. |
| **Pótlási javaslat** | Szövegblokk | Szöveges leírás | `"Helyettesíthető azonos INN készítménnyel."` | Szakmai javaslat a betegellátás folytonosságához. |

### 3.3. Gyógyszertár (Pharmacy) Adatmodell

| Mező neve | Felületi Típus | Megadható Adatok / Formátum | Példa Érték | Üzleti & Felületi Limitációk |
|---|---|---|---|---|
| **Patika neve** | Szövegmező | Szöveg | `"BENU Gyógyszertár Arany Sas"` | Kötelező. |
| **Irányítószám** | Szövegmező | 4 számjegy | `"1052"` | Kötelező. Magyarországi irányítószám formátum. |
| **Város** | Szövegmező | Szöveg | `"Budapest"` | Kötelező. |
| **Utca, házszám** | Szövegmező | Szöveg | `"Károly körút 1."` | Kötelező. Pontos közterület megnevezés. |
| **Vármegye** | Legördülő menü | Magyarországi vármegyék listája | `"Pest / Budapest"` | Területi besorolás. |
| **Szélesség (Lat)** | Számos mező | Tizedes tört (`-90` és `+90` között) | `47.4979` | Földrajzi koordináta térképes pozícionáláshoz. |
| **Hosszúság (Lng)** | Számos mező | Tizedes tört (`-180` és `+180` között)| `19.0543` | Földrajzi koordináta térképes pozícionáláshoz. |
| **Nyitvatartás** | Napi Időpont választók| Nyitás-Zárás naptári naponként | `"H-P: 08:00-19:00, Szo: 08:00-13:00"` | Naponta állítható nyitási és zárási időpont vagy "Zárva". |
| **Telefonszám** | Szövegmező | Telefonszám formátum | `"+36 1 234 5678"` | Kapcsolattartási telefonszám. |
| **E-mail cím** | Email mező | Érvényes e-mail formátum | `"aranysas@benu.hu"` | Elektronikus kapcsolat. |

---

## 4. Modulok és Funkciók Részletes Leírása

### 4.1. Irányítópult (Dashboard)

#### Brief
A bejelentkezést követő nyitóoldal. Gyors áttekintést nyújt a piaci gyógyszer-státuszváltozásokról, a kiválasztott preferált patika állapotáról és az aktuális képzésekről.

**Útvonal:** [https://bvorvosi.vercel.app/dashboard](https://bvorvosi.vercel.app/dashboard)

#### Felületi elemek és Beviteli Mezők

1. **Időszak Választó (Time Period Selector):**
   - **Felületi elem:** Rádiógomb / Választó fülek.
   - **Választható opciók:** `1 nap`, `7 nap`, `30 nap`.
   - **Alapértelmezett érték:** `7 nap`.
   - **Működés:** Az itt kiválasztott időintervallum alapján frissülnek az Irányítópulton látható statisztikai mutatószámok és a legutóbbi készletváltozások listája.

2. **Készletváltozások Összegző Kártyák:**
   - Három vizuális blokk: **Elérhető** (zöld), **Készlethiány** (sárga), **Megszűnt** (piros).
   - Megjeleníti az adott időszakban státuszt váltott gyógyszerek darabszámát.
   - Rákattintva szűri a változási táblázatot.

3. **Legutóbbi Státuszváltozások Táblázata:**
   - Megjeleníti a gyógyszer nevét, TK-számát, az új státuszt és a változás időpontját.
   - **Interakció:** Bármely gyógyszersorra kattintva a rendszer átirányít az adott [Gyógyszer Adatlapjára](#422-gyógyszer-adatlap).

4. **Közeli Patika Modul:**
   - **Ha van kiválasztott preferált patika:** Megjeleníti a patika nevét, címét, nyitvatartási állapotát, valamint egy vizuális aránysávot a raktáron lévő vs. nem elérhető gyógyszerek arányáról.
   - **Ha nincs kijelölt preferált patika:** Egy tájékoztató kártya jelenik meg `"Nincs kiválasztva preferált patika"` felirattal és egy `"Patika kiválasztása"` gombbal, amely átirányít a [Gyógyszertár Keresőre](#431-gyógyszertárak-oldal).

5. **Képzési Program Promóciós Modul:**
   - Kiemelt szakmai kurzus kártyája címmel, időtartammal és kategóriával.
   - `"Képzés megtekintése"` gomb: közvetlen navigáció a [Képzési Programba](#441-képzések-főoldal).

---

### 4.2. Gyógyszer Nyilvántartás

#### 4.2.1. Gyógyszer Lista Oldal

A portál központi kereső- és szűrőfelülete a gyógyszerkészítmények böngészésére.

**Útvonal:** [https://bvorvosi.vercel.app/gyogyszerek](https://bvorvosi.vercel.app/gyogyszerek)

#### Beviteli Mezők és Szűrők Részletes Specifikációja

1. **Kereső mező (Szabad szöveges keresés):**
   - **Típus:** Egysoros szövegmező kereső ikonnal és törlés gombbal.
   - **Megadható adatok:** Szöveges kifejezés.
   - **Keresési tartomány:** Gyógyszer kereskedelmi neve, Törzskönyvi száma (TK-szám), vagy Hatóanyaga (INN).
   - **Példák:** `"Algopyrin"`, `"OGYI-T-8898/01"`, `"metamizol"`.
   - **Limitációk & Működés:** Élő szűrést hajt végre. Kis- és nagybetű független. A szűrés a gépeléssel egyidejűleg elindul.

2. **Gyógyszer Státusz Szűrő:**
   - **Típus:** Legördülő menü (Select).
   - **Választható opciók:** `Mind`, `Elérhető`, `Készlethiány`, `Megszűnt`, `Nem elérhető`.
   - **Alapértelmezett érték:** `Mind`.
   - **Limitáció:** Szűri a táblázatot a kiválasztott piaci elérhetőség szerint.

3. **Közeli Patika Készlet Szűrő:**
   - **Típus:** Kapcsoló / Jelölőnégyzet (Toggle / Checkbox).
   - **Választható opciók:** `Be` (Bekapcsolva) / `Ki` (Kikapcsolva).
   - **Limitáció:** Bekapcsolt állapotban kizárólag azon készítményeket jeleníti meg, amelyek a beállított preferált patikában raktáron vannak. Ha nincs beállítva preferált patika, a kapcsoló inaktív.

4. **Kedvencek Szűrő:**
   - **Típus:** Kapcsoló / Jelölőnégyzet.
   - **Választható opciók:** `Be` / `Ki`.
   - **Limitáció:** Kizárólag a felhasználó által csillaggal megjelölt mentett gyógyszereket mutatja.

5. **Oszlopszintű Dátumtartomány Szűrő (Utolsó Frissítés Oszlop):**
   - **Típus:** Dátumválasztó mezőpár (Kezdő dátum - Záró dátum).
   - **Formátum:** `ÉÉÉÉ.MM.NN`.
   - **Példa:** `2026.01.01` - `2026.08.10`.
   - **Limitáció:** A kezdő dátum nem lehet későbbi a záró dátumnál.

6. **Patikai Készletállapot Oszlopszűrő:**
   - **Típus:** Legördülő menü az oszlopfejlécben.
   - **Választható opciók:** `Raktáron`, `Rendelhető`, `Nincs raktáron`.

7. **Nézet Testreszabása Panel (Oszlopbeállítások):**
   - **Gomb:** `"Oszlopok testreszabása"`.
   - **Funkció:** Egy felugró oldalsó fiókban jelölőnégyzetekkel be- és kikapcsolhatók a táblázat oszlopai (Név, TK-szám, Hatóanyag, ATC kód, Gyártó, Kiadhatóság, Státusz, Utolsó frissítés, Közeli Patika készlet).
   - **Sorrend:** A nyíl gombokkal módosítható az oszlopok megjelenítési sorrendje.
   - **Perzisztencia:** A böngésző helyi tárolója (LocalStorage) megőrzi a felhasználó egyéni oszlopbeállításait.

#### Lista Műveletek és Megerősítő Dialogok

- **Kedvencnek jelölés (Csillag ikon):** A gyógyszer mentése a saját listára. Ha a gyógyszer eltávolításakor a termékhez aktív készletértesítés kapcsolódik, a rendszer egy **Megerősítő Modális Ablakot** jelenít meg:
  - *Üzenet:* `"A gyógyszer eltávolításával a kapcsolódó készletértesítés is törlődik. Biztosan folytatja?"`
  - *Opciók:* `Igen, törlöm` (piros gomb) / `Mégse` (szürke gomb).
- **Készletértesítés kérése (Harang ikon):** Kattintásra feliratkoztat a készletváltozásokra (a termék automatikusan felkerül a kedvencek közé is).
- **Lapozó (Pagination):**
  - *Elemszám választó:* `10`, `25`, `50`, `100` sor/oldal.
  - *Lapozó gombok:* `Első`, `Előző`, Oldalszám gombok, `Következő`, `Utolsó`.

---

#### 4.2.2. Gyógyszer Adatlap

Egy konkrét gyógyszer részletes szakmai adatlapja.

**Útvonal:** `https://bvorvosi.vercel.app/gyogyszerek/[tkSzam]`  
*(Példa: [https://bvorvosi.vercel.app/gyogyszerek/OGYI-T-8898%2F01](https://bvorvosi.vercel.app/gyogyszerek/OGYI-T-8898%2F01))*

#### Részletes Adatmezők és Funkciók

1. **Törzsadatok Megjelenítése:**
   - Kereskedelmi Név, TK-szám, ATC-kód, Márkanév, Gyártó, Kiszerelés, Csomagolási részletek, Kiadhatóság, Biztonsági jellemzők megléte, Engedélyezés dátuma, Utolsó státuszfrissítés időpontja.
   - **INN (Hatóanyag) Interakció:** A hatóanyag kattintható hivatkozás. Rákattintva a rendszer visszanavigál a gyógyszerlistára, automatikusan az adott hatóanyagra szűrve.

2. **Készlethiány Részletes Kártya (kizárólag Készlethiány státusznál):**
   - *Hiány kezdete:* Dátum (pl. `2026.07.15`).
   - *Hiány várható vége:* Dátum (pl. `2026.09.30`).
   - *Hiány oka:* Szöveges megnevezés (pl. `"Gyártási alapanyaghiány"`).
   - *Pótlási javaslat:* Szakmai javaslat és leírás a pótlásra.

3. **Készletellenőrző Gomb (`"Megnézem hol"`):**
   - Kattintásra megnyitja a [Gyógyszertári Készlet Nézet](#433-gyógyszertári-készlet-nézet) térképes ablakát az adott gyógyszerre szűrve.

4. **Helyettesítő Termékek Ajánlója:**
   - Azonos hatóanyagú (INN) vagy terápiás csoportba tartozó (ATC) elérhető készítmények listája.
   - **Üzleti logika:** Az ajánló algoritmus több gyártó kínálatából kiegyensúlyozottan válogat a piaci semlegesség biztosítása érdekében.

5. **Státusz Történet Idővonal:**
   - Időrendi lista a gyógyszer korábbi elérhetőségi változásairól (Dátum, Régi státusz → Új státusz).

---

### 4.3. Gyógyszertár Kereső

#### 4.3.1. Gyógyszertárak Oldal

Interaktív térképes és szinkronizált listás kereső a patikák megtalálására.

**Útvonal:** [https://bvorvosi.vercel.app/gyogyszertarak](https://bvorvosi.vercel.app/gyogyszertarak)

#### Beviteli Mezők és Szűrők

1. **Kereső mező:**
   - **Típus:** Egysoros szövegmező.
   - **Megadható adatok:** Patika neve, Utca/Házszám cím, vagy Város neve.
   - **Példák:** `"BENU"`, `"1052 Budapest"`, `"Károly körút"`.
   - **Limitáció:** Élő szűrés a látható és listázott patikákra.

2. **Nyitvatartási Szűrőgombok:**
   - **Opciók:** `"Most nyitva"`, `"0-24 órás"`, `"Hétvégén is nyitva"`.
   - **Működés:** Szűri a térképes jelölőket és a kapcsolódó listát.

3. **"Mutasd az összeset" Gomb:**
   - Alaphelyzetbe állítja a térkép nézetét és törli az aktív nyitvatartási szűrőket.

4. **Preferált Patika Kijelölése:**
   - Gomb a patikakártyán és a térképes felugró ablakban: `"Beállítás preferált patikaként"`.
   - Visszajelzés: A kiválasztott patikán egyértelmű `"Preferált Patika"` kitűző jelenik meg, és beállítása érvényesül az egész portálon.

---

#### 4.3.3. Gyógyszertári Készlet Nézet (Modális Térképes Nézet)

- **Funkció:** A Gyógyszer adatlapról megnyitható modális ablak.
- **Működés:** Kizárólag azokat a gyógyszertárakat jeleníti meg a térképen és a kísérő listában, ahol a kiválasztott gyógyszer raktáron van vagy rendelhető.

---

### 4.4. Képzési Program

#### 4.4.1. Képzések Főoldal

A szakmai és akkreditált képzések böngészőfelülete.

**Útvonal:** [https://bvorvosi.vercel.app/kepzesek](https://bvorvosi.vercel.app/kepzesek)

#### Felületi elemek és Szűrők

1. **Kategória Szűrő Fülek:**
   - **Típus:** Horizontális fül-választó (Tabs).
   - **Választható opciók:** `Minden képzés`, `Akkreditált`, `Gyártói`, `Eladásösztönző`.
   - **Alapértelmezett:** `Minden képzés`.

2. **Kurzuskártyák adatai:**
   - Képzés címe, Kategória jelvény, Megszerezhető kreditpontok (ha akkreditált), Tananyag becsült időtartama (pl. `"45 perc"`), Tartalomtípus ikon (Videó / PDF Dokumentum).

#### 4.4.2. Képzés Részletes Oldal

**Útvonal:** `https://bvorvosi.vercel.app/kepzesek/[courseId]`  
*(Példa: [https://bvorvosi.vercel.app/kepzesek/c1](https://bvorvosi.vercel.app/kepzesek/c1))*

- Tananyag lejátszó / olvasó felület leckékkel, letölthető segédanyagokkal és tesztkitöltési lehetőséggel.

---

### 4.5. Globális Keresés

A navigációs fejlécbe épített rendszerszintű kereső.

#### Beviteli Mező Specifikáció
- **Típus:** Egysoros szövegmező beépített kereső ikonnal a fejlécben.
- **Megadható adatok:** Bármilyen kifejezés (Gyógynév, TK-szám, Hatóanyag, Patikanév, Fórum téma).
- **Példa:** `"aspirin"`.
- **Limitációk & Működés:**
  - Legalább **2 karakter** beírása után megnyílik a kategorizált élő találati lista:
    - *Gyógyszerek találati blokk:* Rákattintva navigáció a gyógyszer adatlapjára (`/gyogyszerek/[tkSzam]`).
    - *Gyógyszertárak találati blokk:* Rákattintva navigáció a patikakeresőre (`/gyogyszertarak`).
    - *Közösségi témák találati blokk:* Rákattintva navigáció a téma adatlapjára (`/kozosseg/[topicId]`).

---

### 4.6. Hitelesítés és Jogosultságok

#### 4.6.1. Bejelentkezés Oldal

**Útvonal:** [https://bvorvosi.vercel.app/login](https://bvorvosi.vercel.app/login)

#### Beviteli Mezők és Validációk

1. **E-mail cím:**
   - **Típus:** Egysoros email mező (`type="email"`).
   - **Megadható adatok:** Szabványos email formátum (`user@domain.hu`).
   - **Példák:** `demo@example.com`, `admin@example.com`.
   - **Limitáció:** Kötelező mező. Szintaktikai ellenőrzés (érvényes `@` és domain).

2. **Jelszó:**
   - **Típus:** Egysoros jelszómező (`type="password"`, maszkolt karakterekkel).
   - **Megadható adatok:** Karakterlánc.
   - **Példa:** `vény123`.
   - **Limitáció:** Kötelező mező.

3. **Gombok & Hibaüzenetek:**
   - `"Bejelentkezés"` submit gomb.
   - `"Elfelejtett jelszó?"` link -> átirányítás a `/forgot-password` oldalra.
   - *Hiba híváskor:* `"Érvénytelen e-mail cím vagy jelszó."`
   - *Hiba felfüggesztett fióknál:* `"A fiók fel van függesztve. Kérjük, lépjen kapcsolatba az adminisztrátorral."`

#### 4.6.2. Elfelejtett Jelszó Oldal

**Útvonal:** [https://bvorvosi.vercel.app/forgot-password](https://bvorvosi.vercel.app/forgot-password)

- **E-mail cím mező:** Szabványos email mező. Példa: `demo@example.com`. Kötelező.
- **"Visszaállító link küldése" gomb:** Kattintásra megerősítő üzenet jelenik meg a felületen: `"Ha az e-mail cím regisztrálva van a rendszerben, kiküldtük a jelszó-visszaállító utasításokat."`

#### 4.6.3. Jogosultságkezelés és Munkamenet Biztonság
- Szerepkörök: `Admin` (teljes hozzáférés az `/admin/*` útvonalakhoz) és `User` (szakmai felhasználó access).
- **Munkamenet biztonság:** Ha az adminisztrátor felfüggeszti a fiókot vagy gombnyomással lezárja az aktív munkamenetet, a felhasználó a következő műveletnél azonnal kijelentkeztetésre kerül és a login oldalra irányítódik.

---

### 4.7. Adminisztráció

Kizárólag `Admin` szerepkörrel rendelkező felhasználók számára elérhető felület.

#### 4.7.1. Felhasználókezelés

**Útvonal:** [https://bvorvosi.vercel.app/admin/users](https://bvorvosi.vercel.app/admin/users)

#### Új / Szerkesztett Felhasználó Modális Ablak (Fülek)

1. **Alapadatok Fül:**
   - *Teljes név:* Egysoros szövegmező. Megadható: Karakterlánc. Példa: `"Dr. Minta Péter"`. Kötelező.
   - *Elsődleges e-mail cím:* Email mező. Megadható: Érvényes email formátum. Példa: `"minta.peter@orvos.hu"`. Kötelező, egyedi.
   - *Másodlagos e-mail cím:* Email mező. Megadható: Érvényes email formátum. Példa: `"minta.privat@gmail.com"`. Opcionális.
   - *Szerepkör (Role):* Legördülő menü (`User` / `Admin`).
   - *Fiók Státusz (Status):* Legördülő menü (`Active` / `Inactive`).

2. **Profil Fül:**
   - *Szakterületek:* Kódlistás multi-select jelölőnégyzetekkel az orvosi szakterületekből (pl. Háziorvos, Belgyógyász, Kardiológus, Gyógyszerész).

3. **Hírlevél Fül:**
   - Elsődleges és Másodlagos e-mail cím hírlevél preferenciáinak adminisztrátori finomhangolása (Képzési és Készletinfó beállítások).

#### Adminisztrátori Műveletek & Megerősítő Dialogok

- **Aktiválás / Deaktiválás Gomb:** Deaktiváláskor megerősítő dialog: `"Biztosan felfüggeszti a felhasználó fiókját? A meglévő munkamenete azonnal megszűnik."`
- **Munkamenet Azonnali Lezárása (Force Logout):** Gomb és megerősítő dialog: `"Biztosan kijelentkezteti a felhasználót az összes eszközről?"`
- **Jelszó-visszaállítás Kezdeményezése:** Gomb és megerősítő dialog, amely ideiglenes értesítést generál.

---

#### 4.7.2. Fórum és Tartalom Moderálás

**Útvonal:** [https://bvorvosi.vercel.app/admin/forum](https://bvorvosi.vercel.app/admin/forum)

- Témák és Hozzászólások áttekintése.
- *Moderációs műveleti gombok:* `"Téma elrejtése"`, `"Téma lezárása"`, `"Szerző anonimizálása"` (lecseréli a szerző nevét `"Anonim Felhasználó"` feliratra), `"Hozzászólás törlése"`.

---

#### 4.7.3. Gyógyszertár Karbantartás

**Útvonal:** [https://bvorvosi.vercel.app/admin/pharmacies](https://bvorvosi.vercel.app/admin/pharmacies)

#### Patika Szerkesztő Űrlap Beviteli Mezői

- **Patika neve:** Szövegmező. Példa: `"BENU Gyógyszertár Arany Sas"`. Kötelező.
- **Irányítószám:** Szövegmező. Példa: `"1052"`. Kötelező, 4 számjegy.
- **Város:** Szövegmező. Példa: `"Budapest"`. Kötelező.
- **Utca, házszám:** Szövegmező. Példa: `"Károly körút 1."`. Kötelező.
- **Vármegye:** Legördülő menü. Példa: `"Pest / Budapest"`.
- **Szélességi koordináta (Latitude):** Számos mező (`-90` és `+90` között). Példa: `47.4979`.
- **Hosszúsági koordináta (Longitude):** Számos mező (`-180` és `+180` között). Példa: `19.0543`.
- **Nyitvatartási rend:** Naponta bontott nyitási és zárási időpont választók (H-Va). Példa: `"08:00 - 19:00"` vagy `"Zárva"`.
- **Telefonszám:** Szövegmező. Példa: `"+36 1 234 5678"`.
- **E-mail cím:** Email mező. Példa: `"aranysas@benu.hu"`.

---

### 4.8. Felhasználói Profil

A felhasználó saját adataik és preferenciáik kezelési központja.

**Útvonal:** [https://bvorvosi.vercel.app/profile](https://bvorvosi.vercel.app/profile)

#### 4.8.1. Személyes Adatok és Szakterületek
- **Név, Elsődleges e-mail, Másodlagos e-mail:** Megjelenítő mezők olvasási módban.
- **Szakterületek Módosítása:**
  - **Típus:** Kereshető multi-select komponens szakterület keresővel.
  - **Megadható értékek:** Az orvosi szakterület kódlista elemei (pl. Háziorvos, Belgyógyász, Kardiológus, Bőrgyógyász, Gyógyszerész stb.).
  - **Gomb:** `"Szakterületek mentése"`.

#### 4.8.2. Preferált Gyógyszertár Kezelése
- Megjeleníti a jelenleg kiválasztott preferált patika kártyáját.
- **Gombok:**
  - `"Patika módosítása"` -> megnyitja a modális patikakeresőt.
  - `"Preferált patika törlése"` -> megerősítő dialogot nyit (`"Biztosan eltávolítja a preferált patikát?"`).

#### 4.8.3. Mentett Kedvencek & Készletértesítések
- Navigációs linkek a profil aloldalakra:
  - **Mentett Kedvencek Oldal:** `https://bvorvosi.vercel.app/profile/favorites` (Gyógyszerek listája törlési lehetőséggel és megerősítő ablakos figyelmeztetéssel).
  - **Készletértesítések Oldal:** `https://bvorvosi.vercel.app/profile/notifications` (Aktív értesítések áttekintése és leiratkozás).

#### 4.8.4. Jelszó Módosítása Űrlap

1. **Jelenlegi jelszó:**
   - **Típus:** Jelszó mező (`type="password"`).
   - **Megadható adatok:** Karakterlánc. Példa: `vény123`.
   - **Validáció:** Meg kell egyezzen a meglévő aktív jelszóval.

2. **Új jelszó:**
   - **Típus:** Jelszó mező (`type="password"`).
   - **Megadható adatok:** Karakterlánc. Példa: `UjJelszo2026!`.
   - **Validáció & Limitációk:** **Kötelezően legalább 6 karakter hosszú, és tartalmaznia kell legalább egy számot és legalább egy speciális karaktert** (pl. `!`, `@`, `#`, `$`, `%`).

3. **Új jelszó megerősítése:**
   - **Típus:** Jelszó mező (`type="password"`).
   - **Validáció:** Pontosan meg kell egyezzen az Új jelszó mezőbe írt értékkel.

- **Gomb:** `"Jelszó frissítése"`. Sikeres mentéskor zöld megerősítő üzenet jelenik meg.

#### 4.8.5. Hírlevél Beállítások (Fejlett Értesítéskezelés)

Külön-külön konfigurálható az **Elsődleges e-mail címre** és a **Másodlagos e-mail címre**:

1. **BENU Képzési Program Hírlevél:**
   - **Kapcsoló (Toggle):** `Feliratkozva` / `Leiratkozva`.
   - **Témakör Jelölőnégyzetek (Checkboxok):** `Akkreditált`, `Gyártói`, `Eladásösztönző`.

2. **Készletinfó Hírlevél:**
   - **Kapcsoló (Toggle):** `Feliratkozva` / `Leiratkozva`.
   - **Gyakoriság (Frekvencia):** Rádiógomb / Select: `Napi`, `Heti`, `Havi`.
   - **Kiküldési időpont:** Legördülő menü (pl. `08:00`, `09:00`, `10:00`).
   - **Esemény típusok (Jelölőnégyzetek):** `Újra elérhető`, `Készlethiány`, `Megszűnt`.
   - **Hatókör (Scope - Rádiógombok):** `Minden gyógyszer`, `Szakterület + mentett gyógyszerek`, `Csak szakterület`, `Csak mentett gyógyszer`.

---

## 5. Korábban tervezett, de elvetett funkciók

Ez a szekció azokat a funkciókat tartalmazza, amelyek korábbi verziókban tervezett elemek voltak, de a jelenlegi felületen nem aktívak.

### ~~Közösségi Fórum a Felhasználói Oldalon~~
> **Státusz:** Nem aktív a fő felhasználói menüben – szerepét a Képzési Program vette át.  
> **Elérhetőség:** Korábbi útvonal: `https://bvorvosi.vercel.app/kozosseg`. A téma- és hozzászólás-adatmodell moderációs és archiválási okokból az adminisztrációs felületen megmaradt (`https://bvorvosi.vercel.app/admin/forum`).

### ~~Gyógyszer Lista: Kártya Nézet Váltás~~
> **Státusz:** Nem aktív a felületen.  
> A gyógyszerlista a szakmai hatékonyság és áttekinthetőség érdekében kizárólag a rendezhető és szűrhető táblázatos nézetben érhető el.

### ~~Gyógyszer Keresés: ATC Kód és Gyártó Alapján a Szabad Szöveges Keresőben~~
> **Státusz:** Nem aktív a szabad szöveges keresőmezőben.  
> A kereső mező jelenleg Név, TK-szám és INN Hatóanyag alapján keres. Az ATC kód és Gyártó adatok az adatlapon és a táblázat kijelölhető oszlopaiban tekinthetők meg.

---

## 6. Tesztfiókok és Hozzáférések

> **Megjegyzés:** Az alábbi tesztfiókok a prototípus élő kipróbálására szolgálnak a [https://bvorvosi.vercel.app/login](https://bvorvosi.vercel.app/login) oldalon.

**Minden fiók egységes jelszava:** `vény123`

| # | Fiók neve | Email | Jelszó | Szerepkör | Státusz | Szakterületek | Tesztelési Rendeltetés |
|---|---|---|---|---|---|---|---|
| 1 | Adminisztrátor | `admin@example.com` | `vény123` | Admin | Aktív | – | Adminisztrációs felület és felhasználókezelés tesztelése ([https://bvorvosi.vercel.app/admin/users](https://bvorvosi.vercel.app/admin/users)). |
| 2 | Dr. Kovács István (Orvos) | `demo@example.com` | `vény123` | User | Aktív | Háziorvos, Belgyógyász | Szakmai portál teljes körű tesztelése (keresés, kedvencek, értesítések, profilbeállítások). Az admin felület elérése számára korlátozott. |
| 3 | Dr. Teszt Szabolcs (Inaktív) | `teszt@example.com` | `vény123` | User | Inaktív | Kardiológus | Felfüggesztett/Inaktív fiók bejelentkezési elutasításának és védelmének tesztelése. |

---
