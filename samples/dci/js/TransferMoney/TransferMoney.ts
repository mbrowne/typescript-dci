import DCI = require('../../DCI');
export = TransferMoney;

/**
 * TransferMoney Context
 *
 * @constructor
 * @this {TransferMoney}
 * @param {Account} sourceAcct
 * @param {Account} destinationAcct
 * @param {number} amount
 */
var TransferMoney = DCI.Context.extend(function() {
	this.bindRoles = function(sourceAcct, destinationAcct, amount) {
		SourceAccount <- sourceAcct;
		DestinationAccount <- destinationAcct;
		Amount <- amount;
	}
	
	//Run the use case
	this.run = function() {
		SourceAccount.transferOut();
	}

	role SourceAccount {
		//transfer out of this account and into the destination account
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