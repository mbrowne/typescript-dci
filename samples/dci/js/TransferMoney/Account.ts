export = Account;

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
	/*
	get balance() {
		return this._balance;
	}
	*/
}