
/**
 * Transfer Money use case
 */
function TransferMoney(sourceAcct, destinationAcct, amount) {

	//bind the objects to their roles
	SourceAccount <- sourceAcct;
	DestinationAccount <- destinationAcct;
	Amount <- amount;
	
	//do the transfer
	SourceAccount.transferOut();
	
	role SourceAccount {
		
		//transfer money out of this account and into the destination account
		transferOut() {
			self.withdraw();
			DestinationAccount.deposit();
		}
	
		withdraw() {
			if (self.getBalance() < Amount) {
				throw new Error('Insufficient funds');
			}
			self.decreaseBalance(Amount);
		}
	}

	role DestinationAccount {
		deposit() {
			self.increaseBalance(Amount);
		}
	}

	role Amount {}
}

/**
 * Bank account class
 */
function Account() {
	this._balance = 0;
}

Account.prototype = {
	constructor: Account,

	increaseBalance: function(amount) {
		this._balance += amount;
	},

	decreaseBalance: function(amount) {
		this._balance -= amount;
	},

	getBalance: function() {
		return this._balance;
	}
}


//Run the use case

var sourceAccount = new Account();
sourceAccount.increaseBalance(20);

var destinationAccount = new Account();
destinationAccount.increaseBalance(10);

//Transfer 10 dollars (or whatever the currency is) from the source account to the destination account
TransferMoney(sourceAccount, destinationAccount, 10);

console.log(sourceAccount.getBalance());
console.log(destinationAccount.getBalance());
