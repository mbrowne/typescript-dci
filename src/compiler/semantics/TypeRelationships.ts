module TypeScript {
    export class TypeRelationships {
        constructor(private compilation: Compilation) {
        }

        public apperentType(type: IType): IType {
            switch (type.typeKind()) {
                // If T is the primitive type Number, Boolean, or String, the apparent type of T is
                // the global interface type ‘Number’, ‘Boolean’, or ‘String’
                case TypeKind.Number:
                    return this.compilation.globalNumberInterfaceType();
                case TypeKind.Boolean:
                    return this.compilation.globalBooleanInterfaceType();
                case TypeKind.String:
                    return this.compilation.globalStringInterfaceType();

                // if T is an enum type, the apparent type of T is the global interface type ‘Number’
                case TypeKind.Enum:
                    return this.compilation.globalNumberInterfaceType();

                // if T is a type parameter, the apparent type of T is the base constraint (section 
                // 3.4.1) of T.
                case TypeKind.TypeParameter:
                    return this.apperentType((<ITypeParameter>type).constraint());

                // Otherwise, the apparent type of T is T itself.
                default:
                    return type;
            }
        }

        public typesAreIdentical(type1: IType, type2: IType): boolean {
            var typeRelationCache = acquireTypeRelationCache();
            var result = this.typesAreIdenticalWorker(type1, type2, typeRelationCache);
            returnTypeRelationCache(typeRelationCache);

            return result;
        }

        private typesAreIdenticalWorker(type1: IType, type2: IType, cache: TypeRelationCache): boolean {
            // Two types are considered identical when
            //      they are the same primitive type,
            if (type1.isPrimitive() && type2.isPrimitive()) {
                return type1 === type2;
            }

            // they are the same type parameter, or
            if (type1.isTypeParameter() && type2.isTypeParameter()) {
                return type1 === type2;
            }

            // they are object types with identical sets of members
            if (type1.isObjectType() && type2.isObjectType()) {
                // Classes and interfaces can reference themselves in their internal structure, in
                // effect creating recursive types with infinite nesting. Types such as this are 
                // perfectly valid but require special treatment when determining type relationships. 
                // Specifically, when comparing references to two named types S and T for a given 
                // relationship(identity, subtype, or assignability), the relationship in question is 
                // assumed to be true for every directly or indirectly nested occurrence of references 
                // to the same S and T(where same means originating in the same declaration). For 
                // example, consider the identity relationship between ‘A’ above and ‘B’ below:

                if (type1.isNamedTypeReference() && type2.isNamedTypeReference()) {
                    if (type1 === type2) {
                        // Quick short circuit.
                        return true;
                    }

                    var namedType1 = <INamedTypeReference>type1;
                    var namedType2 = <INamedTypeReference>type2;

                    // If we've already been examining this relation, then we assume things to be
                    // true if we were to recurse.
                    if (cache.containsRelation(namedType1, namedType2)) {
                        return true;
                    }

                    // Add a relation between these two types.  If we see them again while 
                    // recursing, then we'll immediately stop.
                    cache.addRelation(namedType1, namedType2);
                }

                var objectType1 = <IObjectType>type1;
                var objectType2 = <IObjectType>type2;

                // they are object types with identical sets of members.
                return this.objectTypeMembersAreIdentical(objectType1, objectType2, cache);
            }

            return false;
        }

        private objectTypeMembersAreIdentical(objectType1: IObjectType, objectType2: IObjectType, cache: TypeRelationCache): boolean {
            if (objectType1.properties().length === objectType2.members().length &&
                objectType1.callSignatures().length === objectType2.callSignatures().length &&
                objectType1.constructSignatures().length === objectType2.constructSignatures().length &&
                objectType1.indexSignatures().length === objectType2.indexSignatures().length) {

                var properties1 = objectType1.properties();
                for (var i = 0, n = properties1.length; i < n; i++) {
                    var property1 = properties1[i];
                    var property2 = objectType2.getProperty(property1.name());

                    if (!this.propertiesAreIdentical(property1, property2, cache)) {
                        return false;
                    }
                }

                if (!this.memberArraysAreIdentical(objectType1.callSignatures(), objectType2.callSignatures(), cache)) {
                    return false;
                }

                if (!this.memberArraysAreIdentical(objectType1.constructSignatures(), objectType2.constructSignatures(), cache)) {
                    return false;
                }

                if (!this.memberArraysAreIdentical(objectType1.indexSignatures(), objectType2.indexSignatures(), cache)) {
                    return false;
                }

                    /*
                    var callSignatures1 = objectType1.callSignatures();
                    var callSignatures2 = objectType1.callSignatures();
                    for (var i = 0, n = callSignatures1.length; i < n; i++) {
                        var callSignature1 = callSignatures1[i];
                        if (!this.anyMembersAreIdentical(callSignatures1[i], callSignatures2)) {
                            return false;
                        }
                    }


                        var constructSignatures1 = objectType1.constructSignatures();
                        var constructSignatures2 = objectType1.constructSignatures();
                        for (var i = 0, n = constructSignatures1.length; i < n; i++) {
                            var constructSignature1 = constructSignatures1[i];
                            if (!this.anyMembersAreIdentical(constructSignatures1[i], constructSignatures2)) {
                                return false;
                            }
                        }
    */

                return true;
            }

            return false;
        }

        private memberArraysAreIdentical(members1: IMember[], members2: IMember[], cache: TypeRelationCache): boolean {
            for (var i = 0, n = members1.length; i < n; i++) {
                var member1 = members1[i];

                if (!this.memberArrayContainsIdenticalMember(member1, members2, cache)) {
                    return false;
                }
            }

            return true;
        }

        private memberArrayContainsIdenticalMember(member1: IMember, members2: IMember[], cache: TypeRelationCache): boolean {
            for (var i = 0, n = members2.length; i < n; i++) {
                var member2 = members2[i];

                if (this.membersAreIdentical(member1, member2, cache)) {
                    return true;
                }
            }

            return false;
        }

        private membersAreIdentical(member1: IMember, member2: IMember, cache: TypeRelationCache): boolean {
            if (member1.memberKind() !== member2.memberKind()) {
                return false;
            }

            switch (member1.memberKind()) {
                case MemberKind.Property: return this.propertiesAreIdentical(<IProperty>member1, <IProperty>member2, cache);
                case MemberKind.CallSignature: return this.callOrConstructSignaturesAreIdentical(<ICallOrConstructSignature>member1, <ICallOrConstructSignature>member2, cache);
                case MemberKind.ConstructSignature: return this.callOrConstructSignaturesAreIdentical(<ICallOrConstructSignature>member1, <ICallOrConstructSignature>member2, cache);
                case MemberKind.IndexSignature: return this.indexSignaturesAreIdentical(<IIndexSignature>member1, <IIndexSignature>member2, cache);
                default:
                    throw Errors.invalidOperation();
            }
        }

        private propertiesAreIdentical(property1: IProperty, property2: IProperty, cache: TypeRelationCache): boolean {
            // Two members are considered identical when
            if (property1.accessibility() === property2.accessibility()) {
                if (property1.accessibility() === Accessibility.Public) {
                    // •	they are public properties with identical names, optionality, and types,
                    return property1.isOptional() === property2.isOptional() &&
                           property1.name() === property2.name() &&
                           this.typesAreIdenticalWorker(property1.type(), property2.type(), cache);
                }
                else {
                    // •	they are private properties originating in the same declaration and having identical types
                    return property1.originatingDeclaration() === property2.originatingDeclaration() &&
                           this.typesAreIdenticalWorker(property1.type(), property2.type(), cache);
                }
            }

            return false;
        }

        private indexSignaturesAreIdentical(indexSignature1: IIndexSignature, indexSignature2: IIndexSignature, cache: TypeRelationCache): boolean {
            // Two members are considered identical when
            // •	they are index signatures of identical kind with identical types.
            return indexSignature1.isNumbericIndexSignature() === indexSignature2.isNumbericIndexSignature() &&
                   this.typesAreIdenticalWorker(indexSignature1.type(), indexSignature2.type(), cache);
        }

        private callOrConstructSignaturesAreIdentical(signature1: ICallOrConstructSignature, signature2: ICallOrConstructSignature, cache: TypeRelationCache): boolean {
            // Two call or construct signatures are considered identical when they have the same 
            // number of type parameters and, considering those type parameters pairwise identical,
            // have identical type parameter constraints, identical number of parameters of 
            // identical kinds and types, and identical return types.
            if (signature1.isCallSignature() === signature2.isCallSignature()) {
                var parameters1 = signature1.parameters();
                var parameters2 = signature2.parameters();

                if (signature1.typeParameters().length === signature2.typeParameters().length &&
                    parameters1.length === parameters2.length) {

                    // var indexedTypeParameters = IndexedTypeParameter.take(signature1.typeParameters().length);
                    if (signature1.typeParameters().length > 0) {
                        // Handle the case where these are generic and we want to compare them 
                        // while considering the type parameters pairwise identical.
                        throw Errors.notYetImplemented();
                    }

                    for (var i = 0, n = parameters1.length; i < n; i++) {
                        var parameter1 = parameters1[i];
                        var parameter2 = parameters2[i];

                        // TODO: what does (identical kind) mean?
                        if (!this.typesAreIdenticalWorker(parameter1.type(), parameter2.type(), cache)) {

                        }
                    }
                }
            }

            return false;
        }
    }

    class TypeRelationCache {
        public clear(): void {
            throw Errors.notYetImplemented();
        }

        public containsRelation(type1: INamedTypeReference, type2: INamedTypeReference): boolean {
            throw Errors.notYetImplemented()
        }

        public addRelation(type1: INamedTypeReference, type2: INamedTypeReference): void {
            throw Errors.notYetImplemented()
        }
    }

    var typeRelationCachePool: TypeRelationCache[] = [];

    function acquireTypeRelationCache(): TypeRelationCache {
        if (typeRelationCachePool.length === 0) {
            return new TypeRelationCache();
        }

        return typeRelationCachePool.pop();
    }

    function returnTypeRelationCache(cache: TypeRelationCache): void {
        cache.clear();
        typeRelationCachePool.push(cache);
    }
}