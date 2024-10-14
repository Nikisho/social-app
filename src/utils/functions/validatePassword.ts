export default function validatePassword(password: string): boolean {
    // Regular expression to validate password
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  
    // Return true if the password matches the regular expression, else false
    return regularExpression.test(password);
}