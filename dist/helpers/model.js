"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 将 sequelize model 类型转换为 Typescript 类型
 * @param {*} type
 */
function transTypeFromModel2Ts(type) {
    if ('STRING' === type) {
        return 'string';
    }
    if (['INTEGER', 'TINYINT', 'BIGINT', 'DECIMAL'].indexOf(type) !== -1) {
        return 'number';
    }
}
exports.transTypeFromModel2Ts = transTypeFromModel2Ts;
/**
 * 根据 property.name 获取相应的 value
 * @param {*} props
 * @param {*} name
 */
function getPropTypeByName(props, name) {
    if (!props || props.length === 0 || name === undefined) {
        return new Error('props and name required');
    }
    var p = props.find(function (n) { return n.key.name === name; });
    if (p === undefined) {
        return null;
    }
    var value = p.value;
    // { type: 'string' }
    if (value.type === 'Literal') {
        return value.value;
    }
    // { type: TYPES.STRING(100) }
    // { type: STRING(100) }
    if ('CallExpression' === value.type) {
        if ('Identifier' === value.callee.type) {
            return transTypeFromModel2Ts(value.callee.name);
        }
        if ('MemberExpression' === value.callee.type) {
            return transTypeFromModel2Ts(value.callee.property.name);
        }
    }
    if ('MemberExpression' === value.type) {
        return transTypeFromModel2Ts(value.property.name);
    }
    return new Error("Not found value from: " + name);
}
exports.getPropTypeByName = getPropTypeByName;
