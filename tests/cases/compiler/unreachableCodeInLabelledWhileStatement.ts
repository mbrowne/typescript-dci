//@noUnreachableCode: true
function func1(): void {
    outter: while (true) {
        inner: while (true) {
            var x = 22;
            if (22) {
                continue outter;
                var unreach1 = 0;  // this should be an error
            }
            else {
                break outter;
            }
            var u22 = 0;  // this should be an error
        }
        var unreach2 = 0;  // this should be an error
    } 
    var unreach = 0;  // this should not be an error
}

function func2(): void {
    outter: while (true) {
        inner: while (true) {
            if (true) {
                break outter;
                var unreach1 = 0;  // this should be an error
            }
        }
        var unreach2 = 0;  // this should be an error
    }
    var reach = 0;  // this should not be an error
}

function func3(): void {
    outter: while (true) {
        inner: while (true) {
            var x = 22;
            if (22) {
                continue outter;
                var unreach1 = 0;  // this should be an error
            }
            else { }
            var u22 = 0;  // this should not be an error
        }
        var unreach2 = 0;  // this should be an error
    }
    var unreach = 0;  // this should be an error
}