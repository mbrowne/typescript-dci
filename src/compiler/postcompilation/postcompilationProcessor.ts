///<reference path='references.ts' />

module TypeScript {
    export enum PostCompilationTypes {
        unreachableCode = 0
    }

    export class SubProcessor extends PositionTrackingWalker {
        constructor(public fileName: string, public diagnostics: Diagnostic[]) {
            super();
        }
    }

    /*
    */
    export class PostCompilationProcessor {
        private _processors: SubProcessor[] = null;
        private _diagnostics: Diagnostic[] = null;

        constructor(public document: Document, settings: CompilationSettings) {
            this._processors = [];
            this._diagnostics = [];

            if (settings.noUnreachableCode) {
                this._processors.push(new UnreachableCodeProcessor(this.document.fileName, this._diagnostics));
            }
        }

        public runPostCompilationProcesses(): Diagnostic[] {
            for (var i = 0, n = this._processors.length; i < n; ++i) {
                this._processors[i].visitSourceUnit(this.document.syntaxTree().sourceUnit());
            }
            return this._diagnostics;
        }
    }
}