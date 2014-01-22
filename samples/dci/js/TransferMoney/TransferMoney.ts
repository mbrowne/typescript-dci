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
		//transfer money out of this account and into the destination account
		transferOut() {
			var withdraw = self['withdraw'];
			withdraw.call(self);
		
			//self.withdraw();
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
});