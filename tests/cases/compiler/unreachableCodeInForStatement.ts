//@noUnreachableCode: true
function func1(): any {
    for (var i = 0; ;) {
        var x = 0;
    }
    var k = 0;  // this should be an error
}

function func2(): any {
    for (var i = 0; ;) {
        break;
    }
    var k = 0;  // this should not be an error
}

function func3(): any {
    for (var j = 0; ;) {
        return;
        var k = 0;  // this should be an error
    }
    var j = 0;  // this should be an error
}

function func4(): any {
    for (var j = 0; j < 5; ++j) { ; }
    var j = 0;  // this should not be an error
}

function func5(): any {
    for (var j = 0; j < 5; ++j) {
        return null;
    }
    var j = 0;  // this should be an error
}

function func6(): any {
    for (var i in this) {
        continue;
    }
    var j = 0;  // this should be an error
}

function func7(): any {
    for (var i in this) { ; }
    var j = 0;  // this should not be an error
}

function func8(): any {
    for(var i = 0;;){
        continue;
        var afterBreak = 0;  // this should be an error
    }
    var unreach = 0;  // this should be an error
}