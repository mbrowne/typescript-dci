//@noUnreachableCode: true
function func1(): any {
    if (true) {
        var x: any;
    }
    else {
        var y = 1;  // this should be an error
        var j = 0;
    }
}

function func2(): any {
    if (false) {
        var x: any;  // this should be an error
    }
    else {
        var y = 1;
        var j = 0;
    }
}


function func3(x: number): any {
    if (x === 5) {
        var x1: any;
        return;
    }
    else {
        var y = 1;
        var j = 0;
        return;
    }
    var j = 0;  // this should be an error
}

function func4(x: number): any {
    if (x === 5) {
        var x1: any;
    }
    else {
        var y = 1;
        var j = 0;
        return;
    }
    var j = 0;  // this should not be an error
}

function func5(x: number): any {
    if (x === 5) {
        var x1: any;
        return;
    }
    else {
        var y = 1;
        var j = 0;
    }
    var j = 0;  // this should not be an error
}