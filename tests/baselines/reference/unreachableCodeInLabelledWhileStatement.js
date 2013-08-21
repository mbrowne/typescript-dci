function func1() {
    outter:
    while (true) {
        inner:
        while (true) {
            var x = 22;
            if (22) {
                continue outter;
                var unreach1 = 0;
            } else {
                break outter;
            }
            var u22 = 0;
        }
        var unreach2 = 0;
    }
    var unreach = 0;
}

function func2() {
    outter:
    while (true) {
        inner:
        while (true) {
            if (true) {
                break outter;
                var unreach1 = 0;
            }
        }
        var unreach2 = 0;
    }
    var reach = 0;
}

function func3() {
    outter:
    while (true) {
        inner:
        while (true) {
            var x = 22;
            if (22) {
                continue outter;
                var unreach1 = 0;
            } else {
            }
            var u22 = 0;
        }
        var unreach2 = 0;
    }
    var unreach = 0;
}
