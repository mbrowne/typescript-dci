//@noUnreachableCode: true
function func1(): any {
    throw "RANDOM";
    var notReach = 0;  // this should be an error
}

function func2(): void{
    try {
        var declareIntry = 0;
        return;
    }
    catch (err) {
        throw "In Catch";
    }
    var unreachableCode = 0;  // this should be an error
}

function func3(): void {
    try {
        var declareIntry = 0;
        return;
    }
    catch (err) {
    }
    var reachableCode = 0;  // this should not be an error
}

function func4(): void{
    try {
        var declareIntry = 0;
    }
    catch (err) {
        throw "In Catch";
    }
    var reachableCode = 0;  // this should not be an error
}

function func5(): any{
    try {
        var declareIntry = 0;
    }
    catch (err) {
        throw "In Catch";
    }
    finally {
        return;
    }
    var unreachableCode = 0;  // this should be an error
}

function func6(): any {
    try {
        return;
    }
    catch (err) {
        return;
    }
    finally {
    }
    var unreachableCode = 0;  // this should be an error
}

function func7(): any {
    try {
        return;
    }
    catch (err) {
        return;
    }
    var unreachableCode = 0;  // this should be an error
}

function func8(): any {
    try {
    }
    catch (err) {
    }
    finally {
        return;
    }
    var unreachableCode = 0;  // this should be an error
}

function func9(): any {
    try {
        throw "error";
    }
    catch (err) {
        throw "error";
    }
    finally {
    }
    var unreachableCode = 0;  // this should be an error
}