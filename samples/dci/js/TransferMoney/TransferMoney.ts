import DCI = require('../../DCI');
export = TransferMoney;

/**
 * TransferMoney Context
 *
 * @constructor
 * @this {TransferMoney}
 * @param {Account} source
 * @param {Account} destination
 * @param {number} amount
 */
var TransferMoney = DCI.Context.extend(function() {
	this.bindRoles = function(sourceAcct, destinationAcct, amount) {
		SourceAccount <- sourceAcct;
		DestinationAccount <- destinationAcct;
		Amount <- amount;
	}

	this.run = function() {
		SourceAccount.transferOut();
	}

	role SourceAccount {
		transferOut() {
			this.withdraw();
			DestinationAccount.deposit();
		}
	
		withdraw() {
			this.decreaseBalance(Amount);
		}
	}

	role DestinationAccount {
		deposit() {
			this.increaseBalance(Amount);
		}
	}

	role Amount {}
});