import { z } from 'zod';

/**
 * Strips non-numeric characters from a phone number string.
 * @param {string} phone - Raw phone number string.
 * @returns {string} Clean numeric digits only.
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

/**
 * Zod schema for email and password login form validation.
 */
export const emailPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required.')
    .email('Please enter a valid enterprise email address.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
});

/**
 * Zod schema for mobile phone login form validation.
 */
export const createLoginSchema = (country) => {
  const minDigits = country?.maxLength || 10;
  
  return z.object({
    countryCode: z.string().min(1, 'Please select a country code.'),
    phoneNumber: z
      .string()
      .min(1, 'Mobile number is required.')
      .refine((val) => {
        const cleaned = cleanPhoneNumber(val);
        return cleaned.length >= minDigits;
      }, {
        message: `Please enter a valid ${minDigits}-digit mobile number for ${country?.name || 'your country'}.`,
      })
      .refine((val) => {
        const cleaned = cleanPhoneNumber(val);
        return cleaned.length <= minDigits + 2;
      }, {
        message: 'Mobile number exceeds allowed digits.',
      }),
  });
};

/**
 * Zod schema for OTP verification form validation.
 */
export const otpValidationSchema = z.object({
  otp: z
    .string()
    .min(1, 'Verification code is required.')
    .length(6, 'Please enter all 6 digits.')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers.'),
});
