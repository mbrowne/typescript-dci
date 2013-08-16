function func1() {
    throw "RANDOM";
    var notReach = 0;
}

function func2() {
    try  {
        var declareIntry = 0;
        return;
    } catch (err) {
        throw "In Catch";
    }
    var unreachableCode = 0;
}

function func3() {
    try  {
        var declareIntry = 0;
        return;
    } catch (err) {
    }
    var reachableCode = 0;
}

function func4() {
    try  {
        var declareIntry = 0;
    } catch (err) {
        throw "In Catch";
    }
    var reachableCode = 0;
}

function func5() {
    try  {
        var declareIntry = 0;
    } catch (err) {
        throw "In Catch";
    } finally {
        return;
    }
    var unreachableCode = 0;
}

function func6() {
    try  {
        return;
    } catch (err) {
        return;
    } finally {
    }
    var unreachableCode = 0;
}

function func7() {
    try  {
        return;
    } catch (err) {
        return;
    }
    var unreachableCode = 0;
}

function func8() {
    try  {
    } catch (err) {
    } finally {
        return;
    }
    var unreachableCode = 0;
}

function func9() {
    try  {
        throw "error";
    } catch (err) {
        throw "error";
    } finally {
    }
    var unreachableCode = 0;
}
