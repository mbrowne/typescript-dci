export = TransferMoney;

/**
 * TransferMoney Context
 *
 * @param {Account} sourceAcct
 * @param {Account} destinationAcct
 * @param {number} amount
 */
function TransferMoney(sourceAcct, destinationAcct, amount) {
	SourceAccount <- sourceAcct;
	DestinationAccount <- destinationAcct;
	Amount <- amount;
	
	//Do the transfer
	SourceAccount.transferOut();

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