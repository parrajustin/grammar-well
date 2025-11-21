"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = exports.NAME_DELIMITER = void 0;
exports.Generate = Generate;
const parse_js_1 = require("../parser/parse.js");
const v1_js_1 = require("./grammars/v1.js");
const v2_js_1 = require("./grammars/v2.js");
const state_js_1 = require("./state.js");
const registry_js_1 = require("./stringify/exports/registry.js");
const javascript_js_1 = require("./stringify/javascript.js");
const browser_js_1 = require("./import-resolvers/browser.js");
const BuiltInRegistry = { "character": "lexer {\n\tstart: \"character\"\n\n\t[character]\n\t\t- when r:{.}\n\n}\n", "json": "import * from whitespace;\n\nlexer {\n\tstart: \"json\"\n\n\t[json]\n\t\t- import whitespace\n\t\t- when r:{-?(?:[0-9]|[1-9][0-9]+)(?:\\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\\b} tag \"number\"\n\t\t- when r:{\"(?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*\"} tag \"string\"\n\t\t- when \"{\" tag \"{\"\n\t\t- when \"}\" tag \"}\"\n\t\t- when \"[\" tag \"[\"\n\t\t- when \"]\" tag \"]\"\n\t\t- when \",\" tag \",\"\n\t\t- when \":\" tag \":\"\n\t\t- when \"true\" tag \"true\"\n\t\t- when \"false\" tag \"false\"\n\t\t- when \"null\" tag \"null\"\n\n}\n\ngrammar {\n\tstart: \"json\"\n\n\t[json]\n\t\t| _ (object | array) _ => ( $1[0] )\n\n\t[object]\n\t\t| \"{\" _ \"}\" => ( {} )\n\t\t| \"{\" _ pair (_ \",\" _ pair)* _ \"}\" => \${ extractObject }\n\n\t[array]\n\t\t| \"[\" _ \"]\" => ( [] )\n\t\t| \"[\" _ value (_ \",\" _ value)* _ \"]\" => \${ extractArray }\n\n\t[value]\n\t\t| object => ( $0 )\n\t\t| array => ( $0 )\n\t\t| number => ( $0 )\n\t\t| string => ( $0 )\n\t\t| \"true\" => ( true )\n\t\t| \"false\" => ( false )\n\t\t| \"null\" => ( null )\n\n\t[number]\n\t\t| <number> => ( parseFloat($0.value) )\n\n\t[string]\n\t\t| <string> => ( JSON.parse($0.value) )\n\n\t[pair]\n\t\t| key@k _ \":\" _ value@v => ( [$k, $v] )\n\n\t[key]\n\t\t| string => ( $0 )\n\n}\n\non:import {\nfunction extractPair(kv, output) {\n        if(kv[0]) { output[kv[0]] = kv[1]; }\n    }\n\n    function extractObject({data}) {\n        let output = {};\n\n        extractPair(data[2], output);\n\n        for (let i in data[3]) {\n            extractPair(data[3][i][3], output);\n        }\n\n        return output;\n    }\n\n    function extractArray({data}) {\n        let output = [data[2]];\n\n        for (let i in data[3]) {\n            output.push(data[3][i][3]);\n        }\n\n        return output;\n    }\n}\n", "number": "grammar {\n\n\t[unsigned_int]\n\t\t| r:{[0-9]}+ => ( parseInt($0.join(\"\")) )\n\n\t[int]\n\t\t| (\"-\" | \"+\")? r:{[0-9]}+ => ( $0 ? parseInt($0[0]+$1.join(\"\")) : parseInt($1.join(\"\")) )\n\n\t[unsigned_decimal]\n\t\t| r:{[0-9]}+ (\".\" r:{[0-9]}+)? => ( parseFloat($0.join(\"\") + ($1 ? \".\"+$1[1].join(\"\") : \"\")) )\n\n\t[decimal]\n\t\t| \"-\"? r:{[0-9]}+ (\".\" r:{[0-9]}+)? => ( parseFloat( ($0 || \"\") + $1.join(\"\") +($2 ? \".\"+$2[1].join(\"\") : \"\")) )\n\n\t[percentage]\n\t\t| decimal \"%\" => ( $0/100 )\n\n\t[jsonfloat]\n\t\t| \"-\"? r:{[0-9]}+ (\".\" r:{[0-9]}+)? (r:{[eE]} r:{[+-]}? r:{[0-9]}+)? => ( parseFloat( ($0 || \"\") + $1.join(\"\") + ($2 ? \".\"+$2[1].join(\"\") : \"\") + ($3 ? \"e\" + ($3[1] || \"+\") + $3[2].join(\"\") : \"\")) )\n\n}\n", "string": "lexer {\n\n\t[string]\n\t\t- import singleQuoteString, doubleQuoteString\n\n\t[doubleQuoteString]\n\t\t- when \"\\\"\" tag \"dquote\" highlight \"string\" goto doubleQuoteStringEnd\n\n\t[singleQuoteString]\n\t\t- when \"'\" tag \"squote\" highlight \"string\" goto singleQuoteStringEnd\n\n\t[doubleQuoteStringEnd]\n\t\t- when r:{\\\\[\\\\/bnrft]} tag \"escaped\" highlight \"constant\"\n\t\t- when r:{\\\\\"} tag \"quoteEscape\"\n\t\t- when r:{\\\\u[A-Fa-f\\d]{4}} tag \"escaped\" highlight \"constant\"\n\t\t- when r:{\\\\.} tag \"badEscape\"\n\t\t- when r:{[^\"\\\\]+} tag \"string\" highlight \"string\"\n\t\t- when \"\\\"\" tag \"dquote\" highlight \"string\" pop\n\n\t[singleQuoteStringEnd]\n\t\t- when r:{\\\\[\\\\/bnrft]} tag \"escaped\"\n\t\t- when r:{\\\\'} tag \"quoteEscape\"\n\t\t- when r:{\\\\u[A-Fa-f\\d]{4}} tag \"escaped\"\n\t\t- when r:{\\\\.} tag \"badEscape\"\n\t\t- when r:{[^'\\\\]+} tag \"string\" highlight \"string\"\n\t\t- when \"'\" tag \"squote\" highlight \"string\" pop\n\n}\n\ngrammar {\n\n\t[string] => ( $0 )\n\t\t| singleQuoteString\n\t\t| doubleQuoteString\n\n\t[doubleQuoteString]\n\t\t| <dquote> stringInner <dquote> => ( $1 )\n\t\t| <dquote> <dquote> => ( '' )\n\n\t[singleQuoteString]\n\t\t| <squote> stringInner <squote> => ( $1 )\n\t\t| <squote> <squote> => ( '' )\n\n\t[stringInner]\n\t\t| stringEscape => ( $0 )\n\t\t| <string> => ( $0.value )\n\t\t| stringInner stringEscape => ( $0 + $1 )\n\t\t| stringInner <string> => ( $0 + $1.value )\n\n\t[stringEscape]\n\t\t| <escaped> => ( JSON.parse('\"' + $0.value + '\"') )\n\t\t| <quoteEscape> => ( $0.value[1] )\n\n}\n", "whitespace": "lexer {\n\n\t[whitespace]\n\t\t- when r:{\\s+} tag \"whitespace\"\n\n}\n\ngrammar {\n\n\t[_]\n\t\t| <whitespace>? => ( null )\n\n\t[__]\n\t\t| <whitespace>+ => ( null )\n\n}\n" };
async function Generate(source, config = {}) {
    const builder = new Generator(config);
    await builder.import(source);
    return builder.output(config.output);
}
exports.NAME_DELIMITER = '.';
class Generator {
    config;
    context;
    aliasPrefix;
    state = new state_js_1.GeneratorState();
    constructor(config = {}, context = {
        imported: new Set(),
        resolver: undefined,
        state: undefined
    }, aliasPrefix = '') {
        this.config = config;
        this.context = context;
        this.aliasPrefix = aliasPrefix;
        if (typeof config.resolver == 'function') {
            this.context.resolver = new config.resolver(config.basedir);
        }
        else if (config.resolver && typeof config.resolver.path == 'function' && typeof config.resolver.body == 'function') {
            this.context.resolver = config.resolver;
        }
        else {
            this.context.resolver == new browser_js_1.BrowserImportResolver(config.basedir);
        }
        if (this.context.state?.grammar) {
            this.state.initializeGrammar();
            this.state.grammar.uuids = context.state.grammar.uuids;
        }
    }
    async import(directives) {
        if (typeof directives == 'string') {
            await this.mergeGrammar(directives);
            return;
        }
        directives = Array.isArray(directives) ? directives : [directives];
        for (const directive of directives) {
            if ("lifecycle" in directive) {
                await this.processLifecycleDirective(directive);
            }
            else if ("import" in directive) {
                await this.processImportDirective(directive);
            }
            else if ("config" in directive) {
                this.processConfigDirective(directive);
            }
            else if ("grammar" in directive) {
                this.processGrammarDirective(directive);
            }
            else if ("lexer" in directive) {
                this.processLexerDirective(directive);
            }
        }
    }
    output(options) {
        const format = options?.format || 'esm';
        if (!registry_js_1.ExportsRegistry[format]) {
            throw new Error("No such output format: " + format);
        }
        const generator = new javascript_js_1.JavaScriptGenerator(this.state, options);
        return registry_js_1.ExportsRegistry[format](generator);
    }
    async processImportDirective(directive) {
        if (directive.path) {
            await this.importGrammar(directive.import, this.aliasPrefix + (directive.alias || ''));
        }
        else {
            await this.importBuiltIn(directive.import, this.aliasPrefix + (directive.alias || ''));
        }
    }
    async processLifecycleDirective(directive) {
        if ('js' in directive.js)
            this.state.addLifecycle(directive.lifecycle, directive.js.js);
        else if ('template' in directive.js)
            this.state.addLifecycle(directive.lifecycle, directive.js.template);
    }
    processConfigDirective(directive) {
        Object.assign(this.state.config, directive.config);
    }
    processLexerDirective(directive) {
        this.state.initializeLexer();
        if (directive.lexer.start) {
            this.state.lexer.start = this.aliasPrefix + directive.lexer.start;
        }
        if (!this.state.lexer.start && directive.lexer.states.length) {
            this.state.lexer.start = this.aliasPrefix + directive.lexer.states[0].name;
        }
        this.importLexerStates(directive.lexer.states);
    }
    importLexerStates(states) {
        for (let state of states) {
            this.importLexerState(state.name, state.state);
        }
    }
    importLexerState(name, state) {
        if ('span' in state) {
            this.state.addLexerState(this.aliasPrefix + name, { rules: [{ import: [`${name}${exports.NAME_DELIMITER}start`] }] });
            const states = this.buildLexerSpanStates(name, state);
            this.importLexerStates(states);
        }
        else {
            if (state.default && state.unmatched) {
                state.unmatched.type = typeof state.unmatched.type != 'undefined' ? state.unmatched.type : state.default?.type;
                state.unmatched.tag = typeof state.unmatched.tag != 'undefined' ? state.unmatched.tag : state.default?.tag;
                state.unmatched.open = typeof state.unmatched.open != 'undefined' ? state.unmatched.open : state.default?.open;
                state.unmatched.close = typeof state.unmatched.close != 'undefined' ? state.unmatched.close : state.default?.close;
                state.unmatched.highlight = typeof state.unmatched.highlight != 'undefined' ? state.unmatched.highlight : state.default?.highlight;
            }
            const rules = [];
            for (const rule of state.rules) {
                if ('span' in rule) {
                    let i = 1;
                    while (`${this.aliasPrefix}${name}${exports.NAME_DELIMITER}${i}` in this.state.lexer.states)
                        ++i;
                    const states = this.buildLexerSpanStates(`${name}${exports.NAME_DELIMITER}${i}`, rule);
                    this.importLexerStates(states);
                    rules.push({ import: `${name}.${i}${exports.NAME_DELIMITER}start` });
                    continue;
                }
                else {
                    if (this.aliasPrefix) {
                        if ('import' in rule) {
                            rule.import = rule.import.map(v2 => this.aliasPrefix + v2);
                        }
                        if ('set' in rule) {
                            rule.set = this.aliasPrefix + rule.set;
                        }
                        if ('goto' in rule) {
                            rule.goto = this.aliasPrefix + rule.goto;
                        }
                    }
                    if ('when' in rule && state.default) {
                        rule.type = typeof rule.type != 'undefined' ? rule.type : state.default?.type;
                        rule.tag = typeof rule.tag != 'undefined' ? rule.tag : state.default?.tag;
                        rule.open = typeof rule.open != 'undefined' ? rule.open : state.default?.open;
                        rule.close = typeof rule.close != 'undefined' ? rule.close : state.default?.close;
                        rule.highlight = typeof rule.highlight != 'undefined' ? rule.highlight : state.default?.highlight;
                    }
                    rules.push(rule);
                }
            }
            this.state.addLexerState(this.aliasPrefix + name, { ...state, rules });
        }
    }
    buildLexerSpanStates(name, rule) {
        const transition = rule.config?.transition == 'set' ? 'set' : 'goto';
        const startRules = [];
        const spanRules = [];
        const stopRules = [];
        const start = rule.span.find(v => v.name == 'start');
        const span = rule.span.find(v => v.name == 'span');
        const stop = rule.span.find(v => v.name == 'stop');
        if (span?.state?.rules)
            for (const r of span?.state?.rules) {
                spanRules.push(r);
            }
        if (stop?.state?.rules)
            for (const r of stop?.state?.rules) {
                if ('when' in r) {
                    stopRules.push({
                        when: r.when,
                        type: r.type,
                        tag: r.tag,
                        before: r.before,
                        skip: r.skip,
                        highlight: r.highlight,
                        open: r.open,
                        close: r.close,
                        embed: r.embed,
                        unembed: r.unembed,
                        set: r.skip ? undefined : r.set,
                        pop: r.skip || r.set ? undefined : 1
                    });
                }
                if ('import' in r) {
                    stopRules.push({
                        import: r.import,
                        set: r.set,
                        pop: r.set ? undefined : 1
                    });
                }
            }
        if (stopRules.length && spanRules.length)
            spanRules.push({ import: [`${name}${exports.NAME_DELIMITER}stop`] });
        const target = spanRules.length ? 'span' : 'stop';
        for (const r of start?.state?.rules) {
            if ('when' in r) {
                startRules.push({
                    when: r.when,
                    skip: r.skip,
                    type: r.type,
                    tag: r.tag,
                    before: r.before,
                    highlight: r.highlight,
                    open: r.open,
                    close: r.close,
                    embed: r.embed,
                    unembed: r.unembed,
                    [transition]: r.stay ? undefined : `${name}${exports.NAME_DELIMITER}${target}`
                });
            }
            if ('import' in r) {
                startRules.push({
                    import: r.import,
                    [transition]: r.stay ? undefined : `${name}${exports.NAME_DELIMITER}${target}`
                });
            }
        }
        return [
            {
                name: `${name}${exports.NAME_DELIMITER}start`,
                state: {
                    default: start.state.default,
                    rules: startRules
                }
            },
            {
                name: `${name}${exports.NAME_DELIMITER}span`,
                state: {
                    default: span?.state?.default,
                    unmatched: span?.state?.unmatched,
                    rules: spanRules
                }
            },
            {
                name: `${name}${exports.NAME_DELIMITER}stop`,
                state: {
                    default: stop?.state?.default,
                    rules: stopRules
                }
            }
        ];
    }
    processGrammarDirective(directive) {
        this.state.initializeGrammar();
        if (directive.grammar.config) {
            if (directive.grammar.config.start) {
                this.state.grammar.start = this.aliasPrefix + directive.grammar.config.start;
            }
            Object.assign(this.state.grammar.config, directive.grammar.config);
        }
        if (!this.state.grammar.start && directive.grammar.rules.length) {
            this.state.grammar.start = this.aliasPrefix + directive.grammar.rules[0].name;
        }
        for (const rule of directive.grammar.rules) {
            rule.name = this.aliasPrefix + rule.name;
            this.buildRules(rule.name, rule.expressions, rule);
        }
    }
    async importBuiltIn(name, alias) {
        name = name.toLowerCase();
        if (!this.context.imported.has(name)) {
            this.context.imported.add(name);
            if (!BuiltInRegistry[name])
                return;
            await this.mergeGrammar(BuiltInRegistry[name], alias);
        }
    }
    async importGrammar(path, alias) {
        const resolver = this.context.resolver;
        const fullPath = resolver.path(path);
        if (!this.context.imported.has(fullPath)) {
            this.context.imported.add(fullPath);
            await this.mergeGrammar(await resolver.body(fullPath), alias);
        }
    }
    async mergeGrammar(body, alias = '') {
        const grammar = body.indexOf('// Grammar Well Version 1') == 0 ? v1_js_1.default : v2_js_1.default;
        const generator = new Generator(this.config, { ...this.context, state: this.state }, alias);
        await generator.import((0, parse_js_1.Parse)(new grammar(), body));
        this.state.merge(generator.state);
        return;
    }
    buildRules(name, expressions, rule) {
        for (const expression of expressions) {
            this.state.addGrammarRule(this.buildRule(name, expression, rule));
        }
    }
    buildRule(name, expression, rule) {
        const symbols = [];
        for (let i = 0; i < expression.symbols.length; i++) {
            const symbol = this.buildSymbol(name, expression.symbols[i]);
            if (symbol)
                symbols.push(symbol);
        }
        return { name, symbols, postprocess: expression.postprocess || rule?.postprocess };
    }
    buildSymbol(name, symbol) {
        if ('repeat' in symbol) {
            return this.buildRepeatRules(name, symbol);
        }
        if ('rule' in symbol) {
            return { ...symbol, rule: this.aliasPrefix + symbol.rule };
        }
        if ('regex' in symbol) {
            return symbol;
        }
        if ('token' in symbol) {
            return symbol;
        }
        if ('literal' in symbol) {
            if (!symbol.literal.length) {
                return null;
            }
            if (symbol.literal.length === 1 || this.state.lexer || this.context.state.lexer) {
                return symbol;
            }
            return this.buildCharacterRules(name, symbol);
        }
        if ('subexpression' in symbol) {
            return this.buildSubExpressionRules(name, symbol);
        }
    }
    buildCharacterRules(name, symbol) {
        const id = this.state.grammarUUID(name + exports.NAME_DELIMITER + "STR");
        this.buildRules(id, [
            {
                symbols: symbol.literal
                    .split("")
                    .map((literal) => {
                    if (symbol.insensitive && literal.toLowerCase() != literal.toUpperCase())
                        return { regex: literal, flags: 'i' };
                    return { literal };
                }),
                postprocess: { builtin: "join" }
            }
        ]);
        return { rule: id };
    }
    buildSubExpressionRules(name, symbol) {
        const id = this.state.grammarUUID(name + exports.NAME_DELIMITER + "SUB");
        this.buildRules(id, symbol.subexpression);
        return { rule: id };
    }
    buildRepeatRules(name, symbol) {
        let id;
        const expr1 = { symbols: [] };
        const expr2 = { symbols: [] };
        if (symbol.repeat == '+') {
            id = this.state.grammarUUID(name + exports.NAME_DELIMITER + "RPT1N");
            expr1.symbols = [symbol.expression];
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        }
        else if (symbol.repeat == '*') {
            id = this.state.grammarUUID(name + exports.NAME_DELIMITER + "RPT0N");
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        }
        else if (symbol.repeat == '?') {
            id = this.state.grammarUUID(name + exports.NAME_DELIMITER + "RPT01");
            expr1.symbols = [symbol.expression];
            expr1.postprocess = { builtin: "first" };
            expr2.postprocess = { builtin: "null" };
        }
        this.buildRules(id, [expr1, expr2]);
        return { rule: id };
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map