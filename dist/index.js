"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tibu_1 = require("tibu");
var parse = tibu_1.Tibu.parse, rule = tibu_1.Tibu.rule, optional = tibu_1.Tibu.optional, many = tibu_1.Tibu.many, either = tibu_1.Tibu.either, token = tibu_1.Tibu.token, all = tibu_1.Tibu.all;
// tokens
var newline = /\r\n|\r|\n\r|\n/;
var indent = token("indent", /^[ \t]+/);
var space0ton = /[ \t]*/;
var space1ton = /[ \t]+/;
var Util = /** @class */ (function () {
    function Util() {
        var _this = this;
        this.space0ton = /[ \t]*/;
        this.space1ton = /[ \t]+/;
        this.newline = /\r\n|\r|\n\r|\n/;
        this.indent = token("indent", /^(\t|    )/);
        this.indents = [];
        this.pushIndent = rule(optional(this.newline), this.indent, many(this.indent)).yields(function (r) {
            _this.indents.push(r.one("indent"));
        });
        this.peekIndent = rule(this.space0ton, this.newline, function (input) {
            var index = input.source.substring(input.location).indexOf(_this.indents.join(""));
            if (index === 0) {
                input.location += _this.indents.join("").length;
                return tibu_1.Result.pass(input);
            }
            return tibu_1.Result.fault(input);
        });
        this.popIndent = rule(function (input) {
            input; // ?+
            _this.indents.pop();
            return tibu_1.Result.pass(input);
        });
        this.EOF = rule(function (input) { return input.location === input.source.length ?
            tibu_1.Result.pass(input) : tibu_1.Result.fault(input); });
        this.listitem = rule(either(token("li", /\-\s+/), token("li", /\*\s+/), token("li", /\d+\s+/)), function () { return block; }).yields(function (r, c) {
            return { type: "li", value: flatdef(c) };
        });
        this.indented = function (repeat) { return rule(all(_this.pushIndent, repeat, many(_this.peekIndent, repeat, _this.space0ton), _this.popIndent)).yields(function (r, c) {
            return {
                type: "indent", value: flatdef(c)
            };
        }); };
    }
    return Util;
}());
var util = new Util();
var flatdef = function (args) {
    return args.reduce(function (a, v) { return a.concat(Array.isArray(v) ? flatdef(v) : v); }, []).filter(function (x) { return x; });
};
var text = rule(token("txt", /[^\r\n]+/)).yields(function (r) {
    r; // 
    return { type: "p", value: r.one("txt") };
});
var heading = rule(token("#", /#+/), /\s+/, text).yields(function (r, c) {
    var level = r.get("#")[0].length; // ?
    return {
        type: "h" + level, value: flatdef(c)[0]
    };
});
var emptylines = rule(either(all(util.space1ton, util.newline), util.newline)).yields(function (r, c) { return ({ type: "br" }); });
var block = rule(either(util.indented(function () { return block; }), heading, util.listitem, text, emptylines)).yields(function (r, c) { return flatdef(c); });
var document = rule(block, many(block)).yields(function (r, c) {
    return {
        elements: flatdef(c)
    };
});
exports.parseSource = function (src) {
    var result = parse(src)(document);
    return result[0];
};
