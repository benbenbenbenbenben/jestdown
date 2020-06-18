import { parseSource } from "./parser"

describe('index', () => {
    it('should parse h1', async () => {
        expect(parseSource(
            `# foobar dingus`
        )).toStrictEqual({
            type:"document",
            value: [
                {
                    type: "h1", value: {
                        type: "p", value: "foobar dingus"
                    }
                }
            ]
        })
    })
    it('should parse h1', async () => {
        expect(parseSource(
            "## foobar dingus"
        )).toStrictEqual({
            type:"document",
            value: [
                {
                    type: "h2", value: {
                        type: "p", value: "foobar dingus"
                    }
                }
            ]
        })
    })
    it('should parse p', async () => {
        expect(parseSource(
            `foobar dingus`
        )).toStrictEqual({
            type:"document",
            value: [
                {
                    type: "p", value: "foobar dingus"
                }
            ]
        })
    })
    it('should parse ul', async () => {
        const parsed = parseSource(
            `- foobar dingus`
        ) 
        JSON.stringify(parsed, null, 2)// ?+
        expect(parsed).toStrictEqual({
            type:"document",
            value: [
                {
                    type: "li",
                    value: [{
                        type: "p", value: "foobar dingus"
                    }]
                }
            ]
        })
    })
    it('should parse a file', async () => {
        const test = require("fs").readFileSync("./test.hide.md").toString()
        let parsed = parseSource(test) // ?+
         require("fs").writeFileSync("test.hide.json", JSON.stringify(parsed, null, 2))
    })
})