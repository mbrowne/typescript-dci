var __dci_internal__ = require('typescript-dci/dci');


function TransferMoney(sourceAcct, destinationAcct) {
var __context = this;
this.__$SourceAccount = {        transferOut: function () {
            //TODO test calling role methods this way:
            //this['withdraw']();
            __context.__$SourceAccount.withdraw.call(__context.SourceAccount);
            __context.__$DestinationAccount.deposit.call(__context.DestinationAccount);
        }
        ,withdraw: function () {
            console.log('withdraw');
        }
};
this.__$DestinationAccount = {        deposit: function () {
            console.log('deposit');
        }
};
    //Role binding
    __context.SourceAccount = sourceAcct;
    __context.DestinationAccount = destinationAcct;
    //Execute the use case
    __context.__$SourceAccount.transferOut.call(__context.SourceAccount);


}
var ctx = TransferMoney({}, {});
module.exports = TransferMoney;

