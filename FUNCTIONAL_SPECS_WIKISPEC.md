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
  a gyógyszerek piaci elérhetőségéről, készlethiányáról (a LogiNet Middleware által közvetített BENU hálózati adatok és az OGYÉI hatósági hiánylista összevetésével) és a helyettesíthetőségről.
- Felhasználóként szeretném megtalálni a legközelebbi preferált gyógyszertáramat és 
  ellenőrizni annak aktuális készletét.
- Felhasználóként szeretnék szakmai és akkreditált képzéseken részt venni.
- Adminisztrátorként szeretném kezelni a felhasználókat, jogosultságokat, patikákat és tartalmakat.

KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
- Fejléc / Navigációs sáv (Globális kereső, Közeli patika, Kedvencek, Profil)
- Irányítópult (Dashboard): https://bvo.uneb.hu/dashboard
- Gyógyszer Nyilvántartás (Lista + Adatlap): https://bvo.uneb.hu/gyogyszerek
- Gyógyszertár Kereső (Térkép + Készlet): https://bvo.uneb.hu/gyogyszertarak
- BENU Képzési Program: https://bvo.uneb.hu/kepzesek
- Közösség és Fórum: https://bvo.uneb.hu/kozosseg
- Képzési Program (Képzések): https://bvo.uneb.hu/kepzesek
- Hitelesítés & Profilkezelés: https://bvo.uneb.hu/login, https://bvo.uneb.hu/profile
- Adminisztráció (Felhasználók, Patikák, Moderálás): https://bvo.uneb.hu/admin/users
============================================================================
-->

# BENUvény orvosi portál funkcionális specifikáció

> **Verzió:** 1.4  
> **Dátum:** 2026.08.24.  
> **Státusz:** Véglegesnek szánt
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

---

---

## 4. Modulok és Funkciók Részletes Leírása

### 4.0. Fejléc és Navigációs Sáv Modul

#### 4.0.1. Fejléc Navigáció és Főfunkciók

A portál tetején rögzített (sticky) központi navigációs sáv, amely minden oldalon elérhető. Biztosítja az oldalak közötti gyors váltást, a mentett kedvenc gyógyszerek elérését, a kijelölt közeli patika megjelenítését és módosítását, a rendszerszintű keresést, valamint a felhasználói fiókműveleteket.

##### 4.0.1.1. Fő navigációs linkek
   - **Elemet tartalmazó menüpontok:** `Irányítópult` (`/dashboard`), `Gyógyszerek` (`/gyogyszerek`), `Gyógyszertárak` (`/gyogyszertarak`), `BENU Képzési Program` (`/kepzesek`).
   - **Adminisztráció menüpont (`/admin/users`):** Kizárólag `Admin` szerepkörrel rendelkező felhasználóknak jelenik meg a navigációs sávban.

##### 4.0.1.2. Közeli Patika Kijelző (Preferált Patika)
   - **Megjelenés:** Ha a felhasználó beállított preferált patikát, annak neve és helyszín ikonja látható a fejlécben.
   - **Interakció:** A gombra kattintva felugrik a teljes képernyős **Patikaválasztó Modális Ablak** (`PharmacyFinder`), ahol a felhasználó térképről vagy listából új közeli patikát jelölhet ki vagy módosíthatja a meglévőt.

##### 4.0.1.3. Mentett Gyógyszerek Gyorslista (Könyvjelző Ikon)
   - **Felületi elem:** Könyvjelző ikon jelzőjelvénnyel (badge counter).
   - **Számláló jelvény:** Megjeleníti a felhasználó által mentett gyógyszerek aktuális darabszámát.
   - **Lenyíló panel (Dropdown):**
     - Megjeleníti a mentett gyógyszerek listáját: Terméknév, TK-szám, és színessel kódolt Státusz címke (`Elérhető` - zöld, `Készlethiány` - sárga, `Megszűnt` - piros).
     - Bármelyik termékre kattintva a rendszer közvetlenül az adott gyógyszer adatlapjára navigál (`/gyogyszerek/adatlap?tk=[tkSzam]`).
     - Ha nincs mentett gyógyszer, a panel a `"Nincs mentett gyógyszered."` szöveget mutatja.
   - **"Összes megtekintése" gomb:** Átirányít a mentett kedvencek részletes profiloldalára (`/profile/favorites`).

##### 4.0.1.4. Felhasználói Profil Menü (Avatár)
   - **Felületi elem:** Monogramos avatár kör (a felhasználó nevének első két kezdőbetűjével, pl. `"KÍ"`).
   - **Lenyíló opciók:**
     - Fejlécben a bejelentkezett felhasználó teljes neve.
     - `"Profil beállítások"` -> átirányítás a profiloldalra (`/profile`).
     - `"Kijelentkezés"` -> azonnal kijelentkezteti a felhasználót és visszanavigál a bejelentkezési oldalra (`/login`).

##### 4.0.1.5. Mobil Hamburger Menü
   - Kisebb kijelzőméret (mobil) esetén a navigációs linkek összecsukódnak egy hamburger menü gomb mögé.

#### 4.0.2. Globális Lábléc (Footer) Modul

A portál alján található központi lábléc (Footer), amely minden bejelentkezett és nyilvános oldalon megjelenik. Elsődleges célja a weboldal aktuális szoftververziójának kijelzése, a fő modulok gyors navigációja, valamint a jogi és szerzői nyilatkozatok biztosítása.

##### 4.0.2.1. Rendszerazonosító és Márka jelzés
   - **Megjelenés:** BENUvény Orvosi Portál logó és megnevezés, valamint a portál rövid szakmai leírása.

##### 4.0.2.2. Verzió Kijelző Badge
   - **Megjelenés:** Letisztult szöveges kijelző (pl. `v6.1.0`), amely a weboldal aktuális szoftververzióját mutatja.
   - **Lábléc alsó sáv:** A szerzői jogi nyilatkozat mellett is megjelenik a verziószám (`Verzió: v6.1.0`).

##### 4.0.2.3. Navigációs Gyorshivatkozások
   - Hivatkozások az Irányítópult (`/dashboard`), Gyógyszerkereső (`/gyogyszerek`), Gyógyszertárak (`/gyogyszertarak`) és BENU Képzés (`/kepzesek`) modulokra.

---

### 4.1. Irányítópult (Dashboard)

A bejelentkezést követő nyitóoldal. Gyors áttekintést nyújt a piaci gyógyszer-státuszváltozásokról, a kiválasztott preferált patika állapotáról és az aktuális képzésekről.

**Útvonal:** [https://bvo.uneb.hu/dashboard](https://bvo.uneb.hu/dashboard)

#### 4.1.1. Időszak Választó (Time Period Selector)
   - **Felületi elem:** Gombválasztó fülek.
   - **Választható opciók:** `1 nap`, `7 nap`, `30 nap`.
   - **Alapértelmezett érték:** `1 nap`.
   - **Működés:** Az itt kiválasztott időintervallum alapján frissülnek az Irányítópulton látható statisztikai mutatószámok és a legutóbbi készletváltozások listája.

#### 4.1.2. Készletváltozások Összegző Panel
   - Egyetlen összefoglaló kártya, amely kiírja a kiválasztott időszak összes státuszváltozásának darabszámát (pl. `"Mai nap változásai: 12 db"`).
   - A kártyán belül három kattintható előszűrő hivatkozás található:
     - **Megszűnt darabszám:** Kattintásra a Gyógyszerlistára navigál pre-szűrve (`/gyogyszerek?status=Megszűnt&lastUpdate_from=...`).
     - **Hiány darabszám:** Kattintásra a Gyógyszerlistára navigál pre-szűrve (`/gyogyszerek?status=Készlethiány&lastUpdate_from=...`).
     - **Elérhető darabszám:** Kattintásra a Gyógyszerlistára navigál pre-szűrve (`/gyogyszerek?status=Elérhető&lastUpdate_from=...`).

#### 4.1.3. Legutóbbi Státuszváltozások Táblázata
   - **Oszlopok:** `Státusz` (színkódolt badge), `Név` (gyógyszer kereskedelmi neve), `Dátum` (utolsó frissítés időpontja). (TK-szám oszlop a táblázatban nincs).
   - **Interakció:** Bármely gyógyszersorra kattintva a rendszer átirányít az adott [Gyógyszer Adatlapjára](#422-gyógyszer-adatlap).
   - **"Összes változás" link:** Átirányít a gyógyszerlistára utolsó frissítés szerint csökkenő sorrendbe rendezve.

#### 4.1.4. Közeli Patika Modul
   - **Ha van kiválasztott preferált patika:** Megjeleníti a patika nevét, az időszaki statisztikai összesítőt (pl. `"X db újra készleten"`, `"Y db elfogyott"` — mindkettő kattintható hivatkozás, amely előszűrt gyógyszerlistára visz), valamint a patika legutóbbi N készletváltozásának táblázatát.
   - **Ha nincs kijelölt preferált patika:** Egy interaktív térképes modul jelenik meg tájékoztató szöveggel és a patikakereső oldalra mutató hivatkozással.

#### 4.1.5. Képzési Program Promóciós Modul
   - 6 legújabb szakmai kurzus listája kategória-jelvénnyel (`Akkreditált`, `Gyártói`, `Eladásösztönző`), becsült időtartammal (`X perc`) és tartalomtípus ikonnal (`Videó` / `PDF`).
   - `"Összes képzés megtekintése"` link: közvetlen navigáció a [Képzési Programba](#441-képzések-főoldal).

---

### 4.2. Gyógyszer Nyilvántartás

#### 4.2.1. Gyógyszer Lista Oldal

A portál központi kereső- és szűrőfelülete a gyógyszerkészítmények táblázatos böngészésére.

**Útvonal:** [https://bvo.uneb.hu/gyogyszerek](https://bvo.uneb.hu/gyogyszerek)

A listaoldalon nincs különálló felső fő keresőmező vagy státusz legördülő; a keresés és szűrés a **táblázat fejléc alatti szűrősorán**, a **gyorsgombokon**, vagy **URL-paramétereken** keresztül történik.

##### 4.2.1.1. Oszlopfejléces Rendezés (Sorting)
   - A táblázat rendezhető oszlopainak fejlécére kattintva a sorrend ciklikusan változik: **Növekvő (asc) → Csökkenő (desc) → Rendezés törlése (null)**.
   - Az aktuális rendezési irányt **▲ (növekvő)** vagy **▼ (csökkenő)** nyilak jelzik az oszlopfejléc mellett.

##### 4.2.1.2. Fejléc alatti Per-oszlop Szűrősor
   - A táblázat oszlopfejlécei alatt egy dedikált szűrősor található minden látható oszlophoz:
     - **Szabadszöveges szűrőmezők:** Egysoros `"Szűrés..."` beviteli mezők a TK-szám, Terméknév, Hatóanyag, Kiszerelés, Gyártó, Csomagolás, Kiadhatóság stb. oszlopokhoz. Élő szűrést végeznek.
     - **Státusz Oszlopszűrő (Select):** Legördülő menü az alábbi opciókkal: `Mindegy`, `Elérhető`, `Készlethiány`, `Megszűnt`.
     - **Közeli Patika Készlet Oszlopszűrő (Select):** Legördülő menü az alábbi opciókkal: `Mindegy`, `Elérhető`, `Nem elérhető`. (Csak beállított preferált patika esetén aktív).
     - **Dátumtartomány Szűrőpár (Utolsó frissítés és Közeli patika frissítve oszlopok):** Dátumválasztó mezőpár (`Dátumtól` és `Dátumig` formátumban: `ÉÉÉÉ.MM.NN`).
     - **"Szűrők törlése":** A szűrőmezők tartalmának kiürítésével a szűrés visszaáll.

##### 4.2.1.3. Automatikus Oszlopmegjelenítés
   - Preferált patika beállításakor a táblázat automatikusan bekapcsolja a `Közeli patika` (készletstátusz) és a `Közeli patika frissítve` (státusz frissítés időpontja) oszlopokat.

##### 4.2.1.4. Közeli Patikában Elérhető Gyorsgomb
   - Gomb a lista felett: `"Közeli patikában elérhető"`. Bekapcsolva kizárólag a kijelölt gyógyszertárban raktáron lévő készítményeket mutatja.

##### 4.2.1.5. Mentett Gyógyszerek Gyorsgomb
   - Gomb a lista felett: `"Mentett gyógyszerek"`. Bekapcsolva kizárólag a könyvjelzővel megjelölt termékeket mutatja.

##### 4.2.1.6. Mélylinkelés (URL Paraméterek)
   - A lista állapota teljes mértékben hivatkozható URL-ből az alábbi paraméterekkel: `search`, `status`, `nearbyOnly`, `sort`, `order`, `lastUpdate_from`, `lastUpdate_to`, `nearbyPharmacyStock`. Ezt használják az Irányítópultról átmutató linkek is.

##### 4.2.1.7. Nézet Testreszabása Panel (Oszlopbeállítások és Átrendezés)
   - **Gomb:** `"Nézet"`.
   - **Oszlopok ki/bekapcsolása:** A felugró panelen jelölőnégyzetekkel tetszőlegesen ki- és bekapcsolhatók a táblázat oszlopai. A beállítások megőrződnek a böngésző helyi tárolójában.
   - **Oszlopok Drag & Drop Átrendezése:** A táblázat oszlopai a fejlécnél található fogantyú ikon (`drag_indicator`) megragadásával egérrel szabadon átrendezhetők. A `Műveletek` oszlop mindig rögzítve az utolsó helyen marad.

##### 4.2.1.8. Találatszám Címsor és Üres Állapot
   - A lapfejlécben látható az aktuálisan szűrt találatok száma: `"Gyógyszerek (N termék)"`.
   - Ha nincs találat, a táblázatban a `"Nem található a keresésnek megfelelő gyógyszer."` üzenet jelenik meg.

##### 4.2.1.9. Műveletek Oszlop (Sorról sorra)
   - **Kedvencnek jelölés (Könyvjelző ikon):** Kattintásra menti a gyógyszert. Ha a gyógyszer eltávolításakor ahhoz aktív készletértesítés kapcsolódik, a rendszer megerősítő modális ablakot jelenít meg:
     - *Üzenet:* `"A gyógyszer eltávolításával a kapcsolódó készletértesítés is törlődik. Biztosan folytatja?"`
     - *Opciók:* `Igen, törlöm` / `Mégse`.
   - **Értesítés kérése (Harang ikon):** Kattintásra feliratkoztat a készletváltozásokra (a termék automatikusan a mentettek közé is bekerül).
   - **Részletek gomb:** Átirányít a gyógyszer adatlapjára.

##### 4.2.1.10. Lapozó (Pagination) Specifikáció
    - Fix **24 elem/oldal** jelenik meg (nincs sor-elemszám választó).
    - **Vezérlők:** `«` (Előző oldal), számozott oldalgombok `...` jelekkel a távolabbi oldalaknál, `»` (Következő oldal). (Nincs külön Első/Utolsó gomb).
    - **Mobil nézet:** Mobilon az oldalszámok helyett kompakt `X / Y` kijelzés látható.

#### 4.2.2. Gyógyszer Adatlap

Egy konkrét gyógyszer részletes szakmai adatlapja.

**Útvonal:** `https://bvo.uneb.hu/gyogyszerek/adatlap?tk=[tkSzam]`  
*(Példa: [https://bvo.uneb.hu/gyogyszerek/adatlap?tk=OGYI-T-8898%2F01](https://bvo.uneb.hu/gyogyszerek/adatlap?tk=OGYI-T-8898%2F01))*

##### 4.2.2.1. Törzsadatok Megjelenítése
   - Az adatlapon megjelenített törzsadatok: **Hatóanyag (INN)**, **Márkanév**, **ATC-kód**, **Gyártó**, **Kiszerelés**, **Utolsó frissítés időpontja**.
   - *(A Csomagolási részletek, Kiadhatósági alcsoport, Biztonsági jellemzők, Engedélyezés dátuma adatok kizárólag a Gyógyszer nyilvántartás táblázatának testreszabható oszlopaiban érhetők el).*
   - **INN (Hatóanyag) Interakció:** A hatóanyag kattintható hivatkozás. Rákattintva a rendszer visszanavigál a gyógyszerlistára, automatikusan az adott hatóanyagra szűrve.

##### 4.2.2.2. Országos Készlet-összesítő Blokk
   - **Elérhető státusznál:** Megjeleníti az elérhetőségi összesítést: `"N gyógyszertárban elérhető: Készleten X patikában / Rendelésre 1-2 munkanapon belül Y patikában"`. Két külön **"Megnézem hol"** gombbal megnyitható a raktáron lévő, illetve a rendelést fogadó patikák térképes modális nézete.
   - **Készlethiány státusznál:** Kizárólag a `"Készleten X patikában"` sor jelenik meg a megfelelő készletellenőrző gombbal.

##### 4.2.2.3. Közeli Patika Készletjelző Badge
   - Az adatlapon megjelenik egy kiemelt jelvény: `"Közeli patikában elérhető / nem elérhető"` felirattal, a preferált patika nevével és a frissítés időpontjával.

##### 4.2.2.4. Interaktív Műveleti Gombok (Adatlap fejléc)
   - **Kedvencnek jelölés (Könyvjelző ikon):** Mentés a mentett listára / eltávolítás (ugyanazzal a megerősítő dialoggal, mint a listán).
   - **Értesítés kérése (Harang ikon):** Készletértesítés be- és kikapcsolása.

##### 4.2.2.5. Készlethiány Részletes Kártya (kizárólag Készlethiány státusznál)
   - *Hiány kezdete:* Dátum (pl. `2026.07.15`).
   - *Hiány várható vége:* Dátum (pl. `2026.09.30`, ha nincs megadva: `"Folyamatban"`).
   - *Hiány oka:* Szöveges megnevezés (ha nincs megadva: `"Szakmai ok"`).
   - *Pótlási javaslat:* Szakmai javaslat a pótlásra.
   - *Adatforrás háttér-ellenőrzés:* A készlethiányi adatok megbízhatóságát a LogiNet Middleware által közvetített BENU hálózati adatok és az OGYÉI hatósági nyilvántartás (`shortage_lista.csv`) összevetése biztosítja (az OGYÉI CSV nyers adatai egyelőre nem kerülnek közvetlenül megjelenítésre a felületen).

##### 4.2.2.6. Helyettesítő Termékek Ajánlója
   - Azonos hatóanyagú (INN) elérhető készítmények listája kártyás elrendezésben. (A kód kizárólag azonos hatóanyag alapján ajánl).

##### 4.2.2.7. Státusz Történet Idővonal
   - Időrendi lista a gyógyszer korábbi elérhetőségi változásairól (Dátum, Régi státusz → Új státusz).

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

### 4.4. Képzési Program

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

**Útvonal:** [https://bvo.uneb.hu/login](https://bvo.uneb.hu/login)

A bejelentkezési felület háromféle belépési módot kínál a fejlécben lévő fülek segítségével:

##### 4.6.1.1. Jelszavas bejelentkezés (alapértelmezett)
   - *E-mail cím:* Egysoros email mező. Példa: `demo@example.com`, `admin@example.com`. Kötelező.
   - *Jelszó:* Maszkolt jelszómező. Példa: `vény123`. Kötelező.
   - *"Elfelejtett jelszó?" link:* Átirányítás a `/forgot-password` oldalra.
   - *"Bejelentkezés" gomb:* Beküldéskor ellenőrzi az adatokat.

##### 4.6.1.2. Passkey biometrikus bejelentkezés (1-kattintásos kényelmi funkció)
   - *"Belépés Passkey-vel" gomb:* Megnyomása után szimulálja a biometrikus megerősítést (Touch ID / Face ID / Windows Hello) és közvetlenül az Irányítópultra navigál.

##### 4.6.1.3. E-mail kódos bejelentkezés (Magic Code)
   - *E-mail cím mező:* Szabványos email mező.
   - *"Egyszeri belépőkód küldése" gomb:* Kiküldi a 6 jegyű belépési kódot és átvált a 2FA nézetre.

#### 4.6.2. Kétfaktoros Azonosítás (2FA) Igazolási Felület

Jelszavas belépés vagy e-mail kód kérése után (ha a 2FA aktív és az eszköz nincs megjegyezve) az alábbi felület jelenik meg:

- **6-jegyű OTP kód mező:** Számszerű beviteli mező (pl. `123456`).
- **"Megbízható eszköz megjegyzése (30 napig)" jelölőnégyzet:** **Alapértelmezetten be van pipálva**. Bejelölve a rendszer 30 napig nem kér 2FA kódot az adott böngészőben.
- **Demó kód kijelzés:** A felületen látható a teszt kód (`123456`).

#### 4.6.3. Elfelejtett Jelszó Oldal

**Útvonal:** [https://bvo.uneb.hu/forgot-password](https://bvo.uneb.hu/forgot-password)

- *E-mail cím mező:* Szabványos email mező.
- *"Belépési kód küldése" gomb:* Kattintásra a felületen megjelenik a generált 6 jegyű belépési kód prototípus gépelési tájékoztatóval (`"Prototípus mód: ... itt láthatja a belépési kódot"`).
- *Információs alert:* Tájékoztatja a tesztelőt, hogy a prototípusban a generált kóddal nem lehet továbbhaladni, a fix jelszót kell használni.
- *Hivatkozások:* `"Vissza a bejelentkezéshez"` és `"Mégis emlékszem a jelszavamra"`.

#### 4.6.4. Jogosultságkezelés és Munkamenet Biztonság
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
