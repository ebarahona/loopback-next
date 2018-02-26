// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  isSchemaObject,
  ParameterObject,
  ParameterLocation,
  ReferenceObject,
  SchemaObject,
} from '@loopback/openapi-v3-types';
import {MetadataInspector, ParameterDecoratorFactory} from '@loopback/context';
import {getSchemaForParam} from './';
import {OAI3Keys} from './keys';

/**
 * Describe an input parameter of a Controller method.
 *
 * `@param` must be applied to parameters. For example,
 * ```
 * class MyController {
 *   @get('/')
 *   list(
 *     @param(offsetSpec) offset?: number,
 *     @param(pageSizeSpec) pageSize?: number,
 *   ) {}
 * }
 * ```
 *
 * @param paramSpec Parameter specification.
 */
export function param(paramSpec: ParameterObject) {
  return function(
    target: Object,
    member: string | symbol,
    // Comment for review purpose:
    // deprecate method level decorator
    index: number,
  ) {
    paramSpec = paramSpec || {};
    // Get the design time method parameter metadata
    const methodSig = MetadataInspector.getDesignTypeForMethod(target, member);
    const paramTypes = (methodSig && methodSig.parameterTypes) || [];

    // Map design-time parameter type to the OpenAPI param type

    let paramType = paramTypes[index];

    if (paramType) {
      if (
        // generate schema if `paramSpec` doesn't have it
        !paramSpec.schema ||
        // generate schema if `paramSpec` has `schema` but without `type`
        (isSchemaObject(paramSpec.schema) && !paramSpec.schema.type)
      ) {
        // please note `getSchemaForParam` only adds `type` and `format` for `schema`
        paramSpec.schema = getSchemaForParam(paramType, paramSpec.schema || {});
      }
    }

    if (
      paramSpec.schema &&
      isSchemaObject(paramSpec.schema) &&
      paramSpec.schema.type === 'array'
    ) {
      // The design-time type is `Object` for `any`
      if (paramType != null && paramType !== Object && paramType !== Array) {
        throw new Error(
          `The parameter type is set to 'array' but the JavaScript type is ${
            paramType.name
          }`,
        );
      }
    }

    ParameterDecoratorFactory.createDecorator<ParameterObject>(
      OAI3Keys.PARAMETERS_KEY,
      paramSpec,
    )(target, member, index);
  };
}

/**
 * The `type` and `format` inferred by a common name of OpenAPI 3.0.0 data type
 * reference link:
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#data-types
 */
const typeAndFormatMap = {
  string: {type: 'string'},
  boolean: {type: 'boolean'},
  number: {type: 'number'},
  integer: {type: 'integer', format: 'int32'},
  long: {type: 'integer', format: 'int64'},
  float: {type: 'number', format: 'float'},
  double: {type: 'number', format: 'double'},
  byte: {type: 'string', format: 'byte'},
  binary: {type: 'string', format: 'binary'},
  date: {type: 'string', format: 'date'},
  dateTime: {type: 'string', format: 'date-time'},
  password: {type: 'string', format: 'password'},
};

/**
 * Shortcut parameter decorators
 */
export namespace param {
  export const query = {
    /**
     * Define a parameter of "integer" type that's read from the query string.
     * "Usage": @param.query.string('paramName')
     *
     * @param name Parameter name.
     */
    string: createParamShortcut('query', typeAndFormatMap.string),
    /**
     * Define a parameter of "number" type that's read from the query string.
     * "Usage": @param.query.number('paramName')
     *
     * @param name Parameter name.
     */
    number: createParamShortcut('query', typeAndFormatMap.number),
    /**
     * Define a parameter of "boolean" type that's read from the query string.
     * "Usage": @param.query.boolean('paramName')
     *
     * @param name Parameter name.
     */
    boolean: createParamShortcut('query', typeAndFormatMap.boolean),
    /**
     * Define a parameter of "integer" type that's read from the query string.
     * "Usage": @param.query.integer('paramName')
     *
     * @param name Parameter name.
     */
    integer: createParamShortcut('query', typeAndFormatMap.integer),
    /**
     * Define a parameter of "long" type that's read from the query string.
     * "Usage": @param.query.long('paramName')
     *
     * @param name Parameter name.
     */
    long: createParamShortcut('query', typeAndFormatMap.long),
    /**
     * Define a parameter of "float" type that's read from the query string.
     * "Usage": @param.query.float('paramName')
     *
     * @param name Parameter name.
     */
    float: createParamShortcut('query', typeAndFormatMap.float),
    /**
     * Define a parameter of "double" type that's read from the query string.
     * "Usage": @param.query.double('paramName')
     *
     * @param name Parameter name.
     */
    double: createParamShortcut('query', typeAndFormatMap.double),
    /**
     * Define a parameter of "byte" type that's read from the query string.
     * "Usage": @param.query.byte('paramName')
     *
     * @param name Parameter name.
     */
    byte: createParamShortcut('query', typeAndFormatMap.byte),
    /**
     * Define a parameter of "binary" type that's read from the query string.
     * "Usage": @param.query.binary('paramName')
     *
     * @param name Parameter name.
     */
    binary: createParamShortcut('query', typeAndFormatMap.binary),
    /**
     * Define a parameter of "date" type that's read from the query string.
     * "Usage": @param.query.date('paramName')
     *
     * @param name Parameter name.
     */
    date: createParamShortcut('query', typeAndFormatMap.date),
    /**
     * Define a parameter of "dateTime" type that's read from the query string.
     * "Usage": @param.query.dateTime('paramName')
     *
     * @param name Parameter name.
     */
    dateTime: createParamShortcut('query', typeAndFormatMap.dateTime),
    /**
     * Define a parameter of "password" type that's read from the query string.
     * "Usage": @param.query.password('paramName')
     *
     * @param name Parameter name.
     */
    password: createParamShortcut('query', typeAndFormatMap.password),
  };

  export const header = {
    /**
     * Define a parameter of "string" type that's read from a request header.
     * "Usage": @param.header.string('paramName')
     *
     * @param name Parameter name, it must match the header name
     * (e.g. `Content-Type`).
     */
    string: createParamShortcut('header', typeAndFormatMap.string),
    /**
     * Define a parameter of "number" type that's read from a request header.
     *  "Usage": @param.header.number('paramName')
     *
     * @param name Parameter name, it must match the header name
     * (e.g. `Content-Length`).
     */
    number: createParamShortcut('header', typeAndFormatMap.number),
    /**
     * Define a parameter of "boolean" type that's read from a request header.
     *  "Usage": @param.header.boolean('paramName')
     *
     * @param name Parameter name, it must match the header name
     * (e.g. `DNT` or `X-Do-Not-Track`).
     */
    boolean: createParamShortcut('header', typeAndFormatMap.boolean),
    /**
     * Define a parameter of "integer" type that's read from a request header.
     *  "Usage": @param.header.integer('paramName')
     *
     * @param name Parameter name, it must match the header name
     * (e.g. `Content-Length`).
     */
    integer: createParamShortcut('header', typeAndFormatMap.integer),
    /**
     * Define a parameter of "long" type that's read from a request header.
     *  "Usage": @param.header.long('paramName')
     *
     * @param name Parameter name, it must match the header name
     */
    long: createParamShortcut('header', typeAndFormatMap.long),
    /**
     * Define a parameter of "float" type that's read from a request header.
     *  "Usage": @param.header.float('paramName')
     *
     * @param name Parameter name, it must match the header name
     * // For review purpose:
     * // Don't have the time to find an example for each data type,
     * // anyone has bandwidth can patch it with examples, thanks!
     */
    float: createParamShortcut('header', typeAndFormatMap.float),
    /**
     * Define a parameter of "double" type that's read from a request header.
     *  "Usage": @param.header.double('paramName')
     *
     * @param name Parameter name, it must match the header name
     */
    double: createParamShortcut('header', typeAndFormatMap.double),
    /**
     * Define a parameter of "byte" type that's read from a request header.
     *  "Usage": @param.header.byte('paramName')
     *
     * @param name Parameter name, it must match the header name
     */
    byte: createParamShortcut('header', typeAndFormatMap.byte),
    /**
     * Define a parameter of "binary" type that's read from a request header.
     *  "Usage": @param.header.binary('paramName')
     *
     * @param name Parameter name, it must match the header name
     */
    binary: createParamShortcut('header', typeAndFormatMap.binary),
    /**
     * Define a parameter of "date" type that's read from a request header.
     *  "Usage": @param.header.date('paramName')
     *
     * @param name Parameter name, it must match the header name
     */
    date: createParamShortcut('header', typeAndFormatMap.date),
    /**
     * Define a parameter of "dateTime" type that's read from a request header.
     *  "Usage": @param.header.dateTime('paramName')
     *
     * @param name Parameter name, it must match the header name
     */
    dateTime: createParamShortcut('header', typeAndFormatMap.dateTime),
    /**
     * Define a parameter of "password" type that's read from a request header.
     * "Usage": @param.header.password('paramName')
     *
     * @param name Parameter name, it must match the header name
     */
    password: createParamShortcut('header', typeAndFormatMap.password),
  };
  export const path = {
    /**
     * Define a parameter of "string" type that's read from request path.
     * "Usage": @param.path.string('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    string: createParamShortcut('path', typeAndFormatMap.string),
    /**
     * Define a parameter of "number" type that's read from request path.
     * "Usage": @param.path.number('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    number: createParamShortcut('path', typeAndFormatMap.number),
    /**
     * Define a parameter of "boolean" type that's read from request path.
     * "Usage": @param.path.boolean('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    boolean: createParamShortcut('path', typeAndFormatMap.boolean),
    /**
     * Define a parameter of "integer" type that's read from request path.
     * "Usage": @param.path.integer('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    integer: createParamShortcut('path', typeAndFormatMap.integer),
    /**
     * Define a parameter of "long" type that's read from request path.
     * "Usage": @param.path.long('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    long: createParamShortcut('path', typeAndFormatMap.long),
    /**
     * Define a parameter of "float" type that's read from request path.
     * "Usage": @param.path.float('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    float: createParamShortcut('path', typeAndFormatMap.float),
    /**
     * Define a parameter of "double" type that's read from request path.
     * "Usage": @param.path.double('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    double: createParamShortcut('path', typeAndFormatMap.double),
    /**
     * Define a parameter of "byte" type that's read from request path.
     * "Usage": @param.path.byte('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    byte: createParamShortcut('path', typeAndFormatMap.byte),
    /**
     * Define a parameter of "binary" type that's read from request path.
     * "Usage": @param.path.binary('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    binary: createParamShortcut('path', typeAndFormatMap.binary),
    /**
     * Define a parameter of "date" type that's read from request path.
     * "Usage": @param.path.date('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    date: createParamShortcut('path', typeAndFormatMap.date),
    /**
     * Define a parameter of "dateTime" type that's read from request path.
     * "Usage": @param.path.dateTime('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    dateTime: createParamShortcut('path', typeAndFormatMap.dateTime),
    /**
     * Define a parameter of "password" type that's read from request path.
     * "Usage": @param.path.password('paramName')
     *
     * @param name Parameter name matching one of the placeholders in the path
     */
    password: createParamShortcut('path', typeAndFormatMap.password),
  };

  /**
   * Define a parameter of `array` type.
   *
   * @example
   * ```ts
   * export class MyController {
   *   @get('/greet')
   *   greet(@param.array('names', 'query', 'string') names: string[]): string {
   *     return `Hello, ${names}`;
   *   }
   * }
   * ```
   *
   * @param name Parameter name
   * @param source Source of the parameter value
   * @param itemSpec Item type for the array or the full item object
   */
  export const array = function(
    name: string,
    source: ParameterLocation,
    itemSpec: SchemaObject | ReferenceObject,
  ) {
    return param({
      name,
      in: source,
      schema: {type: 'array', items: itemSpec},
    });
  };
}

interface paramShortcutOptions {
  type: string;
  format?: string;
}

function createParamShortcut(
  source: ParameterLocation,
  options: paramShortcutOptions,
) {
  return (name: string) => {
    return param({name, in: source, schema: {...options}});
  };
}
