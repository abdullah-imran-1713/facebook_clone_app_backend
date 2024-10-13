"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLog = void 0;
const consoleLog = (object) => {
    console.log("consoleLog");
    console.log(JSON.stringify(object, null, 4));
};
exports.consoleLog = consoleLog;
