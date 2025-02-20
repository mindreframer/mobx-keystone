import type { ModelClass } from "../modelShared/BaseModelShared"
import { failure } from "../utils"
import type { AnyDataModel } from "./BaseDataModel"
import { _BaseDataModel } from "./_BaseDataModel"

/**
 * Checks if an object is a data model instance.
 *
 * @param model
 * @returns
 */
export function isDataModel(model: any): model is AnyDataModel {
  return model instanceof _BaseDataModel
}

/**
 * @ignore
 * @internal
 *
 * Asserts something is actually a data model.
 *
 * @param model
 * @param argName
 */
export function assertIsDataModel(
  model: unknown,
  argName: string,
  customErrMsg = "must be a data model instance"
): asserts model is AnyDataModel {
  if (!isDataModel(model)) {
    throw failure(`${argName} ${customErrMsg}`)
  }
}

/**
 * @ignore
 * @internal
 */
export function isDataModelClass(modelClass: any): modelClass is ModelClass<AnyDataModel> {
  if (typeof modelClass !== "function") {
    return false
  }

  if (modelClass !== _BaseDataModel && !(modelClass.prototype instanceof _BaseDataModel)) {
    return false
  }

  return true
}

/**
 * @ignore
 * @internal
 */
export function assertIsDataModelClass(
  modelClass: unknown,
  argName: string
): asserts modelClass is ModelClass<AnyDataModel> {
  if (typeof modelClass !== "function") {
    throw failure(`${argName} must be a class`)
  }

  if (modelClass !== _BaseDataModel && !(modelClass.prototype instanceof _BaseDataModel)) {
    throw failure(`${argName} must extend DataModel`)
  }
}

/**
 * @ignore
 * @internal
 */
export function checkDataModelDecoratorArgs(fnName: string, target: any, propertyKey: string) {
  if (typeof propertyKey !== "string") {
    throw failure(`${fnName} cannot be used over symbol properties`)
  }

  const errMessage = `${fnName} must be used over data model classes or instances`

  if (!target) {
    throw failure(errMessage)
  }

  // check target is a model object or extended class
  if (
    !(target instanceof _BaseDataModel) &&
    target !== _BaseDataModel &&
    !(target.prototype instanceof _BaseDataModel)
  ) {
    throw failure(errMessage)
  }
}
