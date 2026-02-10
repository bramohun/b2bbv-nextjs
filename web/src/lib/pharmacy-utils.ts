import { Pharmacy } from '@/types';

/**
 * Calculates current opening status and formats today's opening hours
 * @param pharmacy Pharmacy object
 * @returns Object with isOpen boolean, status, status text, and formatted hours
 */
export function getPharmacyOpeningStatus(pharmacy: Pharmacy) {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const openKey = `${dayNames[currentDay]}Open` as keyof Pharmacy;
    const closeKey = `${dayNames[currentDay]}Close` as keyof Pharmacy;

    const openTime = pharmacy[openKey] as string;
    const closeTime = pharmacy[closeKey] as string;

    if (!openTime || openTime === 'Zárva') {
        return {
            isOpen: false,
            status: 'closed' as const,
            statusText: 'Zárva',
            hoursDisplay: 'Ma zárva'
        };
    }

    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const [openHours, openMinutes] = openTime.split(':').map(Number);
    const openTimeMinutes = openHours * 60 + openMinutes;

    let closeTimeMinutes = 1440; // End of day in minutes
    if (closeTime) {
        const [closeHours, closeMinutes] = closeTime.split(':').map(Number);
        closeTimeMinutes = closeHours * 60 + closeMinutes;
    }

    const isOpen = currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes;

    if (!isOpen) {
        return {
            isOpen: false,
            status: 'closed' as const,
            statusText: 'Zárva',
            hoursDisplay: closeTime ? `${openTime} - ${closeTime}` : openTime
        };
    }

    // Check if closing within 60 minutes
    const isClosingSoon = closeTimeMinutes !== 1440 && (closeTimeMinutes - currentTimeMinutes <= 60);

    return {
        isOpen: true,
        status: isClosingSoon ? 'closing_soon' as const : 'open' as const,
        statusText: isClosingSoon ? 'Hamarosan zár' : 'Nyitva',
        hoursDisplay: closeTime ? `${openTime} - ${closeTime}` : openTime
    };
}
