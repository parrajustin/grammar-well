"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parse = Parse;
const character_lexer_js_1 = require("../lexers/character-lexer.js");
const stateful_lexer_js_1 = require("../lexers/stateful-lexer.js");
const token_buffer_js_1 = require("../lexers/token-buffer.js");
const cyk_js_1 = require("./algorithms/cyk.js");
const earley_js_1 = require("./algorithms/earley.js");
const algorithm_js_1 = require("./algorithms/lrk/algorithm.js");
const parsing_js_1 = require("../utility/parsing.js");
const ParserRegistry = {
    earley: earley_js_1.Earley,
    cyk: cyk_js_1.CYK,
    lr0: algorithm_js_1.LRK
};
function Parse(language, input, options = {
    algorithm: 'earley',
    parserOptions: {}
}, results = 'first') {
    const tokenizer = GetTokenizer(language.artifacts);
    tokenizer.feed(input);
    const algorithm = typeof options.algorithm == 'function' ? options.algorithm : ParserRegistry[options.algorithm];
    const result = algorithm({ ...language, tokens: tokenizer, utility: parsing_js_1.ParserUtility }, options.parserOptions);
    return results == 'full' ? result : result.results[0];
}
function GetTokenizer(artifacts) {
    const tokenProcessor = artifacts?.tokenProcessor ? artifacts.tokenProcessor() : null;
    if (!artifacts.lexer) {
        return new token_buffer_js_1.TokenBuffer(new character_lexer_js_1.CharacterLexer(), tokenProcessor);
    }
    else if ("feed" in artifacts.lexer && typeof artifacts.lexer.feed == 'function') {
        return new token_buffer_js_1.TokenBuffer(artifacts.lexer, tokenProcessor);
    }
    else if ('states' in artifacts.lexer) {
        return new token_buffer_js_1.TokenBuffer(new stateful_lexer_js_1.StatefulLexer(artifacts.lexer), tokenProcessor);
    }
}
//# sourceMappingURL=parse.js.map