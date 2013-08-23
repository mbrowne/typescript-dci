function func1() {
    var x = "hello";
    switch (x) {
        case "h1":
            return;
        case "h2":
            return;
        case "h3":
            return;
    }
    var done = 0;
}

function func2() {
    var x = "hello";
    switch (x) {
        case "h1":
            break;
        case "h2":
            return;
        case "h3":
            return;
    }
    var done = 0;
}

function func3() {
    var x = "hello";
    switch (x) {
        case "h1":
            break;
        case "h2":
            break;
        case "h3":
            break;
    }
    var done = 0;
}

function func4() {
    var x = "hello";
    switch (x) {
        case "h1":
        case "h2":
            break;
        case "h3":
            break;
    }
    var done = 0;
}

function func5() {
    var x = "hello";
    switch (x) {
        case "h1":
        case "h2":
            return;
        case "h3":
            break;
    }
    var done = 0;
}

function func6() {
    var x = "hello";
    outter:
    while (true) {
        switch (x) {
            case "h1":
            case "h2":
                return;
            case "h3":
                break outter;
        }
    }
    var done = 0;
}

function func7() {
    var x = "hello";
    outter:
    while (true) {
        switch (x) {
            case "h1":
            case "h2":
                break outter;
            case "h3":
                return;
        }
    }
    var done = 0;
}

function func8() {
    var x = "hello";
    inner:
    switch (x) {
        case "h1":
        case "h2":
            break inner;
        case "h3":
            return;
    }
    var done = 0;
}
