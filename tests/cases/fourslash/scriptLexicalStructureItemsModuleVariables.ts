/// <reference path="fourslash.ts"/>


//// /*file1*/
////module Module1 {
////    export var x = 0;
////}

//// /*file2*/
////module Module1.SubModule {
////    export var y = 0;
////}

//// /*file3*/
////module Module1 {
////    export var z = 0;
////}

//goTo.marker("file1");
//verify.getScriptLexicalStructureListContains("Module1", "module");
//verify.getScriptLexicalStructureListContains("x", "var");
//// should pick up values from another module instance
//verify.getScriptLexicalStructureListContains("z", "var");
//// nothing else should show up
//verify.getScriptLexicalStructureListCount(3); 


//goTo.marker("file2");
//verify.getScriptLexicalStructureListContains("Module1", "module");
//verify.getScriptLexicalStructureListContains("SubModule", "module");
//verify.getScriptLexicalStructureListContains("y", "var");
//verify.getScriptLexicalStructureListContains("x", "var");
//verify.getScriptLexicalStructureListContains("z", "var");
//verify.getScriptLexicalStructureListCount(5);
