const phoneValidationRules = {
  "+509": {
    length: 8,
    pattern: /^[0-9]{8}$/,
    example: "12345678"
  },
  "+1": {
    length: 10,
    pattern: /^[0-9]{10}$/,
    example: "1234567890"
  },
  "+33": {
    length: 10,
    pattern: /^[0-9]{10}$/,
    example: "1234567890"
  },
  "+34": {
    length: 9,
    pattern: /^[0-9]{9}$/,
    example: "123456789"
  }
};

export function validatePhone(countryCode: string, phoneNumber: string): boolean {
  const rules = phoneValidationRules[countryCode as keyof typeof phoneValidationRules];
  if (!rules) return false;
  
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  return rules.pattern.test(cleanNumber) && cleanNumber.length === rules.length;
}

export function getPhoneExample(countryCode: string): string {
  const rules = phoneValidationRules[countryCode as keyof typeof phoneValidationRules];
  return rules?.example || "12345678";
}

export function formatPhoneNumber(countryCode: string, phoneNumber: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  
  switch (countryCode) {
    case "+1":
      if (cleanNumber.length === 10) {
        return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
      }
      break;
    case "+33":
      if (cleanNumber.length === 10) {
        return `${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2, 4)} ${cleanNumber.slice(4, 6)} ${cleanNumber.slice(6, 8)} ${cleanNumber.slice(8)}`;
      }
      break;
    case "+34":
      if (cleanNumber.length === 9) {
        return `${cleanNumber.slice(0, 3)} ${cleanNumber.slice(3, 6)} ${cleanNumber.slice(6)}`;
      }
      break;
    case "+509":
      if (cleanNumber.length === 8) {
        return `${cleanNumber.slice(0, 4)} ${cleanNumber.slice(4)}`;
      }
      break;
  }
  
  return cleanNumber;
}
