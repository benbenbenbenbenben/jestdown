import AbstractVisitor from "../AbstractVisitor";
import { node } from "../types";

class JestBlock {
    parent?: JestBlock
    blocks: JestBlock[] = []
    constructor(parent?: JestBlock) {
    }
    *getAncestors(predicate?:(ancestor:JestBlock) => boolean):IterableIterator<JestBlock> {
        if (this.parent) {
            if (predicate) {
                if(predicate(this.parent)) {
                    yield this.parent
                }
            } else {
                yield this.parent
            }
            return this.parent.getAncestors(predicate)
        }
    }
}

class JestFunctionBlock extends JestBlock {
    name:string
    constructor(parent:JestBlock, name:string) {
        super(parent)
        this.name = name
    }
}

class JestDescribeBlock extends JestFunctionBlock {
    level:number
    constructor(parent:JestBlock, name:string, level:number) {
        super(parent, name)
        this.level = level
    }
 }

class JestTestBlock extends JestFunctionBlock { }

class JestDocument extends JestBlock { 
    root = true
}

export default class JestVisitor extends AbstractVisitor {
    current:JestBlock = new JestDocument()
    indent:number = 0
    visitDocument(node:node): void {
        this.current = new JestDocument()
        this.indent = 0
        super.visitDocument(node)
    }
    visitIndent(node: node): void {
        this.indent++
    }
    visitH(node: node): void {
        const level = parseInt(node.type.substring(1))
        // parent of Hn must be Hn-1 or root
        const parent = this.current.getAncestors((c:any) => c.level === (level - 1) || c.root).next().value
        const next = new JestDescribeBlock(parent, "describebar", level)
        parent.blocks.push(next)
        this.current = next
    }
    visitP(node: node): void {
        //
    }
    visitBR(node: node): void {
        //
    }
    visitA(node: node): void {
        //
    }
    visitLI(node: node): void {
        const next = new JestTestBlock(this.current, "testbar")
        this.current.blocks.push(next)
        // is test nested?
        if (this.indent) {
            this.indent--
            this.current = next
        }
    }
}