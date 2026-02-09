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
