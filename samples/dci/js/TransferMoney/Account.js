var __dci_internal__ = require('typescript-dci/dci');


var Account = Context.extend(function () {
var __context = this;
this.__$Ledgers = {        addEntry: function (message, amount) {
            __context.__$Ledgers.push.call(__context.Ledgers, new LedgerEntry(message, amount));
        }
        ,getBalance: function () {
            var sum = 0;
            __context.__$Ledgers.each.call(__context.Ledgers, function (ledgerEntry) {
                sum += ledgerEntry.amount;
            });
            return sum;
        }
};
    this.bindRoles = function (ledgers) {
        if (!ledgers)
            ledgers = [];
        __context.Ledgers = ledgers;
    };
    this.increaseBalance = function (amount) {
        __context.__$Ledgers.addEntry.call(__context.Ledgers, 'depositing', amount);
    };
    this.decreaseBalance = function (amount) {
        __context.__$Ledgers.addEntry.call(__context.Ledgers, 'withdrawing', 0 - amount);
    };
    this.getBalance = function () {
        return __context.__$Ledgers.getBalance.call(__context.Ledgers);
    };

    //In ES5 environments, a native-like getter could be created:
    //(TypeScript doesn't support this syntax yet)
    //	get balance() {
    //		return this._balance;
    //	}
});
function LedgerEntry(message, amount) {
    this.message = message;
    this.amount = amount;
}

//export the LedgerEntry constructor
Account.LedgerEntry = LedgerEntry;

//TEMP
var a = new Account();
module.exports = Account;

