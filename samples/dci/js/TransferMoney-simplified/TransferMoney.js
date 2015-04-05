/**
* Transfer Money use case
*/
function TransferMoney(sourceAcct, destinationAcct, amount) {
	var __context = (this==undefined || (typeof global != 'undefined' && this == global) || (typeof window != 'undefined' && this == window) ? {}: this);
	__context.__$SourceAccount = {
	    transferOut: //transfer money out of this account and into the destination account
        function () {
            __context.__$SourceAccount.withdraw.call(__context.SourceAccount);
            __context.__$DestinationAccount.deposit.call(__context.DestinationAccount);
        }
        ,withdraw: function () {
            if (__context.SourceAccount.getBalance() < __context.Amount) {
                throw new Error('Insufficient funds');
            }
            __context.SourceAccount.decreaseBalance(__context.Amount);
        }
	};
	__context.__$DestinationAccount = {
	    deposit: function () {
            __context.DestinationAccount.increaseBalance(__context.Amount);
    	}
	};
	
	__context.__$Amount = {};
    //bind the objects to their roles
    __context.SourceAccount = sourceAcct;
    __context.DestinationAccount = destinationAcct;
    __context.Amount = amount;
    //do the transfer
    __context.__$SourceAccount.transferOut.call(__context.SourceAccount);
}

/**
* Bank account class
*/
function Account() {
    this._balance = 0;
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

//Run the use case
var sourceAccount = new Account();
sourceAccount.increaseBalance(20);
var destinationAccount = new Account();
destinationAccount.increaseBalance(10);
//Transfer 10 dollars (or whatever the currency is) from the source account to the destination account
TransferMoney(sourceAccount, destinationAccount, 10);
console.log(sourceAccount.getBalance());
console.log(destinationAccount.getBalance());
