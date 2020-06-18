"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = require("yargs");
var compiler = yargs_1.argv.c || yargs_1.argv.compiler || "jest";
var pattern = yargs_1.argv.p || yargs_1.argv.pattern || "**/*.spec.md";
var patterns = yargs_1.argv._;
var output = yargs_1.argv.o || yargs_1.argv.output || undefined;
