export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export type PasswordRuleState = {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

export function getPasswordRuleState(value: string): PasswordRuleState {
  return {
    minLength: value.length >= 8,
    hasUppercase: /[A-Z]/.test(value),
    hasNumber: /\d/.test(value),
    hasSpecial: /[^A-Za-z0-9]/.test(value),
  };
}

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "El email es obligatorio.";
  if (!EMAIL_REGEX.test(email)) return "Ingresa un email valido.";
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "La contrasena es obligatoria.";
  if (!PASSWORD_REGEX.test(value)) {
    return "La contrasena debe tener minimo 8 caracteres, 1 mayuscula, 1 numero y 1 caracter especial.";
  }
  return undefined;
}

export function validateSpecialty(value: string): string | undefined {
  if (value.trim().length < 4) {
    return "La especialidad debe tener al menos 4 caracteres.";
  }
  return undefined;
}

export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value.trim()) return `${fieldName} es obligatorio.`;
  return undefined;
}
