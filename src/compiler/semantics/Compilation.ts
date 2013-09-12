module TypeScript {
    export class Compilation {
        private typeRelationships = new TypeRelationships(this);

        public anyType(): IType {
            throw Errors.notYetImplemented();
        }

        public numberType(): IType {
            throw Errors.notYetImplemented();
        }
    }
}