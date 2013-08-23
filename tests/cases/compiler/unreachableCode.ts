//@noUnreachableCode: true
function func1(): any {
    return null;
    var x = 5;  // this should be an error
    var y = 6;
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

function func6(): void {
    var x = (a) => {
        return;
        a = 0;  // this should be an error
    };
    var x1 = {
        subFunc: (a: any) => {
            return;
            var x = 0;  // this should be an error
        }
    }
}

function func7(x): any {
    with (x) {
        return;
        var a = 0;  // this should be an error
    }
    return (a) => {
        return;
        a = 0;  // this should be an error
    }
}

function func8(funC: (a) => any) { }
func8(function (a) {
    return null;
    a = 0;  // this should be an error
});

func8((a) => {
    return;
});

function fun9() {
    var x = a => {
        return;
        var hi = "hello";  // this should be an error
    };
}

var object = {
    get propertyX(): any {
        return null;
        var x = 0;  // this should be an error
    },

    set propertyX(newV: any) {
        throw "error";
        var x = 0;  // this should be an error
    }
}

function func10() {
    O: while (true) {
        I: while (true) {
            if (true) {
                break;
            }
        }
        var x = 1;  // this should not be an error
    }
}

function func11() {
    O: while (true) {
        I: while (true) {
            if (false) {
                break;  // this should be an error
            }
        }
        var x = 1;  // this should be an error
    }
}