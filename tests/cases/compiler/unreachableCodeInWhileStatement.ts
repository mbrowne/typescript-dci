//@noUnreachableCode: true
function func1(): any {
    while (true) {
        //break;
    }
    var unreach = 0;  // this should be an error
}

function func2(): any {
    while (true) {
        while (true) {
            if (false) {
                break;  // this should be an error
            }
        }
        var x = 0;  // this should be an error
    }
}

function func3(): any {
    while (true) {
        return null;
    }
    var x = 0;  // this should be an error
}


function func4(): any {
    while (true) {
        continue;
        var afterBreak = 0;  // this should be an error
    }

    var unreach = 0;  // this should be an error
}

function func5(): any {
    while (true) {
        break;
        var afterBreak = 0;  // this should be an error
    }
    var unreach = 0;  // this should not be an error
}

function func6(): any {
    while (true) {
        while (true) {
            if (true) {
                continue;
            }
        }
        var afterBreak = 0;  // this should be an error
    }
    var unreach = 0;  // this should be an error
}