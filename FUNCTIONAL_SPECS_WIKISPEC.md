<!-- 
============================================================================
FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - BENUVÉNY ORVOSI PORTÁL FŐDOKUMENTUM
============================================================================

MIRE HASZNÁLJUK:
Ez a dokumentum a BENUvény Orvosi Portál 
központi funkcionális specifikációja. Részletesen leírja a rendszer üzleti célját,
az entitások adatmodelljét, a megvalósítási és integrációs kereteket, az egyes modulok 
és felületek működését, a beviteli mezőkhöz tartozó adatformátumokat, példákat és limitációkat, 
a felhasználói interakciókat, valamint a tesztelési hozzáféréseket.

KAPCSOLÓDÓ USER STORY-K:
- Egészségügyi szakemberként (orvos/gyógyszerész) szeretnék naprakész és megbízható információt kapni 
  a gyógyszerek piaci elérhetőségéről, készlethiányáról (a LogiNet Middleware által közvetített BENU hálözati adatok és az OGYÉI hatósági hiánylista összevetésével) és a helyettesíthetőségről.
- Felhasználóként szeretném megtalálni a legközelebbi preferált gyógyszertáramat és 
  ellenőrizni annak aktuális készletét.
- Felhasználóként szeretnék szakmai és akkreditált képzéseken részt venni.
- Új szakmai felhasználóként szeretném felvenni a kapcsolatot az adminisztrátorral a bejelentkezési felületről elérhető űrlapon keresztül, hogy szakmai jogosultság-ellenőrzést követően regisztrálják a fiókomat.
- Adminisztrátorként szeretném kezelni a felhasználókat, jogosultságokat, patikákat és tartalmakat.

KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
- Fejléc / Navigációs sáv (Globális kereső, Közeli patika, Kedvencek, Profil)
- Irányítópult (Dashboard): https://bvo.uneb.hu/dashboard
- Gyógyszer Nyilvántartás (Lista + Adatlap): https://bvo.uneb.hu/gyogyszerek
- Gyógyszertár Kereső (Térkép + Készlet): https://bvo.uneb.hu/gyogyszertarak
- BENU Képzési Program: https://bvo.uneb.hu/kepzesek
- Közösség és Fórum: https://bvo.uneb.hu/kozosseg
- Képzési Program (Képzések): https://bvo.uneb.hu/kepzesek
- Hitelesítés, Regisztrációs Kapcsolatfelvétel & Profilkezelés: https://bvo.uneb.hu/login, https://bvo.uneb.hu/profile
- Adminisztráció (Felhasználók, Patikák, Moderálás): https://bvo.uneb.hu/admin/users
============================================================================
-->

# BENUvény orvosi portál funkcionális specifikáció

---

> **Verzió:** 1.5.0  
> **Dátum:** 2026.09.04.  
> **Státusz:** Véglegesnek szánt (Figma Redesign Szinkronizáció)  
> **Prototípus URL:** [https://bvo.uneb.hu/](https://bvo.uneb.hu/) (hozzáférések a 6. pontban)

---

## 1. Brief

### 1.1. Cél és Rendszer Áttekintés
Egy modern, megbízható orvosi szakmai portál biztosítása, amely hatékonyan támogatja a gyógyszerészeket, orvosokat és egészségügyi szakembereket a mindennapi betegellátásban és döntéshozatalban. A rendszer célja, hogy valós idejű, transzparens és hiteles információt nyújtson a gyógyszerkészletekről, a piaci készlethiányról, a hatóanyag-alapú helyettesíthetőségről, a legközelebbi preferált patika elérhetőségéről, valamint folyamatos szakmai és akkreditált képzési lehetőségeket biztosítson a felhasználók számára.

### 1.2. Megvalósítási Keretek és Technológiai Szabadság
A funkcionális specifikáció és a hozzá kapcsolódó prototípus kizárólag a rendszer üzleti működését, a felhasználói folyamatokat, az adatstruktúrákat és a felületi viselkedést rögzíti. 
- **Kivitelezői kompetencia:** A fejlesztési környezet kialakítása, a technológiai stack (architektúra, backend és frontend keretrendszerek, adatbázis-réteg, tárolási és gyorsítótárazási mechanizmusok, konténerizáció, CI/CD pipeline-ok) megválasztása, valamint a szoftveres implementáció konkrét megvalósítása **teljes mértékben a kivitelezőre (fejlesztő partnerre) van bízva**.
- **Megvalósítási szabadság:** A kivitelező jogosult és felelős a hosszú távon fenntartható, skálázható, magas rendelkezésre állású és biztonságos architektúra megtervezéséért és kivitelezéséért a megadott funkcionális kereteken belül.

### 1.3. Készletinformációk és LogiNet Middleware Integráció
A portál alapvető értékajánlata a pontos és gyors készlet- és hiányinformációk elérése:
- **Integrációs alapok:** A gyógyszertári és piaci készletinformációk átadása, lekérdezése és szinkronizációja a jelenlegi **BENU.hu** és **BENUvény.hu** működési alapjainak megfelelően, a **LogiNet által biztosított Middleware** rétegen keresztül valósul meg.
- **Rendszervizsgálat és Audit szükségessége:** Kiemelten fontos és kötelező lépés a jelenlegi LogiNet Middleware képességeinek, interfészeinek és adatkapacitásának alapos technikai és funkcionális felmérése (auditja). Meg kell vizsgálni, hogy a meglévő rendszer milyen adatstruktúrákat szolgáltat, milyen lekérdezési sebességet és frissítési frekvenciát támogat, milyen korlátokkal rendelkezik, illetve szükséges-e a meglévő Middleware bővítése vagy finomhangolása a tervezett orvosi portál igényeinek maradéktalan kiszolgálásához.
- **Piaci Készlethiány Adatforrások Konszolidációja:** A piaci készlethiány meghatározása a LogiNet Middleware által szállított hálózati/kereskedelmi készletinformációk, valamint az OGYÉI (NNGYK) Gyógyszeradatbázis *"Összes termékhiány"* hivatalos nyilvántartása (`https://ogyei.gov.hu/generalt_listak/shortage_lista.csv`) háttérbeli összevetésével valósul meg a maximális adathitelesség érdekében (az OGYÉI CSV nyers adatai közvetlenül nem jelennek meg a felületen).

### 1.4. Kivitelezői Dokumentációs Igények és Specifikációk
A sikeres, kockázatmentes és határidőre történő implementáció előfeltételeként:
- **Igények definiálása:** A **kivitelező (fejlesztő partner) határozza meg és specifikálja**, hogy a meglévő rendszerekből és külső partnerektől milyen műszaki és funkcionális dokumentációkra, interfész-leírásokra (API specifikációk, végponti dokumentációk, adatmodellek, hitelesítési/biztonsági eljárásrendek, tesztkörnyezeti hozzáférések) van szüksége az integrációhoz.
- **Dokumentációs elvárások:** A kivitelező felelőssége összeállítani a hiányzó specifikációs elemek listáját, és azokat a megrendelői/üzemeltetői oldallal egyeztetve beépíteni a fejlesztési tervbe.

### 1.5. Live Prototípus
A működő prototípus felülete elérhető az alábbi hivatkozáson:  
🔗 [https://bvo.uneb.hu/](https://bvo.uneb.hu/)

### 1.6. Felhasználói Szerepkörök
- **Szakmai Felhasználó (User):** Orvos, gyógyszerész vagy egészségügyi szakdolgozó. Hozzáfér a gyógyszer-nyilvántartáshoz, patikakeresőhöz, képzésekhez és a saját profilbeállításaihoz.
- **Rendszeradminisztrátor (Admin):** A portál működését felügyelő felhasználó, aki felhasználókat kezel, patikaadatokat tekint át és tartalommoderációt végez.

### 1.7. Modulok Áttekintése
A rendszer moduláris felépítésű, központjában a biztonságos szakmai azonosítás áll. A fő funkcionális egységek:
- **[Fejléc és Navigációs Sáv](#40-fejléc-és-navigációs-sáv-modul):** Központi navigáció, mentett gyógyszer gyorslista, közeli patika kijelző és profil menü.
- **[Irányítópult](#41-irányítópult-dashboard):** Központi összegző felület a piaci és patikai készletváltozásokról.
- **[Gyógyszer Nyilvántartás](#42-gyógyszer-nyilvántartás):** Gyógyszerek keresése, fejlett táblázatos szűrése, rendezése és részletes adatlapja.
- **[Gyógyszertár Kereső](#43-gyógyszertár-kereső):** Patikák térképes és szinkronizált listás megjelenítése, nyitvatartás és készletellenőrzés.
- **[Képzési Program](#44-képzési-program):** Szakmai és akkreditált képzések böngészése, ismertetése és átirányítás a BENU LMS rendszerbe.
- **[Globális Keresés](#45-globális-keresés):** Fejlécből indítható instant keresés a portál tartalmában.
- **[Hitelesítés és Jogosultságok](#46-hitelesítés-és-jogosultságok):** Bejelentkezési módok (jelszó, passkey, magic code), 2FA azonosítás, elfelejtett jelszó, valamint a manuális regisztrációs kapcsolatfelvételi űrlap.
- **[Adminisztráció](#47-adminisztráció):** Felhasználók, patika-áttekintő nézet és közösségi tartalmak kezelése.
- **[Felhasználói Profil](#48-felhasználói-profil):** Szakmai beállítások, preferált patika, hírlevelek és fiókbiztonság.

---

---

## 2. Fogalomtár

### 2.1. LogiNet Middleware (Készletintegrációs Köztesréteg)
- **Definíció és Üzleti Jelentés:** A BENU.hu és BENUvény.hu ökoszisztéma alapjait képező központi integrációs réteg, amely a gyógyszertári és piaci készletadatok, raktárkészletek és szinkronizációs folyamatok közvetítéséért felel.
- **Konkrét Szerep:** Készletinformációk biztosítása a portál számára; képességeinek és interfészeinek előzetes vizsgálata és auditja a megvalósítás alapfeltétele.

### 2.2. Kivitelezői Implementációs Hatáskör
- **Definíció és Üzleti Jelentés:** A kivitelezőre bízott fejlesztési környezet, technológiai stack és szoftveres architektúra összessége, amely a specifikált funkciók optimális megvalósítását biztosítja.

### 2.3. Közeli Patika (Preferált Patika)
- **Definíció és Üzleti Jelentés:** A felhasználó által megjelölt gyógyszertár. A rendszer ezen patika készletadatait és státuszfrissítéseit kiemelten kezeli az egész portálon.
- **Konkrét Felületi Példa:** *"BENU Gyógyszertár Arany Sas"*

### 2.4. Kedvenc Gyógyszer (Mentett Gyógyszer)
- **Definíció és Üzleti Jelentés:** A felhasználó által könyvjelzővel megjelölt gyógyszer, amely bekerül a mentett listába a gyors elérés érdekében.
- **Konkrét Felületi Példa:** *"Algopyrin 500 mg filmtabletta"*

### 2.5. Készletértesítés
- **Definíció és Üzleti Jelentés:** Feliratkozás egy adott gyógyszer piaci vagy patikai státuszváltozására (pl. készlethiány vagy újra elérhető állapot). Feliratkozáskor a termék automatikusan mentetté is válik.
- **Konkrét Felületi Példa:** Értesítés küldése hírlevélben vagy felületi visszajelzésben.

### 2.6. TK-szám
- **Definíció és Üzleti Jelentés:** Törzskönyvi szám - a gyógyszerek hatósági egyedi azonosítója.
- **Konkrét Felületi Példa:** `"OGYI-T-8898/01"`

### 2.7. INN (Nemzetközi Szabadnév / Hatóanyag)
- **Definíció és Üzleti Jelentés:** Nemzetközi Szabadnév (International Nonproprietary Name) - a gyógyszer hatóanyaga.
- **Konkrét Felületi Példa:** `"metamizol-nátrium"`

### 2.8. ATC-kód
- **Definíció és Üzleti Jelentés:** Anatómiai, Terápiás és Kémiai osztályozási rendszer kódja.
- **Konkrét Felületi Példa:** `"N02BB02"`

### 2.9. Hírlevél Hatókör (Scope)
- **Definíció és Üzleti Jelentés:** A készletértesítő hírlevelek szűrési köre (pl. teljes adatbázis, csak a felhasználó szakterülete, vagy csak a mentett kedvenc gyógyszerei).
- **Konkrét Felületi Példa:** `"Szakterület + mentett gyógyszerek"`

### 2.10. BENU LMS Rendszer
- **Definíció és Üzleti Jelentés:** A BENU külső e-learning és továbbképzési rendszere, ahol a tananyagok tényleges feldolgozása, a tesztkitöltés és a kreditpont-jóváírás történik.
- **Konkrét Felületi Példa:** *"BENU LMS felület"*

### 2.11. Passkey (Biometrikus azonosító)
- **Definíció és Üzleti Jelentés:** Eszközalapú biometrikus kulcs (Touch ID, Face ID, Windows Hello), amely jelszó nélküli 1-kattintásos belépést tesz lehetővé.
- **Konkrét Felületi Példa:** *"Work Mac TouchID"*

### 2.12. Kényszerített Munkamenet Lezárás
- **Definíció és Üzleti Jelentés:** Adminisztrátori vagy biztonsági művelet, amely azonnal érvényteleníti a felhasználó aktív belépését.
- **Konkrét Felületi Példa:** Felhasználó azonnali átirányítása a bejelentkezési oldalra.

### 2.13. Piaci Készlethiány Adatforrás
- **Definíció és Üzleti Jelentés:** A gyógyszerek piaci készlethiányi státuszának meghatározására és ellenőrzésére szolgáló információforrás. A megbízhatóság növelése érdekében a rendszer a BENU.hu és BENUvény.hu által használt, a LogiNet Middleware által közvetített hálózati/kereskedelmi készletinformációkat, valamint az OGYÉI (NNGYK) *"Összes termékhiány"* hivatalos nyilvántartását (`https://ogyei.gov.hu/generalt_listak/shortage_lista.csv`) veti össze.
- **Üzleti & Felületi Limitációk:** A két adatforrás összevetése és visszaigazolása a háttérben történik az adathitelesség garantálására. Az OGYÉI CSV fájl nyers adatai egyelőre nem kerülnek közvetlenül megjelenítésre a felhasználói felületen, a portál a konszolidált készlethiányi állapotot mutatja.

### 2.14. Manuális Felhasználói Regisztráció / Kapcsolatfelvételi Űrlap
- **Definíció és Üzleti Jelentés:** Az orvosok és egészségügyi szakemberek regisztrációja a rendszerbe nem automatikus, hanem adminisztrátori jóváhagyással és kézi rögzítéssel történik. Az új szakmai felhasználó a bejelentkezési felületről elérhető űrlap kitöltésével veszi fel a kapcsolatot az adminisztrátorral, megadva az azonosításhoz és jogosultság-ellenőrzéshez szükséges adatait.
- **Üzleti & Felületi Limitációk:** A portálon jelenleg nincs közvetlen önkiszolgáló regisztrációs felület; a fiókokat a rendszeradminisztrátor hozza létre manuálisan az adminisztrációs felületen az igény beérkezése és elbírálása után. Későbbiekben elképzelhető önkiszolgáló felület kialakítása, de jelenleg nincs ilyen tervezve.

---

## 3. Adatmodellek Specifikációja

Ez a szakasz a rendszer fő üzleti entitásait mutatja be a beviteli mezők, adattípusok, megadható értékek, példák és limitációk szempontjából.

### 3.1. Felhasználó (User) Adatmodell

- **Teljes név:**
  - **Felületi Típus:** Egysoros szövegmező
  - **Megadható Adatok / Formátum:** Szöveg (vezetéknév + keresztnév)
  - **Példa Érték:** `"Dr. Kovács István"`
  - **Üzleti & Felületi Limitációk:** Kötelező. Min. 3, max. 100 karakter. A profilban csak olvasható.
- **Elsődleges e-mail:**
  - **Felületi Típus:** Egysoros email mező
  - **Megadható Adatok / Formátum:** Érvényes e-mail formátum (`user@domain.hu`)
  - **Példa Érték:** `"demo@example.com"`
  - **Üzleti & Felületi Limitációk:** Kötelező. Egyedi belépési azonosító. A profilban nem módosítható.
- **Másodlagos e-mail:**
  - **Felületi Típus:** Egysoros email mező
  - **Megadható Adatok / Formátum:** Érvényes e-mail formátum
  - **Példa Érték:** `"kovacs.private@email.hu"`
  - **Üzleti & Felületi Limitációk:** Opcionális. Értesítések és hírlevelek másodlagos címe.
- **Telefonszám:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** Telefonszám formátum (`+36...`)
  - **Példa Érték:** `"+36 30 123 4567"`
  - **Üzleti & Felületi Limitációk:** Opcionális. Az SMS alapú 2FA azonosítás csatornája.
- **Szerepkör:**
  - **Felületi Típus:** Legördülő menü
  - **Megadható Adatok / Formátum:** `User` (Szakmai) / `Admin` (Rendszeradmin)
  - **Példa Érték:** `User`
  - **Üzleti & Felületi Limitációk:** Kötelező. Kizárólag az adminisztrátor módosíthatja.
- **Fiók Státusz:**
  - **Felületi Típus:** Legördülő menü
  - **Megadható Adatok / Formátum:** `Active` (Aktív) / `Inactive` (Inaktív)
  - **Példa Érték:** `Active`
  - **Üzleti & Felületi Limitációk:** Inaktív fiókkal a bejelentkezés elutasításra kerül.
- **Szakterületek:**
  - **Felületi Típus:** Kereshető multi-select
  - **Megadható Adatok / Formátum:** Orvosi kódlista elemei
  - **Példa Érték:** `["Háziorvos", "Belgyógyász"]`
  - **Üzleti & Felületi Limitációk:** Több opció is kiválasztható a megadott kódlistából.
- **2FA Állapot & Csatorna:**
  - **Felületi Típus:** Kapcsoló + Rádiógombok
  - **Megadható Adatok / Formátum:** `Be` / `Ki`; Csatornák: `E-mail`, `SMS`, `TOTP`
  - **Példa Érték:** `Be (E-mail OTP)`
  - **Üzleti & Felületi Limitációk:** Önkiszolgáló módon állítható a Profilban.
- **Passkey Kulcsok:**
  - **Felületi Típus:** Lista + Modal
  - **Megadható Adatok / Formátum:** Eszköznév + Regisztrációs dátum
  - **Példa Érték:** `[{ name: "MacBook", createdAt: "2026-01-15" }]`
  - **Üzleti & Felületi Limitációk:** Egy fiókhoz több biometrikus eszköz is rendelhető.
- **Megbízható Eszközök:**
  - **Felületi Típus:** Számláló / Gomb
  - **Megadható Adatok / Formátum:** Megjegyzett 30 napos munkamenetek azonosítói
  - **Példa Érték:** `3 aktív eszköz`
  - **Üzleti & Felületi Limitációk:** Egy kattintással az összes eszköz elfelejthető.
- **Hírlevél (Képzés):**
  - **Felületi Típus:** Kapcsoló + Checkboxok
  - **Megadható Adatok / Formátum:** Be/Ki; Kategóriák: `Akkreditált`, `Gyártói`, `Eladásösztönző`
  - **Példa Érték:** `Feliratkozva: Akkreditált`
  - **Üzleti & Felületi Limitációk:** Külön konfigurálható az elsődleges és másodlagos e-mail címre.
- **Hírlevél (Készlet):**
  - **Felületi Típus:** Kapcsoló + Select/Radio
  - **Megadható Adatok / Formátum:** Frekvencia (`Napi`/`Heti`/`Havi`), Időpont (0-23h), Téma multiselect, Hatókör
  - **Példa Érték:** `Heti, 09:00, Készlethiány, Szakterület + mentett`
  - **Üzleti & Felületi Limitációk:** Külön konfigurálható az elsődleges és másodlagos e-mail címre.
- **Preferált Patika:**
  - **Felületi Típus:** Kiválasztó komponens
  - **Megadható Adatok / Formátum:** Egy kijelölt gyógyszertár azonosítója
  - **Példa Érték:** `"BENU Gyógyszertár Arany Sas"`
  - **Üzleti & Felületi Limitációk:** Opcionális. Bármikor módosítható vagy törölhető.

### 3.2. Gyógyszer (Medicine) Adatmodell

- **Kereskedelmi Név:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** Szöveg
  - **Példa Érték:** `"Algopyrin 500 mg filmtabletta"`
  - **Üzleti & Felületi Limitációk:** Kötelező azonosító elnevezés.
- **TK-szám:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** Hatósági azonosító formátum
  - **Példa Érték:** `"OGYI-T-8898/01"`
  - **Üzleti & Felületi Limitációk:** Egyedi törzskönyvi szám. Rendszerazonosító.
- **INN (Hatóanyag):**
  - **Felületi Típus:** Megjelenítő / Link
  - **Megadható Adatok / Formátum:** Szöveg (Hatóanyag neve)
  - **Példa Érték:** `"metamizol-nátrium"`
  - **Üzleti & Felületi Limitációk:** Kattintható hivatkozás: szűr a listában.
- **Márkanév:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** Kereskedelmi márkaneve
  - **Példa Érték:** `"Algopyrin"`
  - **Üzleti & Felületi Limitációk:** A termékcsalád márkaneve.
- **ATC-kód:**
  - **Felületi Típus:** Megjelenítő / Címke
  - **Megadható Adatok / Formátum:** 7 karakteres kód
  - **Példa Érték:** `"N02BB02"`
  - **Üzleti & Felületi Limitációk:** Szabványos anatómiai-terápiás osztályozás.
- **Gyártó:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** Cégnév
  - **Példa Érték:** `"Sanofi-Aventis Zrt."`
  - **Üzleti & Felületi Limitációk:** A forgalomba hozatali engedélyes / gyártó.
- **Kiszerelés:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** Mennyiség és csomagolási forma
  - **Példa Érték:** `"20x filmtabletta"`
  - **Üzleti & Felületi Limitációk:** A dobozban található kiszerelés.
- **Csomagolási részletek:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** Részletes csomagolás leírása
  - **Példa Érték:** `"bliszterben és dobozban"`
  - **Üzleti & Felületi Limitációk:** Opcionális oszlop a nyilvántartásban.
- **Kiadhatóság:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** `Vényköteles` / `Vény nélkül kapható`
  - **Példa Érték:** `Vényköteles`
  - **Üzleti & Felületi Limitációk:** Fő kiadhatósági besorolás.
- **Kiadhatósági alcsoport:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** Részletes kiadhatósági kód/szöveg
  - **Példa Érték:** `"VN"`
  - **Üzleti & Felületi Limitációk:** Opcionális oszlop a nyilvántartásban.
- **Biztonsági elemek:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** `Van` / `Nincs`
  - **Példa Érték:** `Van`
  - **Üzleti & Felületi Limitációk:** Egyedi azonosító és dézsmálásgátló megléte.
- **Engedélyezés dátuma:**
  - **Felületi Típus:** Megjelenítő / Dátum
  - **Megadható Adatok / Formátum:** Dátum formátum (`ÉÉÉÉ.MM.NN`)
  - **Példa Érték:** `2010.05.12`
  - **Üzleti & Felületi Limitációk:** Hatósági engedélyezés időpontja.
- **Státusz:**
  - **Felületi Típus:** Címke (Színkódolt)
  - **Megadható Adatok / Formátum:** `Elérhető` / `Készlethiány` / `Megszűnt`
  - **Példa Érték:** `Készlethiány`
  - **Üzleti & Felületi Limitációk:** Zöld (Elérhető), Sárga (Készlethiány), Piros (Megszűnt). A státusz a LogiNet Middleware által közvetített BENU hálózati adatok és az OGYÉI "Összes termékhiány" CSV nyilvántartásának háttérbeli összevetésén alapul (az OGYÉI CSV nyers adatai egyelőre nem láthatók közvetlenül a felületen).
- **Utolsó frissítés:**
  - **Felületi Típus:** Megjelenítő / Dátum
  - **Megadható Adatok / Formátum:** Dátum és időbélyeg
  - **Példa Érték:** `2026.08.10 14:32`
  - **Üzleti & Felületi Limitációk:** A piaci státusz utolsó módosításának ideje.
- **Hiány kezdete:**
  - **Felületi Típus:** Dátum kijelző
  - **Megadható Adatok / Formátum:** Dátum formátum (`ÉÉÉÉ.MM.NN`)
  - **Példa Érték:** `2026.07.15`
  - **Üzleti & Felületi Limitációk:** Kizárólag készlethiány esetén jelenik meg.
- **Hiány várható vége:**
  - **Felületi Típus:** Dátum kijelző
  - **Megadható Adatok / Formátum:** Dátum formátum (`ÉÉÉÉ.MM.NN`)
  - **Példa Érték:** `2026.09.30`
  - **Üzleti & Felületi Limitációk:** Becsült lejárati dátum (ha hiányzik: "Folyamatban").
- **Hiány oka:**
  - **Felületi Típus:** Szövegblokk
  - **Megadható Adatok / Formátum:** Szöveges leírás
  - **Példa Érték:** `"Gyártási kapacitáshiány"`
  - **Üzleti & Felületi Limitációk:** Részletes tájékoztatás (ha hiányzik: "Szakmai ok").
- **Pótlási javaslat:**
  - **Felületi Típus:** Szövegblokk
  - **Megadható Adatok / Formátum:** Szöveges leírás
  - **Példa Érték:** `"Helyettesíthető azonos INN készítménnyel."`
  - **Üzleti & Felületi Limitációk:** Szakmai javaslat a betegellátáshoz.

### 3.3. Gyógyszertár (Pharmacy) Adatmodell

- **BF azonosító kód:**
  - **Felületi Típus:** Megjelenítő / Szöveg
  - **Megadható Adatok / Formátum:** Egyedi hatósági/rendszer kód
  - **Példa Érték:** `"BF001"`
  - **Üzleti & Felületi Limitációk:** A patika egyedi azonosítója.
- **Patika neve:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** Szöveg
  - **Példa Érték:** `"BENU Gyógyszertár Arany Sas"`
  - **Üzleti & Felületi Limitációk:** Kötelező megnevezés.
- **Irányítószám:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** 4 számjegy
  - **Példa Érték:** `"1052"`
  - **Üzleti & Felületi Limitációk:** Magyarországi irányítószám.
- **Város:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** Szöveg
  - **Példa Érték:** `"Budapest"`
  - **Üzleti & Felületi Limitációk:** Kötelező településnév.
- **Utca, házszám:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** Szöveg
  - **Példa Érték:** `"Károly körút 1."`
  - **Üzleti & Felületi Limitációk:** Pontos közterület megnevezés.
- **Vármegye:**
  - **Felületi Típus:** Legördülő menü
  - **Megadható Adatok / Formátum:** Vármegyék listája
  - **Példa Érték:** `"Pest / Budapest"`
  - **Üzleti & Felületi Limitációk:** Területi besorolás.
- **Szélesség (Lat):**
  - **Felületi Típus:** Számos mező
  - **Megadható Adatok / Formátum:** Tizedes tört (`-90` és `+90` között)
  - **Példa Érték:** `47.4979`
  - **Üzleti & Felületi Limitációk:** Földrajzi koordináta térképhez.
- **Hosszúság (Lng):**
  - **Felületi Típus:** Számos mező
  - **Megadható Adatok / Formátum:** Tizedes tört (`-180` és `+180` között)
  - **Példa Érték:** `19.0543`
  - **Üzleti & Felületi Limitációk:** Földrajzi koordináta térképhez.
- **Nyitvatartás:**
  - **Felületi Típus:** Napi Időpontok
  - **Megadható Adatok / Formátum:** Nyitás-Zárás naptári naponként (H-Va)
  - **Példa Érték:** `"08:00 - 19:00"`
  - **Üzleti & Felületi Limitációk:** Naponta állítható nyitási/zárási időpont vagy "Zárva".
- **Telefonszám:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** Telefonszám formátum
  - **Példa Érték:** `"+36 1 234 5678"`
  - **Üzleti & Felületi Limitációk:** Kapcsolattartási telefonszám.
- **E-mail cím:**
  - **Felületi Típus:** Email mező
  - **Megadható Adatok / Formátum:** Érvényes e-mail formátum
  - **Példa Érték:** `"aranysas@benu.hu"`
  - **Üzleti & Felületi Limitációk:** Elektronikus elérhetőség.

### 3.4. Képzés / Kurzus (Course) Adatmodell

- **Kurzus azonosító:**
  - **Felületi Típus:** Szöveg azonosító
  - **Megadható Adatok / Formátum:** Karakterlánc
  - **Példa Érték:** `"c1"`
  - **Üzleti & Felületi Limitációk:** Egyedi kurzusazonosító.
- **Cím:**
  - **Felületi Típus:** Szöveg
  - **Megadható Adatok / Formátum:** Karakterlánc
  - **Példa Érték:** `"A hipertónia legújabb terápiás irányelvei"`
  - **Üzleti & Felületi Limitációk:** A képzés megnevezése.
- **Kategória:**
  - **Felületi Típus:** Címke
  - **Megadható Adatok / Formátum:** `Akkreditált` / `Gyártói` / `Eladásösztönző`
  - **Példa Érték:** `Akkreditált`
  - **Üzleti & Felületi Limitációk:** A képzés szakmai kategóriája.
- **Becsült időtartam:**
  - **Felületi Típus:** Szám / Kijelző
  - **Megadható Adatok / Formátum:** Percek száma
  - **Példa Érték:** `45 perc`
  - **Üzleti & Felületi Limitációk:** A tananyag feldolgozásához szükséges becsült idő.
- **Tartalomtípus:**
  - **Felületi Típus:** Ikon / Szöveg
  - **Megadható Adatok / Formátum:** `Videó` / `PDF`
  - **Példa Érték:** `Videó`
  - **Üzleti & Felületi Limitációk:** A tananyag fő formátuma.
- **Rövid leírás:**
  - **Felületi Típus:** Szövegblokk
  - **Megadható Adatok / Formátum:** Részlet
  - **Példa Érték:** `"Összefoglaló a legújabb kardiológiai irányelvekről..."`
  - **Üzleti & Felületi Limitációk:** Kártyás nézeten megjelenő összefoglaló.
- **Részletes leírás:**
  - **Felületi Típus:** Szövegblokk
  - **Megadható Adatok / Formátum:** Formázott szöveg
  - **Példa Érték:** `"A kurzus részletesen bemutatja..."`
  - **Üzleti & Felületi Limitációk:** A kurzus adatlapján megjelenő teljes leírás.
- **Akkreditált pontok:**
  - **Felületi Típus:** Kártya / Kijelző
  - **Megadható Adatok / Formátum:** Egész szám
  - **Példa Érték:** `2 kreditpont`
  - **Üzleti & Felületi Limitációk:** Akkreditált képzéseknél megszerezhető pontszám.

### 3.5. Patikai Készletrekord Adatmodell

- **TK-szám:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** Törzskönyvi szám
  - **Példa Érték:** `"OGYI-T-8898/01"`
  - **Üzleti & Felületi Limitációk:** Hivatkozott gyógyszer azonosítója.
- **Raktári darabszám:**
  - **Felületi Típus:** Számmező
  - **Megadható Adatok / Formátum:** Pozitív egész szám
  - **Példa Érték:** `42`
  - **Üzleti & Felületi Limitációk:** A kiválasztott patikában lévő fizikai darabszám.
- **Utolsó adatszinkron:**
  - **Felületi Típus:** Dátum és idő
  - **Megadható Adatok / Formátum:** `ÉÉÉÉ.MM.NN ÓÓ:PP:SS`
  - **Példa Érték:** `2026.08.12 08:15:30`
  - **Üzleti & Felületi Limitációk:** Patikai alapadatok utolsó frissítési ideje.
- **Utolsó készletszinkron:**
  - **Felületi Típus:** Dátum és idő
  - **Megadható Adatok / Formátum:** `ÉÉÉÉ.MM.NN ÓÓ:PP:SS`
  - **Példa Érték:** `2026.08.12 09:00:12`
  - **Üzleti & Felületi Limitációk:** Készletadatok utolsó frissítési ideje.
- **Készletforrás és Szinkronizációs Keretek:**
  - **Integrációs Csatorna:** A patikai készletadatok lekérdezése és szinkronizációja a BENU.hu és BENUvény.hu alapjait képező LogiNet Middleware-en keresztül történik.
  - **Audit és Implementáció:** A szinkronizáció pontos frekvenciáját, végpontjait és adatstruktúráját a kivitelező határozza meg a meglévő Middleware képességeinek vizsgálata (auditja) és a bekért interfész-dokumentációk alapján.

### 3.6. Regisztrációs Igény / Kapcsolatfelvételi Űrlap Adatmodell

- **Teljes név:**
  - **Felületi Típus:** Egysoros szövegmező
  - **Megadható Adatok / Formátum:** Szöveg (Orvos / Gyógyszerész teljes neve)
  - **Példa Érték:** `"Dr. Szabó Péter"`
  - **Üzleti & Felületi Limitációk:** Kötelező. Min. 3, max. 100 karakter.
- **Szakmai e-mail cím:**
  - **Felületi Típus:** Egysoros email mező
  - **Megadható Adatok / Formátum:** Érvényes e-mail formátum (`nev@intezmeny.hu`)
  - **Példa Érték:** `"dr.szabo.peter@korhaz.hu"`
  - **Üzleti & Felületi Limitációk:** Kötelező. A későbbi felhasználói fiók elsődleges azonosítója és a kapcsolatfelvétel címe.
- **Telefonszám:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** Telefonszám formátum (`+36...`)
  - **Példa Érték:** `"+36 30 987 6543"`
  - **Üzleti & Felületi Limitációk:** Opcionális / Ajánlott. Kapcsolattartásra és a későbbi SMS alapú 2FA azonosításhoz szükséges.
- **Pecsétszám / Működési nyilvántartási szám:**
  - **Felületi Típus:** Szövegmező
  - **Megadható Adatok / Formátum:** 5-6 számjegyű orvosi vagy gyógyszerészi alapnyilvántartási szám
  - **Példa Érték:** `"12345"`
  - **Üzleti & Felületi Limitációk:** Kötelező az orvosi / gyógyszerészi jogosultság hatósági és szakmai ellenőrzéséhez.
- **Szakterület / Munkahely:**
  - **Felületi Típus:** Szövegmező / Kiválasztó
  - **Megadható Adatok / Formátum:** Szöveg
  - **Példa Érték:** `"Háziorvostan, Kardiológia"`
  - **Üzleti & Felületi Limitációk:** Opcionális. Segíti az adminisztrátort a profil szakterületi besorolásának előkészítésében.
- **Üzenet / Kérelem szövege:**
  - **Felületi Típus:** Többsoros szövegmező (Textarea)
  - **Megadható Adatok / Formátum:** Szabad szöveg
  - **Példa Érték:** `"Kérem a hozzáférés biztosítását a BENUvény orvosi szakmai rendszerhez."`
  - **Üzleti & Felületi Limitációk:** Opcionális. Max. 500 karakter.
- **Adatkezelési nyilatkozat elfogadása:**
  - **Felületi Típus:** Jelölőnégyzet (Checkbox)
  - **Megadható Adatok / Formátum:** Bepipálva / Nem bepipálva
  - **Példa Érték:** `Bepipálva`
  - **Üzleti & Felületi Limitációk:** Kötelező a kérelem elküldéséhez.
- **Üzleti & Működési Keretek:**
  - Az űrlap beküldése nem hoz létre azonnal belépésre jogosult aktív fiókot; az adatokat a rendszer eljuttatja a rendszeradminisztrátornak, aki a manuális szakmai validációt követően kézzel rögzíti a felhasználót az adminisztrációs felületen.

---

---

## 4. Modulok és Funkciók Részletes Leírása

### 4.0. Fejléc és Navigációs Sáv Modul

#### 4.0.1. Fejléc Navigáció és Főfunkciók

A portál tetején rögzített (sticky) központi navigációs sáv, amely minden oldalon elérhető. A felület a hivatalos 2025-ös BENU VÉNY arculatot követi. Biztosítja az oldalak közötti gyors váltást, a mentett kedvenc gyógyszerek gyors elérését, a kijelölt közeli gyógyszertár megjelenítését és módosítását, a rendszerszintű keresést, valamint a felhasználói fiókműveleteket.

##### 4.0.1.1. Arculat és Logó
   - **BENU Vény Logó:** A fejléc bal oldalán elhelyezett hivatalos arculati elem, amely a kezdőoldalra (Irányítópult) vezet.
   - **Kompakt mobil elrendezés:** Kisebb kijelzőkön a logó mellett azonnal elérhető a navigációs menü és a kereső.

##### 4.0.1.2. Központi Intelligens Kereső (Globális Keresés)
   - A fejléc közepén elhelyezkedő keresőmező, amely azonnali élő keresést biztosít a gyógyszerek, gyógyszertárak és képzések között.
   - **Keresési kategória választók:** A keresőfelületen a felhasználó szűrhet `Minden`, `Gyógyszerek`, `Gyógyszertárak` vagy `Képzések` kategóriák szerint.

##### 4.0.1.3. Közeli Patika Kijelző (Preferált Gyógyszertár)
   - **Megjelenés:** A fejléc jobb oldalán kiemelten látható a *"Közeli gyógyszertár"* felirat és alatta a kiválasztott patika neve zöld színnel, aláhúzva (pl. *"BENU Gyógyszertár Arany Sas"*).
   - **Ha nincs kiválasztva patika:** A felirat *"Válasszon gyógyszertárat"* szövegre vált.
   - **Interakció:** A blokkra kattintva közvetlenül felugrik a teljes képernyős **Patikaválasztó Modális Ablak** (`PharmacyFinder`), ahol térképes és listás nézetben új preferált patika választható.

##### 4.0.1.4. Ikonos Vertikális Navigációs Menüpontok
   - Az asztali felületen a fő funkciók jól elkülönülő ikonos, feliratos gombokként jelennek meg:
     - **Irányítópult:** Közvetlen hivatkozás az összefoglaló főoldalra (`/dashboard`).
     - **Gyógyszer:** Közvetlen hivatkozás a gyógyszer-nyilvántartás táblázatához (`/gyogyszerek`).
     - **Gyógyszertár:** Közvetlen hivatkozás a térképes és listás patikakeresőhöz (`/gyogyszertarak`).
     - **Mentett (Gyorslista):** Csillag ikonnal ellátott gomb, amely felett számláló jelvény mutatja az elmentett gyógyszerek darabszámát.
     - **Profil:** Felhasználói fiók és beállítások elérése.

##### 4.0.1.5. Mentett Gyógyszerek Lenyíló Gyorslista (Dropdown)
   - A fejléc *"Mentett"* gombjára kattintva egy lenyíló ablak jelenik meg az alábbi tartalommal:
     - **Fejléc:** *"Mentett gyógyszerek"* cím és a mentett tételek összdarabszáma.
     - **Tétellista:** Gyógyszer neve, kiszerelése, valamint színes készletjelvénye (`Elérhető` - zöld, `Készlethiány` - sárga, `Megszűnt` - piros).
     - **Gyorsnavigáció:** Bármely mentett gyógyszerre kattintva a rendszer azonnal az adott gyógyszer adatlapjára visz.
     - **Üres állapot:** Amennyiben a felhasználó még nem jelölt meg kedvencet: *"Nincs mentett gyógyszere."*
     - **"Összes mentett gyógyszer megtekintése" gomb:** Átirányít a szűrt gyógyszerlistára (`/gyogyszerek?status=saved`).

##### 4.0.1.6. Felhasználói Profil Menü
   - A profil gombra kattintva lenyíló menü jelenik meg:
     - A bejelentkezett orvos / gyógyszerész teljes neve és e-mail címe.
     - *"Profilom és Beállítások"* opció (`/profile`).
     - *"Kijelentkezés"* opció, amely megszakítja a munkamenetet és a bejelentkező felületre navigál.

##### 4.0.1.7. Mobil Hamburger Menü
   - Mobil és táblagép méret esetén a menüpontok egy könnyen kezelhető felugró oldalsávba (drawer) rendeződnek.

#### 4.0.2. Globális Lábléc (Footer) Modul

A portál alján elhelyezkedő prémium, sötétkék hátterű lábléc.
- **Megjelenés:** BENU Vény Orvosi Portál megnevezés, hivatalos "Color & Code" fejlesztői és márkaembléma, valamint a jogi és szerzői jogi nyilatkozatok.
- **Verzió kijelzés:** A lábléc jobb oldalán folyamatosan látható az éles szoftververzió száma (pl. `v1.5.0`).
- **Gyorslinkek:** Gyors navigációs hivatkozások a fő modulokra és jogi tudnivalókra.

---

### 4.1. Irányítópult (Dashboard)

A bejelentkezést követő nyitóoldal. Modern, kétoszlopos elrendezésben azonnali vizuális összefoglalást nyújt a piaci gyógyszer-státuszváltozásokról és a kijelölt preferált gyógyszertár aktuális állapotáról.

**Útvonal:** [https://bvo.uneb.hu/dashboard](https://bvo.uneb.hu/dashboard)

#### 4.1.1. Fejléc és Időszak Választó (Time Period Selector)
- **Cím és Köszöntés:** *"Irányítópult"* főcím és az orvos / felhasználó személyes üdvözlése.
- **Időszak választó gomb (Pill Dropdown):**
  - Lekerekített kapszula alakú gomb naptár ikonnal és lefelé mutató nyíllal.
  - **Kiválasztható időintervallumok:**
    - `Elmúlt 3 nap` (alapértelmezett beállítás)
    - `Elmúlt 1 nap (Mai nap)`
    - `Elmúlt 7 nap`
    - `Elmúlt 30 nap`
  - A kiválasztott intervallum azonnal érvényesül az egész irányítópulton: újraszámolja az összesítő kártya adatait és frissíti a legutóbbi változások táblázatát.

#### 4.1.2. "Fontos Készletváltozások" Figyelmeztető Kártya
- Kiemelt, világossárga hátterű (`#FFFCE9`), sárga figyelmeztető kerettel ellátott információs kártya a bal hasáb tetején.
- **Tartalom:**
  - Figyelmeztető felkiáltójel ikon.
  - Cím: *"Fontos készletváltozások"* a kiválasztott időszakra vonatkozóan.
  - Részletes szöveges összefoglaló a piaci készlethiányba került, újra elérhetővé vált, illetve forgalomból kivont (megszűnt) gyógyszerek pontos darabszámával.
  - Preferált gyógyszertár beállítása esetén kiemeli az adott patikában történt legfontosabb változásokat is (pl. *"A preferált gyógyszertárában 3 gyógyszer készlete változott."*).
  - Közvetlen kattintható hivatkozások, amelyek a gyógyszerlistát a megfelelő státusz szerint előszűrve nyitják meg.

#### 4.1.3. Országos Készletváltozások Táblázata (Bal hasáb)
- **Tételkapacitás:** A legutóbbi 20 releváns gyógyszer-státuszváltozás időrendben.
- **Oszlopok:**
  - **Státusz:** Színkódolt, lekerekített jelvények a hivatalos arculat szerint:
    - `Elérhető` – világoszöld háttér (`#E8F8E2`), sötétzöld szöveg
    - `Hiány` (Készlethiány) – világossárga háttér (`#FFF7BA`), sötétsárga szöveg
    - `Megszűnt` – világospiros háttér (`#FEEAED`), bordó szöveg
  - **Gyógyszer neve:** A készítmény teljes kereskedelmi neve (pl. *"Algopyrin 500 mg filmtabletta"*). Kattintható hivatkozás, amely a gyógyszer részletes adatlapjára visz.
  - **Dátum:** A státuszváltozás rögzítésének pontos dátuma (pl. `2026.09.02`).
- **"Összes változás megtekintése" gomb:** A táblázat alatt elhelyezett hivatkozás, amely átnavigál a Gyógyszerek oldalra frissítési dátum szerint rendezve.

#### 4.1.4. Gyógyszertári Widget (Jobb hasáb)
Kétféle állapotban jelenik meg a felhasználó beállításaitól függően:

##### A) Ha NINCS beállítva preferált patika:
- Kiemelt tájékoztató kártya térképes grafikával.
- Cím: *"Válasszon közeli gyógyszertárat"*.
- Szöveges leírás az előnyökről: *"Állítsa be kedvenc gyógyszertárát, hogy a főoldalon azonnal nyomon követhesse a helyi készletmozgásokat és hiánycikkeket."*
- **"Gyógyszertár keresése" gomb:** Kattintásra megnyitja a Patikaválasztó térképes modális ablakot.

##### B) Ha VAN beállítva preferált patika:
- **Fejléc:** A kiválasztott patika neve, címe és nyitvatartási állapota.
- **Készletstatisztikai összefoglaló:**
  - *"Újra készleten:"* X darab (kattintható zöld számérték).
  - *"Elfogyott / hiány:"* Y darab (kattintható piros számérték).
- **Helyi Készletváltozások Táblázata:** A megjelölt patika legfrissebb készletmozgásainak listája terméknévvel, darabszámmal és státusszal.

---

### 4.2. Gyógyszer Nyilvántartás

A portál központi kereső-, szűrő- és tájékoztató felülete a gyógyszerkészítmények országos és helyi adatainak böngészésére.

#### 4.2.1. Gyógyszer Lista Oldal

**Útvonal:** [https://bvo.uneb.hu/gyogyszerek](https://bvo.uneb.hu/gyogyszerek)

##### 4.2.1.1. Fejléc és Gyorsszűrők
- **Találati számláló:** A címsor mellett jól látható a szűrt tételek száma (pl. *"Gyógyszerek (142)"*).
- **Közvetlen Szűrő Jelölőnégyzetek (Checkboxok):**
  - **"Csak mentett gyógyszerek":** Bekapcsolásakor a táblázat kizárólag a felhasználó által csillaggal megjelölt kedvenc készítményeket mutatja.
  - **"Közeli gyógyszertárban elérhető":** Bekapcsolásakor kizárólag azok a gyógyszerek jelennek meg, amelyek a beállított preferált patikában fizikai raktárkészleten vannak. (Ha nincs beállítva patika, a funkció figyelmeztet a választásra).
- **"Oszlopok" Testreszabási Gomb (Dropdown):**
  - Másodlagos, szürke keretes funkciógomb lefelé mutató nyíllal.
  - Kattintásra lenyíló panel jelenik meg az összes lehetséges oszlop listájával és jelölőnégyzeteivel.
  - A felhasználó tetszőlegesen be- és kikapcsolhatja az oszlopok láthatóságát (pl. TK-szám, Terméknév, Hatóanyag, Kiszerelés, Gyártó, Státusz, Közeli patika készlet, Közeli patika frissítve, Utolsó frissítés, Csomagolás, Kiadhatóság, Biztonsági jellemzők, Támogatás, Bruttó ár, Ekvivalencia).
  - A beállításokat a böngésző automatikusan megjegyzi a későbbi látogatásokhoz.

##### 4.2.1.2. Táblázat Oszlopfejlécek és Sorrendezés
- **Oszlopok átrendezése (Drag & Drop):** Minden oszlopfejléc előtt egy hatpontos fogantyú ikon (`drag_indicator`) található, amellyel a felhasználó az oszlopokat tetszőleges sorrendbe húzhatja át.
- **Rendezés:** Az oszlop nevére kattintva a sorrend növekvő (A-Z, 0-9), csökkenő (Z-A, 9-0) vagy alapértelmezett irányba rendeződik, amit nyilak jeleznek.

##### 4.2.1.3. Oszloponkénti Szűrősor
A fejlécek alatt közvetlenül egy szűrősor helyezkedik el:
- **Szöveges beviteli mezők:** Egysoros *"Szűrés..."* mező a szöveges oszlopokhoz (pl. Név, Hatóanyag, TK-szám, Gyártó). Gépelés közben valós időben szűri a listát.
- **Státusz legördülő választó:** Opciók: `Mindegy`, `Elérhető`, `Készlethiány`, `Megszűnt`.
- **Közeli patika készlet legördülő választó:** Opciók: `Mindegy`, `Készleten`, `Nincs készleten`.
- **Dátum szűrők:** Dátumválasztó naptár mezők az utolsó frissítés időpontjának szűrésére.

##### 4.2.1.4. Táblázatsorok Megjelenése és Akciógombok
- **Státusz jelvények:** A sor elején színes, lekerekített kártyák mutatják az elérhetőséget:
  - `Elérhető` – világoszöld háttér (`#E8F8E2`), sötétzöld szöveg
  - `Hiány` – világossárga háttér (`#FFF7BA`), sötétsárga szöveg
  - `Megszűnt` – világospiros háttér (`#FEEAED`), bordó szöveg
- **Műveleti gombok (36px x 36px négyzet alakú gombok):**
  - **Kedvenc gomb (Csillag ikon):** Egykattintásos mentés a kedvencek közé. Sárga csillag jelzi az aktív állapotot. Ha a felhasználó egy olyan tételt távolít el a kedvencekből, amelyhez értesítés van rendelve, megerősítő párbeszédablak jelenik meg.
  - **Értesítés gomb (Harang ikon):** Egykattintásos feliratkozás a gyógyszer piaci státuszváltozásaira. Kék harang jelzi az aktív feliratkozást.
- **"Részletek >" Link:** Jobbra mutató nyíllal ellátott szöveges hivatkozás, amely a gyógyszer részletes adatlapjára viszi a felhasználót.

##### 4.2.1.5. Lapozó és Oldalméret Vezérlés (Pagination)
- **Számozott lapozó:** A táblázat bal alsó sarkában elhelyezkedő lapszámozás előző és következő gombokkal. Az aktív oldal sötétkék háttérrel (`#002664`) és fehér számmal van kiemelve.
- **Oldalméret választó:** A jobb alsó sarokban található legördülő menü, amellyel a felhasználó kiválaszthatja, hány tétel jelenjen meg egy oldalon:
  - `10 elem / oldal`
  - `20 elem / oldal` (alapértelmezett)
  - `50 elem / oldal`
  - `100 elem / oldal`

---

#### 4.2.2. Gyógyszer Adatlap

Egy kiválasztott gyógyszer részletes szakmai információs adatlapja.

**Útvonal:** `https://bvo.uneb.hu/gyogyszerek/adatlap?tk=[tkSzam]`

##### 4.2.2.1. Navigáció és Fejléc
- **Visszalépés link:** Bal felül látható a `"< Részletek"` vissza gomb, amely visszanavigál a gyógyszerlistához az előzőleg beállított szűrők megőrzésével.
- **Gyógyszer Főcíme és ATC-kód:** Nagy méretű terméknév sötétkék színben (pl. *"Algopyrin 500 mg filmtabletta"*), alatta a hatósági ATC-kód kiegészítéssel (pl. *"N02BB02"*).
- **Prémium Akciógombok (48px magasság):**
  - **"Kedvencekhez adás" gomb:** Sötétkék hátterű, fehér csillag ikonos gomb.
  - **"Értesítést kérek" gomb:** Fehér hátterű, sötétkék keretes, harang ikonos gomb.

##### 4.2.2.2. Állapotjelző Figyelmeztető Bannerek
- **Készlethiányos termék esetén:**
  - Világossárga hátterű (`#FFFCE9`), sárga keretes információs kártya figyelmeztető háromszög ikonnal.
  - Cím: *"Készlethiány információk"*.
  - Részletek: Hiány kezdetének dátuma, a hiány várható megszűnésének becsült ideje, a hiány hivatalos oka (pl. *"Gyártási kapacitáshiány"*), valamint szakmai pótlási javaslat (pl. *"Helyettesíthető azonos hatóanyagú készítménnyel"*).
- **Megszűnt készítmény esetén:**
  - Világospiros hátterű (`#FEEAED`), piros keretes figyelmeztető doboz.
  - Cím: *"A gyógyszer forgalomból kivonva / Megszűnt"*.
  - Részletek: A forgalomból való kivonás hatósági dátuma és szakmai tájékoztatás.

##### 4.2.2.3. Hálózati és Helyi Elérhetőségi Sorok
- **BENU Gyógyszertárak készletinformáció:**
  - Zöld állapotjelző pont.
  - Szöveges összesítés az országos hálózatról: *"Elérhető X gyógyszertárban"*.
  - **"Hol érhető el? >" gomb:** Kattintásra felugró térképes ablak jelenik meg, amely megjeleníti a készlettel rendelkező gyógyszertárakat.
- **Kedvenc Patika állapota:**
  - Megjeleníti a kiválasztott preferált gyógyszertár nevét (pl. *"BENU Gyógyszertár Arany Sas"*).
  - Készletstátusz: Zöld pipa ikon és *"Raktáron"* felirat, vagy sárga figyelmeztetés *"Nincs készleten"* felirattal.

##### 4.2.2.4. Részletes Tulajdonságok és Árinformációk Kártya
Három oszlopos, világosszürke hátterű kártya a készítmény összes fontos szakmai és gazdasági paraméterével:
- **Törzsadatok:**
  - **Gyártó:** A forgalomba hozatali engedély jogosultja (pl. *"Sanofi-Aventis Zrt."*).
  - **Kiszerelés:** A gyógyszer pontos csomagolása és egysége (pl. *"20x filmtabletta buborékcsomagolásban"*).
  - **Támogatási kategória:** Normatív, kiemelt vagy támogatás nélküli besorolás.
  - **Ekvivalencia:** Helyettesíthetőségi besorolás (pl. *"Azonos INN ekvivalens"*).
  - **Törzskönyvi szám (TK):** Hivatalos hatósági azonosító (pl. `"OGYI-T-8898/01"`).
  - **Hatóanyag (INN):** A készítmény nemzetközi szabadneve (pl. `"metamizol-nátrium"`). Kattintásra a gyógyszerlistára navigál az azonos hatóanyagú termékekhez.
- **Kiemelt Árblokkok:**
  - **Publikus Bruttó Fogyasztói Ár:** Feltűnő, bordó színnel (`#B1174E`) kiemelt összeg (pl. `2 490 Ft`).
  - **Becsült Térítési Díj:** Sötétkék színnel (`#002664`) kiemelt betegtérítési díj támogatott készítményeknél.

##### 4.2.2.5. Státusz Történet (Előzmények Kártya)
- Időrendi táblázat, amely bemutatja a gyógyszer korábbi készlet- és piaci státuszváltozásait.
- Tartalma: Változás dátuma, korábbi státusz → új státusz.
- A kártya alján látható az utolsó adatbázis-szinkronizáció pontos időbélyege.

##### 4.2.2.6. Helyettesítő Készítmények (Substitutes Kártya)
- Azonos hatóanyagú (INN) vagy terápiásan ekvivalens készítmények táblázata.
- **Megjelenített adatok soronként:** Terméknév, Gyártó, Kiszerelés, Elérhetőség a közeli patikában (zöld badge vagy hiányjelzés), valamint közvetlen kedvenc/értesítés akciógombok és hivatkozás az adott helyettesítő termék adatlapjára.

---

### 4.3. Gyógyszertár Kereső

#### 4.3.1. Gyógyszertárak Oldal

Interaktív térképes és szinkronizált listás kereső a patikák megtalálására.

**Útvonal:** [https://bvo.uneb.hu/gyogyszertarak](https://bvo.uneb.hu/gyogyszertarak)

##### 4.3.1.1. Kereső mező
   - **Típus:** Egysoros szövegmező.
   - **Megadható adatok:** Patika neve, Utca/Házszám cím, Város neve vagy BF azonosító kód.
   - **Példák:** `"BENU"`, `"1052 Budapest"`, `"Károly körút"`, `"BF001"`.

##### 4.3.1.2. Nyitvatartási Szűrőgombok
   - **Opciók:** `"Most nyitva"`, `"Hétvégén nyitva"`, `"0-24 órában nyitva"`.
   - **Működés:** Szűri a térképes jelölőket és a kapcsolódó listát.

##### 4.3.1.3. "Mutasd az összeset" Gomb
   - Alaphelyzetbe állítja a térkép nézetét (középpont és zoom), de az aktív nyitvatartási és szöveges szűrőket **NEM törli**.

##### 4.3.1.4. Mobil Lista / Térkép Nézetváltó
   - Kisebb kijelzőméretnél egy kapcsológomb jellegű opcióválasztó jelenik meg a fejlécben (`Lista` / `Térkép`), amely lehetővé teszi a két nézet közötti váltást mobilon.

##### 4.3.1.5. Térkép - Lista Szinkronizáció és Találatszám
   - A lista panelén kizárólag azon gyógyszertárak kártyái jelennek meg, amelyek az aktuális térképes kivágatban láthatók (maximum 50 kártya).
   - **Találatszám kijelzés:** `"Összesen N gyógyszertár / a térképen X gyógyszertár."`
   - **[Mutasd az összest] hivatkozás:** Visszaállítja a térkép zoom szintjét az összes patika megjelenítéséhez.

##### 4.3.1.6. Nyitvatartási Státusz Kijelzés (Patikakártya)
   - Háromállapotú jelvény: **Nyitva** (zöld), **Hamarosan zár** (sárga), **Zárva** (piros) + a napi nyitvatartási időpontok kijelzése (pl. `08:00 - 19:00`).

##### 4.3.1.7. Preferált Patika Kijelölése
   - Gomb a patikakártyán és a térképes felugró ablakban: Ház / helyszín hozzáadása ikon (`"Közeli patikának jelölöm"`).
   - Visszajelzés: A kiválasztott patikán egyértelmű `"Közeli gyógyszertár"` kitűző jelenik meg, és beállítása érvényesül az egész portálon.

##### 4.3.1.8. Gyógyszertár Részletek Modal és Mélylinkelés
   - **Megnyitás:** A patikakártyán és a térképes marker felugró ablakában lévő `"Részletek"` gombra kattintva megnyílik a gyógyszertár részletes adatlapja egy reszponzív felugró modális ablakban.
   - **Mélylinkelés (Deep Linking):** Ha a felhasználó a Globális keresőből vagy más felületről hivatkozással érkezik (pl. `/gyogyszertarak?id=BF133`), a rendszer a térképen automatikusan az adott patikára fókuszál (zoom 15) és megnyitja a részletes modális ablakot.
   - **A Modal Tartalma:**
     - *Fejléc:* Gyógyszertár neve, belső azonosító kódja (pl. `BF133`), esetleges `"Közeli gyógyszertár"` jelvény és bezáró `X` gomb.
     - *Aktuális státusz & Elérhetőségek:* Háromállapotú jelvény (`Nyitva`, `Hamarosan zár`, `Zárva`), pontos cím, kattintható telefonszám (`tel:` hivatkozással azonnali hívásindításhoz) és kattintható e-mail cím (`mailto:` hivatkozással levelezéshez).
     - *Heti nyitvatartási rend:* Hétfőtől Vasárnapig napokra lebontott nyitvatartási idők. Az aktuális nap kiemelésre kerül (kiemelt háttér és `"Ma"` badge). A zárva tartó napoknál `"ZÁRVA"` felirat jelenik meg.
   - **Reszponzivitás:** Mobilon és asztali kijelzőn egyaránt görgethető, érintésbarát felületet nyújt (`max-h-[90vh]`).
   - **Akciógombok:**
     - `"Közeli patikának jelölöm"` / `"Közeli jelölés eltávolítása"` (szinkronizálja a preferált patika állapotot).
     - `"Mutasd térképen"` (bezárja a modalt és ráfókuszál a gyógyszertárra a térképen).
     - `"Bezárás"` (lezárja a modális ablakot).

#### 4.3.2. Gyógyszertári Készlet Nézet (Modális Nézet)

- **Funkció:** A Gyógyszer adatlapról a `"Megnézem hol"` gombokkal megnyitható teljes képernyős modális ablak.
- **Működés:** Kizárólag azokat a gyógyszertárakat jeleníti meg a térképen és a kísérő listában, ahol a kiválasztott gyógyszer raktáron van vagy rendelhető.

---

### 4.4. Képzési Program (NEM MVP!)

A Képzési program modul egy teljesen különálló rendszer a portálon, külső LMS rendszerrel szükséges kommunikálnia. Jelenleg nem kell foglalkozni a modul fejlesztésével, viszont szükséges felmérni a szükség kapcsolódási információkat.

#### 4.4.1. Képzések Főoldal

A szakmai és akkreditált képzések böngészőfelülete.

**Útvonal:** [https://bvo.uneb.hu/kepzesek](https://bvo.uneb.hu/kepzesek)

##### 4.4.1.1. Kategória Szűrő Fülek
   - **Típus:** Horizontális fül-választó (Tabs).
   - **Választható opciók:** `Összes`, `Akkreditált`, `Gyártói`, `Eladásösztönző`.
   - **Alapértelmezett:** `Összes`.

##### 4.4.1.2. Kurzuskártyák adatai
   - Képzés címe, Kategória jelvény (`Akkreditált` - zöld, `Gyártói` - kék, `Eladásösztönző` - sárga), Rövid leírás, Tananyag becsült időtartama (pl. `"45 perc"`), Tartalomtípus ikon (Videó / PDF Dokumentum), `"Részletek"` gomb és `"Érdekel"` gomb. *(Kreditpont a kártyán NEM jelenik meg)*.

##### 4.4.1.3. "Érdekel" Gomb és BENU LMS Tájékoztató Modal
   - A kurzuskártyán lévő `"Érdekel"` gombra kattintva megnyílik a **BENU LMS bemutató modális ablak**.
   - **Tartalom:** Tájékoztató leírás a BENU Képzési Programról, a továbbképzési rendszerről és a kreditpont-gyűjtésről.
   - **Gombok:** `"Tovább a BENU LMS-re"` (külső hivatkozás a tanulási felületre) és `"Bezárás"`.

#### 4.4.2. Képzés Részletes Oldal és BENU LMS Integráció

**Útvonal:** `https://bvo.uneb.hu/kepzesek/[courseId]`  
*(Példa: [https://bvo.uneb.hu/kepzesek/c1](https://bvo.uneb.hu/kepzesek/c1))*

##### 4.4.2.1. Bevezető Videó Placeholder
- Képzés fejléce lejátszás gombbal és kategória jelvénnyel.
##### 4.4.2.2. Tanfolyam Részletei
- Részletes szöveges ismertető a képzésről.
##### 4.4.2.3. Tartalmi Elemek (Modullista)
   - *Modul 1:* Bevezető előadás (Videó ikon, időtartam).
   - *Modul 2:* Klinikai adatok és segédanyagok (PDF ikon, diaszám).
   - *Modul 3 (Zárolt):* Záróteszt és Akkreditáció — Felirat: `"A tartalom eléréséhez lépjen be a BENU LMS rendszerbe"`.
##### 4.4.2.4. Akkreditált Pontok Kártya
- Megszerezhető kreditpontok kijelzése (pl. `2 kreditpont`) + `"Pontszerzés"` gomb (megnyitja az LMS Tájékoztató Modalt).
##### 4.4.2.5. Hibaállapot és Érvénytelen Kurzuskezelés
- Nem létező kurzusazonosító esetén `"Tanfolyam nem található"` üzenet és gomb a listára való visszalépéshez.
##### 4.4.2.6. Üzleti Integráció a BENU LMS Rendszerrel
- A tananyagok tényleges feldolgozása, a tesztkitöltés és a kreditpontok elismerése a külső BENU LMS rendszerben történik.

---

### 4.5. Globális Keresés

A navigációs fejlécbe épített rendszerszintű instant kereső, amely reszponzív elrendezéssel támogatja az asztali és a mobil felületeket egyaránt.

#### 4.5.1. Reszponzív Keresősáv és Mobil Overlay Felület
- **Asztali nézet (≥768px / md):** Egysoros keresőmező kereső ikonnal a fejlécben, amely alatt gépeléskor élő legördülő találati kártya (`w-[400px]`) jelenik meg.
- **Mobil nézet (<768px / md):** A fejlécben egy jól érinthető **kereső ikon gomb** (nagyító ikon) jelenik meg. A gombra koppintva egy **teljes képernyős Mobil Kereső Overlay (Modális felület)** nyílik meg kiterjesztett rétegen (`fixed inset-0 z-[100]`), letiltva a háttér oldal görgetését.
- **Mobil Kereső Overlay felületi elemei:**
  - **Vissza gomb (`arrow_back`):** Az overlay azonnali bezárása és visszatérés az eredeti oldalra.
  - **Kereső beviteli mező:** Lekerekített keresősáv automatikus fókusszal (`autoFocus`), hogy a felnyíló virtuális billentyűzetről azonnal lehessen gépelni.
  - **Törlés gomb (X):** Kifejezés beírása esetén megjelenő gyors törlés ikon a mező kiürítésére.
  - **Kategória fülek:** Vízszintesen kényelmesen választható szűrő gombok (`Minden`, `Gyógyszerek`, `Patikák`, `Képzések`).

#### 4.5.2. Keresési Tartomány és Kategóriák
- *Gyógyszerek:* Gyógyszer kereskedelmi neve és Hatóanyaga (INN). *(TK-szám alapján a globális kereső nem keres).*
- *Gyógyszertárak:* Patika neve, Település és Cím.
- *Képzések:* BENU Képzési Program tanfolyamainak címe, rövid leírása és kategóriája (`Gyártói`, `Eladásösztönző`, `Akkreditált`).

#### 4.5.3. Működés, Élő Találati Panel és Mélylinkelés
- Már **1 karakter** beírása után megnyílik az élő találati panel.
- **Kategória fülek:** `Minden`, `Gyógyszerek`, `Patikák`, `Képzések`.
- **Találati korlátok:** Kategóriánként max. 5 találat jelenik meg, a `Minden` fülön összesen max. 10 találat.
- **Navigáció találatra kattintva:**
  - Gyógyszer találat → gyógyszer adatlapjára navigál (`/gyogyszerek/adatlap?tk=[tkSzam]`).
  - Gyógyszertár találat → a gyógyszertár keresőre navigál a kiválasztott patika mélylinkjével, fókuszált térképpel és megnyitott adatlapjával (`/gyogyszertarak?id=[pharmacyId]`).
  - Képzés találat → a BENU Képzési Program adott tanfolyamának adatlapjára navigál (`/kepzesek/[courseId]`).
  - Találatra kattintáskor a mobil overlay automatikusan bezárul és helyreáll a háttér görgetése.
- **Lábléc:** `"Összes találat megtekintése"` gomb.

---

### 4.6. Hitelesítés és Jogosultságok

#### 4.6.1. Bejelentkezés Oldal

A portál hivatalos, orvosi szakmai bejelentkezési felülete, amely a modern, letisztult BENU Vény arculatot követi.

**Útvonal:** [https://bvo.uneb.hu/login](https://bvo.uneb.hu/login)

##### 4.6.1.1. Fejléc és Arculati Elemek
- **BENU Vény Logó:** A képernyő felső részén elhelyezett hivatalos arculati embléma.
- **"Orvosoknak" Alcím:** A logó alatt kiemelten látható, 22px-es sötétkék felirat, amely egyértelműen jelzi a felület zárt szakmai jellegét.

##### 4.6.1.2. Bejelentkezési Kártya Felépítése
A képernyő közepén elhelyezkedő 479px széles, világosszürke hátterű (`#F9F9FB`), lekerekített sarkú kártya:
- **Kártya Címe:** *"Bejelentkezés"* (22px méretű sötétkék betűkkel).
- **Bejelentkezési Módok Fülei (Tabs):**
  - Három választható fül: `Jelszó` (alapértelmezett), `Passkey` (biometrikus belépés), `E-mail Kód` (egyszeri kód jelszó nélkül).
  - Az aktív fül sötétkék háttérrel és fehér szöveggel van kiemelve.

##### 4.6.1.3. Jelszavas Bejelentkezés (Alapértelmezett Mód)
- **E-mail cím beviteli mező:**
  - 56px magasságú, fehér hátterű, finom szürke kerettel (`#D8D9E0`) ellátott egysoros mező.
  - Helykitöltő szöveg: *"E-mail cím"*.
  - Megadható adat: az orvos regisztrált szakmai e-mail címe (pl. `demo@example.com`).
- **Jelszó beviteli mező:**
  - 56px magasságú, fehér hátterű, szürke keretes maszkolt jelszómező.
  - Helykitöltő szöveg: *"Jelszó"*.
- **"Bejelentkezés" Gomb:**
  - 56px magasságú, sötétkék (`#002664`) háttérszínű, fehér félkövér feliratú gomb jobbra mutató nyíl ikonnal.
  - Beküldéskor ellenőrzi az adatokat; helyes jelszó esetén (ha az eszköz megbízható) közvetlenül az Irányítópultra navigál, vagy kétfaktoros ellenőrzést kér.
- **"Elfelejtett jelszó" Hivatkozás:**
  - A gomb alatt elhelyezkedő sötétkék link, amely a jelszó-visszaállító oldalra (`/forgot-password`) navigál.

##### 4.6.1.4. Passkey Biometrikus Belépés (1-kattintásos kényelmi funkció)
- Lehetővé teszi az orvosok számára a belépést Touch ID, Face ID vagy Windows Hello segítségével.
- Ujjlenyomat ikonnal és opcionális e-mail azonosítóval ellátott felület, 56px magas sötétkék *"Belépés Passkey-vel"* akciógombbal.

##### 4.6.1.5. Egyszeri E-mail Kódos Belépés (Magic Code)
- Jelszó nélküli belépési lehetőség: az orvos megadja az e-mail címét, a rendszer kiküld egy 6-jegyű egyszeri érvényesítő kódot, és átirányítja a felhasználót a hitelesítési képernyőre.

#### 4.6.2. Kétfaktoros Azonosítás (2FA) Igazolási Felület

Jelszavas belépés vagy e-mail kód kérése után (amennyiben a 2FA be van kapcsolva és az eszköz még nem megbízható) a bejelentkezési kártya átvált a kétfaktoros ellenőrzési állapotba:

- **Biztonsági Információs Blokk:** Zöld/kék biztonsági pajzs ikon és tájékoztató szöveg a kód kiküldéséről a felhasználó e-mail címére.
- **6-jegyű OTP kód mező:** 56px magas, nagyméretű, középre zárt, ritkított karaktertávolságú számszerű beviteli mező (pl. `123456`).
- **"Megbízható eszköz megjegyzése (ne kérjen kódot 30 napig)" jelölőnégyzet:** Alapértelmezetten bepipálva. Megjelölése esetén a rendszer 30 napig nem kér újabb 2FA kódot az adott böngészőből való belépéskor.
- **Akciógombok:**
  - *"Vissza"* gomb: a belépési űrlaphoz való visszatéréshez.
  - *"Kód igazolása"* gomb: 48px magas sötétkék akciógomb, amely sikeres ellenőrzés után az Irányítópultra lépteti be a felhasználót.
- **Tesztelési Segédlet:** A prototípusban látható egy tesztelői emlékeztető a működő demó kódról (`123456`).

#### 4.6.3. Elfelejtett Jelszó Oldal

**Útvonal:** [https://bvo.uneb.hu/forgot-password](https://bvo.uneb.hu/forgot-password)

- *E-mail cím mező:* Szabványos email mező.
- *"Belépési kód küldése" gomb:* Kattintásra a felületen megjelenik a generált 6 jegyű belépési kód prototípus gépelési tájékoztatóval (`"Prototípus mód: ... itt láthatja a belépési kódot"`).
- *Információs alert:* Tájékoztatja a tesztelőt, hogy a prototípusban a generált kóddal nem lehet továbbhaladni, a fix jelszót kell használni.
- *Hivatkozások:* `"Vissza a bejelentkezéshez"` és `"Mégis emlékszem a jelszavamra"`.

#### 4.6.4. Manuális Felhasználói Regisztráció és Kapcsolatfelvételi Űrlap

A BENUvény Orvosi Portál zárt szakmai rendszer, amely kizárólag hitelesített orvosok, gyógyszerészek és egészségügyi szakemberek számára érhető el.

- **Manuális regisztrációs folyamat:** A portálon **nincs közvetlen, azonnali önkiszolgáló felhasználói regisztráció**. A felhasználói fiókok létrehozása és aktiválása kizárólag kézzel, az adminisztrátor által történik.
- **Kapcsolatfelvétel a bejelentkezési oldalról:**
  - Az új szakmai felhasználó a bejelentkezési felületen (`/login`) elhelyezett kapcsolatfelvételi hivatkozáson / gombon keresztül érheti el a **Regisztrációs Igény / Kapcsolatfelvételi Űrlapot** (modális ablakban vagy dedikált aloldalon).
  - **Űrlapon megadandó adatok:** Teljes név, Szakmai e-mail cím, Telefonszám, Orvosi/Gyógyszerészi pecsétszám (működési nyilvántartási szám), Szakterület/Munkahely, valamint tetszőleges kiegészítő megjegyzés/üzenet és az adatkezelési nyilatkozat elfogadása.
  - **Visszajelzés a felhasználónak:** Az űrlap beküldésekor a felület egyértelmű tájékoztatást ad arról, hogy az igény rögzítésre került, és az adminisztrátor a szakmai jogosultság (pecsétszám) ellenőrzése után manuálisan felveszi a kapcsolatot a felhasználóval és létrehozza a fiókot.
- **Adminisztrátori jóváhagyás és fiókrögzítés:** Az adminisztrátor a beküldött adatok alapján elvégzi a kamarai/hatósági nyilvántartási ellenőrzést, majd az [Adminisztráció -> Felhasználókezelés](#471-felhasználókezelés) felületen manuálisan rögzíti az új felhasználót, beállítja a jogosultságát (`User`), és eljuttatja számára a kezdeti belépési információkat.
- **Jövőbeli tervek és önkiszolgáló regisztráció:** Későbbiekben elképzelhető, hogy a rendszer kiegészül egy önkiszolgáló, automatizált regisztrációs felülettel (pl. közvetlen szakmai adatbázis-verifikációval), de **jelenleg a rendszerben nem tervezünk ilyennel**, a regisztráció kizárólag a kapcsolatfelvételi űrlapon és kézi adminisztrátori rögzítésen keresztül működik.

#### 4.6.5. Jogosultságkezelés és Munkamenet Biztonság
- Szerepkörök: `Admin` (teljes hozzáférés az `/admin/*` útvonalakhoz) és `User` (szakmai felhasználó).
- **Munkamenet biztonság:** Adminisztrátori fiók-felfüggesztés vagy munkamenet-lezárás (Force Logout) esetén a felhasználó a következő műveletnél azonnal kijelentkeztetésre kerül.

---

### 4.7. Adminisztráció

Kizárólag `Admin` szerepkörrel rendelkező felhasználók számára elérhető felület.

#### 4.7.1. Felhasználókezelés

**Útvonal:** [https://bvo.uneb.hu/admin/users](https://bvo.uneb.hu/admin/users)

##### 4.7.1.1. Felhasználó Lista Táblázat
- **Táblázat oszlopai:** Név / E-mail cím, Szerepkör (`Admin` / `Orvos`), Fiók státusz (`Aktív` / `Inaktív`), Szakterületek (max 2 megjelenítve + `+N`), Műveleti menü (`⋮`).

##### 4.7.1.2. Felhasználó Szerkesztő Modal Fülek (Alapadatok, Profil, Hírlevél)
- **1. Alapadatok Fül (Modal):**
  - *Teljes név:* Egysoros szövegmező. Kötelező.
  - *Elsődleges e-mail cím:* Email mező. Kötelező, egyedi.
  - *Szerepkör (Role):* Legördülő menü (`User` / `Admin`).
  - *Fiók Státusz (Status):* Legördülő menü (`Active` / `Inactive`).
- **2. Profil Fül (Modal):**
  - *Másodlagos e-mail cím:* Email mező. Opcionális.
  - *Szakterületek:* Kódlistás multi-select jelölőnégyzet szakterületekből.
- **3. Hírlevél Fül (Modal):**
  - Elsődleges és Másodlagos e-mail cím hírlevél preferenciáinak adminisztrátori beállítása.
  - **Kategóriák:** `"Közösség, Fórum"` (kiküldés ideje, rendszeresség, téma, csak saját témák — a kivezetett fórum maradványa) és `"Készletinfó"`.

##### 4.7.1.3. Adminisztrátori Műveletek & Védelmek
- **Deaktiválás / Aktiválás:** Megerősítő dialog. *(Az adminisztrátor saját fiókját nem deaktiválhatja).*
- **Munkamenet Azonnali Lezárása (Force Logout):** Növeli a munkamenet verziót, azonnal kijelentkezteti a felhasználót.
- **Jelszó-visszaállítás kezdeményezése:** Értesítést generál a jelszó-visszaállításról.

#### 4.7.2. Fórum és Tartalom Moderálás

**Útvonal:** [https://bvo.uneb.hu/admin/forum](https://bvo.uneb.hu/admin/forum)

- Témák és Hozzászólások áttekintése (az admin számára a rejtett tartalmak is láthatók).
- **Moderációs műveletek:**
  - *Téma Lezárása / Feloldása:* Lezárt témához nem lehet új hozzászólást fűzni.
  - *Elrejtés / Megjelenítés (Téma és Hozzászólás):* Visszavonható elrejtés toggle (nem törlés!).
  - *Szöveg Szerkesztése:* Téma leírásának vagy hozzászólás szövegének módosítása moderálási céllal.
  - *Szerző Anonimizálása:* Lecseréli a szerző nevét `"Anonim Felhasználó"` feliratra.
  - *Lenyitható komment-lista:* Témánként megtekinthetők és moderálhatók a kapcsolódó hozzászólások.

#### 4.7.3. Gyógyszertár Karbantartás

**Útvonal:** [https://bvo.uneb.hu/admin/pharmacies](https://bvo.uneb.hu/admin/pharmacies)

A prototípusban **NINCS patika-szerkesztő űrlap**. A felületen az alábbi tájékoztató látható: *"Az adatok szerkesztése a Patika Kezelő rendszerben történik. Itt csak áttekintő nézet érhető el."*

##### 4.7.3.1. Gyógyszertárak Lista Oldal
- *Keresőmező:* Keresés név, település, cím vagy BF kód alapján.
- *Táblázat oszlopai:* BF kód, Név, Település, Cím, Nyitvatartás (ma), Utolsó adatszinkron időpontja, Utolsó készletszinkron időpontja, Részletek gomb.

##### 4.7.3.2. Részletes Patika Nézet és Készletáttekintés
- *Patikai alapadatok:* Név, BF kód, Cím, Telefonszám, E-mail, Szinkronidőpontok (olvasható kártyákon).
- *Termékkészlet Táblázat:* Megjeleníti a patikához tartozó termékeket: TK-szám, Terméknév, Hatóanyag, Kiszerelés, Gyártó, Státusz, Raktári darabszám (`dapieces`).
- *Táblázatos Funkciók:* Oszloponkénti szűrősor, növekvő/csökkenő rendezés, 25 elemes lapozó, `"Szűrők törlése"` gomb.

---

### 4.8. Felhasználói Profil

A felhasználó saját adataik, preferenciáik és fiókbiztonságuk kezelési központja.

**Útvonal:** [https://bvo.uneb.hu/profile](https://bvo.uneb.hu/profile)

#### 4.8.1. Személyes Adatok és Szakterületek
- **Név, Elsődleges e-mail, Másodlagos e-mail:** Megjelenítő mezők olvasási módban. *Magyarázó felirat:* `"Szerkesztéséhez keresse az adminisztrációt."`
- **Szakterületek Módosítása:**
  - *Típus:* Kereshető multi-select komponens szakterület keresővel.
  - *Megadható értékek:* Az orvosi szakterület kódlista elemei.
  - *Gomb:* `"Szakterületek mentése"`.

#### 4.8.2. Preferált Gyógyszertár Kezelése
- Megjeleníti a jelenleg kiválasztott preferált patika kártyáját.
- *Gombok:* `"Módosítás"` (megnyitja a modális patikakeresőt) és `"Törlés"` (megerősítő dialogot nyit).

#### 4.8.3. Hírlevél Beállítások Szekció

A profil egyik legterjedelmesebb funkcióblokkja, amely **külön konfigurálható az Elsődleges ÉS a Másodlagos e-mail címre**:

##### 4.8.3.1. BENU Képzési Program Hírlevél
   - *Feliratkozás kapcsoló:* `Be` / `Ki`.
   - *Érdekelt témakörök gombok:* `Akkreditált`, `Gyártói`, `Eladásösztönző`.

##### 4.8.3.2. Készletinfó Hírlevél
   - *Feliratkozás kapcsoló:* `Be` / `Ki`.
   - *Rendszeresség (Select):* `Napi`, `Heti`, `Havi`.
   - *Kiküldés ideje (Számmező):* `0` – `23` óra között.
   - *Téma (Multiselect gombok):* `Újra elérhető`, `Készlethiány`, `Megszűnt`.
   - *Témakör / Hatókör (Select):* `Minden`, `Szakterület + mentett gyógyszerek`, `Csak szakterület`, `Csak mentett gyógyszer`.

#### 4.8.4. Mentett Kedvencek Oldal
- **Útvonal:** [https://bvo.uneb.hu/profile/favorites](https://bvo.uneb.hu/profile/favorites)
- Tájékoztató infó-kártya, mentett gyógyszerek listája törlési lehetőséggel és értesítések közvetlen kezelésével.

#### 4.8.5. Készletértesítések Oldal
- **Útvonal:** [https://bvo.uneb.hu/profile/notifications](https://bvo.uneb.hu/profile/notifications)
- Aktív készletértesítések táblázata a **feliratkozás időpontjával** és egykattintásos leiratkozási opcióval.

#### 4.8.6. Biztonság és Kétfaktoros Azonosítás (2FA / Passkey)

##### 4.8.6.1. Kétfaktoros Azonosítás (2FA) Kapcsoló és Csatornák
   - *Kapcsoló:* `Be` / `Ki`.
   - *2FA Csatorna választás:* `E-mail OTP (alapértelmezett)`, `SMS OTP (mobil telefonszámra)`, `Hitelesítő App (TOTP)`. SMS választása esetén megjeleníti a regisztrált telefonszámot.

##### 4.8.6.2. Passkey Kulcsok Kezelése (Biometria)
   - *Regisztrált eszközök listája:* Megjeleníti a fiókhoz kapcsolt eszközök nevét és regisztrációs dátumát (pl. `"Work Mac TouchID - 2026-01-15"`).
   - *"Új Passkey" gomb:* Megnyit egy modális ablakot az eszköz nevének megadásához.
   - *Törlés gomb:* Passkey eltávolítása.

##### 4.8.6.3. Megbízható Eszközök Kezelése
   - Kijelzi a 30 napra megjegyzett munkamenetek számát.
   - *"Eszközök elfelejtése" gomb:* Azonnal érvényteleníti az összes megjegyzett eszközt, így a rákövetkező belépéskor minden böngészőben kötelezővé válik a 2FA kód megadása.

##### 4.8.6.4. Kijelentkezés a Rendszerből
- *"Kijelentkezés a rendszerből"* gomb: Azonnali kijelentkezés a munkamenetből.

---

---

## 5. Korábban tervezett, de elvetett / külső rendszerbe átsorolt funkciók

Ez a szekció azokat a funkciókat tartalmazza, amelyek korábbi tervekben szerepeltek, de a jelenlegi felületen nem aktívak, módosultak vagy külső rendszerbe kerültek át.

### 5.1. Közösségi Fórum a Felhasználói Főmenüben és a Globális Keresőben
> **Státusz:** Nem aktív a fő navigációs menüben és a globális keresőben – szerepét a Képzési Program vette át.  
> **Elérhetőség:** Korábbi útvonal: `https://bvo.uneb.hu/kozosseg`. A témák és hozzászólások közvetlen URL-lel továbbra is elérhetők (témalétrehozás, hozzászólások működnek). A moderációs felület az adminisztrációban megmaradt (`/admin/forum`).

### 5.2. Közösségi Aktivitás Dashboard-Widget
> **Státusz:** Elvetve (a kódban explicit `"HASZNÁLATON KÍVÜL"` jelöléssel).  
> Helyét az Irányítópulton a Képzési Program promóciós widget vette át.

### 5.3. Jelszó Módosítása a Felhasználói Profilban
> **Státusz:** Nem aktív a felületen.  
> A profiloldalon az alapadatok csak olvashatók. Jelszó módosításához vagy adategyeztetéshez a felhasználónak az adminisztrációt kell keresnie.

### 5.4. Betegtájékoztató Letöltése a Gyógyszer Adatlapról
> **Státusz:** Tervezett / Jelenleg nem aktív.  
> A kódkommentben szereplő letöltési funkció a prototípusban nem készült el.

### 5.5. Globális Kereső: "Összes találat megtekintése" Gomb
> **Státusz:** Nem funkcionális gomb.  
> A kereső panel láblécében megjelenik, meglévő felületi elem, de nem indít külön találati oldalt.

### 5.6. Adminisztrációs Gyógyszertár Szerkesztő Űrlap
> **Státusz:** Külső rendszerbe átsorolva.  
> Az adminisztrációs felületen nincs patika-szerkesztő űrlap (koordináták, nyitvatartás szerkesztése). A patikaadatok szerkesztése a külső Patika Kezelő rendszerben történik, az admin felület kizárólag áttekintést és készletellenőrzést nyújt.

### 5.7. Gyógyszer Lista: Kártya Nézet Váltás
> **Státusz:** Nem aktív a felületen.  
> A gyógyszerlista a szakmai áttekinthetőség érdekében kizárólag a rendezhető és szűrhető táblázatos nézetben érhető el.

### 5.8. Gyógyszer Keresés: ATC Kód és Gyártó Alapján a Szabad Szöveges Keresőben
> **Státusz:** Nem aktív a szabad szöveges mezőben.  
> A keresőmező Név és Hatóanyag alapján keres. Az ATC kód és Gyártó adatok az oszlopszűrőkben és a kijelölhető oszlopokban érhetők el.

### 5.9. Önkiszolgáló Automatikus Felhasználói Regisztrációs Felület
> **Státusz:** Jelenleg nem tervezett / Későbbi fejlesztési lehetőség.  
> A rendszerben nem érhető el közvetlen, azonnali önkiszolgáló regisztrációs folyamat. A felhasználók regisztrációja kézzel (manuálisan) történik az adminisztrátor által, miután az érdeklődő orvos/gyógyszerész felvette a kapcsolatot az üzemeltetéssel a bejelentkezési felületről elérhető kapcsolatfelvételi űrlapon keresztül. Későbbiekben elképzelhető egy automatizált önkiszolgáló regisztrációs felület kialakítása, de jelenleg nem tervezünk ilyennel.

---

---

## 6. Tesztfiókok és Hozzáférések

> **Megjegyzés:** Az alábbi tesztfiókok a prototípus élő kipróbálására szolgálnak a [https://bvo.uneb.hu/login](https://bvo.uneb.hu/login) oldalon.

**Minden fiók egységes jelszava:** `vény123`

### 6.1. Adminisztrátor Tesztfiók
- **Email:** `admin@example.com`
- **Jelszó:** `vény123`
- **Szerepkör:** Admin
- **Státusz:** Aktív
- **Szakterületek:** –
- **Tesztelési Rendeltetés:** Adminisztrációs felület és felhasználókezelés tesztelése ([https://bvo.uneb.hu/admin/users](https://bvo.uneb.hu/admin/users)).

### 6.2. Dr. Kovács István (Szakmai Felhasználó)
- **Email:** `demo@example.com`
- **Jelszó:** `vény123`
- **Szerepkör:** User
- **Státusz:** Aktív
- **Szakterületek:** Háziorvos, Belgyógyász
- **Tesztelési Rendeltetés:** Szakmai portál teljes körű tesztelése (keresés, kedvencek, értesítések, profilbeállítások). Az admin felület elérése számára korlátozott.

### 6.3. Dr. Teszt Szabolcs (Inaktív / Felfüggesztett Fiók)
- **Email:** `teszt@example.com`
- **Jelszó:** `vény123`
- **Szerepkör:** User
- **Státusz:** Inaktív
- **Szakterületek:** Kardiológus
- **Tesztelési Rendeltetés:** Felfüggesztett/Inaktív fiók bejelentkezési elutasításának és védelmének tesztelése.

---

---

## 7. Változásnapló (Verziótörténet)

Ez a fejezet a funkcionális specifikáció dokumentumban eszközölt módosítások, pontosítások és kiegészítések időrendi követésére és archiválására szolgál.

| Verzió | Dátum | Változás Típusa | Változások Összefoglalása |
| :--- | :--- | :--- | :--- |
| **v1.4.1** | 2026.08.24. | Kiegészítés | **Manuális felhasználói regisztráció és kapcsolatfelvételi űrlap rögzítése:**<br>• Tisztázásra került, hogy a rendszerbe a felhasználók regisztrációja kézzel (manuálisan) történik az adminisztrátor által.<br>• Az új szakmai felhasználó a bejelentkezési felületről elérhető űrlapon keresztül veszi fel a kapcsolatot az adminisztrátorral a szakmai adatok (pl. név, pecsétszám, szakterület) megadásával.<br>• Rögzítésre került, hogy későbbiekben elképzelhető önkiszolgáló regisztrációs felület bevezetése, de jelenleg nem tervezünk ilyennel.<br>• Új adatmodell fejezet hozzáadása: 3.6. Regisztrációs Igény / Kapcsolatfelvételi Űrlap Adatmodell.<br>• Új funkcionális alfejezet: 4.6.4. Manuális Felhasználói Regisztráció és Kapcsolatfelvételi Űrlap.<br>• Elvetett/későbbi funkciók közé felvéve: 5.9. Önkiszolgáló Automatikus Felhasználói Regisztrációs Felület.<br>• Új fejezet bevezetése a dokumentum végén: 7. Változásnapló (Verziótörténet). |
