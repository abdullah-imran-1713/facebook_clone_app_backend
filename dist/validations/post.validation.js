"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostSchema = void 0;
const yup_1 = require("yup");
exports.validatePostSchema = (0, yup_1.object)({
    caption: (0, yup_1.string)().required('Caption is required'),
    image: (0, yup_1.string)().nullable(),
});
