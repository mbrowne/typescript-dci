/// <reference path='references.ts' />

module TypeScript {
    export interface IMember {
        memberKind(): MemberKind;

        isProperty(): boolean;
        isCallSignature(): boolean;
        isConstructSignature(): boolean;
        isIndexSignature(): boolean;
    }

    export interface IProperty extends IMember {
        originatingDeclaration(): Declaration;
        accessibility(): Accessibility;
        name(): string;
        isOptional(): boolean;
        type(): IType;
    }

    export interface IParameter {
        name(): string;
        type(): IType;
        isOptional(): boolean;
    }

    export interface ICallOrConstructSignature extends IMember {
        typeParameters(): ITypeParameter[];
        parameters(): IParameter[];
        returnType(): IType;
    }

    export interface IIndexSignature extends IMember {
        isStringIndexSignature(): boolean;
        isNumbericIndexSignature(): boolean;
        type(): IType;
    }
}