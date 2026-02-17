# B2B Betegútvezérlő Next.js Projekt

Ez a dokumentum tartalmazza a projekt telepítéséhez és futtatásához szükséges információkat, valamint a teszteléshez használható bejelentkezési adatokat.

## Telepítés és Futtatás

A projekt a `web` könyvtárban található. A futtatáshoz kövesd az alábbi lépéseket:

1.  **Lépj be a projekt könyvtárba:**
    ```bash
    cd web
    ```

2.  **Függőségek telepítése:**
    ```bash
    npm install
    # vagy
    yarn install
    # vagy
    pnpm install
    ```

3.  **Fejlesztői szerver indítása:**
    ```bash
    npm run dev
    # vagy
    yarn dev
    # vagy
    pnpm dev
    ```

4.  **Alkalmazás megnyitása:**
    Nyisd meg a böngészőben a [http://localhost:3000](http://localhost:3000) címet.

## Bejelentkezési Adatok (Demo)

A teszteléshez az alábbi előre definiált felhasználói fiókok állnak rendelkezésre.  
**Minden felhasználó jelszava:** `vény123`

### 1. Adminisztrátor
- **Email:** `admin@example.com`
- **Szerepkör:** Admin
- **Jogosultságok:** Teljes hozzáférés a rendszerhez.

### 2. Orvos (Felhasználó)
- **Email:** `demo@example.com`
- **Szerepkör:** User
- **Státusz:** Aktív
- **Szakterületek:** Háziorvos, Belgyógyász

### 3. Inaktív Felhasználó
- **Email:** `teszt@example.com`
- **Szerepkör:** User
- **Státusz:** Inaktív (Bejelentkezés tiltva)
