"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemResolver = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
class FileSystemResolver {
    baseDir;
    constructor(baseDir) {
        this.baseDir = baseDir ? (0, path_1.dirname)(baseDir) : process?.cwd();
    }
    path(path) {
        return (0, path_1.resolve)(this.baseDir, path);
    }
    body(path) {
        return (0, promises_1.readFile)(path, 'utf-8');
    }
}
exports.FileSystemResolver = FileSystemResolver;
//# sourceMappingURL=filesystem.js.map