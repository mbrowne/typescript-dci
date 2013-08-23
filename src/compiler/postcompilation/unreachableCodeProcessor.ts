///<reference path='postcompilationProcessor.ts' />
///<reference path='references.ts' />

module TypeScript {
    // the basic block used for unreachableCode analaysis
    // the block is created whenever the new scope is introduced:
    //      while | forIn | for | doWhile | If/Else | try | catch | finally | switch | function | script |
    // other kinds of statements: return | continue | break | throw | variable | expression | will simply update flags in ControlFlowBlock which contains it.
    export class ControlFlowBlock {
        // name property is set by label statement in the code
        public labelName: string;
        public node: ISyntaxNodeOrToken;

        // the flag is set to be true if within the current block, statement is still reachable from one to the other
        public isStatementInCurrentBlockReachable: boolean;

        // the flag is set to be true if we can reach next control-flow block after the current one.
        public isStatementAfterBlockReachable: boolean;

        // the flag is set to be true if we already report an unreachable code error in current block
        public errorReported: boolean;

        constructor(node: ISyntaxNodeOrToken, labelName: string = null) {
            this.labelName = labelName;
            this.node = node;
            this.isStatementInCurrentBlockReachable = true;
            this.isStatementAfterBlockReachable = true;
            this.errorReported = false;
        }
    }

    // the class to perform unreachable code analysis by visiting syntaxTree and create ControlFlowBlock.
    // The class extends SubProcessor which extends PositionTrackingWalker. It override visit function of node
    // which are of type statements :
    //      ifStatement
    //      variableStatement
    //      expressionStatement
    //      returnStatement
    //      switchStatement
    //      breakStatement
    //      continueStatement
    //      forStatement & forInStatement
    //      throwStatement
    //      whileStatement
    //      tryStatement
    //      labeledStatement
    //      doStatement
    //      debuggerStatement
    //      withStatement
    //      functionDeclaration
    //      functionExpression
    //      memberFunctionDeclaration
    //      getMemberAccessor & setMemberAccessor
    //      sourceUnit
    // In other type of nodes, the class will simply inherit the function from its parents which will update the postion.
    export class UnreachableCodeProcessor extends SubProcessor {
        private _blockStack: ControlFlowBlock[];  // a stack data structure to keep track of ControlFlowBlock
        private _currentLabel: string;  // a stack data structure to keep track of label

        constructor(fileName: string, diagnostics: Diagnostic[]) {
            super(fileName, diagnostics);
            this._blockStack = [];
            this._currentLabel = null;
        }

        // check if the block which contains current visiting statement is reachable.
        // If not, the current node is not reachable so report an error at appropriate location
        // Return true if we can't reach current node, otherwise return false
        private checkNoContinuationAndReportError(position: number, width: number): boolean {
            var containerBlock = this._blockStack[this._blockStack.length - 1];

            // if the isStatementInCurrentBlockReachable is true then the rest of statements in the block is not reachable
            // report unreachableCode error if we haven't done so yet
            if (containerBlock && !containerBlock.isStatementInCurrentBlockReachable && !containerBlock.errorReported) {
                this.diagnostics.push(new Diagnostic(this.fileName, position, width, DiagnosticCode.Unreachable_code_detected, null));
                containerBlock.errorReported = true;
                return true;
            }
            return false
        }

        public visitSourceUnit(node: SourceUnitSyntax): void {
            var sourceUnitBlock = new ControlFlowBlock(node);
            this._blockStack.push(sourceUnitBlock);
            super.visitSourceUnit(node);
            this._blockStack.pop();
        }

        public visitFunctionDeclaration(node: FunctionDeclarationSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitFunctionDeclaration(node);
            this._blockStack.pop();
        }

        public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitConstructorDeclaration(node);
            this._blockStack.pop();
        }

        public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitMemberFunctionDeclaration(node);
            this._blockStack.pop();
        }

        public visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitGetMemberAccessorDeclaration(node);
            this._blockStack.pop();
        }

        public visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitSetMemberAccessorDeclaration(node);
            this._blockStack.pop();
        }

        public visitFunctionPropertyAssignment(node: FunctionPropertyAssignmentSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitFunctionPropertyAssignment(node);
            this._blockStack.pop();
        }

        public visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitGetAccessorPropertyAssignment(node);
            this._blockStack.pop();
        }

        public visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitSetAccessorPropertyAssignment(node);
            this._blockStack.pop();
        }

        public visitFunctionExpression(node: FunctionExpressionSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitFunctionExpression(node);
            this._blockStack.pop();
        }

        public visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitSimpleArrowFunctionExpression(node);
            this._blockStack.pop();
        }

        public visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): void {
            var newBlock = new ControlFlowBlock(node);
            this._blockStack.push(newBlock);
            super.visitParenthesizedArrowFunctionExpression(node);
            this._blockStack.pop();
        }

        public visitLabeledStatement(node: LabeledStatementSyntax): void {
            this.visitToken(node.identifier);
            this.visitToken(node.colonToken);
            this._currentLabel = node.identifier.text();
            this.visitNodeOrToken(node.statement);
            this._currentLabel = null;
        }

        public visitVariableStatement(node: VariableStatementSyntax): void {
            this.checkNoContinuationAndReportError(super.position() + node.variableDeclaration.varKeyword.leadingTriviaWidth(), node.width());
            super.visitVariableStatement(node);
        }

        public visitExpressionStatement(node: ExpressionStatementSyntax): void {
            this.checkNoContinuationAndReportError(super.position() + node.leadingTriviaWidth(), node.width());
            super.visitExpressionStatement(node);
        }

        public visitDebuggerStatement(node: DebuggerStatementSyntax): void {
            this.checkNoContinuationAndReportError(super.position() + node.debuggerKeyword.leadingTriviaWidth(), node.width());
            super.skip(node);
        }

        public visitWithStatement(node: WithStatementSyntax): void {
            this.checkNoContinuationAndReportError(super.position() + node.withKeyword.leadingTriviaWidth(), node.width());
            var withBlock = new ControlFlowBlock(node);
            this._blockStack.push(withBlock);
            super.visitWithStatement(node);
            this._blockStack.pop();
        }

        public visitReturnStatement(node: ReturnStatementSyntax): void {
            this.checkNoContinuationAndReportError(super.position() + node.returnKeyword.leadingTriviaWidth(), node.width());
            // get the controlFlowBlock which contains the return statement
            var containerBlock = this._blockStack[this._blockStack.length - 1];

            // if we encounter return statement, then rest of statements in the block is not reachable
            containerBlock.isStatementInCurrentBlockReachable = false;
            containerBlock.isStatementAfterBlockReachable = false;
            super.visitReturnStatement(node);
        }

        public visitThrowStatement(node: ThrowStatementSyntax): void {
            this.checkNoContinuationAndReportError(super.position() + node.throwKeyword.leadingTriviaWidth(), node.width());
            // get the controlFlowBlock which contains the throw statement
            var containerBlock = this._blockStack[this._blockStack.length - 1];

            // if we encounter throw statement, then rest of statements in the block is not reachable
            containerBlock.isStatementInCurrentBlockReachable = false;
            containerBlock.isStatementAfterBlockReachable = false;
            super.visitThrowStatement(node);
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

            // get the controlFlowBlock which contains the break statement
            var containerBlock = this._blockStack[this._blockStack.length - 1];
            // breakStatement makes the rest of statements in the same block to be unreachable
            containerBlock.isStatementInCurrentBlockReachable = false;

            // find block statement with matched label
            // if labelName === null, we will update flag of the top most blog
            // find iteration control flow block with matched labelName to the labelName of the breakSatement.
            var iterationOrSwitch: ControlFlowBlock = null;
            for (var i = this._blockStack.length - 1; i >= 0; --i) {
                var block = this._blockStack[i];
                var kind = block.node.kind();
                var label = block.labelName;

                if (kind === SyntaxKind.WhileStatement ||
                    kind === SyntaxKind.ForInStatement ||
                    kind === SyntaxKind.ForStatement ||
                    kind === SyntaxKind.DoStatement ||
                    kind === SyntaxKind.CaseSwitchClause ||
                    kind === SyntaxKind.DefaultSwitchClause ||
                    kind === SyntaxKind.SwitchStatement) {
                    if (label === labelName || labelName === null) {
                        iterationOrSwitch = block;
                        iterationOrSwitch.isStatementAfterBlockReachable = true;
                        break;
                    }
                    // if we encounter other iteration ControlFlowBlock before able to find matched block with the label 
                    // then we can't reach the end of the block so statement after the block is not reachable
                    else {
                        block.isStatementAfterBlockReachable = false;
                    }
                }
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

            var containerBlock = this._blockStack[this._blockStack.length - 1];
            // continueStatement makes other statements of the current block to be unreachable
            containerBlock.isStatementInCurrentBlockReachable = false;

            // find iteration ControlFlowBlock with matched labelName to the labelName of the continueStatement.
            var iterationBlock: ControlFlowBlock = null;
            for (var i = this._blockStack.length - 1; i >= 0; --i) {
                var block = this._blockStack[i];
                var kind = block.node.kind();
                var label = block.labelName;

                if (kind === SyntaxKind.WhileStatement ||
                    kind === SyntaxKind.ForInStatement ||
                    kind === SyntaxKind.ForStatement ||
                    kind === SyntaxKind.DoStatement) {
                    block.isStatementAfterBlockReachable = false;
                    if (label === labelName) {
                        iterationBlock = block;
                        break;
                    }
                }
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
                var ifBlock = new ControlFlowBlock(node);
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);

                // if there is elseClause then, visit elseClause though the elseBlock is not reachable as the condition is always true
                var elseClause = node.elseClause;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(node);
                    elseBlock.isStatementInCurrentBlockReachable = false;
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    this._blockStack.pop();
                }

                // remove the top most block which will correspond to the ifBlock we push in
                var resultBlock = this._blockStack.pop();
                var ifBlockFlag = resultBlock.isStatementInCurrentBlockReachable;
                // if statements in ifBlock are reachable, then statements in the block which contains ifBlock are still reachable
                containerBlock.isStatementInCurrentBlockReachable = ifBlockFlag;
            }
            else if (node.condition.kind() === SyntaxKind.FalseKeyword) {
                // visit ifClause and mark it is unreachable
                var ifBlock = new ControlFlowBlock(node);
                ifBlock.isStatementInCurrentBlockReachable = false;
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();

                // if there is elseClause, then visit elseClause
                // its continuity will determine containerBlock's continuity
                var elseClause = node.elseClause;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(node);
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    var elseBlockFlag = this._blockStack.pop().isStatementInCurrentBlockReachable;
                    // if statements in elseBlock are reachable, then statements in the block which contains ifBlock are still reachable
                    containerBlock.isStatementInCurrentBlockReachable = elseBlockFlag;
                }
                // if there is no elseClause, then the containerBlock's continuity does not get affected by ifStatement node
            }
            // condition is an expression instead of boolean literal
            else {
                // visit ifClause
                var ifBlock = new ControlFlowBlock(node);
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);
                var ifBlockFlag = this._blockStack.pop().isStatementInCurrentBlockReachable;

                // visit elseClause
                var elseClause = node.elseClause;
                var elseBlockFlag = false;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(node);
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    elseBlockFlag = this._blockStack.pop().isStatementInCurrentBlockReachable;
                }

                // the reachability of ifBlock and elseBlock determine the reachability of the block which contains ifStatement
                containerBlock.isStatementInCurrentBlockReachable = (elseBlockFlag || ifBlockFlag);
            }
        }

        public visitWhileStatement(node: WhileStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.whileKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                // since the current statement is not reachable then all its children are not reachable
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

            // check if there is any label associated with this whileStatement
            var label: string = null;
            if (this._currentLabel !== null) {
                // if there is a label, then get the top most one on the stack as that is the most recent one
                label = this._currentLabel;
                this._currentLabel = null;
            }

            var whileBlock = new ControlFlowBlock(node, label);
            if (node.condition.kind() === SyntaxKind.TrueKeyword) {
                // by default the loop is not terminated and we can't reach the next statements after the whileBlock
                whileBlock.isStatementAfterBlockReachable = false;
                whileBlock.isStatementInCurrentBlockReachable = true;
                this._blockStack.push(whileBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                // the reachability to the next statement after the whileBlock will determine the reachability of the block that contains whileStatement
                containerBlock.isStatementInCurrentBlockReachable = result.isStatementAfterBlockReachable;
            }
            else if (node.condition.kind() === SyntaxKind.FalseKeyword) {
                // because the condition is already false, the body of whileStatement will never be reached
                // by default the loop will be terminated
                whileBlock.isStatementAfterBlockReachable = true;
                whileBlock.isStatementInCurrentBlockReachable = false;
                this._blockStack.push(whileBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();
            }
            else {
                // not enough information we can't say anything about the whileStatement so visit the while body as normal
                // report an error that we possibly find inside the body of while statement
                whileBlock.isStatementAfterBlockReachable = true;
                whileBlock.isStatementInCurrentBlockReachable = true;
                this._blockStack.push(whileBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                // the reachability to the next statement after the whileBlock will determine the reachability of the block that contains whileStatement
                containerBlock.isStatementInCurrentBlockReachable = result.isStatementAfterBlockReachable;
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

            // check if there is any label associated with this forStatement
            var label: string = null;
            if (this._currentLabel !== null) {
                // if there is a label, then get the top most one on the stack as that is the most recent one
                label = this._currentLabel;
                this._currentLabel = null;
            }

            // check if we have condition
            // if no condition, then we have infiniteloop
            var forBlock = new ControlFlowBlock(node,label);
            if (node.condition === null) {
                // by default if there is no condition, we have infinite loop which means that we can't reach the next block statement after the loop
                forBlock.isStatementAfterBlockReachable = false;
                forBlock.isStatementInCurrentBlockReachable = true;
                this._blockStack.push(forBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                 // the reachability to the next statement after the forBlock will determine the reachability of the block that contains forStatement
                containerBlock.isStatementInCurrentBlockReachable = result.isStatementAfterBlockReachable;
            }
            else {
                // if we have condition, we can't assume anything.
                // so by default, it will be terminated, and reach its end.
                // its continuity is true unless encounter any terminator statements.
                // so we will visit all statement in for loop and check its continuity afterward.
                forBlock.isStatementAfterBlockReachable = true;
                forBlock.isStatementInCurrentBlockReachable = true;
                this._blockStack.push(forBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                // the reachability to the next statement after the forBlock will determine the reachability of the block that contains forStatement
                containerBlock.isStatementInCurrentBlockReachable = result.isStatementAfterBlockReachable;
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

            // check if there is any label associated with this forInStatement
            var label: string = null;
            if (this._currentLabel !== null) {
                // if there is a label, then get the top most one on the stack as that is the most recent one
                label = this._currentLabel;
                this._currentLabel = null;
            }

            var forInBlock = new ControlFlowBlock(node, label);

            // by default, forInStatement will be terminated, and reach its end.
            // its continuity is true unless encounter return statement.
            // so we will visit all statement in for loop and check its continuity afterward.
            this._blockStack.push(forInBlock);
            super.visitNodeOrToken(node.statement);
            var result = this._blockStack.pop();

            // the reachability to the next statement after the forInBlock will determine the reachability of the block that contains forInStatement
            containerBlock.isStatementInCurrentBlockReachable = result.isStatementAfterBlockReachable;
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

            // check if there is any label associated with this doStatement
            var label: string = null;
            if (this._currentLabel !== null) {
                // if there is a label, then get the top most one on the stack as that is the most recent one
                label = this._currentLabel;
                this._currentLabel = null;
            }

            // visit statements in the doWhile body
            var doWhileBlock = new ControlFlowBlock(node, label);
            if (node.condition.kind() === SyntaxKind.TrueKeyword) {
                // by default the loop is not terminated and we can't reach the next statements after the doBlock
                doWhileBlock.isStatementAfterBlockReachable = false;
                this._blockStack.push(doWhileBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                containerBlock.isStatementInCurrentBlockReachable = result.isStatementAfterBlockReachable;
            }
            else if (node.condition.kind() === SyntaxKind.FalseKeyword) {
                // because the condition is already false, the body of doStaement will never be reached
                // by default the loop will be terminated
                doWhileBlock.isStatementAfterBlockReachable = true;
                doWhileBlock.isStatementInCurrentBlockReachable = true;
                this._blockStack.push(doWhileBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();
            }
            else {
                // not enough information we can't say anything about the doStatement so visit the while body as normal
                doWhileBlock.isStatementAfterBlockReachable = true;
                doWhileBlock.isStatementInCurrentBlockReachable = true;
                this._blockStack.push(doWhileBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                containerBlock.isStatementInCurrentBlockReachable = result.isStatementAfterBlockReachable;
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
            var clause: SwitchClauseSyntax = null;
            var clauseBlock: ControlFlowBlock = null;
            var result: ControlFlowBlock = null;
            var numberOfReturn = 0;  // store number of return in switchClause

            // check if there is any label associated with this doStatement
            var label: string = null;
            if (this._currentLabel !== null) {
                // if there is a label, then get the top most one on the stack as that is the most recent one
                label = this._currentLabel;
                this._currentLabel = null;
            }

            var containerBlock = this._blockStack[this._blockStack.length - 1];

            var switchBlock = new ControlFlowBlock(node, label);
            switchBlock.isStatementAfterBlockReachable = false;
            this._blockStack.push(switchBlock);
            for (var i = 0, n = node.switchClauses.childCount(); i < n; ++i) {
                clause = <SwitchClauseSyntax>(node.switchClauses.childAt(i));

                // if the clause doesn't contain any statement in the body, we wil skip it
                if (clause.statements.childCount() === 0) {
                    super.skip(clause);
                    continue;
                }

                clauseBlock = new ControlFlowBlock(clause, label);
                this._blockStack.push(clauseBlock);
                super.visitNodeOrToken(clause);
                result = this._blockStack.pop();

                // if any clause of the switchStatement contains breakStatement then statements after switchstatement are reachable
                if (result.isStatementAfterBlockReachable) {
                    switchBlock.isStatementAfterBlockReachable = result.isStatementAfterBlockReachable;
                }
            }
            this._blockStack.pop()
            containerBlock.isStatementInCurrentBlockReachable = switchBlock.isStatementAfterBlockReachable;
            super.skip(node.closeBraceToken);
        }

        public visitTryStatement(node: TryStatementSyntax): void {
            var notReachaedCurrentNode = this.checkNoContinuationAndReportError(super.position() + node.tryKeyword.leadingTriviaWidth(), node.width());
            if (notReachaedCurrentNode) {
                // since the current one is not reachable then all its children are not reachable
                // also we report an error already we don't need to visit the rest of the node in tryStatement
                super.skip(node);
                return;
            }

            super.skip(node.tryKeyword);
            // if containerBlock is reachable, we will visit current tryStatement node
            var containerBlock = this._blockStack[this._blockStack.length - 1];
            var tryBlock = new ControlFlowBlock(node);
            this._blockStack.push(tryBlock);
            super.visitNode(node.block);
            var tryFlag = this._blockStack.pop().isStatementInCurrentBlockReachable;

            // visit catchClause if one exists
            var catchFlag = true;
            if (node.catchClause !== null) {
                var catchBlock = new ControlFlowBlock(node);
                this._blockStack.push(catchBlock);
                super.visitNode(node.catchClause);
                catchFlag = this._blockStack.pop().isStatementInCurrentBlockReachable;
            }

            // visit finallyClause if one exists
            var finallyFlag = true;
            if (node.finallyClause !== null) {
                var finallyBlock = new ControlFlowBlock(node);
                this._blockStack.push(finallyBlock);
                super.visitNode(node.finallyClause);
                finallyFlag = this._blockStack.pop().isStatementInCurrentBlockReachable;
            }

            // if both tryBlock and catchBlock are reachable as well as finallyBlock then other statements in the same block will not be reachable
            // if both tryBlock and catchBlock are not reachable the other statements in the same block will not be reachable
            // if finallyBlock is not reachable then other statements in the same block are not reachable (regardless of tryBlock and catchBlock)
            containerBlock.isStatementInCurrentBlockReachable = (tryFlag || catchFlag) && finallyFlag;
        }
    }
}
