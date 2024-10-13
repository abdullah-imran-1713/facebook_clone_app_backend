import { object, string, date } from 'yup';
import { GENDER_TYPES } from '../utils/constants';

// Helper function to capitalize the first letter of each word
const capitalizeFirstLetters = (value: string) =>
  value
    .toLowerCase() // Convert everything to lowercase first
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

export const signupSchema = object({
  name: string()
    .required('Name is required')
    .transform((value) => capitalizeFirstLetters(value.trim())), // Capitalize first letter of each word
  email: string().email().required('Email is required'),
  dob: date().required().max(new Date(), "Date of birth cannot be in the future"), // Ensure dob is not in the future
  gender: string()
    .transform((value) => value.trim().toLowerCase()) // Remove whitespace and convert to lowercase
    .oneOf(GENDER_TYPES).required('Gender is required'),
  password: string()
    .required('Password is required')
    .test('isValidPassword', 'Password must be at least 8 characters and at most 20 characters. Password must include at least one lowercase, at least one uppercase letter, at least one digit, and at least one special character (@$!%*?&.)', (value) => {
      const password = value || "";
      const hasLowercase = /[a-z]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecialChar = /[@$!%*?&.]/.test(password);
      const isValidLength = password.length >= 8 && password.length <= 20;
      return isValidLength && hasLowercase && hasUppercase && hasDigit && hasSpecialChar;
    }),
  phone: string()
    .nullable() // Allow phone to be null
    .matches(/^[0-9]+$/, "Phone must be only digits") // Validate phone number format
    .max(15, "Phone number must be at most 15 digits") // Optional: Limit phone number length
    .min(11, "Phone number must be at least 11 digits")
    .notRequired(),
});

export let loginSchema = object({
  email: string().email().required('Email is required'),
  password: string().required('Password is required'),
});
