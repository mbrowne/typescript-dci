/// <reference path='references.ts' />

module TypeScript {
    export interface IType {
        typeKind(): TypeKind;

        isPrimitive(): boolean;
        isAny(): boolean;
        isNumber(): boolean;
        isBoolean(): boolean;
        isString(): boolean;
        isVoid(): boolean;
        isNull(): boolean;
        isUndefined(): boolean;
        isEnum(): boolean;
        isStringLiteral(): boolean;
        isObjectType(): boolean;
        isNamedTypeReference(): boolean;
        isAnonymousType(): boolean;
        isTypeParameter(): boolean;

        // We probably don't want this here.  
        name(): string;
    }

    export interface IObjectType extends IType {
        members(): IMember[];

        getProperty(name: string): IProperty;

        properties(): IProperty[];
        callSignatures(): ICallOrConstructSignature[];
        constructSignatures(): ICallOrConstructSignature[];
        indexSignatures(): IIndexSignature[];
    }

    export class Declaration {
    }

    export interface INamedTypeReference extends IObjectType {
        originatingDeclaration(): Declaration;
        typeArguments(): IType[];
    }

    export interface ITypeParameter extends IType {
        constraint(): IType;
    }
}