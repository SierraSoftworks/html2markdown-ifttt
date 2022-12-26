export abstract class _Node {
    abstract kind(): string
    abstract toString(): string
}

export class _TextNode extends _Node {
    constructor(public text: string) {
        super()
    }

    kind() {
        return 'text'
    }

    toString() {
        return this.text
    }
}

export class _TagNode extends _Node {
    constructor(public tag: string, public attrs: { [key: string]: string } = {}, public children: _Node[] = []) {
        super()
    }

    kind() {
        return `<${this.tag}/>`
    }

    toString() {
        const attrs = Object.keys(this.attrs).map(key => `${key}="${this.attrs[key]}"`).join(' ')
        return `<${this.tag}${attrs ? ` ${attrs}` : ''}>${this.children.map(c => c.toString()).join('')}</${this.tag}>`
    }
}

// Parses a string containing XML node attributes into a dictionary.
// It supports the following formats:
// - key="value"
// - key='value'
// - key=value
// - key
// 
// The parser is implemented using a simple recursive descent parser
export function _parseAttributes(input: string): { [key: string]: string } {
    const attrs: { [key: string]: string } = {}
    let cursor = 0

    function parseKey(): string {
        let key = ''
        while (cursor < input.length) {
            const ch = input[cursor]
            if (ch === '=' || ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
                break
            }

            key += ch
            cursor++
        }

        return key
    }

    function parseValue(): string {
        if (input[cursor] !== '=') {
            return ''
        }

        cursor++;

        const q = input[cursor]
        if (q === '"' || q === "'") {
            return parseQuotedValue(q)
        }

        return parseUnquotedValue()
    }

    function parseQuotedValue(quote: string): string {
        cursor++
        let value = ''
        while (cursor < input.length) {
            const ch = input[cursor]
            if (ch === quote) {
                break
            }

            value += ch
            cursor++
        }

        cursor++
        return value
    }

    function parseUnquotedValue(): string {
        let value = ''
        while (cursor < input.length) {
            const ch = input[cursor]
            if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
                break
            }

            value += ch
            cursor++
        }

        return value
    }

    while (cursor < input.length) {
        const ch = input[cursor]
        if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
            cursor++
            continue
        }

        const key = parseKey()
        const value = parseValue()
        attrs[key] = value
    }

    return attrs
}

export function _parseHtml(input: string): _Node[] {
    // A recursive descent parser for HTML which returns a list of nodes.

    const stack: _Node[] = []
    const nodes: _Node[] = []
    let cursor = 0

    function push(node: _Node) {
        if (stack.length > 0) {
            const parent = stack[stack.length - 1]
            if (parent instanceof _TagNode) {
                parent.children.push(node)
            } else {
                throw new Error(`Invalid HTML: Cannot add a child node to a text node at position ${cursor}`)
            }
        } else {
            nodes.push(node)
        }

        if (node instanceof _TagNode) {
            stack.push(node)
        }
    }

    while (cursor < input.length) {
        const nextTag = input.indexOf('<', cursor)
        if (nextTag === -1) {
            push(new _TextNode(input.substring(cursor)))
            break
        }

        if (nextTag > cursor) {
            push(new _TextNode(input.substring(cursor, nextTag)))
        }

        const endTag = input.indexOf('>', nextTag)
        if (endTag === -1) {
            throw new Error(`Invalid HTML: Could not find end of tag ('>') at position ${nextTag}`)
        }

        const tag = input.substring(nextTag + 1, endTag)

        if (tag[0] === '/') {
            const tagName = tag.substring(1)
            const node = stack.pop()
            if (!node || !(node instanceof _TagNode) || node.tag !== tagName) {
                throw new Error(`Invalid HTML: The end tag '${tagName}' does not match the start tag '${node && node.kind() || '!!MISSING!!'}' at position ${nextTag}`)
            }
        } else {
            const tagNamePivot = tag.indexOf(' ')
            const tagName = tag.substring(0, tagNamePivot !== -1 ? tagNamePivot : (tag[tag.length - 1] === '/' ? tag.length - 1 : tag.length))

            const attrs = tagNamePivot !== -1 ? tag.substring(tagNamePivot + 1, tag[tag.length - 1] === '/' ? tag.length - 1 : tag.length) : ''
            push(new _TagNode(tagName, _parseAttributes(attrs)))

            if (tagName === 'br' || tagName === 'hr' || tagName === 'img' || tag[tag.length - 1] === '/') {
                // Self-closing tag
                stack.pop()
            }
        }

        cursor = endTag + 1
    }

    return nodes
}

export class _NodeVisitor {
    visit(node: _Node): void {
        if (node instanceof _TextNode) {
            this.onText(node)
        } else if (node instanceof _TagNode) {
            this.onTag(node)
        } else {
            this.onOther(node)
        }
    }

    onText(node: _TextNode): void {}

    onTag(node: _TagNode): void {
        node.children.forEach(c => this.visit(c))
    }

    onOther(node: _Node): void {}
}

export class _MarkdownVisitor extends _NodeVisitor {
    public output: string = ''

    onText(node: _TextNode): void {
        this.output += node.text
    }

    onTag(node: _TagNode): void {
        const method = (this as any)[node.tag]
        if (method) {
            method.call(this, node)
        } else {
            super.onTag(node)
        }
    }

    p(node: _TagNode): void {
        this.output += `\n\n`
        super.onTag(node)
        this.output += `\n\n`
    }

    br(node: _TagNode): void {
        this.output += `\n`
    }

    h1(node: _TagNode): void {
        this.output += `# `
        super.onTag(node)
    }

    h2(node: _TagNode): void {
        this.output += `## `
        super.onTag(node)
    }

    h3(node: _TagNode): void {
        this.output += `### `
        super.onTag(node)
    }

    h4(node: _TagNode): void {
        this.output += `#### `
        super.onTag(node)
    }

    h5(node: _TagNode): void {
        this.output += `##### `
        super.onTag(node)
    }

    h6(node: _TagNode): void {
        this.output += `###### `
        super.onTag(node)
    }

    b(node: _TagNode): void {
        this.output += `**`
        super.onTag(node)
        this.output += `**`
    }

    strong(node: _TagNode): void {
        this.b(node)
    }

    i(node: _TagNode): void {
        this.output += `*`
        super.onTag(node)
        this.output += `*`
    }

    em(node: _TagNode): void {
        this.i(node)
    }

    u(node: _TagNode): void {
        this.output += `__`
        super.onTag(node)
        this.output += `__`
    }

    pre(node: _TagNode): void {
        this.output += `\`\`\`\n`
        super.onTag(node)
        this.output += `\n\`\`\``
    }

    code(node: _TagNode): void {
        this.output += `\``
        super.onTag(node)
        this.output += `\``
    }

    a(node: _TagNode): void {
        const href = node.attrs['href']
        if (href) {
            this.output += `[`
            super.onTag(node)
            this.output += `](${href})`
        } else {
            super.onTag(node)
        }
    }

    img(node: _TagNode): void {
        const src = node.attrs['src']
        if (src) {
            this.output += `![`
            this.output += node.attrs['alt'] || node.attrs['title'] || ''
            this.output += `](${src})`
        } else {
            super.onTag(node)
        }
    }

    ul(node: _TagNode): void {
        this.output += `\n`
        super.onTag(node)
    }

    ol(node: _TagNode): void {
        this.output += `\n`
        super.onTag(node)
    }

    li(node: _TagNode): void {
        this.output += `\n* `
        super.onTag(node)
    }

    hr(node: _TagNode): void {
        this.output += `\n\n---\n\n`
    }
}

export function htmlToMarkdown(input: string): string {
    const nodes = _parseHtml(input)
    const visitor = new _MarkdownVisitor()
    nodes.forEach(n => visitor.visit(n))
    return visitor.output.trim()
}