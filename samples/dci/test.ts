function TransferMoney(sourceAcct2) {
	
	SourceAccount <- sourceAcct2;
	var test = '123';
	
	role SourceAccount {
		test() {
			DestinationAccount.deposit();
		}
		
		foo() {
			this.greet();
		}
	}
}