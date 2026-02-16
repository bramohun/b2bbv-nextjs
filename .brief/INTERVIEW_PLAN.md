# Interjú Terv - Orvosi Portál Rendszer Koncepció Validálás

**Célcsoport:** Orvosok (Háziorvosok, Szakorvosok)
**Időtartam:** kb. 60 perc
**Cél:** Az igények felmérése és annak validálása, hogy a tervezett rendszer valós megoldást nyújt-e a mindennapi problémákra. Nem a kezelőfelület tesztelése a cél, hanem a *koncepció* és az *értékajánlat* vizsgálata.

## 1. Bevezetés (5 perc)
*Cél: A légkör megteremtése, bizalomépítés, célok tisztázása.*

*   **Üdvözlés és Bemutatkozás:** [Interjúvoló neve], [Szerepkör].
*   **A beszélgetés célja:** Egy új orvosi támogató eszköz koncepcióján dolgozunk. Szeretnénk megérteni, hogy az Ön munkájában ez valódi segítséget jelentene-e. Nem vizsgáztatjuk Önt, hanem a rendszer hasznosságát keressük.
*   **Módszer:** Megmutatunk egy működő prototípust (én fogom kezelni, vagy Ön is kipróbálhatja, ahogy kényelmesebb), és átbeszéljük az egyes funkciók létjogosultságát.
*   **Technikai részletek:** Időtartam, (opcionális hangfelvétel), bármikor megállhatunk.

## 2. Igényfelmérés és Kontextus (15 perc)
*Cél: Mélyebbre ásni a jelenlegi fájdalompontokban a gyógyszerellátás terén.*

1.  **Napi rutin és gyógyszerfelírás:**
    *   Amikor felír egy gyógyszert, milyen gyakran bizonytalan abban, hogy a beteg ki tudja-e váltani?
    *   Milyen gyakran történik meg, hogy a beteg visszajön (vagy telefonál), mert hiánycikk a felírt készítmény? Ez mennyi plusz munkát jelent Önnek?
2.  **Jelenlegi megoldások és frusztrációk:**
    *   Jelenleg hogyan tájékozódik a hiánycikkekről? (OGYÉI lista, patikus ismerős, kollégák?)
    *   Mennyire bízik ezekben az információkban? Mennyire naprakészek?
    *   Hogyan ajánl helyettesítő készítményt, ha az eredeti nem elérhető?
3.  **Betegút menedzsment:**
    *   Szokott-e konkrét patikát javasolni a betegeknek? Miért (vagy miért nem)?
    *   Mennyire fontos Önnek, hogy a beteg a rendelőhöz közeli patikában váltsa ki a receptet?

## 3. Megoldás Bemutatása és Validáció (30 perc)
*Cél: A prototípus bemutatása azzal a céllal, hogy reakciókat váltsunk ki: "Ez hasznos lenne?" vs. "Ezt sosem használnám".*
*Módszer: Mutassuk be a szituációt a képernyőn, és kérdezzük meg a véleményét.*

**I. Irányítópult (Dashboard) - A "Reggeli kávé" teszt**
*   *Mutassuk meg a Dashboard-ot.*
*   "Képzelje el, hogy reggel, rendelés előtt megnyitja ezt az oldalt. Itt látja egy helyen az elmúlt 24 óra legfontosabb változásait: mik lettek hiánycikkek, mik érhetők el újra."
*   **Kérdés:**
    *   "Van olyan információ itt, ami miatt Ön máshogy kezdené a napját?"
    *   "Releváns Önnek látni a *készletváltozásokat* így listázva?"

**II. Gyógyszerkeresés - A "Biztonságos felírás" teszt**
*   *Demo: Keressünk rá egy ismert hiánycikkre (pl. Augmentin), és mutassuk meg a találati listát a státuszjelzőkkel.*
*   **Kérdés:**
    *   "Ha látja ezt a piros 'Hiánycikk' jelzést felírás előtt, az befolyásolná a döntését? Vagy ettől függetlenül felírná?"
    *   "Mennyire hiszi el ennek az adatnak a hitelességét?"
    *   "Ez a felület gyorsabb/jobb információt ad, mint amit most használ?"

**III. Helyettesítés és Patikakeresés - A "Beteg elégedettség" teszt**
*   *Demo: Nyissuk meg a gyógyszer adatlapját, mutassuk a 'Hasonló termékek' listát és a 'Megnézem hol' térképet.*
*   "A rendszer itt azonnal felajánlja a helyettesítőket, és megmutatja, melyik patikában van készleten *most*."
*   **Kérdés:**
    *   "Merné ez alapján a lista alapján módosítani a terápiát?"
    *   "Szokott a beteggel ilyesmiről egyeztetni, hogy 'Menjen a X utcai patikába, mert ott van'?"
    *   "Lát ebben értéket, vagy ez már túl sok információ?"

**IV. Közeli Patika beállítása**
*   *Mutassuk meg a funkciót.*
*   "Beállíthat egy vagy több kedvenc patikát (pl. a rendelő melletti), aminek a készletét kiemelten látja."
*   **Kérdés:** Ez életszerű? Van 'preferált' patika, vagy a betegek teljesen vegyesen járnak mindenhová?

**V. Szakmai Fórum (Opcionális)**
*   *Demo: Anonim kérdésfeltevés lehetősége.*
*   **Kérdés:** Hiányzik Önnek egy zárt, orvosi szakmai fórum? Használna ilyet, vagy a jelenlegi csatornák (Facebook csoportok, stb.) megfelelnek?

## 4. Összegzés és Értékajánlat (10 perc)
*Cél: A "Must have" vs. "Nice to have" eldöntése.*

1.  **Legfőbb érték:**
    *   "A látottak alapján mi az az **egyetlen dolog**, ami miatt hetente legalább egyszer megnyitná ezt a rendszert?" (Ha nincs ilyen, az is fontos válasz!)
2.  **Fizetési hajlandóság / Modell:**
    *   "Ha ez a rendszer létezne és hibátlanul működne, látja értelmét, hogy a praxisa vagy az intézmény fizessen érte? Vagy ezt alapvető szolgáltatásnak tekinti?"
3.  **Visszatartó erők:**
    *   "Mi lenne az a tényező (pl. bonyolultság, lassúság, bizalom hiány), ami miatt biztosan NEM használná?"

## 5. Lezárás (5 perc)
*   Köszönjük a beszélgetést és az őszinte véleményt.
*   (Opcionális) Továbbkövetés lehetősége.
