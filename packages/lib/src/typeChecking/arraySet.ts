import { ArraySet } from "../wrappers/ArraySet"
import { typesArray } from "./array"
import { getTypeInfo } from "./getTypeInfo"
import { typesObject } from "./object"
import { resolveStandardType, resolveTypeChecker } from "./resolveTypeChecker"
import type { AnyStandardType, AnyType, IdentityType, TypeToData } from "./schemas"
import { lateTypeChecker, TypeChecker, TypeInfo, TypeInfoGen } from "./TypeChecker"
import { TypeCheckError } from "./TypeCheckError"

/**
 * A type that represents an array backed set ArraySet.
 *
 * Example:
 * ```ts
 * const numberSetType = types.arraySet(types.number)
 * ```
 *
 * @typeparam T Value type.
 * @param valueType Value type.
 * @returns
 */
export function typesArraySet<T extends AnyType>(
  valueType: T
): IdentityType<ArraySet<TypeToData<T>>> {
  const typeInfoGen: TypeInfoGen = (t) => new ArraySetTypeInfo(t, resolveStandardType(valueType))

  return lateTypeChecker(() => {
    const valueChecker = resolveTypeChecker(valueType)

    const getTypeName = (...recursiveTypeCheckers: TypeChecker[]) =>
      `ArraySet<${valueChecker.getTypeName(...recursiveTypeCheckers, valueChecker)}>`

    const dataTypeChecker = typesObject(() => ({
      items: typesArray(valueChecker as any),
    }))

    const thisTc: TypeChecker = new TypeChecker(
      (obj, path) => {
        if (!(obj instanceof ArraySet)) {
          return new TypeCheckError(path, getTypeName(thisTc), obj)
        }

        const resolvedTc = resolveTypeChecker(dataTypeChecker)
        return resolvedTc.check(obj.$, path)
      },
      getTypeName,
      typeInfoGen
    )

    return thisTc
  }, typeInfoGen) as any
}

/**
 * `types.arraySet` type info.
 */
export class ArraySetTypeInfo extends TypeInfo {
  get valueTypeInfo(): TypeInfo {
    return getTypeInfo(this.valueType)
  }

  constructor(originalType: AnyStandardType, readonly valueType: AnyStandardType) {
    super(originalType)
  }
}
