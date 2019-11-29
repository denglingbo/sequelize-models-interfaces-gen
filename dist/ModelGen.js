"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var ModelGen = /** @class */ (function () {
    function ModelGen() {
        this.interfaceName = null;
        this.props = [];
        this.source = {};
    }
    ModelGen.prototype.addInterface = function (name) {
        this.interfaceName = "I" + lodash_1.upperFirst(name);
    };
    ModelGen.prototype.addProperty = function (data) {
        this.props.push(data);
    };
    ModelGen.prototype.addProperties = function (data) {
        this.props = data;
    };
    // 添加源文件的信息
    ModelGen.prototype.addSource = function (source) {
        this.source = source;
    };
    ModelGen.prototype.getData = function () {
        if (!this.interfaceName || this.props.length === 0) {
            return null;
        }
        return {
            interfaceName: this.interfaceName,
            props: this.props,
            source: this.source || {}
        };
    };
    return ModelGen;
}());
exports.default = ModelGen;
