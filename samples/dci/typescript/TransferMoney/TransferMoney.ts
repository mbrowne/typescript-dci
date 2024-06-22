import DCI = require('../../DCI');

//IN PROGRESS
//if needed in the meantime we can use a class that extends DCI.Context instead
export context TransferMoney
{
	/**
	 * @param {Account} sourceAcct
	 * @param {Account} destinationAcct
	 * @param {number} amount
	 */
	bindRoles(sourceAcct: Account, destinationAcct: Account, amount: int) {
		SourceAccount <- sourceAcct;
		DestinationAccount <- destinationAcct;
		Amount <- amount;
	}
	
	run() {
		SourceAccount.transferOut();
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