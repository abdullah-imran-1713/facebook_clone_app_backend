"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const yup_1 = require("yup");
const constants_1 = require("../utils/constants");
exports.signupSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
    email: (0, yup_1.string)().email().required(),
    dob: (0, yup_1.date)().required().max(new Date(), "Date of birth cannot be in the future"), // Ensure dob is not in the future
    gender: (0, yup_1.string)()
        .transform((value) => value.trim().toLowerCase()) // Remove whitespace and convert to lowercase
        .oneOf(constants_1.GENDER_TYPES).required(),
    password: (0, yup_1.string)()
        .required('Password is required')
        .test('isValidPassword', 'Password must be at least 8 characters and at most 20 characters. Password must include at least one lowercase, at least one uppercase letter and at least one digit and at least one special character (@$!%*?&.)', (value) => {
        const password = value || "";
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&.]/.test(password);
        const isValidLength = password.length >= 8 && password.length <= 20;
        return isValidLength && hasLowercase && hasUppercase && hasDigit && hasSpecialChar;
    }),
    phone: (0, yup_1.string)()
        .nullable() // Allow phone to be null
        .matches(/^[0-9]+$/, "Phone must be only digits") // Validate phone number format
        .max(15, "Phone number must be at most 15 digits") // Optional: Limit phone number length
        .min(11, "Phone number must be at least 11 digits")
        .notRequired(),
});
exports.loginSchema = (0, yup_1.object)({
    email: (0, yup_1.string)().email().required('Email is required'),
    password: (0, yup_1.string)().required('Password is required'),
});
