//@noUnreachableCode: true
function func1(): any {
    return null;
    var x = 5;  // this should be an error
    var y = 6;
}

function func2(): void {
    continue; // this should be an error
}

function func3(): void {
    throw "an error may be?";
    var x = 0  // this should be an error
}

function func4(): void {
    var x = 4;
    return;
    ++x;  // this should be an error
    x = x - 1;
}

function func5(): void {
    var x = 4;
    return;
    ;  // this shouldn't be an error (following C#)
}