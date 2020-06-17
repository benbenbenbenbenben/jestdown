import { Input, Result, Tibu, Pattern, ResultTokens } from "tibu"

const { parse, rule, optional, many, either, token, all } = Tibu

// tokens
const newline = /\r\n|\r|\n\r|\n/
const indent = token("indent", /^[ \t]+/)
const space0ton = /[ \t]*/
const space1ton = /[ \t]+/

class Util {
    space0ton = /[ \t]*/;
    space1ton = /[ \t]+/;
    newline = /\r\n|\r|\n\r|\n/;
    indent = token("indent", /^(\t|    )/);
    indents: string[] = [];
    pushIndent = rule(optional(this.newline), this.indent, many(this.indent)).yields((r: ResultTokens) => {
        this.indents.push(r.one("indent"))
    });
    peekIndent = rule(this.space0ton, this.newline, (input: Input): Result => {
        const index = input.source.substring(input.location).indexOf(this.indents.join(""))
        if (index === 0) {
            input.location += this.indents.join("").length;
            return Result.pass(input);
        }
        return Result.fault(input);
    });
    popIndent = rule((input: Input): Result => {
        input// ?+
        this.indents.pop()
        return Result.pass(input)
    });
    EOF = rule((input: Input): Result => input.location === input.source.length ?
        Result.pass(input) : Result.fault(input));
    
    listitem = rule(either(
        token("li", /\-\s+/),
        token("li", /\*\s+/),
        token("li", /\d+\s+/),
    ), () => block).yields((r, c) => {
        return { type: "li", value: flatdef(c) }
    })
    
    indented = (repeat: any) => rule(
        all(this.pushIndent, repeat,
            many(this.peekIndent, repeat, this.space0ton),
            this.popIndent)
    ).yields((r, c) => {
        return {
            type: "indent", value: flatdef(c)
        }
    })
}
const util = new Util()

const flatdef = (args: any[]): any[] => {
    return args.reduce(
        (a, v) => a.concat(Array.isArray(v) ? flatdef(v) : v), []
    ).filter((x: any) => x)
}

const text = rule(token("txt", /[^\r\n]+/)).yields(
    r => {
        r // 
        return { type: "p", value: r.one("txt") }
    }
)

const heading = rule(token("#", /#+/), /\s+/, text).yields(
    (r, c) => {
        const level = r.get("#")[0].length // ?
        return {
            type: `h${level}`, value: flatdef(c)[0]
        }
    }
)

const emptylines = rule(
    either(
        all(util.space1ton, util.newline),
        util.newline
    )
).yields((r, c) => ({ type: "br" }))

const block = rule(
    either(util.indented(() => block), heading, util.listitem, text, emptylines)
).yields((r, c) => flatdef(c))

const document = rule(block, many(block)).yields((r, c) => {
    return {
        elements: flatdef(c)
    }
})

export const parseSource = (src: string) => {
    const result = parse(src)(
        document
    )
    return result[0]
}