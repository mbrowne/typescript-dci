var DCI = {
    Context: function Context(callback) {
        return function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var context = new callback();
            context.bindRoles.apply(callback, arguments);
            return context;
        };
    }
};

function TransferMoney(sourceAcct, destinationAcct) {
var __context = this;
    //Role binding
    __context.__context.SourceAccount = sourceAcct;
    __context.__context.DestinationAccount = destinationAcct;

    //Execute the use case
    transferOut.call(__context.SourceAccount);
    this.__$SourceAccount = {        transferOut: function () {
            //TODO test calling role methods this way:
            //this['withdraw']();
            DCI.callMethodOnCurrentRolePlayer(__context, this, 'SourceAccount', 'withdraw');
            __context.__$DestinationAccount.deposit.call(__context.DestinationAccount);
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
