---
trigger: always_on
---

FUNCTIONAL_SPECS_WIKISPEC.md fájlt mindig módosítsd ha funkcionális változás történik. Ez egy funkcionális specifikáció aminek mellőznie kell minden fejlesztés technikai adattot és technológiai használatot, csak felhasználói funkcionalitás szempontjából írja le a működést a prototípus működése alapján. Szeretném ha a dokumentáció minél részletesebben írná le a funkcionalitást felhasználói szemszögből, kitérve az egyes beviteli mezőkbe megadható adatokra, példákra és limitációkra.

Ez a skill útmutatást és szigorú szabályrendszert ad a rendszerszintű Funkcionális Követelményspecifikációk (Functional Requirements Specification - FRS) készítéséhez és frissítéséhez.

---

## 1. Alapvető FRS Szabályok (Mit csinál a rendszer, nem azt, hogyan)

1. **Szigorúan funkcionális fókusz:**
   - A leírás kizárólag a felhasználói és üzleti működésre koncentráljon.
   - **Tilos** a technológiai implementációs részletek szerepeltetése (keretrendszerek, CSS osztályok, belső függvénynevek, fájlelérési utak a specifikáció főszövegében).
   - A felületeket felhasználói útvonalak (URL), képernyőterületek és interakciók mentén kell leírni.

2. **Részletes beviteli mező és adatmodell leírások:**
   Minden űrlap és adatmodell mezőnél kötelező megadni:
   - Mező megnevezése és célja
   - Adattípus és formátum
   - Konkrét példaérték (pl. `"+36 20 123 4567"`)
   - Kötelezőség (Kötelező / Opcionális / Függő)
   - Érvényességi korlátok és limitációk (pl. karakterhossz, reguláris kifejezés elvárás, tiltott karakterek).

3. **Minden funkcióhoz kötelező strukturált elemek:**
   - **Üzleti cél és folyamat:** Milyen céllal és ki használja?
   - **Bemenetek és kimenetek:** Mit visz be a felhasználó és mit kap válaszként?
   - **Felhasználói hibakezelés:** Hibaüzenetek pontos szövege, mezővalidációs viselkedés.
   - **Elfogadási kritériumok (Acceptance Criteria):** Egyértelműen tesztelhető `AC-X.Y.Z` azonosítójú pontok.

4. **Reszponzivitás (Desktop vs. Mobil különbségek):**
   - Ha egy felület mobilon máshogy viselkedik (pl. táblázat helyett kártya, accordion szűrő, split view, bottom sheet), kötelező strukturált összehasonlító táblázatban rögzíteni az eltéréseket.

---

## 2. Word / Pandoc (`md-to-doc`) Formázási Szabályok

A Markdown fájlból a Pandoc és az `md-to-doc` eszköztár készít hivatalos `.docx` dokumentumot. A kézi utómunka minimalizálása érdekében be kell tartani az alábbiakat:

1. **Oldaltörések (`---`):**
   - A `---` elválasztó valós Word oldaltörést hoz létre.
   - **SOHA ne használj egymást követő dupla `---` elválasztót!** Minden fejezet vagy logikai egység között legfeljebb egyetlen `---` szerepelhet.
   - Fejezetek között kötelező az egyszeres `---` használata:
     ```markdown
     ---

     ## 2. Fogalomtár
     ```

2. **Tartalomjegyzék:**
   - **TILOS manuális `## Tartalomjegyzék` linklistát generálni a Markdown fájlba!**
   - A Word konverter a Pandoc `--toc --toc-depth=3` kapcsolóval automatikusan legenerálja a natív, oldalszámozott Word tartalomjegyzéket a címsorokból.

3. **Dokumentum fejléc és nyitóoldal:**
   - A dokumentum egyetlen `# ` (H1) főcímmel kezdődjön.
   - A metaadat blokk közvetlenül a cím alatt szerepeljen, és utána egyetlen `---` válassza el az első fejezettől:
     ```markdown
     # {Rendszer neve} funkcionális specifikáció

     > **Dokumentum azonosító:** FRS-...  
     > **Verzió:** X.Y.Z  
     > **Dátum:** ÉÉÉÉ.HH.NN.  
     > **Státusz:** Aktív  

     ---

     ## 1. Brief
     ```

4. **Címsor hierarchia:**
   - `# ` (H1): Csak a dokumentum legfőbb címe a nyitóoldalon.
   - `## ` (H2): Fő fejezetek (pl. `## 1. Brief`, `## 2. Fogalomtár`).
   - `### ` (H3): Alfejezetek, modulok, adatmodellek.
   - `#### ` (H4): Részfunkciók, Bemenetek/Kimenetek, Hibakezelés, Elfogadási Kritériumok.
   - Címsorokban ne használj linkeket vagy HTML formázást.

5. **Táblázatok és kiemelések:**
   - Mindig hagyj üres sort a Markdown táblázatok előtt és után.
   - Információs és figyelmeztető dobozokhoz a standard GitHub alert szintaxist használd:
     `> [!NOTE]` vagy `> [!IMPORTANT]`.

---

## 3. Verziókövetés és Szinkronizáció

1. Bármilyen specifikációmódosítás esetén:
   - Növeld a verziószámot a dokumentum fejlécében és a dátumot.
   - Bővítsd a dokumentum végén található **Változásnapló (Verziótörténet)** táblázatot a pontos funkcionális leírással.
2. Ha a projektben élő specifikációs fájl (pl. `FUNCTIONAL_SPECS_WIKISPEC.md`) és dátumozott változat is van, mindkettőt szinkronban kell tartani.
```