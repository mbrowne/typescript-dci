export class Context
{
	//for plain JS version
	static extend(callback): Function {
		return function(...args : any[]) {
			var context = new callback();
			context.bindRoles.apply(callback, arguments);
			return context;
		}
	}
}