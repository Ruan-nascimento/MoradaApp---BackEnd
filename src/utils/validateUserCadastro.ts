export function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validatePassword(password: string) {
    return password.length >= 6;
}

export function validateName(name: string) {
    return name.trim().length >= 3;
}