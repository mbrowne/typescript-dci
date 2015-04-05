var Account = require('./Account');
var TransferMoney = require('./TransferMoney');

var sourceAccount = new Account();
sourceAccount.increaseBalance(20);

var destinationAccount = new Account();
destinationAccount.increaseBalance(10);

//run the use case
TransferMoney(sourceAccount, destinationAccount, 10);

console.log(sourceAccount.getBalance());
console.log(destinationAccount.getBalance());

