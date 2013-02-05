///<reference path='_project.ts'/>

describe('getBraceMatchingAtPosition', function() {
    var __typescriptLS = new Harness.TypeScriptLS();

    __typescriptLS.addDefaultLibrary();

    var fileName = 'tests/cases/unittests/services/testCode/getBraceMatchingAtPosition.ts';

    __typescriptLS.addFile(fileName);

    var __ls = __typescriptLS.getLanguageService();

    //
    // line and column are 1-based
    //
    function lineColToPosition(fileName: string, line: number, col: number): number {
        var script = __ls.languageService.getScriptAST(fileName);
        assert.notNull(script);

        var lineMap = script.locationInfo.lineMap;

        assert.is(line >= 1);
        assert.is(col >= 1);
        assert.is(line < lineMap.length);
        var offset = lineMap[line] + (col - 1);

        assert.is(offset < script.limChar);
        return offset;
    }

    //
    // line and column are 1-based
    //
    function getBraceMatching(fileName, line, column): TextSpan[]{
        var position = lineColToPosition(fileName, line, column);
        return __ls.pullLanguageService.getMatchingBraceSpans(fileName, position);
    }

    describe("test cases for brace matching", function() {

        it("matches open curly brace", function() {
            var result = getBraceMatching(fileName, 1, 12);

            assert.notNull(result);
            assert.equal(2, result.length);
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 1, 12); });
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 12, 1); });
        });

        it("matches close curly brace", function() {
            var result = getBraceMatching(fileName, 12, 2);

            assert.notNull(result);
            assert.equal(2, result.length);
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 1, 12); });
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 12, 1); });
        });

        it("matches both open and close curly brace", function() {
            var result = getBraceMatching(fileName, 9, 25);

            assert.notNull(result);
            assert.equal(4, result.length);
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 9, 22); });
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 9, 24); });
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 9, 25); });
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 9, 27); });
        });

        it("does not match curly brace in comments", function() {
            var result = getBraceMatching(fileName, 15, 4);

            assert.notNull(result);
            assert.equal(0, result.length);
        });

        it("does not match parenthesis in comments", function() {
            var result = getBraceMatching(fileName, 16, 4);

            assert.notNull(result);
            assert.equal(0, result.length);
        });

        it("does not match square brace in comments", function() {
            var result = getBraceMatching(fileName, 17, 4);

            assert.notNull(result);
            assert.equal(0, result.length);
        });

        it("matchs open angular brace in template defintion", function() {
            var result = getBraceMatching(fileName, 20, 20);

            assert.notNull(result);
            assert.equal(2, result.length);
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 20, 20); });
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 20, 41); });
        });

        it("matchs close angular brace in template defintion", function() {
            var result = getBraceMatching(fileName, 20, 42);

            assert.notNull(result);
            assert.equal(2, result.length);
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 20, 41); });
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 20, 20); });
        });

        it("matchs open angular brace in cast expressions", function() {
            var result = getBraceMatching(fileName, 22, 16);

            assert.notNull(result);
            assert.equal(2, result.length);
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 22, 16); });
            assert.arrayContainsOnce(result, function(item) { return item.start() === lineColToPosition(fileName, 22, 20); });
        });

        it("does not match angle brackets in comments", function() {
            var result = getBraceMatching(fileName, 18, 4);

            assert.notNull(result);
            assert.equal(0, result.length);
        });

        it("does not match less than in binary expressions", function() {
            var result = getBraceMatching(fileName, 25, 18);

            assert.notNull(result);
            assert.equal(0, result.length);
        });

        it("does not match greater than in binary expressions", function() {
            var result = getBraceMatching(fileName, 25, 27);

            assert.notNull(result);
            assert.equal(0, result.length);
        });
    });
});
