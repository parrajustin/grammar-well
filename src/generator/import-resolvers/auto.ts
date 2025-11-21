import { ImportResolverConstructor } from "../../typings/index.js";
import { FileSystemResolver } from "./filesystem.js";
import { BrowserImportResolver } from "./browser.js";
let resolver;

if (typeof process && process?.release?.name?.search(/node|io\.js/) >= 0) {
    resolver = FileSystemResolver;
} else {
    resolver = BrowserImportResolver;
}

export const AutoImportResolver = resolver as ImportResolverConstructor;