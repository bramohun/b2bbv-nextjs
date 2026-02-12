/**
 * Formats an ISO date string to YYYY-MM-DD HH:MM
 * @param dateStr ISO date string
 * @returns Formatted date string or '-' if input is invalid
 */
export function formatDate(dateStr: string | undefined | null): string {
    if (!dateStr) return '-';

    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '-';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
        console.error('Error formatting date:', e);
        return '-';
    }
}

/**
 * Deterministic mock function to simulate stock availability in a specific pharmacy.
 * @param medicineId Medicine ID (tkSzam)
 * @param pharmacyId Pharmacy ID
 * @returns boolean True if available, false otherwise
 */
export function isAvailableInPharmacy(medicineId: string, pharmacyId: string): boolean {
    if (medicineId.startsWith('MOCK-')) {
        const index = parseInt(medicineId.replace('MOCK-', ''));
        // 0-15 are Shortage/Discontinued in data.ts, so they should be "Not Available" in pharmacy
        // 16+ are Available
        return index >= 16;
    }

    const str = `${medicineId}-${pharmacyId}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % 2 === 0; // 50% chance
}
/**
 * Deterministic mock function to simulate status update time for a specific medicine in a specific pharmacy.
 * @param medicineId Medicine ID (tkSzam)
 * @param pharmacyId Pharmacy ID
 * @param baseDate The product's general last update date
 * @returns Formatted date string
 */
export function getNearbyPharmacyStatusUpdate(medicineId: string, pharmacyId: string, baseDate: string): string {
    const str = `${medicineId}-${pharmacyId}-status`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }

    // Use hash to create a date that is up to 30 days older than now, 
    // but definitely somewhat related to the baseDate or just recent.
    const now = new Date();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const offset = Math.abs(hash) % thirtyDaysInMs;
    const updateDate = new Date(now.getTime() - offset);

    return formatDate(updateDate.toISOString());
}
