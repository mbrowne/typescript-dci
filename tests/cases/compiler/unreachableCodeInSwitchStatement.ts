//@noUnreachableCode: true
function func1(): any {
    var x: string = "hello";
    switch (x) {
        case "h1":
            return;
        case "h2":
            return;
        case "h3":
            return;
    }
    var done = 0;  // this should be an error
}

function func2(): any {
    var x: string = "hello";
    switch (x) {
        case "h1":
            break;
        case "h2":
            return;
        case "h3":
            return;
    }
    var done = 0;  // this should not be an error
}


function func3(): any {
    var x: string = "hello";
    switch (x) {
        case "h1":
            break;
        case "h2":
            break;
        case "h3":
            break;
    }
    var done = 0;  // this should not be an error
}

function func4(): any {
    var x: string = "hello";
    switch (x) {
        case "h1":
        case "h2":
            break;
        case "h3":
            break;
    }
    var done = 0;  // this should not be an error
}

function func5(): any {
    var x: string = "hello";
    switch (x) {
        case "h1":
        case "h2":
            return;
        case "h3":
            break;
    }
    var done = 0;  // this should not be an error
}

function func6(): any {
    var x: string = "hello";
    outter: while (true) {
        switch (x) {
            case "h1":
            case "h2":
                return;
            case "h3":
                break outter;
        }
    }
    var done = 0;  // this should not be an error
}

function func7(): any {
    var x: string = "hello";
    outter: while (true) {
        switch (x) {
            case "h1":
            case "h2":
                break outter;
            case "h3":
                return;
        }
    }
    var done = 0;  // this should not be an error
}

function func8(): any {
    var x: string = "hello";
    inner: switch (x) {
        case "h1":
        case "h2":
            break inner;
        case "h3":
            return;
    }
    var done = 0;  // this should not be an error
}