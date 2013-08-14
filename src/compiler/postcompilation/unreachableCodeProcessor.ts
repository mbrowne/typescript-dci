///<reference path='postcompilationProcessor.ts' />
///<reference path='references.ts' />

module TypeScript {
    /*
    */
    export class ControlFlowBlock {
        // name property is set by label statement in the code
        public labelName: string;
        public nodeKind: SyntaxKind;
        public noContinuation: boolean;  // the flag is set to be true if the block is not continued (i.e the next statement is unreachable)
        public loopTerminated: boolean;  // the flag is set to be true if the current LOOP block will be terminated
        public reachEndOfLoop: boolean;  // the flag is set to be true if the next statement outside the current LOOP block can be reached
        public errorReported: boolean;  // the flag is set tob

        constructor(labelName: string, nodeKind: SyntaxKind) {
            this.labelName = labelName;
            this.noContinuation = false;
            this.nodeKind = nodeKind;
            this.loopTerminated = true;
            this.reachEndOfLoop = true;
            this.errorReported = false;
        }
    }

    /*
    */
    export class UnreachableCodeProcessor extends SubProcessor {
        private _blockStack: ControlFlowBlock[];

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

        public reportError(error: Diagnostic, block: ControlFlowBlock): void {
            this.diagnostics.push(error);
            block.errorReported = true;
        }

        public visitSourceUnit(node: SourceUnitSyntax): void {
            var sourceUnitBlock = new ControlFlowBlock(null, node.kind());
            this._blockStack.push(sourceUnitBlock);
            super.visitSourceUnit(node);
            this._blockStack.pop();
        }

        public visitVariableStatement(node: VariableStatementSyntax): void {
            var previousBlock = this._blockStack[this._blockStack.length-1];

            // if previous block noContinuationFlag is true, then the current statement is unreachable. 
            // if we have not reported an error yet, report an error.
            if (previousBlock && previousBlock.noContinuation && !previousBlock.errorReported) {
                this.reportError(new Diagnostic(this.fileName, super.position() + node.variableDeclaration.varKeyword.leadingTriviaWidth(), 
                    node.width(), DiagnosticCode.Unreachable_code_detected, null), previousBlock);
            }
            super.visitVariableStatement(node);
        }

        public visitReturnStatement(node: ReturnStatementSyntax): void {
            var previousBlock = this._blockStack[this._blockStack.length - 1];
            if (previousBlock && previousBlock.noContinuation && !previousBlock.errorReported) {
                this.reportError(new Diagnostic(this.fileName, super.position() + node.returnKeyword.leadingTriviaWidth(),
                    node.width(), DiagnosticCode.Unreachable_code_detected, null), previousBlock);
            }
            previousBlock.noContinuation = true;
            super.skip(node);
        }

        public visitBreakStatement(node: BreakStatementSyntax): void {
            var previousBlock = this._blockStack[this._blockStack.length - 1];
            // check if previousBlock is reachable; if it is not reachable, then current block is not reachable.
            // report an error if not yet report
            if (previousBlock && previousBlock.noContinuation && !previousBlock.errorReported) {
                this.reportError(new Diagnostic(this.fileName, super.position() + node.breakKeyword.leadingTriviaWidth(),
                    node.width(), DiagnosticCode.Unreachable_code_detected, null), previousBlock);
                super.skip(node);
                return;
            }

            // get labelName from breakStatement if one exists
            var labelName: string = null;
            if (node.identifier !== null) {
                labelName = node.identifier.text();
            }

            // breakStatement make other statements of the current block to be unreachable
            previousBlock.noContinuation = true;

            // find loop control flow block with matched labelName to the labelName of the breakSatement.
            var whileBlock: ControlFlowBlock = null;
            for (var i = this._blockStack.length - 1; i >= 0; --i) {
                var block = this._blockStack[i];
                var kind = block.nodeKind;
                var label = block.labelName;

                if (kind === SyntaxKind.WhileStatement ||
                    kind === SyntaxKind.ForInStatement ||
                    kind === SyntaxKind.ForStatement ||
                    kind === SyntaxKind.DoStatement) {
                    if (label === labelName) {
                        whileBlock = block;
                        whileBlock.loopTerminated = true;
                        whileBlock.reachEndOfLoop = true;
                        break;
                    }
                    // if we encounter other whileBlock before able to find matched whileBlock with the label then mark such block to be terminated
                    else {
                        block.loopTerminated = true;
                        block.reachEndOfLoop = false;
                    }
                }
            }
            
            // breakStatement is not declared in while/for/do
            if (whileBlock === null) {
                this.reportError(new Diagnostic(this.fileName, super.position() + node.breakKeyword.leadingTriviaWidth(),
                    node.width(), DiagnosticCode.Break_statement_declared_outside_of_loop_control_flow_statement, null), previousBlock);
            }
            super.skip(node);
            return;
        }

        public visitIfStatement(node: IfStatementSyntax): void {
            var previousBlock = this._blockStack[this._blockStack.length - 1];

            // if previousBlock is already unreachable then current one will be unreachable as well
            if (previousBlock && previousBlock.noContinuation) {
                // if we haven't report an unreachableCode error, report an error
                if (!previousBlock.errorReported) {
                    this.reportError(new Diagnostic(this.fileName, super.position() + node.ifKeyword.leadingTriviaWidth(),
                        node.width(), DiagnosticCode.Unreachable_code_detected, null), previousBlock);
                }
                // since we report an error already we don't need to visit the rest of the node in ifStatement
                super.skip(node);
                return;
            }

            // if previousBlock is reachable, we will visit current node
            super.visitToken(node.ifKeyword);
            super.visitToken(node.openParenToken);
            super.skip(node.condition);
            super.visitToken(node.closeParenToken);

            // evaluate condition when it is true/false literal or condition statement
            if (node.condition.kind() === SyntaxKind.TrueKeyword) {
                // visit ifClause
                var ifBlock = new ControlFlowBlock(null, node.kind());
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);

                // the flag set by ifBlock will determine ifStatementBlock continuation
                var resultBlock = this._blockStack.pop();
                var ifBlockFlag = resultBlock.noContinuation;

                // if there is elseClause then, visit elseClause and mark it is unreachable
                var elseClause = node.elseClause;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(null, node.kind());
                    elseBlock.noContinuation = true;
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    this._blockStack.pop();
                }

                // update the previousBlock with ifClause noContinuation flag
                // determine whehter statements after if is reachable 
                previousBlock.noContinuation = ifBlockFlag;
                return;
            }
            else if (node.condition.kind() === SyntaxKind.FalseKeyword) {
                // visit ifClause and mark it is unreachable
                var ifBlock = new ControlFlowBlock(null, node.kind());
                ifBlock.noContinuation = true;
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();

                // if there is elseClause then, visit elseClause
                var elseClause = node.elseClause;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(null, node.kind());
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    var elseBlockFlag = this._blockStack.pop().noContinuation;
                    previousBlock.noContinuation = elseBlockFlag;
                }
                return;
            }
            // condition is an expression instead of boolean literal
            else {
                // visit ifClause
                var ifBlock = new ControlFlowBlock(null, node.kind());
                this._blockStack.push(ifBlock);
                super.visitNodeOrToken(node.statement);
                var ifBlockFlag = this._blockStack.pop().noContinuation;

                var elseClause = node.elseClause;
                var elseBlockFlag = false;
                if (elseClause) {
                    var elseBlock = new ControlFlowBlock(null, node.kind());
                    this._blockStack.push(elseBlock);
                    super.visitElseClause(elseClause);
                    elseBlockFlag = this._blockStack.pop().noContinuation;
                }

                // update ifStatementBlock with noContinuation from ifClause and elseClause
                previousBlock.noContinuation = (elseBlockFlag && ifBlockFlag);
                return;
            }
        }

        public visitWhileStatement(node: WhileStatementSyntax): void {
            var previousBlock = this._blockStack[this._blockStack.length - 1];
            if (previousBlock && previousBlock.noContinuation && !previousBlock.errorReported) {
                this.reportError(new Diagnostic(this.fileName, super.position() + node.whileKeyword.leadingTriviaWidth(),
                    node.width(), DiagnosticCode.Unreachable_code_detected, null), previousBlock);
                super.skip(node);
                return;
            }

            super.visitToken(node.whileKeyword);
            super.visitToken(node.openParenToken);
            super.visitNodeOrToken(node.condition);
            super.visitToken(node.closeParenToken);

            var whileBlock = new ControlFlowBlock(null, node.kind());
            if (node.condition.kind() === SyntaxKind.TrueKeyword) {
                // by default if the condition is a true literal, the loop is not terminated and the end of the loop can't be reached
                whileBlock.loopTerminated = false;
                whileBlock.reachEndOfLoop = false;
                this._blockStack.push(whileBlock);
                super.visitNodeOrToken(node.statement);
                var result = this._blockStack.pop();

                // check if we encounter an breakStatement and, thus, updateEndofLoop flag
                // if we can't reach the end of the loop but the loop is terminated, then the statement in the same block after the loop will be unreachable
                if (!result.reachEndOfLoop && result.loopTerminated) {
                    previousBlock.noContinuation = true;
                }
                // if we can reach the end of the loop and the loop is terminated, then the statement in the same block after the loop will reachable
                else if (result.reachEndOfLoop && result.loopTerminated) {
                    previousBlock.noContinuation = false;
                }
                // if we can't reach the end of the loop and the loop is not terminated, then the statement in the same block after the lopp will be unreachable
                else if (!result.reachEndOfLoop && !result.loopTerminated) {
                    previousBlock.noContinuation = true;
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
                return;
            }
            else {
                // not enough information we can't say anything about the whileStatement so visit the while body as normal
                whileBlock.loopTerminated = true;
                whileBlock.reachEndOfLoop = true;
                whileBlock.noContinuation = true;
                this._blockStack.push(whileBlock);
                super.visitNodeOrToken(node.statement);
                this._blockStack.pop();
                return;
            }
        }
    }
}
