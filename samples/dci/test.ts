var DCI = {
	Context: function Context(callback) {
		return function(...args : any[]) {
			var context = new callback();
			context.bindRoles.apply(callback, arguments);
			return context;
		}
	}
};

function TransferMoney(sourceAcct, destinationAcct) {
	//Role binding
	SourceAccount <- sourceAcct;
	DestinationAccount <- destinationAcct;
	
	//Execute the use case
    SourceAccount.transferOut();
	
	role SourceAccount {
		transferOut() {
			//TODO test calling role methods this way:
			//this['withdraw']();
		
			this.withdraw();
			DestinationAccount.deposit();
		}
		
		withdraw() {
			console.log('withdraw');
		}
	}
	
	role DestinationAccount {
		deposit() {
			console.log('deposit');
		}
	}
}

var ctx = TransferMoney({}, {});

/*
//TODO DCI.Context.extend()  -- DCI.Context should be a Typescript class
var TransferMoney = DCI.Context(function() {

	this.bindRoles = function(sourceAcct, destinationAcct) {
		SourceAccount <- sourceAcct;
		DestinationAccount <- destinationAcct;
	}
	
    this.execute = function() {
    	SourceAccount.transferOut();
    }
	
	role SourceAccount {
		transferOut() {
			//TODO test calling role methods this way:
			//this['withdraw']();
		
			this.withdraw();
			DestinationAccount.deposit();
		}
		
		withdraw() {
			console.log('withdraw');
		}
	}
	
	role DestinationAccount {
		deposit() {
			console.log('deposit');
		}
	}
});

var ctx = TransferMoney({}, {});
ctx.execute();
*/

/*
function TransferMoney(sourceAcct, destinationAcct) {
	
	this.bindRoles = function(a1, a2) {
		SourceAccount <- a1;
		DestinationAccount <- a2;
	}
	this.bindRoles(sourceAcct, destinationAcct);
	
    this.execute = function() {
    	SourceAccount.transferOut();
    }
	
	role SourceAccount {
		transferOut() {
			this.withdraw();
			DestinationAccount.deposit();
		}
		
		withdraw() {
			
		}
	}
	
	role DestinationAccount {
		deposit() {
			console.log('deposit');
		}
	}
}

var ctx = new TransferMoney({}, {});
ctx.execute();
*/

/*

var TransferMoney = DCI.Context(function() {
	this.bindRoles = function(sourceAcct, destinationAcct) {
		SourceAccount <- sourceAcct;
		DestinationAccount <- destinationAcct;
	}
	
	this.execute = function() {
		console.log('executing');
	}
});

var ctx = TransferMoney({}, {});
ctx.execute();
*/