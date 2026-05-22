export function makeEmail(prefix = "user") {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);

    return `${prefix}-${timestamp}-${random}@email.com`;
}