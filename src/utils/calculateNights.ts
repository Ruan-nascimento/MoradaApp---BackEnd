export function calculateNights(checkIn: Date, checkOut: Date): number {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
}
