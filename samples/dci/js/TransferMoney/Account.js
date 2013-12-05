var __dci_internal__ = require('typescript-dci/dci');
var DCI = require('../../DCI');



var Account = DCI.Context.extend(function () {
var __context = this;
    //TypeScript doesn't support this syntax yet.
    //If it did, in ES5 environments, a native-like getter could be created:
    /*
    get balance() {
    return Ledgers.getBalance();
    }
    */
this.__$Ledgers = {        addEntry: function (message, amount) {
            __context.Ledgers.push(new LedgerEntry(message, amount));
        }
        ,getBalance: function () {
            var sum = 0;
            __context.Ledgers.forEach(function (ledgerEntry) {
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


});
function LedgerEntry(message, amount) {
    this.message = message;
    this.amount = amount;
}

//export the LedgerEntry constructor
Account.LedgerEntry = LedgerEntry;
module.exports = Account;

