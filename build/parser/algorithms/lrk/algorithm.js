"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRK = LRK;
const parsing_js_1 = require("../../../utility/parsing.js");
const canonical_collection_js_1 = require("./canonical-collection.js");
const stack_js_1 = require("./stack.js");
function LRK(language, options = {}) {
    const { grammar } = language.artifacts;
    const { tokens } = language;
    const { states, rules: rules } = new canonical_collection_js_1.CanonicalCollection(grammar);
    const stack = new stack_js_1.LRStack();
    const s = states.get('0.0');
    stack.append(s.rule.name);
    stack.shift(s);
    let token;
    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (parsing_js_1.ParserUtility.SymbolMatchesToken(symbol, token)) {
                stack.append(symbol);
                stack.shift(states.get(state));
                stack.current.value = token;
                break;
            }
        }
        while (stack.current.state?.isFinal) {
            const rule = rules.fetch(stack.current.state.reduce);
            stack.reduce(rule);
            stack.current.value = parsing_js_1.ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(states.get(s));
        }
    }
    return { results: [stack.current.value] };
}
//# sourceMappingURL=algorithm.js.map