"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_morph_1 = require("ts-morph");
var fs_1 = require("fs");
var default_1 = /** @class */ (function () {
    function default_1(path) {
        if (fs_1.existsSync(path)) {
            fs_1.unlinkSync(path);
        }
        this.project = new ts_morph_1.Project();
        this.sourceFile = this.project.createSourceFile(path);
    }
    default_1.prototype.addProps = function (interfaceName, props) {
        this.interfaceDeclaration = this.sourceFile.addInterface({
            name: interfaceName,
            isExported: true
        });
        this.interfaceDeclaration.addProperties(props);
        return this;
    };
    default_1.prototype.addDoc = function (text) {
        this.interfaceDeclaration.addJsDoc({
            description: text
        });
    };
    default_1.prototype.addExtends = function (list) {
        this.interfaceDeclaration.addExtends(list);
    };
    /**
     * 创建 import 信息
     * @param path
     * @param importConfig
     */
    default_1.prototype.addImport = function (path, importConfig) {
        var importDeclaration = this.sourceFile.addImportDeclaration(__assign(__assign({}, (importConfig.defaultImport
            ? {
                defaultImport: importConfig.defaultImport
            }
            : {})), { moduleSpecifier: path }));
        if (importConfig.namedImports) {
            importDeclaration.addNamedImports(importConfig.namedImports);
        }
    };
    default_1.prototype.getText = function () {
        return this.sourceFile.getText();
    };
    default_1.prototype.createFileSync = function () {
        this.sourceFile.saveSync();
    };
    return default_1;
}());
exports.default = default_1;
