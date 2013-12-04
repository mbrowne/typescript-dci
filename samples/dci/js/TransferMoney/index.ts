import Account = require('./Account');
import TransferMoney = require('./TransferMoney');

var src = new Account(20);
var dst = new Account(10);


//var ctx = new TransferMoney(src, dst, 10);


var ctx = TransferMoney(src, dst, 10);

ctx.execute();

//ctx.bindRoles(dst, src, 50);
//ctx.execute();

console.log(src.getBalance());
console.log(dst.getBalance());