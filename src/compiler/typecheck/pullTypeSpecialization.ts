// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export class PullSpecializedValueSymbol extends PullSymbol {
        private _rootSymbol: PullSymbol;

        constructor(rootSymbol: PullSymbol) {
            super(rootSymbol.getName(), rootSymbol.getKind());

            this._rootSymbol = rootSymbol;
        }

        public isSpecializedValue(): boolean { return false; }

        public getDeclarations(): PullDecl[] {
            return this._rootSymbol.getDeclarations();
        }

        // abstract methods
        public addDeclaration(decl: PullDecl) {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeDeclaration() {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public setContainer(containerSymbol: PullTypeSymbol) {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public unsetContainer() {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public unsetType() {
            Debug.assert(false, "Invalid method call on specialized type");
        }

    }

    export class PullSpecializedTypeSymbol extends PullTypeSymbol {
        private _rootType: PullTypeSymbol = null;
        private _typeArguments: PullTypeSymbol[] = null;
        private _specializedMemberNameCache: any = new BlockIntrinsics(); // name -> PullSpecializedValueSymbol

        private _specializedMemberCache: PullSymbol[] = null;
        private _specializedAllMembersCache: PullSymbol[] = null;
        private _specializedCallSignatureCache: PullSignatureSymbol[] = null;
        private _specializedConstructSignatureCache: PullSignatureSymbol[] = null;
        private _specializedIndexSignatureCache: PullSignatureSymbol[] = null;
        private _specializedExtendedTypesCache: PullTypeSymbol[] = null;
        private _specializedImplementedTypesCache: PullTypeSymbol[] = null;
        private _specializedConstructorMethod: PullSymbol = null;
        private _typeSubstitutionCache: any = null;

        constructor(rootType: PullTypeSymbol, typeArguments: PullTypeSymbol[], substitutions: any) {
            super(rootType.getName(), rootType.getKind());

            this._rootType = rootType;
            this._typeArguments = typeArguments;
            this._typeSubstitutionCache = substitutions;

            rootType.addSpecialization(this, typeArguments);
        }

        public isGeneric(): boolean {
            return true;
        }

        public getIsSpecialized(): boolean {
            return true;
        }

        public getTypeArguments(): PullTypeSymbol[] {
            return this._typeArguments;
        }

        public rootType(): PullTypeSymbol {
            return this._rootType;
        }

        public getSubstitutionForType(type: PullTypeSymbol): PullTypeSymbol {
            if (this._typeSubstitutionCache) {
                var substitution = this._typeSubstitutionCache[type.getSymbolID().toString()]

                if (substitution) {
                    return substitution;
                }
            }

            return type;
        }

        public addTypeSubstitutions(substitutions: any) {
            if (!substitutions) {
                return;
            }

            if (!this._typeSubstitutionCache) {
                this._typeSubstitutionCache = substitutions;
                return;
            }

            for (var sub in substitutions) {
                this._typeSubstitutionCache[sub] = substitutions[sub];
            }
        }

        public getTypeSubstitutions() {
            return this._typeSubstitutionCache;
        }

        public getMembers(): PullSymbol[]{

            if (!this._specializedMemberCache) {

                this._specializedMemberCache = [];

                var rootMembers = this._rootType.getMembers();

                for (var i = 0; i < rootMembers.length; i++) {

                    if (this._specializedMemberNameCache[rootMembers[i].getName()]) {
                        this._specializedMemberCache[this._specializedMemberCache.length] = this._specializedMemberNameCache[rootMembers[i].getName()];
                    }
                    else {
                        this._specializedMemberCache[this._specializedMemberCache.length] = getSpecializedMember(rootMembers[i], this._rootType.getTypeParameters(), this._typeArguments, this._typeSubstitutionCache);
                        this._specializedMemberNameCache[rootMembers[i].getName()] = this._specializedMemberCache[this._specializedMemberCache.length - 1];
                    }
                }
            }

            return this._specializedMemberCache;
        }

        public findMember(name: string, lookInParent?: boolean): PullSymbol {

            if (!this._specializedMemberNameCache) {
                this._specializedMemberNameCache = new BlockIntrinsics();
            }

            if (this._specializedMemberNameCache[name]) {
                return this._specializedMemberNameCache[name];
            }

            var rootMember = this._rootType.findMember(name, lookInParent);

            if (!rootMember) {
                return null;
            }

            var specializedMember = getSpecializedMember(rootMember, this._rootType.getTypeParameters(), this._typeArguments, this._typeSubstitutionCache);

            if (!lookInParent) {
                this._specializedMemberNameCache[name] = specializedMember;
            }

            return specializedMember;
        }

        public getAllMembers(searchDeclKind: PullElementKind, includePrivate: boolean): PullSymbol[] {
            
            // It's safe to have one cache -  since we can't have nested types and containers can't be generic,
            // searchDeclKind can only be SomeValue
            if (this._specializedAllMembersCache) {
                return this._specializedAllMembersCache;
            }

            this._specializedAllMembersCache = [];

            var allRootMembers = this._rootType.getAllMembers(searchDeclKind, includePrivate);

            for (var i = 0; i < allRootMembers.length; i++) {
                if (this._specializedMemberNameCache[allRootMembers[i].getName()]) {
                    this._specializedAllMembersCache[this._specializedAllMembersCache.length] = this._specializedMemberNameCache[allRootMembers[i].getName()];
                }
                else {
                    this._specializedAllMembersCache[this._specializedAllMembersCache.length] = getSpecializedMember(allRootMembers[i], this._rootType.getTypeParameters(), this._typeArguments, this._typeSubstitutionCache);
                }
            }
            
            return this._specializedAllMembersCache;
        }

        public getCallSignatures(): PullSignatureSymbol[]{

            if (this._specializedCallSignatureCache) {
                return this._specializedCallSignatureCache;
            }

            this._specializedCallSignatureCache = [];

            var rootCallSignatures = this._rootType.getCallSignatures();

            for (var i = 0; i < rootCallSignatures.length; i++) {
                this._specializedCallSignatureCache[this._specializedCallSignatureCache.length] = getSpecializedSignature(rootCallSignatures[i], this._rootType.getTypeParameters(), this._typeArguments, false, this._typeSubstitutionCache);
            }

            return this._specializedCallSignatureCache;
        }

        public getConstructSignatures(): PullSignatureSymbol[] {
            if (this._specializedConstructSignatureCache) {
                return this._specializedConstructSignatureCache;
            }

            this._specializedConstructSignatureCache = [];

            var rootConstructSignatures = this._rootType.getConstructSignatures();

            for (var i = 0; i < rootConstructSignatures.length; i++) {
                this._specializedConstructSignatureCache[this._specializedConstructSignatureCache.length] = getSpecializedSignature(rootConstructSignatures[i], this._rootType.getTypeParameters(), this._typeArguments, false, this._typeSubstitutionCache);
            }

            return this._specializedConstructSignatureCache;
        }

        public getIndexSignatures(): PullSignatureSymbol[] {
            if (this._specializedIndexSignatureCache) {
                return this._specializedIndexSignatureCache;
            }

            this._specializedIndexSignatureCache = [];

            var rootIndexSignatures = this._rootType.getIndexSignatures();

            for (var i = 0; i < rootIndexSignatures.length; i++) {
                this._specializedIndexSignatureCache[this._specializedIndexSignatureCache.length] = getSpecializedSignature(rootIndexSignatures[i], this._rootType.getTypeParameters(), this._typeArguments, false, this._typeSubstitutionCache);
            }

            return this._specializedIndexSignatureCache;
        }

        public getImplementedTypes(): PullTypeSymbol[] {
            if (this._specializedImplementedTypesCache) {
                return this._specializedImplementedTypesCache;
            }

            this._specializedImplementedTypesCache = [];

            var rootImplementedTypes = this._rootType.getImplementedTypes();

            for (var i = 0; i < rootImplementedTypes.length; i++) {
                this._specializedImplementedTypesCache[this._specializedImplementedTypesCache.length] = getSpecializedType(rootImplementedTypes[i], rootImplementedTypes[i].getTypeParameters(), this._typeArguments, false, this._typeSubstitutionCache);
            }

            return this._specializedImplementedTypesCache;
        }

        public getExtendedTypes(): PullTypeSymbol[] {
            if (this._specializedExtendedTypesCache) {
                return this._specializedExtendedTypesCache;
            }

            this._specializedExtendedTypesCache = [];

            var rootExtendedTypes = this._rootType.getExtendedTypes();

            for (var i = 0; i < rootExtendedTypes.length; i++) {
                this._specializedExtendedTypesCache[this._specializedExtendedTypesCache.length] = getSpecializedType(rootExtendedTypes[i], rootExtendedTypes[i].getTypeParameters(), this._typeArguments, false, this._typeSubstitutionCache);
            }

            return this._specializedExtendedTypesCache;
        }

        public hasBase(potentialBase: PullTypeSymbol): boolean {

            // REVIEW: Need to re-think this...
            return this._rootType.hasBase(potentialBase);
        }

        public getConstructorMethod(): PullSymbol {
            if (this._specializedConstructorMethod) {
                return this._specializedConstructorMethod;
            }

            var rootConstructorMethod = this._rootType.getConstructorMethod();

            if (!rootConstructorMethod) {
                return null;
            }

            this._specializedConstructorMethod = getSpecializedMember(rootConstructorMethod, rootConstructorMethod.getType().getTypeParameters(), this._typeArguments, this._typeSubstitutionCache);

            return this._specializedConstructorMethod;
        }

        public getElementType(): PullTypeSymbol {
            if (!this.isArray()) {
                return null;
            }

            return this._typeArguments[0];
        }

        public invalidate() {
            this._specializedMemberNameCache = new BlockIntrinsics(); // name -> PullSpecializedValueSymbol

            this._specializedMemberCache = null;
            this._specializedAllMembersCache = null;
            this._specializedCallSignatureCache = null;
            this._specializedConstructSignatureCache = null;
            this._specializedIndexSignatureCache = null;
            this._specializedConstructorMethod = null;
            this._specializedExtendedTypesCache = null;
            this._specializedImplementedTypesCache = null;

            super.invalidate();
        }

        // root type delegate methods

        public getDeclarations(): PullDecl[] {
            return this._rootType.getDeclarations();
        }

        public isClass() {
            return this._rootType.isClass();
        }

        public getContainer(): PullTypeSymbol {
            return this._rootType.getContainer();
        }

        public hasMembers() {
            return this._rootType.hasMembers();
        }

        public getHasDefaultConstructor(): boolean {
            return this._rootType.getHasDefaultConstructor();
        }

        public getTypeParameters(): PullTypeParameterSymbol[] {
            return this._rootType.getTypeParameters();
        }

        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol {

            return this._rootType.getSpecialization(substitutingTypes);
        }

        public getKnownSpecializations(): PullTypeSymbol[] {
            return this._rootType.getKnownSpecializations();
        }

        public hasOwnCallSignatures(): boolean {
            return this._rootType.hasOwnCallSignatures();
        }

        public hasOwnConstructSignatures() {
            return this._rootType.hasOwnConstructSignatures();
        }

        public hasOwnIndexSignatures() {
            return this._rootType.hasOwnIndexSignatures();
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            return this._rootType.findTypeParameter(name);
        }

        public getHasGenericMember(): boolean {
            return this._rootType.getHasGenericMember();
        }

        public getHasGenericSignature(): boolean {
            return this._rootType.getHasGenericSignature();
        }

        public getAssociatedContainerType(): PullTypeSymbol {
            return this._rootType.getAssociatedContainerType();
        }

        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void {
            this._rootType.addSpecialization(specializedVersionOfThisType, substitutingTypes);
        }

        // abstract members
        public addDeclaration(decl: PullDecl) {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeDeclaration() {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public setContainer(containerSymbol: PullTypeSymbol) {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public unsetContainer() {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public unsetType() {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public setHasGenericSignature(): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public setHasGenericMember(): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public setAssociatedContainerType(type: PullTypeSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addMember(memberSymbol: PullSymbol, linkKind: SymbolLinkKind, doNotChangeContainer?: boolean): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeMember(memberSymbol: PullSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public setHasDefaultConstructor(hasOne= true): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public setConstructorMethod(constructorMethod: PullSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public isFixed(): boolean {
            Debug.assert(false, "Invalid method call on specialized type");
            return false;
        }

        public invalidateSpecializations(): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeSpecialization(specializationType: PullTypeSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public setTypeArguments(typeArgs: PullTypeSymbol[]): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addCallSignature(callSignature: PullSignatureSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addCallSignatures(callSignatures: PullSignatureSymbol[]): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addConstructSignature(constructSignature: PullSignatureSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addConstructSignatures(constructSignatures: PullSignatureSymbol[]): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addIndexSignature(indexSignature: PullSignatureSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addIndexSignatures(indexSignatures: PullSignatureSymbol[]): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeCallSignature(signature: PullSignatureSymbol, invalidate = true): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public recomputeCallSignatures(): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeConstructSignature(signature: PullSignatureSymbol, invalidate = true): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public recomputeConstructSignatures(): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeIndexSignature(signature: PullSignatureSymbol, invalidate = true): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public recomputeIndexSignatures(): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addImplementedType(interfaceType: PullTypeSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeImplementedType(implementedType: PullTypeSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public addExtendedType(extendedType: PullTypeSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public removeExtendedType(extendedType: PullTypeSymbol): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }

        public findNestedType(name: string, kind = PullElementKind.None): PullTypeSymbol {
            Debug.assert(false, "Invalid method call on specialized type");
            
            return null;
        }

        public cleanTypeParameters(): void {
            Debug.assert(false, "Invalid method call on specialized type");
        }
    }

    export class PullSpecializedSignatureSymbol extends PullSignatureSymbol {
        private _rootSignature: PullSignatureSymbol = null;
        private _typeArguments: PullTypeSymbol[] = null;

        constructor(rootSignature: PullSignatureSymbol, typeArguments: PullTypeSymbol[]) {
            super(rootSignature.getKind());

            this._rootSignature = rootSignature;
            this._typeArguments = typeArguments;

            this._rootSignature.addSpecialization(this, typeArguments);
        }

        public rootSignature() {
            return this._rootSignature;
        }

        public getTypeArguments() {
            return this._typeArguments;
        }

        public getDeclarations() {
            return this._rootSignature.getDeclarations();
        }

        public isGeneric() {
            return true;
        }

        // root delegates
        public isDefinition() {
            return this._rootSignature.isDefinition();
        }

        public hasVariableParamList() {
            return this._rootSignature.hasVariableParamList();
        }

        public hasGenericParameter() {
            return this._rootSignature.hasGenericParameter();
        }

        public getTypeParameters() {
            return this._rootSignature.getTypeParameters();
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            return this._rootSignature.findTypeParameter(name);
        }

        public getSpecialization(typeArguments) {
            return this._rootSignature.getSpecialization(typeArguments);
        }

        public getNonOptionalParameterCount() {
            return this._rootSignature.getNonOptionalParameterCount();
        }
        public addSpecialization(signature: PullSignatureSymbol, typeArguments: PullTypeSymbol[]) {
            this._rootSignature.addSpecialization(signature, typeArguments);
        }


        // abstract methods
        public addDeclaration(decl: PullDecl) {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public removeDeclaration() {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public setContainer(containerSymbol: PullTypeSymbol) {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public unsetContainer() {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public unsetType() {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public setIsDefinition() {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public setHasVariableParamList() {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public setHasGenericParameter() {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public addTypeParameter(parameter: PullTypeParameterSymbol) {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public removeParameter(parameterSymbol: PullSymbol) {
            Debug.assert(false, "Invalid method call on specialized signature");
        }

        public mimicSignature(signature: PullSignatureSymbol, resolver: PullTypeResolver) {
            Debug.assert(false, "Invalid method call on specialized signature");
        }
    }


    export function getSpecializedMember(symbolToSpecialize: PullSymbol, typeParameters: PullTypeSymbol[], typeArguments: PullTypeSymbol[], substitutions: any): PullSymbol {

        var newValueSymbol = new PullSpecializedValueSymbol(symbolToSpecialize);

        var newType = getSpecializedType(symbolToSpecialize.getType(), typeParameters, typeArguments, false, substitutions);

        newValueSymbol.setType(newType);

        newValueSymbol.setResolved();

        return newValueSymbol;
    }

    export function createSubstitutionMap(substitutions: any, typeParameters: PullTypeSymbol[], typeArguments: PullTypeSymbol[]) {

        if (!typeParameters.length || !typeArguments.length || (typeParameters.length != typeArguments.length)) {
            return substitutions;
        }

        if (!substitutions) {
            substitutions = {};
        }

        for (var i = 0; i < typeParameters.length; i++) {
            substitutions[typeParameters[i].getSymbolID().toString()] = typeArguments[i];
        }

        return substitutions;
    }

    export function createOverrideSubstitutionMap(substitutions: any, typeParameters: PullTypeSymbol[], overrideType: PullTypeSymbol) {

        if (!substitutions) {
            substitutions = {};
        }
        else {
            for (var sub in substitutions) {
                substitutions[sub] = overrideType;
            }
        }

        for (var i = 0; i < typeParameters.length; i++) {
            substitutions[typeParameters[i].getSymbolID().toString()] = overrideType;
        }

        return substitutions;
    }


    export function getSpecializedType(typeToSpecialize: PullTypeSymbol, typeParameters: PullTypeSymbol[], typeArguments: PullTypeSymbol[], atCallSite: boolean, substitutions: any, overrideType?: PullTypeSymbol): PullTypeSymbol {
        if (typeToSpecialize.isPrimitive() || !typeToSpecialize.isGeneric()) {
            return typeToSpecialize;
        }

        if (typeToSpecialize.isTypeParameter()) {

            if (overrideType) {
                return overrideType;
            }

            if (substitutions && substitutions[typeToSpecialize.getSymbolID().toString()]) {
                return <PullTypeSymbol>substitutions[typeToSpecialize.getSymbolID().toString()];
            }

            if (typeArguments.length == 1 && (!(<PullTypeParameterSymbol>typeToSpecialize).isFunctionTypeParameter())) {
                return typeArguments[0];

                //else if (substitutions && substitutions[typeToSpecialize.getSymbolID().toString()]) {
                //    return <PullTypeSymbol>substitutions[typeToSpecialize.getSymbolID().toString()];
                //}
            }
            return typeToSpecialize;
            //else {
            //    Debug.assert(false, "Could not specialize type parameter");
            //}
        }

        var existingSpecialization = typeToSpecialize.getSpecialization(typeArguments);

        if (existingSpecialization) {
            return existingSpecialization;
        }

        var substitutions = overrideType ? createOverrideSubstitutionMap((<PullSpecializedTypeSymbol>typeToSpecialize).getTypeSubstitutions(), typeParameters, overrideType) : createSubstitutionMap(substitutions, typeParameters, typeArguments);
        var targetTypeParameters = typeToSpecialize.getIsSpecialized() ? typeToSpecialize.getTypeArguments() : typeToSpecialize.getTypeParameters(); //typeToSpecialize.getIsSpecialized() ? typeToSpecialize.getTypeArguments() : typeParameters;

        var typeParametersMatch = targetTypeParameters.length == typeParameters.length;

        if (typeParametersMatch) {
            for (var i = 0; i < typeParameters.length; i++) {
                if (typeParameters[i] != targetTypeParameters[i]) {
                    typeParametersMatch = false;
                    break;
                }
            }
        }

        // if (typeToSpecialize.typeParameters == typeParameters) && typeArguments - specialize to type arguments
        // if typeToSpecialize has no "wrapped" type parameters, specialize
        if (typeParametersMatch && typeArguments.length) {
            return new PullSpecializedTypeSymbol(typeToSpecialize, typeArguments, substitutions);
        }

        var targetSubstitutions: PullTypeSymbol[] = new Array<PullTypeSymbol>();

        if (substitutions) {
            for (var i = 0; i < targetTypeParameters.length; i++) {
                if (substitutions[targetTypeParameters[i].getSymbolID().toString()]) {
                    targetSubstitutions[i] = substitutions[targetTypeParameters[i].getSymbolID().toString()];
                }
                else {
                    break;
                }   
            }
        }

        // if typeToSpecialize has no type Parameters - add substitution, re-specialize
        // if (typeToSpecialize.typeParameters != typeParameters) && substitution - add substitution, re-specialize to type parameters

        return new PullSpecializedTypeSymbol(typeToSpecialize, targetSubstitutions.length == targetTypeParameters.length ? targetSubstitutions : targetTypeParameters, substitutions);

        //var targetTypeArguments = new Array<PullTypeSymbol>();
        //var substitution: PullTypeSymbol = null;

        //for (var i = 0; i < targetTypeParameters.length; i++) {
        //    if (typeArguments.length) {
        //        targetTypeArguments[i] = typeArguments[i];
        //    }
        //    else if (substitutions) {
        //        substitution = substitutions[targetTypeParameters[i].getSymbolID().toString()];

        //        if (substitution) {
        //            targetTypeArguments[targetTypeArguments.length] = substitution;
        //        }
        //    }
        //}

        //var specializedType = new PullSpecializedTypeSymbol(typeToSpecialize, targetTypeArguments, substitutions);

        //return specializedType;
    }

    export function getSpecializedSignature(signatureToSpecialize: PullSignatureSymbol, typeParameters: PullTypeSymbol[], typeArguments: PullTypeSymbol[], atCallSite: boolean, substitutions: any): PullSignatureSymbol {

        var existingSignature = signatureToSpecialize.getSpecialization(typeArguments);

        if (existingSignature) {
            return existingSignature;
        }

        var newSignature = new PullSpecializedSignatureSymbol(signatureToSpecialize, typeArguments);

        // specialize the return type
        var newReturnType = getSpecializedType(signatureToSpecialize.getReturnType(), typeParameters/*signatureToSpecialize.getReturnType().getTypeParameters()*/, typeArguments, atCallSite, substitutions);

        newSignature.setReturnType(newReturnType);

        // specialize the parameters
        var newParameter: PullSymbol = null;
        var newParameterType: PullTypeSymbol = null;

        var parametersToSpecialize = signatureToSpecialize.getParameters();

        for (var i = 0; i < parametersToSpecialize.length; i++) {
            newParameter = new PullSpecializedValueSymbol(parametersToSpecialize[i]);
            newParameterType = getSpecializedType(parametersToSpecialize[i].getType(), typeParameters, typeArguments, false, substitutions);

            newParameter.setType(newParameterType);

            newSignature.addParameter(newParameter);
        }

        return newSignature;
    }

}