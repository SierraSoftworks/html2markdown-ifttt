import {describe, it} from 'node:test';
import {strict as assert} from "node:assert";

import {
    _Node,
    _TagNode,
    _TextNode,
    _parseAttributes,
    _parseHtml,
    htmlToMarkdown
} from '../parser.mjs';

describe("_parseAttributes", () => {
    it("should return an empty object if an empty string is provided", () => {
        const result = _parseAttributes("");
        assert.deepEqual(result, {});
    })

    it("should return an object with a single attribute if a single attribute is provided", () => {
        const result = _parseAttributes("class='test'");
        assert.deepEqual(result, {class: "test"});
    })

    it("should return an object with multiple attributes if multiple attributes are provided", () => {
        const result = _parseAttributes("class='test1' id='test2'");
        assert.deepEqual(result, {class: "test1", id: "test2"});
    })

    it("should return an object with attributes with double quotes", () => {
        const result = _parseAttributes('class="test"');
        assert.deepEqual(result, {class: "test"});
    })

    it("should return an object with attributes with no value", () => {
        const result = _parseAttributes("disabled");
        assert.deepEqual(result, {disabled: ""});
    })

    it("should return an object with attributes with no value and other attributes", () => {
        const result = _parseAttributes("disabled class='test'");
        assert.deepEqual(result, {disabled: "", class: "test"});
    })
})

describe("_parseHtml", () => {
    it("should return an empty list of nodes if an empty string is provided", () => {
        const result = _parseHtml("");
        assert.deepEqual(result, []);
    })

    it("should return a list of nodes if a string is provided", () => {
        const result = _parseHtml("<p>Test</p>");
        assert.deepEqual(result, [
            new _TagNode("p", {}, [new _TextNode("Test")])
        ]);
    })

    it("should handle text-only inputs", () => {
        const result = _parseHtml("Test");
        assert.deepEqual(result, [new _TextNode("Test")]);
    })

    it("should handle a sequential list of tags", () => {
        const result = _parseHtml("<p>Test1</p>text<p>Test2</p>");
        assert.deepEqual(result, [
            new _TagNode("p", {}, [new _TextNode("Test1")]),
            new _TextNode("text"),
            new _TagNode("p", {}, [new _TextNode("Test2")])
        ]);
    })

    it("should handle self-closing tags", () => {
        const result = _parseHtml("<br/>");
        assert.deepEqual(result, [new _TagNode("br", {}, [])]);
    })

    it("should handle nested tags", () => {
        const result = _parseHtml("<p><b>Test</b></p>");
        assert.deepEqual(result, [
            new _TagNode("p", {}, [
                new _TagNode("b", {}, [new _TextNode("Test")])
            ])
        ]);
    })

    it("should handle attributes", () => {
        const result = _parseHtml("<p class='test'>Test</p>");
        assert.deepEqual(result, [
            new _TagNode("p", {class: "test"}, [new _TextNode("Test")])
        ]);
    })

    it("should handle multiple attributes", () => {
        const result = _parseHtml("<p class='test1' id='test2'>Test</p>");
        assert.deepEqual(result, [
            new _TagNode("p", {class: "test1", id: "test2"}, [new _TextNode("Test")])
        ]);
    })

    it("should handle attributes with double quotes", () => {
        const result = _parseHtml('<p class="test">Test</p>');
        assert.deepEqual(result, [
            new _TagNode("p", {class: "test"}, [new _TextNode("Test")])
        ]);
    })

    it("should handle attributes with no quotes", () => {
        const result = _parseHtml("<p class=test>Test</p>");
        assert.deepEqual(result, [
            new _TagNode("p", {class: "test"}, [new _TextNode("Test")])
        ]);
    })

    it("should handle attributes with no value", () => {
        const result = _parseHtml("<p class>Test</p>");
        assert.deepEqual(result, [
            new _TagNode("p", {class: ""}, [new _TextNode("Test")])
        ]);
    })
})

describe("htmlToMarkdown", () => {
    it("should return an empty string if an empty string is provided", () => {
        const result = htmlToMarkdown("");
        assert.equal(result, "");
    })

    it("should handle text-only inputs", () => {
        const result = htmlToMarkdown("Test");
        assert.equal(result, "Test");
    })

    it("should handle a sequential list of tags", () => {
        const result = htmlToMarkdown("<p>Test1</p>text<p>Test2</p>");
        assert.equal(result, "Test1\n\ntext\n\nTest2");
    })

    it("should handle self-closing tags", () => {
        const result = htmlToMarkdown("This is a<br/>test");
        assert.equal(result, "This is a\ntest");
    })

    it("should handle nested tags", () => {
        const result = htmlToMarkdown("<p><b>Test</b></p>");
        assert.equal(result, "**Test**");
    })

    it("should handle links", () => {
        const result = htmlToMarkdown("<a href='https://example.com'>Test</a>");
        assert.equal(result, "[Test](https://example.com)");
    })

    it("should handle images", () => {
        const result = htmlToMarkdown("<img src='https://example.com/test.png' alt='Test'>");
        assert.equal(result, "![Test](https://example.com/test.png)");
    })

    it("should handle headers", () => {
        const result = htmlToMarkdown("<h1>Test</h1><p>This is a test</p>");
        assert.equal(result, "# Test\n\nThis is a test");
    })
})