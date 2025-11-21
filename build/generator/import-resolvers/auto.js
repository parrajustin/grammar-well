"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoImportResolver = void 0;
const filesystem_js_1 = require("./filesystem.js");
const browser_js_1 = require("./browser.js");
let resolver;
if (typeof process && process?.release?.name?.search(/node|io\.js/) >= 0) {
    resolver = filesystem_js_1.FileSystemResolver;
}
else {
    resolver = browser_js_1.BrowserImportResolver;
}
exports.AutoImportResolver = resolver;
//# sourceMappingURL=auto.js.map