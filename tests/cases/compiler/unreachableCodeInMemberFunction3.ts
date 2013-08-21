//@noUnreachableCode: true
class C1 {
    constructor() {
        return;
        var unreachable = 1;  // this should be an error
    }
}

class C2 {
    constructor() {
        var unreachable = 0;
        if (true) {
        }
        else {
            unreachable++;  // this should be an error
        }
    }
}

class C3 {
    constructor() {
        for (var i = 0; ;) {
        }
        var unreachable = 1;  // this should be an error
    }
}

class C4 {
    constructor() {
        var neverEndLoop = 0;
        while (true) {
        }
        neverEndLoop++;  // this should be an error
    }
}

class C5 {
    constructor() {
        try {
            return;
        }
        catch (error) {
            throw "some error";
        } finally {
        }
        var unreachableCode = 1;  // this should be an error
    }
}

class C6 {
    constructor() {
        try { }
        catch (error){ }
        finally {
            return 0;
        }
        var unreachableCode = 1;  // this should be an error
    }
}

class C7 {
    constructor() {
        try {
        }
        catch (error) {
            throw "Error";
        }
        finally { }
        var reachableCode = "hi";  // this should not be an error
    }
}
