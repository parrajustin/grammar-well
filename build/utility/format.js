"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = Format;
const v1_js_1 = require("../generator/grammars/v1.js");
const v2_js_1 = require("../generator/grammars/v2.js");
const v2_js_2 = require("../generator/stringify/grammar/v2.js");
const parse_js_1 = require("../parser/parse.js");
function Format(source, sourceVersion = '2') {
    const grammar = sourceVersion.toString() == '1' ? v1_js_1.default : v2_js_1.default;
    const result = (0, parse_js_1.Parse)(new grammar(), source);
    const stringer = new v2_js_2.V2GrammarString();
    stringer.append(result);
    return stringer.source;
}
//# sourceMappingURL=format.js.map