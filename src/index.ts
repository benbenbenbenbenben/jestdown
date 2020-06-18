import { argv } from "yargs"

const compiler = argv.c || argv.compiler || "jest"
const pattern = argv.p || argv.pattern || "**/*.spec.md"
const patterns = argv._
const output = argv.o || argv.output || undefined

