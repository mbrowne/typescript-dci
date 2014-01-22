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