/// <reference path='fourslash.ts' />

////module foo {
////    class Bar {
////        doSomething() {
/////**/
////            }
////        }
////    }
////}

goTo.marker();
edit.insert(";");
// Adding smicolon should format the break statement
verify.currentLineContentIs(';');
