"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserUtility = void 0;
class ParserUtility {
    static SymbolMatchesToken(symbol, token) {
        if (typeof symbol === 'string')
            throw 'Attempted to match token against non-terminal';
        if (typeof symbol == 'function')
            return symbol(token);
        if (!symbol)
            return;
        if ("test" in symbol)
            return symbol.test(token.value);
        if ("token" in symbol)
            return symbol.token === token.type || token.tag?.has(symbol.token);
        if ("literal" in symbol)
            return symbol.literal === token.value;
    }
    static SymbolIsTerminal(symbol) {
        return typeof symbol != 'string';
    }
    static PostProcess(rule, data, meta) {
        if (rule.postprocess) {
            return rule.postprocess({ rule, data, meta });
        }
        return data;
    }
}
exports.ParserUtility = ParserUtility;
//# sourceMappingURL=parsing.js.map