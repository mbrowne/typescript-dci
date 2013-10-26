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

//TODO DCI.Context.extend()  -- DCI.Context should be a Typescript class
var TransferMoney = DCI.Context(function () {
var __context = this;
    this.bindRoles = function (sourceAcct, destinationAcct) {
        __context.SourceAccount = sourceAcct;
        __context.DestinationAccount = destinationAcct;
    };
    this.execute = function () {
        SourceAccount.transferOut();
    };
    this.__$SourceAccount = {        transferOut: function () {
            //TODO test calling role methods this way:
            //this['withdraw']();
            DCI.callMethodOnCurrentRolePlayer(__context, this, 'SourceAccount', 'withdraw');
            __context.__$DestinationAccount.deposit.call(__context.DestinationAccount);
        }
        ,withdraw: function () {
        }
}
    this.__$DestinationAccount = {        deposit: function () {
            console.log('deposit');
        }
}
});
var ctx = TransferMoney({}, {});
ctx.execute();
