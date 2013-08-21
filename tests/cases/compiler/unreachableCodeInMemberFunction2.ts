//@noUnreachableCode: true
class C {
    public prop: string;
    public prop1: number;

    public get Prop() {
        return this.prop;
        this.prop + "hello World";  // this should be an error
    }

    public set Prop(str: string) {
        throw "error";
        this.prop + "hello World";  // this should be an error
    }

    public get Prop1() {
        if (true) {
        }
        else {
            this.prop + this.prop1;  // this should be an error
        }
        return this.prop1;  // this should not be an error
    }

    public set Prop1(i: number) {
        if (false) {
            i++;  // this should be an error
        }
        else {
        }
    }

    public get Prop11() {
        while (true) {
        }
        return this.prop1;  // this should be an error
    }

    public set Prop11(num: number) {
        for (var i = 0; ;) {
        }
        num++;  // this should be an error
    }

    public get Prop12() {
        for (var i; ;) {
        }
        return this.prop1;  // this should be an error
    }

    public set Prop12(num: number) {
        while (false) {
            throw "Error that is not reached";
        }
    }

    public get Prop13() {
        for (var i in this ) {
        }
        return this.prop1;  // this should not be an error
    }

    public set Prop13(num: number) {
        while (true) {
            while (true) {
                continue;
            }
            var unreachableCode = 1;  // this should be an error
        }
    }

    public get Prop14() {
        while (true) {
            while (true) {
                if (false) {
                    break;
                }
            }
            var unreachableCode = 1;  // this should be an error
        }
        return this.prop1;  // this should be an error
    }

    public set Prop14(num: number) {
        try {
            throw "error1";
        }
        catch (err){
            throw "error2";
        }
        finally {
        }
        var unreachable = num + 1;  // this should be an error
    }
}