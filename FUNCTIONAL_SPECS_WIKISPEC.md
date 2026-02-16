# WikiSpec Funkcionális Specifikáció

> **Verzió:** 2.0
> **Dátum:** 2026.02.16.
> **Státusz:** Tervezet

## Tartalomjegyzék
1. [Brief (Áttekintés)](#1-brief)
2. [Fogalomtár (Glossary)](#2-fogalomtár)
3. [Adatmodellek (Data)](#3-adatmodellek)
4. [Modulok és Funkciók](#4-modulok-és-funkciók)
   - [Irányítópult](#41-irányítópult-dashboard)
   - [Gyógyszer Nyilvántartás](#42-gyógyszer-nyilvántartás)
   - [Gyógyszertár Kereső](#43-gyógyszertár-kereső)
   - [Közösségi Fórum](#44-közösségi-fórum)
   - [Globális Keresés](#45-globális-keresés)
   - [Hitelesítés](#46-hitelesítés-és-jogosultságok)
   - [Adminisztráció](#47-adminisztráció)
   - [Felhasználói Profil](#48-felhasználói-profil)

---

## 1. Brief

### Cél
Egy orvosi szakmai portál létrehozása, amely támogatja a gyógyszerészeket és orvosokat a napi munkájukban. A rendszer célja, hogy naprakész információt nyújtson gyógyszerkészletekről, helyettesíthetőségről, patika elérhetőségről, és szakmai közösségi teret biztosítson.

### Felhasználók
- **Felhasználó:** Orvos, gyógyszerész vagy egészségügyi szakdolgozó.
- **Adminisztrátor:** A rendszer működését felügyelő, tartalomkezelési jogokkal rendelkező felhasználó.

### Modulok Áttekintése
A rendszer moduláris felépítésű, központban a [Hitelesítés](#46-hitelesítés-és-jogosultságok) áll. A fő funkcionális egységek:
- **[Irányítópult](#41-irányítópult-dashboard):** Minden fontos információ egy helyen.
- **[Gyógyszer Nyilvántartás](#42-gyógyszer-nyilvántartás):** Gyógyszerek keresése és részletes információk.
- **[Gyógyszertár Kereső](#43-gyógyszertár-kereső):** Patikák térképes megjelenítése és készletellenőrzés.
- **[Közösségi Fórum](#44-közösségi-fórum):** Szakmai diskurzus platform.

---

## 2. Fogalomtár

| Kifejezés | Definíció |
|---|---|
| **[Közeli Patika](#data-pharmacy)** | A [Felhasználó](#data-user) által kiválasztott, preferált [Gyógyszertár](#data-pharmacy). A rendszer ezen patika adatait (készlet, távolság) kiemelten kezeli. |
| **[Kedvenc](#data-favorite)** | A felhasználó által megjelölt [Gyógyszer](#data-medicine), amely gyors elérést biztosít a listákban. |
| **[Értesítés](#data-notification)** | Feliratkozás egy adott [Gyógyszer](#data-medicine) készlet státuszának változására (pl. újra elérhető). |
| **TK-szám** | Törzskönyvi szám, egyedi azonosító a gyógyszerekhez. |
| **INN** | Nemzetközi Szabadnév (International Nonproprietary Name) - a gyógyszer hatóanyaga. |
| **ATC-kód** | Anatómiai, Terápiás és Kémiai osztályozási rendszer kódja. |

---

## 3. Adatmodellek

Ez a szakasz definiálja a rendszerben használt fő entitásokat.

### <a name="data-user"></a>Felhasználó (User)
- **Email:** Egyedi azonosító.
- **Jelszó:** Titkosított hitelesítési adat.
- **Szakterületek:** Érdeklődési körök listája.
- **Hírlevél beállítások:** Preferenciák az email értesítésekhez.
- **Szerepkör:** 'User' vagy 'Admin'.

### <a name="data-medicine"></a>Gyógyszer (Medicine)
- **Név:** Kereskedelmi név.
- **TK-szám:** Egyedi azonosító.
- **INN (Hatóanyag):** Hatóanyag megnevezése.
- **ATC-kód:** Besorolási kód.
- **Gyártó:** A gyógyszer gyártója.
- **Státusz:** Elérhető / Készlethiány / Megszűnt.
- **Készlet:** Elérhető darabszám (összesítve vagy patikánként).

### <a name="data-pharmacy"></a>Gyógyszertár (Pharmacy)
- **Név:** Patika neve.
- **Cím:** Pontos cím (Irányítószám, Város, Utca, Házszám).
- **Koordináták:** GPS pozíció a térképhez.
- **Nyitvatartás:** Heti nyitvatartási rend.

### <a name="data-topic"></a>Fórum Téma (Topic)
- **Cím:** Téma megnevezése.
- **Leírás:** Részletes kifejtés.
- **Szerző:** Kapcsolódó [Felhasználó](#data-user) (vagy anonim).
- **Címkék:** Kategorizáló kulcsszavak.
- **Szakterület:** Kapcsolódó orvosi terület.

### <a name="data-comment"></a>Hozzászólás (Comment)
- **Tartalom:** Szöveges üzenet.
- **Szerző:** Kapcsolódó [Felhasználó](#data-user) (vagy anonim).
- **Reakciók:** Like / Dislike számlálók.

---

## 4. Modulok és Funkciók

### 4.1. Irányítópult (Dashboard)

#### Brief
A rendszer nyitóoldala bejelentkezés után. Gyors áttekintést nyújt a piaci változásokról, a kiválasztott [Közeli Patika](#data-pharmacy) státuszáról és a közösségi életről.

#### Interface
- **Készletváltozások Widget:** Lista a legutóbbi piaci státuszváltozásokról.
- **Közeli Patika Widget:** Kiválasztott patika adatai vagy térkép, ha nincs választva.
- **Közösségi Aktivitás Widget:** Statisztika és legfrissebb témák listája.

#### Funkciók
1. **Piaci változások megtekintése**
   - A [Felhasználó](#data-user) látja az "Elérhető", "Készlethiány", "Megszűnt" [Gyógyszerek](#data-medicine) számát.
   - A listából közvetlenül a [Gyógyszer Adatlapra](#422-gyógyszer-adatlap) navigálhat.

2. **Közeli Patika monitorozása**
   - Ha van beállítva [Közeli Patika](#data-pharmacy), a widget mutatja annak készletadatait.
   - Ha nincs, a rendszer felajánlja a [Gyógyszertár Kereső](#43-gyógyszertár-kereső) használatát.

3. **Közösségi aktivitás követése**
   - Megjeleníti az új [Témák](#data-topic) és [Hozzászólások](#data-comment) számát.
   - Kattintásra a [Fórum Főoldalra](#441-fórum-főoldal) navigál.

---

### 4.2. Gyógyszer Nyilvántartás

#### Brief
A központi adatbázis a gyógyszerek keresésére és kezelésére.

#### 4.2.1. Gyógyszer Lista Oldal
**Interface:** Keresőmező, Szűrő panel (Státusz, Patika elérhetőség), Találati lista/kártyák.

**Funkciók:**
1. **Keresés és Szűrés**
   - Keresés Név, TK-szám, INN, ATC, Gyártó alapján.
   - Szűrés [Gyógyszer Státusz](#data-medicine) szerint.
   - Szűrés [Közeli Patika](#data-pharmacy) elérhetőség szerint.

2. **Nézet testreszabása**
   - Váltás Táblázatos és Kártya nézet között.
   - Oszlopok ki/bekapcsolása és sorrendjének módosítása.
   - A beállítások mentése a kliens oldalon.

3. **Lista műveletek**
   - **[Kedvenc](#data-favorite) jelölés:** Csillag ikonnal.
   - **[Értesítés](#data-notification) kérés:** Harang ikonnal.

#### 4.2.2. Gyógyszer Adatlap
**Interface:** Részletes adatlap, Készletinformációs blokk, Hasonló termékek táblázat.

**Funkciók:**
1. **Adatok megtekintése**
   - Minden [Gyógyszer](#data-medicine) attribútum megjelenítése.
   - Az [INN](#data-medicine) (hatóanyag) linkként működik: kattintásra szűrt keresést indít.

2. **Készlet ellenőrzés**
   - "Megnézem hol" gomb: [Gyógyszertári Készlet Nézet](#433-gyógyszertári-készlet-nézet) megnyitása.
   - [Közeli Patika](#data-pharmacy) indikátor: Zöld/Szürke jelzés a készletről.

3. **Helyettesítő termékek keresése**
   - Hasonló hatóanyagú [Gyógyszerek](#data-medicine) listázása.
   - Csak "Elérhető" státuszúak megjelenítése.

---

### 4.3. Gyógyszertár Kereső

#### Brief
Modul a patikák lokációjának és készleteinek megjelenítésére.

#### 4.3.1. Gyógyszertárak Oldal
**Interface:** Osztott képernyő: Térkép és Lista nézet. Szűrő sáv.

**Funkciók:**
1. **Keresés**
   - Keresés Név, Cím, Város alapján.
   - Szűrők: "Most nyitva", "0-24", "Hétvégén is".

2. **Közeli Patika kiválasztása**
   - Listaelem vagy Térkép marker kiválasztása.
   - "Közeli patikának jelölöm" gomb megnyomása -> A [Közeli Patika](#data-pharmacy) frissül a [Felhasználó](#data-user) profiljában.

#### 4.3.3. Gyógyszertári Készlet Nézet
(Modális ablak vagy aloldal egy konkrét termékről)

**Funkciók:**
1. **Készlet alapú szűrés**
   - Csak azon [Gyógyszertárak](#data-pharmacy) megjelenítése, ahol a kiválasztott [Gyógyszer](#data-medicine) készleten van.

---

### 4.4. Közösségi Fórum

#### Brief
Szakmai diskurzus felület.

#### 4.4.1. Fórum Főoldal
**Interface:** Téma lista kártyák, Kereső/Szűrő sáv, "Új téma" gomb.

**Funkciók:**
1. **Témák böngészése**
   - Keresés cím és tartalom alapján.
   - Szűrés [Szakterület](#data-topic) és [Címke](#data-topic) alapján.

2. **Új téma indítása**
   - Űrlap kitöltése (Cím, Leírás, Címkék).
   - "Anonim mód" kapcsoló: A [Szerző](#data-topic) rejtve marad.

#### 4.4.2. Téma Részletek
**Interface:** Téma kifejtése, Hozzászólások listája, Komment író mező.

**Funkciók:**
1. **Hozzászólás írása**
   - Szöveges hozzászólás küldése.
   - Anonim opció támogatása.

2. **Reakciók**
   - Like/Dislike lehetőség [Témákra](#data-topic) és [Hozzászólásokra](#data-comment).

---

### 4.5. Globális Keresés

#### Brief
Rendszerszintű kereső a fejlécben.

**Funkciók:**
1. **Integrált keresés**
   - Egyidejű keresés [Gyógyszerek](#data-medicine), [Gyógyszertárak](#data-pharmacy) és [Fórum Témák](#data-topic) között.
   - Találatok kategorizált megjelenítése legördülő listában vagy találati oldalon.

---

### 4.6. Hitelesítés és Jogosultságok

#### Brief
A rendszer biztonsági kapuja.

**Funkciók:**
1. **Bejelentkezés**
   - Email/Jelszó páros ellenőrzése.
   - Sikertelen kísérlet esetén hibaüzenet.

2. **Elfelejtett jelszó**
   - Email alapú jelszó-visszaállítási folyamat.

3. **Jogosultságkezelés**
   - **Admin:** Hozzáférés az [Adminisztráció](#47-adminisztráció) modulhoz.
   - **User:** Hozzáférés a publikus funkciókhoz.

---

### 4.7. Adminisztráció

#### Brief
Csak [Adminisztrátor](#data-user) jogosultsággal elérhető karbantartó felület.

#### Funkciók
1. **Felhasználó menedzsment**
   - Users listázása, szerkesztése, deaktiválása.
   - Admin általi jelszó visszaállítás.

2. **Fórum moderálás**
   - [Témák](#data-topic) és [Hozzászólások](#data-comment) törlése, elrejtése.
   - Tartalom szerkesztése.
   - Szerző anonimizálása (GDPR/kérelem esetén).

3. **Gyógyszertár karbantartás**
   - Patikák adatainak felülvizsgálata.

---

### 4.8. Felhasználói Profil

#### Brief
Személyes beállítások központja.

**Funkciók:**
1. **Kedvencek kezelése**
   - Lista a [Kedvenc](#data-favorite) gyógyszerekről.
   - Eltávolítás és Értesítés kezelés.

2. **Értesítések kezelése**
   - [Értesítés](#data-notification) feliratkozások listája.
   - Leiratkozás lehetősége.

3. **Profil szerkesztés**
   - Jelszócsere.
   - Hírlevél preferenciák.
   - Szakterületek megadása.
