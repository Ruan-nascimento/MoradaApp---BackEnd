export function normalizeCheckDates(checkIn: string, checkOut: string): { checkInDate: Date; checkOutDate: Date } {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    checkInDate.setHours(12, 0, 0, 0);
    checkOutDate.setHours(12, 0, 0, 0);
    return { checkInDate, checkOutDate };
}
