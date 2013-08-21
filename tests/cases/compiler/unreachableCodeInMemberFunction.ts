//@noUnreachableCode: true
class C1 {
    public func1(): void {
        return;
        var unreachable: string;  // this should be an error
    }

    public func2(): void {
        if (true) {
        }
        else {
            var unreachable: any;  // this should be an error
        }
    }

    public func3(): void {
        if (false) {
            var unreachable: any;  // this should be an error
        }
        else {
        }
    }

    public func4(): void {
        for (var i = 0; ;) {
        }
        var unreachable: any;  // this should be an error
    }

    public func5(): void {
        while (true) {
        }
        var unreachable: any;  // this should be an error
    }

    public func6(): void {
        try {
            return;
        }
        catch (err) {
        }
        finally {
        }
        var reachable = 1;  // this should not be an error
    }

    public func7(): void {
        try {
            return;
        }
        catch (err) {
            throw "some error";
        }
        finally {
        }
        var unreachable = 1;  // this should be an error
    }

    public func8(): void {
        try {
        }
        catch (err) {
        }
        finally {
            return;
        }
        var unreachable = 1;  // this should be an error
    }

    public func9(): void {
        while (true) {
            while (true) {
            }
            var unreachable = 1;  // this should be an error
        }
    }

    public func10(): void {
        while (true) {
            while (true) {
            }
        }
        var unreachable = 1;  // this should be an error
    }

    public func11(arg: number): void {
        while (true) {
            while (true) {
                if (true) {
                    break;
                }
            }
            var reachable = 1;  // this should not be an error
        }
        arg++;  // this should be an error
    }

    public func12(arg: number): void {
        outter: while (true) {
            inner: while (true) {
                if (true) {
                    break outter;
                }
            }
            if (arg === 1) { }  // this should be an error
        }
    }
}

// to make sure that we push/pop correct ControlFlowBlock
var reachable = 1;  // this should not be an error