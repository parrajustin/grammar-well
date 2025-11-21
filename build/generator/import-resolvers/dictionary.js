"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionaryResolver = void 0;
class DictionaryResolver {
    files;
    constructor(files) {
        this.files = files;
    }
    path(path) {
        if (path in this.files)
            return path;
        throw new Error(`Unable to import "${path}"`);
    }
    async body(path) {
        return this.files[path];
    }
}
exports.DictionaryResolver = DictionaryResolver;
//# sourceMappingURL=dictionary.js.map