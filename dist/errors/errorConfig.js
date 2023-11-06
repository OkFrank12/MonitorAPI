"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSet = void 0;
const errorSetUp_1 = require("./errorSetUp");
const prepareError = (err, res) => {
    return res.status(errorSetUp_1.HTTP.BAD).json({
        name: err.name,
        message: err.message,
        status: err.status,
        success: err.success,
        stack: err.stack,
        err,
    });
};
const errorSet = (err, req, res, next) => {
    prepareError(err, res);
};
exports.errorSet = errorSet;
