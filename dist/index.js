"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var acorn = require("acorn");
var walk = require("acorn-walk");
var fs_1 = require("fs");
var ModelGen_1 = require("./ModelGen");
var InterfaceGen_1 = require("./InterfaceGen");
var model_1 = require("./helpers/model");
var ts = require("typescript");
var MODEL_KEY = 'defineModel';
var expr = /_(\w{1})/g;
/**
 * 如果源文件中没有 model 变量，则判断是否在 export default | exports.default 的 args[1] 中
 *
 * args:
 *  1.
 *    export default db.defineModel('xxxxx', { ... })
 *    ExportDefaultDeclaration -> n.declaration.arguments
 *  2.
 *    exports.default = db_1.default.defineModel('xxx', { ... })
 *    ExpressionStatement -> n.expression.right.arguments
 */
function getDefineModelData(args) {
    var data = {
        interfaceName: null,
        props: [],
        source: {
            tablename: ''
        }
    };
    var nameFinder = args.find(function (a) { return a.type === 'Literal'; });
    if (!nameFinder) {
        return data;
    }
    data.source.tablename = nameFinder.value;
    var name = nameFinder.value.replace(expr, function (a, b) {
        return b.toUpperCase();
    });
    data.interfaceName = name + "Data";
    var valueFinder = args.find(function (a) { return a.type === 'ObjectExpression'; });
    if (valueFinder) {
        valueFinder.properties.forEach(function (v) {
            var key = v.key, value = v.value;
            data.props.push({
                name: key.name,
                type: model_1.getPropTypeByName(value.properties, 'type')
            });
        });
    }
    return data;
}
/**
 * 给 modelGen 设置 defineModel 中获取到的数据
 * @param modelGen
 * @param args
 */
function setModelData(modelGen, args) {
    var _a = getDefineModelData(args), interfaceName = _a.interfaceName, props = _a.props, source = _a.source;
    if (interfaceName) {
        modelGen.addInterface(interfaceName);
    }
    if (source) {
        modelGen.addSource(source);
    }
    modelGen.addProperties(props);
}
/**
 * 创建声明文件
 * @param ast
 */
function createInterfaces(ast) {
    var mg = new ModelGen_1.default();
    walk.ancestor(ast, {
        /**
         * 从 ExpressionStatement export.default 上获取 Interface 名以及数据
         * @param _
         * @param ancestors
         */
        ExpressionStatement: function (_, ancestors) {
            ancestors.forEach(function (n) {
                var expression = n.expression;
                if ((n.type =
                    'ExpressionStatement' &&
                        expression &&
                        expression.left &&
                        expression.right) &&
                    n.type.callee) {
                    if (n.type.callee.property.name === MODEL_KEY) {
                        setModelData(mg, expression.right.arguments);
                    }
                }
            });
        },
        /**
         * 从 const let var 变量上获取 跟 MODEL_KEY 匹配的数据
         * @param _
         * @param ancestors
         */
        VariableDeclarator: function (_, ancestors) {
            ancestors.forEach(function (n) {
                if (n.type === 'VariableDeclarator' &&
                    n.init &&
                    n.init.callee.property &&
                    n.init.callee.property.name === MODEL_KEY) {
                    setModelData(mg, n.init.arguments);
                }
            });
        }
    });
    return mg.getData();
}
function default_1(config) {
    return __awaiter(this, void 0, void 0, function () {
        var gen, res, _a, _b, file, source, outputText, ast, item, _c, source_1;
        var e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    gen = new InterfaceGen_1.default(config.output);
                    res = { success: 0, failed: 0 };
                    try {
                        for (_a = __values(config.files), _b = _a.next(); !_b.done; _b = _a.next()) {
                            file = _b.value;
                            if (!fs_1.existsSync(file.filePath)) {
                                throw new Error("Not found the file: " + file.filePath);
                            }
                            source = ts.sys.readFile(file.filePath);
                            if (source) {
                                outputText = ts.transpileModule(source, {
                                    compilerOptions: { module: ts.ModuleKind.CommonJS }
                                }).outputText;
                                ast = acorn.parse(outputText, { sourceType: 'module' });
                                item = createInterfaces(ast);
                                if (item !== null && item.interfaceName) {
                                    _c = item.source, source_1 = _c === void 0 ? {} : _c;
                                    gen.addProps(item.interfaceName, item.props);
                                    // 给单个文件添加导入配置
                                    if (file.importsConfig) {
                                        file.importsConfig.forEach(function (importConfig) {
                                            var path = importConfig.path, rest = __rest(importConfig, ["path"]);
                                            gen.addImport(path, rest);
                                        });
                                    }
                                    if (source_1) {
                                        gen.addDoc("Auto gererated by sequelize-models-interfaces-gen\ndb table name: " + source_1.tablename);
                                    }
                                    if (file.extendsConfig) {
                                        gen.addExtends(file.extendsConfig);
                                    }
                                    res.success++;
                                }
                                else {
                                    res.failed++;
                                    console.error("[ERROR]: " + file.filePath);
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    /**
                     * 添加公共的 imports
                     */
                    if (config.importsConfig) {
                        config.importsConfig.forEach(function (importConfig) {
                            var path = importConfig.path, rest = __rest(importConfig, ["path"]);
                            gen.addImport(path, rest);
                        });
                    }
                    // console.log('interfaces-gen:\n', gen.getText());
                    return [4 /*yield*/, gen.createFileSync()];
                case 1:
                    // console.log('interfaces-gen:\n', gen.getText());
                    _e.sent();
                    console.log("\n<========================= START =========================>\nAuto gererated Success by sequelize-models-interfaces-gen.\nTotal: " + config.files.length + "\nSuccess: " + res.success + "\nFailed: " + res.failed + "\n<=========================  END  =========================>\n  ");
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
