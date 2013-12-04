export class Context
{
	//for plain JS version
	static extend(callback) {
		//return type isn't really void; void is used because otherwise TS gives this error when running `new MyContext(...`:
		//"Call signatures used in a 'new' expression must have a 'void' return type."
		
		return function(...args : any[]): void {
			var context = new callback();
			if (!context.bindRoles) throw new Error('bindRoles() method not found');
			
			context.bindRoles.apply(callback, arguments);
			return context;
		}
	}
}