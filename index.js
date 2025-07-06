"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
var pako_1 = __importDefault(require("pako"));
function scaleValue(value, scale) {
    if (typeof value === 'number')
        value = value * scale;
    if (typeof value === 'object') {
        if (value.s != null)
            value.s = value.s.map(function (v) { return v * scale; });
        if (value.e != null)
            value.e = value.e.map(function (v) { return v * scale; });
    }
    return value;
}
function bytesToString(bytes) {
    var result = "";
    for (var i = 0; i < bytes.length; ++i) {
        result += String.fromCharCode(bytes[i]);
    }
    return result;
}
function convert(tgs, size) {
    var _a, _b, _c, _d;
    if (size === void 0) { size = 512; }
    if (size < 1) {
        throw new Error("Size must be at least 1!");
    }
    var json = { layers: [] };
    try {
        var unzip = pako_1.default.ungzip(tgs);
        json = JSON.parse(bytesToString(unzip));
    }
    catch (_e) {
        json = JSON.parse(bytesToString(tgs));
    }
    var scale = size / (json.w || 512);
    json.w = (json.w || 512) * scale;
    json.h = (json.h || 512) * scale;
    if (json.layers != null) {
        for (var _i = 0, _f = json.layers; _i < _f.length; _i++) {
            var layer = _f[_i];
            if (layer.ks != null) {
                if (layer.parent == null) {
                    if ((_b = (_a = layer.ks) === null || _a === void 0 ? void 0 : _a.p) === null || _b === void 0 ? void 0 : _b.k) {
                        layer.ks.p.k = layer.ks.p.k.map(function (v) { return scaleValue(v, scale); });
                    }
                    if ((_d = (_c = layer.ks) === null || _c === void 0 ? void 0 : _c.s) === null || _d === void 0 ? void 0 : _d.k) {
                        layer.ks.s.k = layer.ks.s.k.map(function (v) { return scaleValue(v, scale); });
                    }
                    else if (layer.ks && layer.ks.s === undefined) {
                        layer.ks.s = { a: 0, k: [100 * scale, 100 * scale, 100 * scale] };
                    }
                }
            }
        }
    }
    return JSON.stringify(json);
}
exports.convert = convert;
exports.default = convert;
