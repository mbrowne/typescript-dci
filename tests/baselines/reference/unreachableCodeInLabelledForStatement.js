function func1() {
    outter:
    for (var i = 0; ;) {
        inner:
        for (var j = 0; ;) {
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
    for (var i = 0; ;) {
        inner:
        for (var i = 0; ;) {
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
    for (var i = 0; ;) {
        inner:
        for (var j = 0; ;) {
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
