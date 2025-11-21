import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLexerToken } from "../typings/index.js";
export declare class ParserUtility {
    static SymbolMatchesToken(symbol: RuntimeGrammarRuleSymbol, token: RuntimeLexerToken): boolean;
    static SymbolIsTerminal(symbol: RuntimeGrammarRuleSymbol): symbol is RegExp | import("../typings/ast.js").ASTGrammarSymbolLiteral | import("../typings/ast.js").ASTGrammarSymbolToken | ((data: RuntimeLexerToken) => boolean);
    static PostProcess(rule: RuntimeGrammarProductionRule, data: any, meta?: any): any;
}
