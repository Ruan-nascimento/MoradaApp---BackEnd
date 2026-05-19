// email precisa ter @ e .
export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// senha precisa ter pelo menos 6 caracteres
export const validatePassword = (password: string) => {
    return password.length >= 6;
}
// nome precisa ter pelo menos 3 caracteres
export const validateName = (name: string) => {
    return name.length >= 3;
}