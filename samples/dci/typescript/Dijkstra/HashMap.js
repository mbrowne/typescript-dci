

/*
HashMap

Features include:
* support for object keys (it doesn't actually use a hash function, it just loops to find the matching object)
* fast keys or values iteration using for (;;) instead of for in syntax (http://jsperf.com/array-keys-vs-object-keys-iteration/3 )
(thanks to https://gist.github.com/alaa-eddine/6317515)
*/
var HashMap = (function () {
    function HashMap() {
        this.length = 0;
        //Keys will be stored here giving fast iteration through keys with a for loop
        this.keys = [];
        //Values will be stored here giving fast iteration with a for loop
        this.values = [];
    }
    HashMap.prototype.indexOf = function (key) {
        for (var i = 0, len = this.keys.length; i < len; i++) {
            if (this.keys[i] == key)
                return i;
        }
        return -1;
    };

    HashMap.prototype.add = function (key, value) {
        if (key === undefined && value === undefined)
            return undefined;

        var previous = undefined;

        //Are we replacing an existing element ?
        var index = this.indexOf(key);
        if (index != -1) {
            previous = this.values[index];
            this.values[index] = value;
            this.keys[index] = key;
        } else {
            this.values.push(value);
            this.keys.push(key);
            this.length++;
        }

        return previous;
    };

    HashMap.prototype.get = function (key) {
        if (this.has(key))
            return this.values[this.indexOf(key)];
    };

    HashMap.prototype.has = function (key) {
        return (this.indexOf(key) != -1);
    };

    HashMap.prototype.remove = function (key) {
        var index = this.indexOf(key);
        if (index != -1) {
            var previous = this.values[index];
            delete this.values[index];
            delete this.keys[index];

            this.length--;
            return previous;
        } else {
            return undefined;
        }
        //TODO : clean this.keys and this.values from undefined values when their size becomes too big
    };

    //helper function to iterate through all values
    HashMap.prototype.each = function (fn) {
        for (var i = 0; i < this.keys.length; i++) {
            fn(this.keys[i], this.values[i]);
        }
    };

    HashMap.prototype.map = function (fn) {
        if (typeof fn != 'function')
            return;
        var result = [];
        for (var i = 0; i < this.keys.length; i++) {
            result[i] = fn(this.keys[i], this.values[i]);
        }
        return result;
    };

    HashMap.prototype.clear = function () {
        this.values = [];
        this.keys = [];
        this.length = 0;
    };

    HashMap.prototype.isEmpty = function () {
        return this.length == 0;
    };
    return HashMap;
})();
module.exports = HashMap;

