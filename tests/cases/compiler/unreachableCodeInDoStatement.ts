//@noUnreachableCode: true
function func1(): any {
    do {
    } while (true);
    var k = 0;  // this should be an error
}

function func2(): any {
    do {
        return;
    } while (true);
    var k = 0;  // this should be an error
}

function func3(): any {
    do {
        break;
    } while (true);
    var k = 0;  // this should not be an error
}

function func4(): any {
    do {
        do {
            if (true) {
                break;
            }
        } while (true);
        var j = 0;  // this should not be an error
    } while (true);
    var k = 0;  // this should be an error
}

function func5(): any {
    do {
        do {
            if (true) {
                continue;
            }
        } while (true);
        var j = 0;  // this should be an error
    } while (true);
    var k = 0;  // this should be an error
}