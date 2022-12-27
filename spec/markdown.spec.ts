import 'jasmine';

import {
    htmlToMarkdown
} from '../parser';

describe("htmlToMarkdown", () => {
    it("should return an empty string if an empty string is provided", () => {
        expect(htmlToMarkdown("")).toEqual("");
    })

    it("should handle text-only inputs", () => {
        expect(htmlToMarkdown("Test")).toEqual("Test");
    })

    it("should handle a sequential list of tags", () => {
        expect(htmlToMarkdown("<p>Test1</p>text<p>Test2</p>")).toEqual("Test1\n\ntext\n\nTest2");
    })

    it("should handle self-closing tags", () => {
        expect(htmlToMarkdown("This is a<br/>test")).toEqual("This is a\ntest");
    })

    it("should handle nested tags", () => {
        expect(htmlToMarkdown("<p><b>Test</b></p>")).toEqual("**Test**");
    })

    it("should handle links", () => {
        expect(htmlToMarkdown("<a href='https://example.com'>Test</a>")).toEqual("[Test](https://example.com)");
    })

    it("should handle images", () => {
        expect(htmlToMarkdown("<img src='https://example.com/test.png' alt='Test'>")).toEqual("![Test](https://example.com/test.png)");
    })

    it("should handle headers", () => {
        expect(htmlToMarkdown("<h1>Test</h1><p>This is a test</p>")).toEqual("# Test\n\nThis is a test");
    })
})