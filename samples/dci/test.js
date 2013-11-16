//import dci = require('dci');
//console.log(dci);
/*
var DCI = {
Context: function Context(callback) {
return function(...args : any[]) {
var context = new callback();
context.bindRoles.apply(callback, arguments);
return context;
}
}
};
*/
function TransferMoney(sourceAcct, destinationAcct) {
var __context = this;
    //Role binding
    __context.SourceAccount = sourceAcct;
    __context.DestinationAccount = destinationAcct;
    //Execute the use case
    __context.__$SourceAccount.call(__context.SourceAccount);
    this.__$SourceAccount = {        transferOut: function () {
            //TODO test calling role methods this way:
            //this['withdraw']();
            DCI.callMethodOnSelf(__context, this, 'SourceAccount', 'withdraw');
            __context.__$DestinationAccount.call(__context.DestinationAccount);
        }
        ,withdraw: function () {
            console.log('withdraw');
        }
}
    this.__$DestinationAccount = {        deposit: function () {
            console.log('deposit');
        }
}
}
var ctx = TransferMoney({}, {});
