///<reference path='postcompilationProcessor.ts' />
///<reference path='references.ts' />

module TypeScript {
    // the basic block used for unreachableCode analaysis
    // the block is created whenever the new scope is introduced:
    //      while | forIn | for | doWhile | If/Else | try | catch | finally | switch | function | script |
    // other kinds of statements: return | continue | break | throw | variable | will simply update flags in ControlFlowBlock which contains it.
    export class ControlFlowBlock {
        // name property is set by label statement in the code
        public labelName: string;
        public nodeKind: SyntaxKind;
        public noContinuation: boolean;  // the flag is set to be true if the block is not continued (i.e the next statement is unreachable)
        public loopTerminated: boolean;  // the flag is set to be true if the current LOOP block will be terminated
        public reachEndOfLoop: boolean;  // the flag is set to be true if the next statement outside the current LOOP block can be reached
        public errorReported: boolean;  // the flag is set to be true if we already report an unreachable code error in current block
        public containReturn: boolean;  // the flag is set to be true if we encounter return statement (this is mainly for distinguish between
                                           // noContinuity by break statement and return statement

        constructor(labelName: string, nodeKind: SyntaxKind) {
            this.labelName = labelName;
            this.noContinuation = false;
            this.nodeKind = nodeKind;
            this.loopTerminated = true;
            this.reachEndOfLoop = true;
            this.errorReported = false;
            this.containReturn = false;
        }
    }

    // the class to perform unreachable code analysis by visiting syntaxTree and create ControlFlowBlock to analyze
    // the flow of the code. The class extends SubProcessor which extends PositionTrackingWalker. It override visit function of node
    // which are of type statements : block, ifStatement, variableStatement, expressionStatement, returnStatement, switchStatement,
    // breakStatement, continueStatement, forStatement, forInStatement, emptyStatement, throwStatement, whileStatement, tryStatement,
    // labeledStatement, deStatement, and withStatement. In other type of nodes, the class will simply inherit the function from its parents which
    // will update the postion.
    export class UnreachableCodeProcessor extends SubProcessor {
        private _blockStack: ControlFlowBlock[];
        //private _labelStack

        constructor(fileName: string, diagnostics: Diagnostic[]) {
            super(fileName, diagnostics);
            this._blockStack = [];
        }

        public visitFunctionDeclaration(node: FunctionDeclarationSyntax): void {
            var newBlock = new ControlFlowBlock(null, node.kind());
            this._blockStack.push(newBlock);
            super.visitFunctionDeclaration(node);
            this._blockStack.pop();
        }

        // check if the block which contains current visiting statement is reachable.
        // If not, the current node is not reachable so report an error at appropriate location
        // Return true if we can't reach current node, otherwise return false
        public checkNoContinuationAndReportError(position: number, width: number): boolean {
            var containerBlock = this._blockStack[this._blockStack.length - 1];
            // if top most block which contains current statement is not reachable, then the current statement is unreachable.
            // if we have not reported an error yet, report an error.
            if (containerBlock && containerBlock.noContinuation && !containerBlock.errorReported) {
                this.diagnostics.push(new Diagnostic(this.fileName, position, width, DiagnosticCode.Unreachable_code_detected, null));
                containerBlock.errorReported = true;
                return true;
            }
            return false
        }

        public visitSourceUnit(node: SourceUnitSyntax): void {
            var sourceUnitBlock = new ControlFlowBlock(null, node.kind());
            this._blockStack.push(sourceUnitBlock);
            super.visitSourceUnit(node);
            this._blockStack.pop();
        }

        public visitVariableStatement(node: VariableStatementSyntax): void {
            this.checkNoContinuationAndReportError(super.position() + node.variableDeclaration.varKeyword.leadingTriviaWidth(), node.width());
            super.skip(node);
        }

        public visitReturnStatement(node: ReturnStatementSyntax): void {
            this.checkNoContinuationAndReportError(super.position() + node.returnKeyword.leadingTriviaWidth(), node.width());
            // the block which contains the return statement is not continuable
            var containerBlock = this._blockStack[this._blockStack.length - 1];
            containerBlock.noContinuation = true;
            containerBlock.containReturn = true;
            super.skip(node);
        }

        public visitThrowStatement(node: ThrowStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.throwKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                super.skip(node);
                return;
            }
            // the block which contains the throw statement is not continuable
            var containerBlock = this._blockStack[this._blockStack.length - 1];
            containerBlock.noContinuation = true;
            super.skip(node);
        }

        public visitBreakStatement(node: BreakStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.breakKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                super.skip(node);
                return;
            }

            // if current breakStatement is still reachable, then perform unreachable code analysis
            // get labelName from breakStatement if one exists
            var labelName: string = null;
            if (node.identifier !== null) {
                labelName = node.identifier.text();
            }

            // breakStatement makes other statements of the current block to be unreachable
            var containerBlock = this._blockStack[this._blockStack.length - 1];
            containerBlock.noContinuation = true;

            // find iteration control flow block with matched labelName to the labelName of the breakSatement.
            var iterationOrSwitch: ControlFlowBlock = null;
            for (var i = this._blockStack.length - 1; i >= 0; --i) {
                var block = this._blockStack[i];
                var kind = block.nodeKind;
                var label = block.labelName;

                if (kind === SyntaxKind.WhileStatement ||
                    kind === SyntaxKind.ForInStatement ||
                    kind === SyntaxKind.ForStatement ||
                    kind === SyntaxKind.DoStatement) {
                    if (label === labelName) {
                        iterationOrSwitch = block;
                        iterationOrSwitch.loopTerminated = true;
                        iterationOrSwitch.reachEndOfLoop = true;
                        break;
                    }
                    // if we encounter other iteration ControlFlowBlock before able to find matched whileBlock with the label then mark such block to be terminated but not reahed the end
                    else {
                        block.loopTerminated = true;
                        block.reachEndOfLoop = false;
                    }
                }
                // breakStatement in the switchClause
                else if (kind === SyntaxKind.CaseSwitchClause ||
                        kind === SyntaxKind.DefaultSwitchClause) {
                        iterationOrSwitch = block;
                        iterationOrSwitch.noContinuation = true;
                        break;
                }
            }
            
            // breakStatement is not declared in iteration statements(while, for, forIn, doWhile) or switch statements
            if (iterationOrSwitch === null) {
                this.diagnostics.push(new Diagnostic(this.fileName, super.position() + node.breakKeyword.leadingTriviaWidth(),
                    node.width(), DiagnosticCode.Break_statement_declared_outside_of_iteration_or_switch_statement, null));
            }
            super.skip(node);
        }

        public visitContinueStatement(node: ContinueStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.continueKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                super.skip(node);
                return;
            }

            // if current continueStatement is still reachable, then perform unreachable code analysis
            // get labelName from continueStatement if one exists
            var labelName: string = null;
            if (node.identifier !== null) {
                labelName = node.identifier.text();
            }

            // continueStatement makes other statements of the current block to be unreachable
            var containerBlock = this._blockStack[this._blockStack.length - 1];
            containerBlock.noContinuation = true;

            // find iteration ControlFlowBlock with matched labelName to the labelName of the continueStatement.
            var iterationBlock: ControlFlowBlock = null;
            for (var i = this._blockStack.length - 1; i >= 0; --i) {
                var block = this._blockStack[i];
                var kind = block.nodeKind;
                var label = block.labelName;

                if (kind === SyntaxKind.WhileStatement ||
                    kind === SyntaxKind.ForInStatement ||
                    kind === SyntaxKind.ForStatement ||
                    kind === SyntaxKind.DoStatement) {
                    if (label === labelName) {
                        iterationBlock = block;
                        iterationBlock.loopTerminated = false;
                        iterationBlock.reachEndOfLoop = false;
                        break;
                    }
                    // if we encounter other iterationBlock before able to find matched whileBlock with the label then mark such block to be terminated but not reahaed to the end
                    else {
                        block.loopTerminated = true;
                        block.reachEndOfLoop = false;
                    }
                }
            }

            // continueStatement is not declared in iteration statements(while, for, forIn, doWhile)
            if (iterationBlock === null) {
                this.diagnostics.push(new Diagnostic(this.fileName, super.position() + node.continueKeyword.leadingTriviaWidth(),
                    node.width(), DiagnosticCode.Continue_statement_declared_outside_of_iteration_statement, null));
            }
            super.skip(node);
        }

        public visitIfStatement(node: IfStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.ifKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                // since the current one is not reachable then all its children are not reachable
                // also we report an error already we don't need to visit the rest of the node in ifStatement
                super.skip(node);
                return;
            }
            var containerBlock = this._blockStack[this._blockStack.length - 1];

            // if containerBlock is reachable, we will visit current ifStatement node
            // skip other elements that are not body of ifStatement
            super.skip(node.ifKeyword);
            super.skip(node.openParenToken);
            super.skip(node.condition);
            super.skip(node.closeParenToken);

            // evaluate condition when it is true/false literal or condition statement
            if (node.condition.kind() === SyntaxKind.TrueKeyword) {
                // visit ifClause and get its noContinuation flag
                var ifBlock = new ControlFlowBlock(null, node.kind());
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);

                // if there is elseClause then, visit elseClause and mark it is unreachable
                var elseClause = node.elseClause;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(null, node.kind());
                    elseBlock.noContinuation = true;
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    this._blockStack.pop();
                }

                // the flag set by ifBlock will determine containerBlock's continuation as we will only visit ifClause due to true literal in the condition
                var resultBlock = this._blockStack.pop();
                var ifBlockFlag = resultBlock.noContinuation;
                containerBlock.noContinuation = ifBlockFlag;
            }
            else if (node.condition.kind() === SyntaxKind.FalseKeyword) {
                // visit ifClause and mark it is unreachable
                var ifBlock = new ControlFlowBlock(null, node.kind());
                ifBlock.noContinuation = true;
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();

                // if there is elseClause, then visit elseClause
                // its continuity will determine containerBlock's continuity
                var elseClause = node.elseClause;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(null, node.kind());
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    var elseBlockFlag = this._blockStack.pop().noContinuation;
                    containerBlock.noContinuation = elseBlockFlag;
                }
                // if there is no elseClause, then the containerBlock's continuity does not get affected by ifStatement node
            }
            // condition is an expression instead of boolean literal
            else {
                // visit ifClause
                var ifBlock = new ControlFlowBlock(null, node.kind());
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);
                var ifBlockFlag = this._blockStack.pop().noContinuation;

                // visit elseClause
                var elseClause = node.elseClause;
                var elseBlockFlag = false;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(null, node.kind());
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    elseBlockFlag = this._blockStack.pop().noContinuation;
                }

                // update ifStatementBlock with noContinuation from ifClause and elseClause
                // if both ifClause and elseClause are not continuable, then containerBlock is not continuable as well
                // otherwise the containerBlock is still continuable
                containerBlock.noContinuation = (elseBlockFlag && ifBlockFlag);
            }
        }

        public visitWhileStatement(node: WhileStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.whileKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                // since the current one is not reachable then all its children are not reachable
                // also we report an error already we don't need to visit the rest of the node in whileStatement
                super.skip(node);
                return;
            }

            var containerBlock = this._blockStack[this._blockStack.length - 1];

            // if containerBlock is reachable, we will visit current whileStatement node
            // skip other elements that are not body of whileStatement
            super.skip(node.whileKeyword);
            super.skip(node.openParenToken);
            super.skip(node.condition);
            super.skip(node.closeParenToken);

            var whileBlock = new ControlFlowBlock(null, node.kind());
            if (node.condition.kind() === SyntaxKind.TrueKeyword) {
                // by default if the condition is a true literal, the loop is not terminated and the end of the loop can't be reached
                whileBlock.loopTerminated = false;
                whileBlock.reachEndOfLoop = false;
                this._blockStack.push(whileBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                // check if we encounter any breakStatement and, thus, updateEndofLoop flag
                // if we can't reach the end of the loop but the loop is terminated, then the statement in the same block after the loop will be unreachable
                if (!result.reachEndOfLoop && result.loopTerminated) {
                    containerBlock.noContinuation = true;
                }
                // if we can reach the end of the loop and the loop is terminated, then the statement in the same block after the loop will reachable
                else if (result.reachEndOfLoop && result.loopTerminated) {
                    containerBlock.noContinuation = false;
                }
                // if we can't reach the end of the loop and the loop is not terminated, then the statement in the same block after the lopp will be unreachable
                else {
                    containerBlock.noContinuation = true;
                }
            }
            else if (node.condition.kind() === SyntaxKind.FalseKeyword) {
                // the while body is unreachable; visit the body and report an error
                whileBlock.loopTerminated = true;
                whileBlock.reachEndOfLoop = true;
                whileBlock.noContinuation = true;
                this._blockStack.push(whileBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();
            }
            else {
                // not enough information we can't say anything about the whileStatement so visit the while body as normal
                // report an error that we possibly find inside the body of while statement
                whileBlock.loopTerminated = true;
                whileBlock.reachEndOfLoop = true;
                whileBlock.noContinuation = true;
                this._blockStack.push(whileBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();
            }
        }

        public visitForStatement(node: ForStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.forKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                // since the current one is not reachable then all its children are not reachable
                // also we report an error already we don't need to visit the rest of the node in fortatement
                super.skip(node);
                return;
            }

            var containerBlock = this._blockStack[this._blockStack.length - 1];

            // if containerBlock is reachable, we will visit current forStatement node
            // skip other elements that are not body of forStatement
            super.skip(node.forKeyword);
            super.skip(node.openParenToken);
            super.visitOptionalNode(node.variableDeclaration);
            super.visitOptionalNodeOrToken(node.initializer);
            super.skip(node.firstSemicolonToken);
            super.visitOptionalNodeOrToken(node.condition);
            super.skip(node.secondSemicolonToken);
            super.visitOptionalNodeOrToken(node.incrementor);
            super.skip(node.closeParenToken);

            // check if we have condition
            // if no condition, then we have infiniteloop
            var forBlock = new ControlFlowBlock(null, node.kind());
            if (node.condition === null) {
                // by default if there is no condition, the loop is not terminated and the end of the loop can't be reached
                forBlock.loopTerminated = false;
                forBlock.reachEndOfLoop = false;
                this._blockStack.push(forBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                // check if we encounter any breakStatement and, thus, updateEndofLoop flag
                // if we can't reach the end of the loop but the loop is terminated, then the statement in the same block after the loop will be unreachable
                if (!result.reachEndOfLoop && result.loopTerminated) {
                    containerBlock.noContinuation = true;
                }
                // if we can reach the end of the loop and the loop is terminated, then the statement in the same block after the loop will reachable
                else if (result.reachEndOfLoop && result.loopTerminated) {
                    containerBlock.noContinuation = false;
                }
                // if we can't reach the end of the loop and the loop is not terminated, then the statement in the same block after the lopp will be unreachable
                else {
                    containerBlock.noContinuation = true;
                }
            }
            else {
                // if we have condition, we can't assume anything.
                // so by default, it will be terminated, and reach its end.
                // its continuity is true unless encounter return statement.
                // so we will visit all statement in for loop and check its continuity afterward.
                this._blockStack.push(forBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                containerBlock.noContinuation = result.noContinuation;
            }
        }

        public visitForInStatement(node: ForInStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.forKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                // since the current one is not reachable then all its children are not reachable
                // also we report an error already we don't need to visit the rest of the node in ifStatement
                super.skip(node);
                return;
            }

            var containerBlock = this._blockStack[this._blockStack.length - 1];

            // if containerBlock is reachable, we will visit current forInStatement node
            // skip other elements that are not body of forInStatement
            super.skip(node.forKeyword);
            super.skip(node.openParenToken);
            super.visitOptionalNode(node.variableDeclaration);
            super.visitOptionalNodeOrToken(node.left);
            super.skip(node.inKeyword);
            super.skip(node.expression);
            super.skip(node.closeParenToken);

            var forInBlock = new ControlFlowBlock(null, node.kind());

            // by default, forInStatement will be terminated, and reach its end.
            // its continuity is true unless encounter return statement.
            // so we will visit all statement in for loop and check its continuity afterward.
            this._blockStack.push(forInBlock);
            super.visitNodeOrToken(node.statement);
            var result = this._blockStack.pop();

            containerBlock.noContinuation = result.noContinuation;
        }

        public visitDoStatement(node: DoStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.doKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                // since the current one is not reachable then all its children are not reachable
                // also we report an error already we don't need to visit the rest of the node in doStatement
                super.skip(node);
                return;
            }

            var containerBlock = this._blockStack[this._blockStack.length - 1];

             // if containerBlock is reachable, we will visit current doStatement node
            super.skip(node.doKeyword);

            // visit statements in the doWhile body
            var doWhileBlock = new ControlFlowBlock(null, node.kind());
            if (node.condition.kind() === SyntaxKind.TrueKeyword) {
                // by default if the condition is a true literal, the loop is not terminated and the end of the loop can't be reached
                doWhileBlock.loopTerminated = false;
                doWhileBlock.reachEndOfLoop = false;
                this._blockStack.push(doWhileBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                // check if we encounter any breakStatement and, thus, updateEndofLoop flag
                // if we can't reach the end of the loop but the loop is terminated, then the statement in the same block after the loop will be unreachable
                if (!result.reachEndOfLoop && result.loopTerminated) {
                    containerBlock.noContinuation = true;
                }
                // if we can reach the end of the loop and the loop is terminated, then the statement in the same block after the loop will reachable
                else if (result.reachEndOfLoop && result.loopTerminated) {
                    containerBlock.noContinuation = false;
                }
                // if we can't reach the end of the loop and the loop is not terminated, then the statement in the same block after the lopp will be unreachable
                else {
                    containerBlock.noContinuation = true;
                }
            }
            else if (node.condition.kind() === SyntaxKind.FalseKeyword) {
                // the while body is unreachable; visit the body and report an error
                doWhileBlock.loopTerminated = true;
                doWhileBlock.reachEndOfLoop = true;
                doWhileBlock.noContinuation = true;
                this._blockStack.push(doWhileBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();
            }
            else {
                // not enough information we can't say anything about the whileStatement so visit the while body as normal
                doWhileBlock.loopTerminated = true;
                doWhileBlock.reachEndOfLoop = true;
                doWhileBlock.noContinuation = true;
                this._blockStack.push(doWhileBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();
            }

            // skip other elements that are not body of doStatement
            super.skip(node.whileKeyword);
            super.skip(node.openParenToken);
            super.skip(node.condition);
            super.skip(node.closeParenToken);
            super.skip(node.semicolonToken);
        }

        public visitSwitchStatement(node: SwitchStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.switchKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                // since the current one is not reachable then all its children are not reachable
                // also we report an error already we don't need to visit the rest of the node in doStatement
                super.skip(node);
                return;
            }

            // if containerBlock is reachable, we will visit current switchStatement node
            // skip other elements that are not body of switchStatement
            super.skip(node.switchKeyword);
            super.skip(node.openParenToken);
            super.skip(node.expression);
            super.skip(node.closeParenToken);
            super.skip(node.openBraceToken);

            // visit each clause and check the continuity of each clause
            var clause: ISyntaxNodeOrToken = null;
            var clauseBlock: ControlFlowBlock = null;
            var result: ControlFlowBlock = null;
            var numberOfReturn = 0;  // store number of return in switchClause
            for (var i = 0, n = node.switchClauses.childCount(); i < n; ++i) {
                clause = node.switchClauses.childAt(i);
                clauseBlock = new ControlFlowBlock(null, clause.kind());
                this._blockStack.push(clauseBlock);
                super.visitNodeOrToken(clause);
                result = this._blockStack.pop();

                // the clause is terminated due to return statement
                if (result.noContinuation && result.containReturn) {
                    ++numberOfReturn;
                }
            }

            // if number of return statement is equal to number of clauses then all clauses must contain return statement
            // the containerBlock of the switchStatement must be no continuity
            if (numberOfReturn === node.switchClauses.childCount()) {
                var containerBlock = this._blockStack[this._blockStack.length - 1];
                containerBlock.noContinuation = true;
            }
            super.skip(node.closeBraceToken);
        }
    }
}
