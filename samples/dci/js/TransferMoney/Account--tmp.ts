/*
var Account: any = function(ledgers) {
	if (!ledgers) ledgers = [];
	Ledgers <- ledgers;
}
*/
/*
var Account = DCI.Context.extend(function() {
	
	this.bindRoles = function(ledgers) {
		if (!ledgers) ledgers = [];
		Ledgers <- ledgers;
	};
		
	this.increaseBalance = function(amount) {
		Ledgers.addEntry('depositing', amount);
	};
	
	this.decreaseBalance = function(amount) {
		Ledgers.addEntry('withdrawing', 0 - amount);		
	};

	this.getBalance = function() {
		return Ledgers.getBalance();
	}
	
	//TypeScript doesn't support this syntax yet.
	//If it did, in ES5 environments, a native-like getter could be created:
	//get balance() {
	//	return Ledgers.getBalance();
	//}
	
	role Ledgers {
		addEntry(message, amount) {
			Ledgers.push(new LedgerEntry(message, amount));
		}
		
		getBalance() {
			var sum = 0;
			Ledgers.forEach(function(ledgerEntry) {
				sum += ledgerEntry.amount;
			});
			return sum;
		}
	}
});

function LedgerEntry(message, amount) {
	this.message = message;
	this.amount = amount;
}

//export the LedgerEntry constructor
Account.LedgerEntry = LedgerEntry;
*/

/*
function Account(initialBalance) {
	this._balance = initialBalance || 0;
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

	//In ES5 environments, a more natural getter could be created:
	//(TypeScript doesn't support this syntax yet)
//	get balance() {
//		return this._balance;
//	}
}
*/