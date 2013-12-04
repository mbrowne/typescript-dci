

function Account(initialBalance) {
    this._balance = initialBalance || 0;
}

Account.prototype = {
    constructor: Account,
    increaseBalance: function (amount) {
        this._balance += amount;
    },
    decreaseBalance: function (amount) {
        this._balance -= amount;
    },
    getBalance: function () {
        return this._balance;
    }
};
module.exports = Account;

