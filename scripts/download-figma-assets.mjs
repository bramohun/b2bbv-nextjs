/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - FIGMA ESZKÖZTÁR ÉS VEKTOR LETÖLTŐ SZKRIPT
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * Segédszkript a hivatalos Figma design rendszerben definiált ikonok, vektorok,
 * státuszjelzések és logók helyi letöltésére és gyorsítótárazására
 * a `web/public/assets/figma/` mappába. Biztosítja a prototípus offline és
 * fejlesztői MCP-független futtatását.
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Fejlesztőként és tesztelőként szeretném, ha a portál arculati elemei, ikonjai
 *   és státuszjelvényei minden környezetben azonnal és hiba nélkül betöltődnének.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Fejléc (Navbar) és Lábléc (Footer)
 * - Irányítópult (Dashboard), Gyógyszer lista és Gyógyszer adatlap felületek
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

const targetDir = path.resolve('web/public/assets/figma');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const assets = [
  '4730634439bfe6aed6a9bd8cc76d5c82b5ea3b77.svg', // Color & code logo
  'c5d9b22ba806bb52c15a398d9d8ee7ff7e067868.svg', // Status cancel / megszunt
  '8d5c6e13ab3c6173ee2bfff8d7a4bf3cc46bca63.svg', // Status check / elerheto
  '95a59bf06dc352f30740e8e75e9dc3eccfec6dd4.svg', // Status alert / hiany
  '6facf09639ce8f21ae7716fe32dc70d4159927dc.svg', // Chevron right
  '4e27e9eac7fd5012dd75d2aecd2f99138bc60523.svg',
  '20c251f28bbd764f633f36d5479376e289e29e65.svg',
  'c5cba43ddc5c0f652c0f9fe15ea05bf4b1cd49f3.svg',
  'be56dbd4d5465997bcb8e07e286d5004c737eb55.svg',
  'e7c7a97e2a14b6367b55e3ca6a81de0203e6676e.svg',
  '1cac7bfddabb91c60d23acb3a633b584aded0db0.svg',
  '6a49b7ce1fbf33d8d44ecf62f3da9fd4300d15c3.svg',
  'eff377806bd8f75819b3baee49d3732b3ff15102.svg',
  '69925bffa83e510dac4728574f0400096d5668e6.svg',
  'a94814c8cc379f7e9d54fbad6c622dd9b41b6087.svg', // Search icon
  'fbac0194bef5cfd022a9163982735ef9952d202c.svg', // Hospital pin
  'b9b1d3505bf8fc93b77461b483b8b862c2ab9c90.svg',
  '38bf5ad3ce1d1b2b21785ece01507074f555c665.svg', // Drug nav icon
  'b939d063c8680f9b8b986be7e1dede9d5990461e.svg', // Pharmacy nav icon
  '114e1e05e928444fa85b729449a28d0644a58c6a.svg', // Saved nav icon
  '0d0588996ac27669b9b31a8f76daf50d5aa19634.svg', // Profile nav icon
  '36fc6c1e01c20d652a08ee4fbe943277f9d9695e.svg',
  '33337a27e63c4ad80b11edd594af76b86c95b819.svg',
  'bbb8b289e0529c918f53d375fc26f245b777bd09.svg'  // Chevron down
];

for (const asset of assets) {
  try {
    const res = await fetch(`http://localhost:3845/assets/${asset}`);
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(targetDir, asset), buffer);
      console.log(`Saved: ${asset}`);
    } else {
      console.warn(`Failed ${asset}: ${res.status}`);
    }
  } catch (err) {
    console.error(`Error ${asset}:`, err.message);
  }
}
