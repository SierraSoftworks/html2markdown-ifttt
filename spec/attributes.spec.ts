import "jasmine";

import {
    _parseAttributes
} from '../parser';

describe("_parseAttributes", () => {
    it("should return an empty object if an empty string is provided", () => {
        expect(_parseAttributes("")).toEqual({});
    })

    it("should return an object with a single attribute if a single attribute is provided", () => {
        expect(_parseAttributes("class='test'")).toEqual({class: "test"});
    })

    it("should return an object with multiple attributes if multiple attributes are provided", () => {
        expect(_parseAttributes("class='test1' id='test2'")).toEqual({class: "test1", id: "test2"});
    })

    it("should return an object with attributes with double quotes", () => {
        expect(_parseAttributes('class="test"')).toEqual({class: "test"});
    })

    it("should return an object with attributes with no value", () => {
        expect(_parseAttributes("disabled")).toEqual({disabled: ""});
    })

    it("should return an object with attributes with no value and other attributes", () => {
        expect(_parseAttributes("disabled class='test'")).toEqual({disabled: "", class: "test"});
    })
})