import { node } from "./types";

export default abstract class AbstractVisitor {
    visit(node:node):void {
        switch (node.type) {
            case "document":
                return this.visitDocument(node)
            case "indent":
                return this.visitIndent(node)
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
                return this.visitH(node)
            case "p":
                return this.visitP(node)
            case "li":
                return this.visitLI(node)
            case "br":
                return this.visitBR(node)
            default:
                throw `unknown node type: ${node.type}`
        }
    }
    visitDocument(node:node):void {
        (node.value as node[]).forEach(subnode => {
            this.visit(subnode)
        });
    }
    abstract visitIndent(node:node):void
    abstract visitH(node:node):void
    abstract visitP(node:node):void
    abstract visitBR(node:node):void
    abstract visitA(node:node):void
    abstract visitLI(node:node):void
}