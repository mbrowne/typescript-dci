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

    // This class is for performing various kinds of post-compilation analysis.
    // An object of this class is created per document. Each object contains its own
    // array of sub-processor which specified by users through CompilationSettings.
    export class PostCompilationProcessor {
        private _processors: SubProcessor[] = null;
        private _diagnostics: Diagnostic[] = null;

        // Constructor takes what Document to perform post-compilation process
        // and CompilationSetting which specifies what type of sub-process to be done.
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