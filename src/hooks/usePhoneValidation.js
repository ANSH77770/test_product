import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_COUNTRY } from '@/lib/constants';
import { cleanPhoneNumber, createLoginSchema } from '@/lib/validation';

/**
 * Custom hook to manage country selection and mobile phone number validation & formatting.
 * @param {object} initialCountry - Default country object.
 * @returns {object} Phone state, country state, handlers, and validation check.
 */
export const usePhoneValidation = (initialCountry = DEFAULT_COUNTRY) => {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState(null);

  const cleanDigits = useMemo(() => cleanPhoneNumber(phoneNumber), [phoneNumber]);

  const handlePhoneChange = useCallback((rawInput) => {
    const cleaned = cleanPhoneNumber(rawInput);
    // Limit to reasonable max digits for the country + extra buffer
    const maxDigits = (selectedCountry?.maxLength || 10) + 2;
    if (cleaned.length <= maxDigits) {
      setPhoneNumber(cleaned);
      if (validationError) {
        setValidationError(null);
      }
    }
  }, [selectedCountry, validationError]);

  const handleCountryChange = useCallback((newCountry) => {
    setSelectedCountry(newCountry);
    setValidationError(null);
  }, []);

  const validatePhone = useCallback(() => {
    const schema = createLoginSchema(selectedCountry);
    const result = schema.safeParse({
      countryCode: selectedCountry.dialCode,
      phoneNumber: cleanDigits,
    });

    if (!result.success) {
      const errorMsg = result.error.errors[0]?.message || 'Invalid mobile number.';
      setValidationError(errorMsg);
      return { isValid: false, error: errorMsg };
    }

    setValidationError(null);
    return { isValid: true, error: null };
  }, [selectedCountry, cleanDigits]);

  return {
    selectedCountry,
    phoneNumber,
    cleanDigits,
    validationError,
    setValidationError,
    handlePhoneChange,
    handleCountryChange,
    validatePhone,
  };
};
