"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSetUp = exports.HTTP = void 0;
var HTTP;
(function (HTTP) {
    HTTP[HTTP["OK"] = 200] = "OK";
    HTTP[HTTP["CREATED"] = 201] = "CREATED";
    HTTP[HTTP["BAD"] = 404] = "BAD";
    HTTP[HTTP["UN_FULLFILLED"] = 500] = "UN_FULLFILLED";
    HTTP[HTTP["UN_AUTHORIZED"] = 403] = "UN_AUTHORIZED";
    HTTP[HTTP["DELETE"] = 202] = "DELETE";
})(HTTP || (exports.HTTP = HTTP = {}));
class errorSetUp extends Error {
    constructor(args) {
        super(args.message);
        this.success = false;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name;
        this.message = args.message;
        this.status = args.status;
        if (this.success !== undefined) {
            this.success = args.success;
        }
        Error.captureStackTrace(this);
    }
}
exports.errorSetUp = errorSetUp;
