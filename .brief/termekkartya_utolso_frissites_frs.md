# Funkcionális Követelményspecifikáció (FRS)
## Gyógyszer Termékkártya Konstans Frissítési Dátum és Azonosító Elrendezés

- **Érintett komponens / fájl:** `web/src/components/medicines/MedicineCard.tsx`
- **Kapcsolódó felület:** `/gyogyszerek` (Gyógyszerkereső oldal kártyás nézete mobil eszközökön vagy manuális nézetváltás esetén)
- **Verzió:** v1.8.2
- **Dátum:** 2026. október 21.

---

### 1. A Fájl Felelőssége és Rendeltetése
A [MedicineCard.tsx](file:///c:/Users/abramov.gabor/GitHub/b2bbv-nextjs/web/src/components/medicines/MedicineCard.tsx) komponens a BENU Vény Orvosi Portál központi gyógyszerkereső felületén a gyógyszerek ergonomikus, érintésbarát kártyás megjelenítéséért felel.
Alapértelmezetten ez jelenik meg minden 1024 képpontnál keskenyebb mobil vagy táblagép kijelzőn (helyszíni betegvizit, ambuláns rendelés), illetve asztali monitoron is, amennyiben a felhasználó a fejlécben lévő nézetváltó kapcsolóval a kártyás megjelenítést választja.

A komponens felel:
1. A készítmény nevének, országos készletstátuszának megjelenítéséért.
2. A kártya **jobb felső sarkában az utolsó adatszinkronizáció / frissítés pontos időpontjának** állandó, kiemelt kijelzéséért (`Utolsó frissítés: ÉÉÉÉ-HH-NN ÓÓ:PP`).
3. A kijelölt helyi referenciapatika elérhetőségi állapotának azonnali visszajelzéséért.
4. Az elsődleges szakmai adatok (hatóanyag, kiszerelés, gyártó, valamint az **Azonosító** [TK-szám]) azonnali, összecsukott állapotban is látható megjelenítéséért.
5. A másodlagos adatok (csomagolás, kiadhatóság, alcsoport, biztonsági elemek, engedély dátuma) helyben történő, oldalváltás nélküli lenyitásáért.
6. A közvetlen orvosi gyorsműveletekért (mentés a kedvencekhez, készlethiány-értesítés feliratkozás, részletes adatlap megnyitása).

---

### 2. Érintett Felhasználói Szerepkörök
- **Háziorvos / Szakorvos:** Betegvizit vagy távkonzultáció során az orvosnak azonnal látnia kell, mikor frissült az adat (közvetlenül a kártya fejlécében a státusz mellett), illetve receptíráskor kéznél kell lennie a törzskönyvi azonosítónak.
- **Rendelői Szakasszisztens:** Betegtájékoztatás vagy receptelőkészítés során gyorsan ellenőrzi a készletfrissesség idejét és a termékazonosítót.

---

### 3. Üzleti Folyamat és Vizuális Ergonómia

#### 3.1. Vizuális Hierarchia
- **Fejléc (Kiemelt státusz és frissesség):**
  - Bal oldalon: Piaci státuszjelvény (`Elérhető`, `Hiány`, `Megszűnt`) és a közeli patika indikátor.
  - Jobb oldalon: Finom kontúrral ellátott, diszkrét státuszcímke: `Utolsó frissítés: 2026-10-21 00:35`. Ezzel az orvos a készletállapot mellett közvetlenül érzékeli annak időbeli hitelességét.
- **Törzs (Készítmény adatok):**
  - Gyógyszernév (kattintható link az adatlapra).
  - Hatóanyag
  - Kiszerelés
  - Gyártó (ha elérhető)
  - **Azonosító:** A korábban fejlécben lévő TK-szám (pl. `OGYI-T-8898/01`) átkerült az elsődleges törzsadatok utolsó sorába, egységes kulcs-érték elrendezésben, rögzített betűszélességű (monospace) formátumban.
- **Lenyitható panel:**
  - Csomagolás, kiadhatóság, alcsoport, biztonsági elemek, engedély dátuma. (Sem az utolsó frissítés, sem az azonosító nem duplikálódik itt).

---

### 4. Bemenetek és Kimenetek

- **Bemenet:**
  - `medicine.lastUpdate`: ISO dátum string (pl. `"2026-10-21T00:35:00Z"`).
  - `medicine.tkSzam`: Törzskönyvi azonosító string (pl. `"OGYI-T-8898/01"`).
- **Kimenet:**
  - **Jobb felső sarok:** `Utolsó frissítés: 2026-10-21 00:35` szöveges címke `#62788f` színnel, `#f9f9fb` háttérrel és finom kerettel.
  - **Adattörzs alsó sora:** `Azonosító:` címke a bal oldalon, jobb oldalon a törzskönyvi szám monospaced, kiemelt színű (`#002664`) formázással.

---

### 5. Hibakezelés és Határesetek
- **Hiányzó frissítési dátum:** Ha nincs kitöltve a `lastUpdate`, az érték helyén `-` jelenik meg, elkerülve a törést.
- **Hosszú azonosító:** A törzsben lévő `Azonosító` mező `truncate` stílussal rendelkezik, így extrém hosszú azonosító esetén sem borítja fel a kártya elrendezését.
- **Keskeny képernyő (<360px):** A fejléc `flex-wrap justify-between` elrendezésének köszönhetően a státuszbadge és az utolsó frissítés címke szükség esetén elegánsan tördelődik.

---

### 6. Elfogadási Kritériumok (Acceptance Criteria)

- **AC-1:** A `/gyogyszerek` oldalon a gyógyszerkártya fejlécének jobb felső sarkában konstans látható az utolsó frissítés ideje `Utolsó frissítés: ÉÉÉÉ-HH-NN ÓÓ:PP` formátumban (pl. `Utolsó frissítés: 2026-10-21 00:35`).
- **AC-2:** A termék törzskönyvi azonosítója (`Azonosító:`) az elsődleges adattörzsben kap helyet, a Hatóanyag, Kiszerelés és Gyártó mezők után.
- **AC-3:** Az utolsó frissítés és az azonosító megjelenítése nem igényel semmilyen lenyitási műveletet; mindkét adat azonnal látható.
- **AC-4:** A „További adatok megjelenítése” panel kibontásakor sem az utolsó frissítés, sem az azonosító nem jelenik meg másodszor.
