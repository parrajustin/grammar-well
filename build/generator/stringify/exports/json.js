"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFormatter = JSONFormatter;
function JSONFormatter(generator) {
    return JSON.stringify({ state: generator.state.export(), output: generator.options });
}
//# sourceMappingURL=json.js.map