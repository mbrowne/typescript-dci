var __dci_internal__ = require('typescript-dci/dci');
var DCI = '../../DCI';


/**
* TransferMoney Context
*
* @constructor
* @this {TransferMoney}
* @param {Account} source
* @param {Account} destination
* @param {number} amount
*/
var TransferMoney = DCI.Context.extend(function () {
var __context = this;
this.__$SourceAccount = {        transferOut: function () {
            __dci_internal__.callMethodOnSelf(__context, this, 'SourceAccount', 'withdraw');
            __context.__$DestinationAccount.deposit.call(__context.DestinationAccount);
        }
        ,withdraw: function () {
            __dci_internal__.callMethodOnSelf(__context, this, 'SourceAccount', 'decreaseBalance', [__context.Amount]);
        }
};
this.__$DestinationAccount = {        deposit: function () {
            __dci_internal__.callMethodOnSelf(__context, this, 'DestinationAccount', 'increaseBalance', [__context.Amount]);
        }
};
this.__$Amount = {};
    this.bindRoles = function (sourceAcct, destinationAcct, amount) {
        __context.SourceAccount = sourceAcct;
        __context.DestinationAccount = destinationAcct;
        __context.Amount = amount;
    };
    this.run = function () {
        __context.__$SourceAccount.transferOut.call(__context.SourceAccount);
    };



});
module.exports = TransferMoney;

