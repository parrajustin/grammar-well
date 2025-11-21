"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportsRegistry = void 0;
const javascript_js_1 = require("./javascript.js");
const json_js_1 = require("./json.js");
const typescript_js_1 = require("./typescript.js");
exports.ExportsRegistry = {
    object: (generator) => ({ state: generator.state, output: generator.options }),
    json: json_js_1.JSONFormatter,
    js: javascript_js_1.CJSOutput,
    cjs: javascript_js_1.CJSOutput,
    javascript: javascript_js_1.CJSOutput,
    commonjs: javascript_js_1.CJSOutput,
    module: javascript_js_1.ESMOutput,
    esmodule: javascript_js_1.ESMOutput,
    esm: javascript_js_1.ESMOutput,
    ts: typescript_js_1.TypescriptFormat,
    typescript: typescript_js_1.TypescriptFormat
};
//# sourceMappingURL=registry.js.map