function func1() {
    do {
    } while(true);
    var k = 0;
}

function func2() {
    do {
        return;
    } while(true);
    var k = 0;
}

function func3() {
    do {
        break;
    } while(true);
    var k = 0;
}

function func4() {
    do {
        do {
            if (true) {
                break;
            }
        } while(true);
        var j = 0;
    } while(true);
    var k = 0;
}

function func5() {
    do {
        do {
            if (true) {
                continue;
            }
        } while(true);
        var j = 0;
    } while(true);
    var k = 0;
}
