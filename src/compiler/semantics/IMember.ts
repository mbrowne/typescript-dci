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

        // A numerically named property is a property whose name is a valid numeric literal. 
        // Specifically, a property with a name N for which ToNumber(N) is not NaN, where ToNumber 
        // is the abstract operation defined in ECMAScript specification.
        isNumericallyNamed(): boolean;
    }

    export interface IParameter {
        name(): string;
        type(): IType;
        isOptional(): boolean;
        isRest(): boolean;
    }

    export interface IInstantiatedCallOrConstructSignature {
        // Gets the type of the parameter at the specified index.  This method takes into account
        // rest parameters and considers them expanded when retrieving the type.  i.e. if you have
        //
        //  (a: string, ...b: number[]) => void;
        //
        // Then the following results will be returned:
        //  0 -> string
        //  1 -> number
        //  2 -> number
        //  ...
        //  n -> number
        getParameterTypeWithRestExpansion(index: number): IType;
        parameters(): IParameter[];
        returnType(): IType;

        // Call and construct signatures may be specialized (section 3.7.2.4) by including 
        // parameters with string literal types.Specialized signatures are used to express patterns
        // where specific string values for some parameters cause the types of other parameters or
        // the function result to become further specialized.
        isSpecialized(): boolean;

        nonOptionalParameterCount(): number;
    }

    export interface ICallOrConstructSignature extends IMember, IInstantiatedCallOrConstructSignature {
        typeParameters(): ITypeParameter[];

        // A call signature that includes TypeParameters (section 3.4.1) is called a generic call 
        // signature. Conversely, a call signature with no TypeParameters is called a non-generic 
        // call signature
        isGenericSignature(): boolean;

        instantiate(typeArguments: IType[]): IInstantiatedCallOrConstructSignature;
    }

    export interface IIndexSignature extends IMember {
        isStringIndexSignature(): boolean;
        isNumbericIndexSignature(): boolean;
        type(): IType;
    }
}