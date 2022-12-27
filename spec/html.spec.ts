import "jasmine"

import {
    _Node,
    _TagNode,
    _TextNode,
    _parseHtml
} from '../parser';

describe("_parseHtml", () => {
    it("should return an empty list of nodes if an empty string is provided", () => {
        expect(_parseHtml("")).toEqual([]);
    })

    it("should return a list of nodes if a string is provided", () => {
        expect(_parseHtml("<p>Test</p>")).toEqual([
            new _TagNode("p", {}, [new _TextNode("Test")])
        ]);
    })

    it("should handle text-only inputs", () => {
        expect(_parseHtml("Test")).toEqual([new _TextNode("Test")]);
    })

    it("should handle escaped entities", () => {
        expect(_parseHtml("Test&lt;Test&nbsp;")).toEqual([new _TextNode("Test<Test\u00a0")]);
    })

    it("should handle a sequential list of tags", () => {
        expect(_parseHtml("<p>Test1</p>text<p>Test2</p>")).toEqual([
            new _TagNode("p", {}, [new _TextNode("Test1")]),
            new _TextNode("text"),
            new _TagNode("p", {}, [new _TextNode("Test2")])
        ]);
    })

    it("should handle self-closing tags", () => {
        expect(_parseHtml("This is a<br/>test")).toEqual([
            new _TextNode("This is a"),
            new _TagNode("br", {}, []),
            new _TextNode("test")
        ]);
    })

    it("should handle nested tags", () => {
        expect(_parseHtml("<p><b>Test</b></p>")).toEqual([
            new _TagNode("p", {}, [
                new _TagNode("b", {}, [new _TextNode("Test")])
            ])
        ]);
    })

    it("should strip empty text nodes from the tree", () => {
        expect(_parseHtml("<p><b>Test</b> </p>")).toEqual([
            new _TagNode("p", {}, [
                new _TagNode("b", {}, [new _TextNode("Test")])
            ])
        ]);
    })

    it("should not strip nbsp; nodes from the tree", () => {
        expect(_parseHtml("<p><b>Test&nbsp;</b>!</p>")).toEqual([
            new _TagNode("p", {}, [
                new _TagNode("b", {}, [new _TextNode("Test\u00a0")]),
                new _TextNode("!")
            ])
        ]);
    })

    it("should handle attributes", () => {
        expect(_parseHtml("<p class='test'>Test</p>")).toEqual([
            new _TagNode("p", {class: "test"}, [new _TextNode("Test")])
        ]);
    })

    it("should handle multiple attributes", () => {
        expect(_parseHtml("<p class='test1' id='test2'>Test</p>")).toEqual([
            new _TagNode("p", {class: "test1", id: "test2"}, [new _TextNode("Test")])
        ]);
    })

    it("should handle attributes with double quotes", () => {
        expect(_parseHtml('<p class="test">Test</p>')).toEqual([
            new _TagNode("p", {class: "test"}, [new _TextNode("Test")])
        ]);
    })

    it("should handle attributes with no quotes", () => {
        expect(_parseHtml("<p class=test>Test</p>")).toEqual([
            new _TagNode("p", {class: "test"}, [new _TextNode("Test")])
        ]);
    })

    it("should handle attributes with no value", () => {
        expect(_parseHtml("<p disabled>Test</p>")).toEqual([
            new _TagNode("p", {disabled: ""}, [new _TextNode("Test")])
        ]);
    })
})