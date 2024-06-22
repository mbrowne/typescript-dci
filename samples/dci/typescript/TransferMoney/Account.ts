import DCI = require('../../DCI');

export = Account;

var Account = DCI.Context.extend(function(ledgers) {
	if (!ledgers) ledgers = [];
	Ledgers <- ledgers;
	
	this.increaseBalance = function(amount) {
		Ledgers.addEntry('depositing', amount);
	};
	
	this.decreaseBalance = function(amount) {
		Ledgers.addEntry('withdrawing', 0 - amount);		
	};
	
	this.getBalance = function() {
		return Ledgers.getBalance();
	}
	
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