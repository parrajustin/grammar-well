"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptGenerator = void 0;
const basic_js_1 = require("../artifacts/basic.js");
const lexer_js_1 = require("../artifacts/lexer.js");
const lr_js_1 = require("../artifacts/lr.js");
const common_js_1 = require("./common.js");
const PostProcessors = {
    "join": "({data}) => data.join('')",
    "concat": "({data}) => data[0].concat([data[1]])",
    "null": "() => null",
    "first": "({data}) => data[0]"
};
class JavaScriptGenerator {
    state;
    options;
    constructor(state, options) {
        this.state = state;
        this.options = options;
    }
    name() {
        return this.options.name || 'GWLanguage';
    }
    lifecycle(lifecycle) {
        if (this.options.noscript)
            return [];
        return this.state.lifecycle[lifecycle] || [];
    }
    artifacts(depth = 0) {
        let output = {};
        const artifacts = this.options.artifacts || { grammar: true, lexer: true };
        if (artifacts && artifacts.lr) {
            const table = new lr_js_1.LRParseTableBuilder(this);
            output.lr = common_js_1.CommonGenerator.JSON({
                k: "0",
                table: table.stringify(depth + 2)
            }, depth + 1);
        }
        if ('lexer' in this.state && artifacts.lexer) {
            const l = new lexer_js_1.LexerArtifact(this.state.lexer);
            output.lexer = l.output(depth + 1);
        }
        if (artifacts.grammar) {
            const basic = new basic_js_1.BasicGrammarTable(this);
            output.grammar = basic.stringify(depth + 1);
        }
        const onToken = this.lifecycle('token');
        if (onToken.length) {
            output.tokenProcessor = `() => {`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 1)}return (token) => {`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 2)}const processors = [`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 3)}${onToken.map(v => `({ token, state }) => ${v}`).join(',' + common_js_1.CommonGenerator.SmartIndent(depth + 3))}`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 2)}];`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 2)}for (const processor of processors) {`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 3)}token = processor({ token, state: this.state })`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 2)}}`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 2)}return token;`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth + 1)}}`;
            output.tokenProcessor += `${common_js_1.CommonGenerator.SmartIndent(depth)}}`;
        }
        return common_js_1.CommonGenerator.JSON(output, depth);
    }
    f(token) {
        const processors = [({ token, state }) => token];
        for (const processor of processors) {
            token = processor({ token, state: this.state });
        }
        return token;
    }
    postProcess(postprocess, alias) {
        postprocess = this.state.grammar.config.postprocessorOverride || postprocess || this.state.grammar.config.postprocessorDefault;
        if (!postprocess)
            return null;
        if ('builtin' in postprocess)
            return PostProcessors[postprocess.builtin];
        if (this.options.noscript)
            return;
        if (typeof postprocess == 'string')
            return postprocess;
        if ('js' in postprocess)
            return postprocess.js;
        if ('template' in postprocess)
            return this.templatePostProcess(postprocess.template, alias);
    }
    grammarRule(rule) {
        const symbols = [];
        const alias = {};
        for (let i = 0; i < rule.symbols.length; i++) {
            symbols.push(common_js_1.CommonGenerator.SerializeSymbol(rule.symbols[i]));
            if (rule.symbols[i].alias) {
                alias[rule.symbols[i].alias] = i;
            }
        }
        return common_js_1.CommonGenerator.JSON({
            name: JSON.stringify(rule.name),
            symbols: common_js_1.CommonGenerator.JSON(symbols, -1),
            postprocess: this.postProcess(rule.postprocess, alias)
        }, -1);
    }
    templatePostProcess(templateBody, alias) {
        for (const key in alias) {
            templateBody = templateBody.replace(new RegExp('(?:\\$)' + key + '(?![a-zA-Z\\d\\$_])'), `data[${alias[key]}]`);
        }
        return "({data}) => { return " + templateBody.replace(/\$(\d+)/g, "data[$1]") + "; }";
    }
}
exports.JavaScriptGenerator = JavaScriptGenerator;
//# sourceMappingURL=javascript.js.map