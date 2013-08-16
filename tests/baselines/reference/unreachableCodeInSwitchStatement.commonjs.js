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
