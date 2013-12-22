import DCI = require('../../DCI');

export class TransferMoney extends DCI.Context
{
	/**
	 * @param {Account} sourceAcct
	 * @param {Account} destinationAcct
	 * @param {number} amount
	 */
	bindRoles(sourceAcct, destinationAcct, amount) {
		SourceAccount <- sourceAcct;
		DestinationAccount <- destinationAcct;
		Amount <- amount;
	}
	
	role SourceAccount {	
	
		transferOut() {
			self.withdraw();
			DestinationAccount.deposit();
		}
	
		withdraw() {
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