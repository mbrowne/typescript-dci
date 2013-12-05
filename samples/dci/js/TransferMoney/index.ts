import Account = require('./Account');
import TransferMoney = require('./TransferMoney');

var src = new Account();
src.increaseBalance(20);

var dst = new Account();
dst.increaseBalance(10);

var ctx = new TransferMoney(src, dst, 10);

//run the use case
ctx.run();

//ctx.bindRoles(dst, src, 50);
//ctx.execute();

console.log(src.getBalance());
console.log(dst.getBalance());
