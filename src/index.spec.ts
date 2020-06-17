import { parseSource } from "."

describe('index', () => {
    it('should parse h1', async () => {
        expect(parseSource(
            `# foobar dingus`
        )).toStrictEqual({
            elements: [
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
            elements: [
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
            elements: [
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
            elements: [
                {
                    type: "li",
                    value: [{
                        type: "p", value: "foobar dingus"
                    }]
                }
            ]
        })
    })
    fit('should parse a file', async () => {
        const test = require("fs").readFileSync("./test.hide.md").toString()
        let parsed = parseSource(test) // ?+
         require("fs").writeFileSync("test.hide.json", JSON.stringify(parsed, null, 2))
    })
})