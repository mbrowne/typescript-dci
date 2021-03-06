var __dci_internal = require('typescript-dci/dci');

/**
* TransferMoney Context
*
* @param {Account} sourceAcct
* @param {Account} destinationAcct
* @param {number} amount
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
	__context.__$DestinationAccount = {        deposit: function () {
            __context.DestinationAccount.increaseBalance(__context.Amount);
        }
	};
	
	__context.__$Amount = {};
    __context.SourceAccount = sourceAcct;
    __context.DestinationAccount = destinationAcct;
    __context.Amount = amount;
    //Do the transfer
    __context.__$SourceAccount.transferOut.call(__context.SourceAccount);
}
module.exports = TransferMoney;

