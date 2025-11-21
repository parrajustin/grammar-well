"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserImportResolver = void 0;
class BrowserImportResolver {
    baseURL;
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    path(path) {
        return (new URL(path, this.baseURL)).href;
    }
    async body(path) {
        return (await fetch(path)).text();
    }
}
exports.BrowserImportResolver = BrowserImportResolver;
//# sourceMappingURL=browser.js.map