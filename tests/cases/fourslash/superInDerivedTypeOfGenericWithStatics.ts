/// <reference path='fourslash.ts'/>

////module M {
////   export class C<T extends Date> {
////      static foo(): C<Date> { 
////          return null;
////           }
////     }
////}
////class D extends M.C<Date> {
////    constructor() {
////        /**/ // bug was an error appearing on super in editing scenarios
////       }
////}

goTo.marker();
edit.insert('super();');
verify.numberOfErrorsInCurrentFile(0);