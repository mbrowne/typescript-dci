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
}