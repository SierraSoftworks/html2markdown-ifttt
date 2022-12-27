import "jasmine";

import {
    _unescapeHtml
} from '../parser';

describe("_unescapeHtml", () => {
    it("should return an empty string if none is provided", () => {
        expect(_unescapeHtml("")).toEqual("");
    })

    it("should convert &lt; to <", () => {
        expect(_unescapeHtml("&lt;")).toEqual("<");
    })

    it("should convert &gt; to >", () => {
        expect(_unescapeHtml("&gt;")).toEqual(">");
    })

    it("should convert &amp; to &", () => {
        expect(_unescapeHtml("&amp;")).toEqual("&");
    })

    it("should convert &quot; to \"", () => {
        expect(_unescapeHtml("&quot;")).toEqual("\"");
    })

    it("should convert &apos; to '", () => {
        expect(_unescapeHtml("&apos;")).toEqual("'");
    })

    it("should convert &nbsp; to \\u00a0", () => {
        expect(_unescapeHtml("&nbsp;")).toEqual("\u00a0");
    })

    it("should convert a stream of text correctly", () => {
        expect(_unescapeHtml("Test&lt;Test&nbsp;")).toEqual("Test<Test\u00a0");
    })
})