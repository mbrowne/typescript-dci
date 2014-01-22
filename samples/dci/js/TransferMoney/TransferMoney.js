var __dci_internal = require('typescript-dci/dci');
var DCI = require('../../DCI');


/**
* TransferMoney Context
*
* @constructor
* @this {TransferMoney}
* @param {Account} sourceAcct
* @param {Account} destinationAcct
* @param {number} amount
*/
var TransferMoney = DCI.Context.extend(function () {
var __context = this;
this.__$SourceAccount = {        transferOut: //transfer money out of this account and into the destination account
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
this.__$DestinationAccount = {        deposit: function () {
            __context.DestinationAccount.increaseBalance(__context.Amount);
        }
};
this.__$Amount = {};
    this.bindRoles = function (sourceAcct, destinationAcct, amount) {
        __context.SourceAccount = sourceAcct;
        __context.DestinationAccount = destinationAcct;
        __context.Amount = amount;
    };
    //Run the use case
    this.run = function () {
        __context.__$SourceAccount.transferOut.call(__context.SourceAccount);
    };



});
module.exports = TransferMoney;

