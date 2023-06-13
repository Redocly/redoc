import { MergedOpenAPISchema } from '../services';
import { OpenAPISchema } from '../types';

export interface ConfigAccessOptions {
  includeReadOnly?: boolean;
  includeWriteOnly?: boolean;
}

export interface ExampleConfig extends ConfigAccessOptions {
  includeDeprecated?: boolean;
  useXmlTagForProp?: boolean;
}

export interface GenerateExampleProps extends ConfigAccessOptions {
  schema: MergedOpenAPISchema | undefined;
}

export interface FinalExamples {
  exampleDescription: string;
  exampleId: string;
  exampleSummary: string;
  exampleValue: string;
}

/**
 * json2xml
 * @example
 * Schema: {
 *   'prop1' : 'one',
 *   'prop2' : 'two',
 *   'prop3' : [ 'a', 'b', 'c' ],
 *   'prop4' : {
 *     'ob1' : 'val-1',
 *     'ob2' : 'val-2'
 *   }
 * }
 * XML:
 * <root>
 *   <prop1>simple</prop1>
 *   <prop2>
 *     <0>a</0>
 *     <1>b</1>
 *     <2>c</2>
 *   </prop2>
 *   <prop3>
 *     <ob1>val-1</ob1>
 *     <ob2>val-2</ob2>
 *   </prop3>
 * </root>
 **/
const json2xml = (obj: any, level: number = 1): string => {
  const indent = '  '.repeat(level);
  let xmlText = '';
  if (level === 1 && typeof obj !== 'object') {
    return `\n${indent}${obj.toString()}`;
  }
  for (const prop in obj) {
    const tagNameOrProp = obj[prop]?.['::XML_TAG'] || prop;
    let tagName = '';
    if (Array.isArray(obj[prop])) {
      tagName = tagNameOrProp[0]?.['::XML_TAG'] || `${prop}`;
    } else {
      tagName = tagNameOrProp;
    }
    if (prop.startsWith('::')) {
      continue;
    }
    if (Array.isArray(obj[prop])) {
      xmlText = `${xmlText}\n${indent}<${tagName}>${json2xml(
        obj[prop],
        level + 1,
      )}\n${indent}</${tagName}>`;
    } else if (typeof obj[prop] === 'object') {
      xmlText = `${xmlText}\n${indent}<${tagName}>${json2xml(
        obj[prop],
        level + 1,
      )}\n${indent}</${tagName}>`;
    } else {
      xmlText = `${xmlText}\n${indent}<${tagName}>${obj[prop].toString()}</${tagName}>`;
    }
  }
  return xmlText;
};

const mergePropertyExamples = (
  obj: { [x: string]: any },
  propertyName: string,
  propExamples: never[],
) => {
  // Create an example for each variant of the propertyExample, merging them with the current (parent) example
  let i = 0;
  const maxCombinations = 10;
  const mergedObj = {};
  for (const exampleKey in obj) {
    for (const propExampleKey in propExamples) {
      mergedObj[`example-${i}`] = { ...obj[exampleKey] };
      mergedObj[`example-${i}`][propertyName] = propExamples[propExampleKey];
      i++;
      if (i >= maxCombinations) {
        break;
      }
    }
    if (i >= maxCombinations) {
      break;
    }
  }
  return mergedObj;
};

const addSchemaInfoToExample = (schema: OpenAPISchema, obj: any) => {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }
  if (schema.title) {
    obj['::TITLE'] = schema.title;
  }
  if (schema.description) {
    obj['::DESCRIPTION'] = schema.description;
  }
  if (schema.xml?.name) {
    obj['::XML_TAG'] = schema.xml?.name;
  }
  if (schema.xml?.wrapped) {
    obj['::XML_WRAP'] = schema.xml?.wrapped.toString();
  }
};

const addPropertyExampleToObjectExamples = (example: any, obj: object, propertyKey: string) => {
  for (const key in obj) {
    obj[key][propertyKey] = example;
  }
};

const getSampleValueByType = (schemaObj: OpenAPISchema) => {
  const example = schemaObj.examples
    ? schemaObj.examples[0]
    : schemaObj.example === null
    ? null
    : schemaObj.example || undefined;
  if (example === '') {
    return '';
  }
  if (example === null) {
    return null;
  }
  if (example === 0) {
    return 0;
  }
  if (example === false) {
    return false;
  }
  if (example instanceof Date) {
    switch (schemaObj.format?.toLowerCase()) {
      case 'date':
        return example.toISOString().split('T')[0];
      case 'time':
        return example.toISOString().split('T')[1];
      default:
        return example.toISOString();
    }
  }
  if (example) {
    return example;
  }

  if (Object.keys(schemaObj).length === 0) {
    return null;
  }
  if (schemaObj.$ref) {
    // Indicates a Circular ref
    return schemaObj.$ref;
  }
  if (schemaObj.const === null || schemaObj.const === '') {
    return schemaObj.const;
  }
  if (schemaObj.const) {
    return schemaObj.const;
  }
  const typeValue = Array.isArray(schemaObj.type) ? schemaObj.type[0] : schemaObj.type;
  if (!typeValue) {
    return '?';
  }
  if (typeValue.match(/^integer|^number/g)) {
    const multipleOf = Number.isNaN(Number(schemaObj.multipleOf))
      ? undefined
      : Number(schemaObj.multipleOf);
    const maximum = Number.isNaN(Number(schemaObj.maximum)) ? undefined : Number(schemaObj.maximum);
    const minimumPossibleVal = Number.isNaN(Number(schemaObj.minimum))
      ? Number.isNaN(Number(schemaObj.exclusiveMinimum))
        ? maximum || 0
        : Number(schemaObj.exclusiveMinimum) + (typeValue.startsWith('integer') ? 1 : 0.001)
      : Number(schemaObj.minimum);
    return multipleOf
      ? multipleOf >= minimumPossibleVal
        ? multipleOf
        : minimumPossibleVal % multipleOf === 0
        ? minimumPossibleVal
        : Math.ceil(minimumPossibleVal / multipleOf) * multipleOf
      : minimumPossibleVal;
  }
  if (typeValue.match(/^boolean/g)) {
    return false;
  }
  if (typeValue.match(/^null/g)) {
    return null;
  }
  if (typeValue.match(/^string/g)) {
    if (schemaObj.enum) {
      return schemaObj.enum[0];
    }
    if (schemaObj.const) {
      return schemaObj.const;
    }
    if (schemaObj.pattern) {
      return schemaObj.pattern;
    }
    if (schemaObj.format) {
      const u = `${Date.now().toString(16)}${Math.random().toString(16)}0`.repeat(16);
      switch (schemaObj.format.toLowerCase()) {
        case 'url':
        case 'uri':
          return 'http://example.com';
        case 'date':
          return new Date(0).toISOString().split('T')[0];
        case 'time':
          return new Date(0).toISOString().split('T')[1];
        case 'date-time':
          return new Date(0).toISOString();
        case 'duration':
          return 'P3Y6M4DT12H30M5S'; // P=Period 3-Years 6-Months 4-Days 12-Hours 30-Minutes 5-Seconds
        case 'email':
        case 'idn-email':
          return 'user@example.com';
        case 'hostname':
        case 'idn-hostname':
          return 'www.example.com';
        case 'ipv4':
          return '198.51.100.42';
        case 'ipv6':
          return '2001:0db8:5b96:0000:0000:426f:8e17:642a';
        case 'uuid':
          return [
            u.substr(0, 8),
            u.substr(8, 4),
            `4000-8${u.substr(13, 3)}`,
            u.substr(16, 12),
          ].join('-');
        case 'byte':
          return 'ZXhhbXBsZQ=='; // 'example' base64 encoded. See https://spec.openapis.org/oas/v3.0.0#data-types
        default:
          return '';
      }
    } else {
      const minLength = Number.isNaN(schemaObj.minLength) ? undefined : Number(schemaObj.minLength);
      const maxLength = Number.isNaN(schemaObj.maxLength) ? undefined : Number(schemaObj.maxLength);
      const finalLength = minLength || (maxLength && maxLength > 6 ? 6 : maxLength || undefined);
      return finalLength ? 'A'.repeat(finalLength) : 'string';
    }
  }
  // If type cannot be determined
  return '?';
};

/* For changing JSON-Schema to a Sample Object, as per the schema (to generate examples based on schema) */
const schemaToSampleObj = (schema: OpenAPISchema, config: ExampleConfig = {}) => {
  let obj = {};
  if (!schema) {
    return;
  }
  if (schema.allOf) {
    const objWithAllProps = {};

    if (schema.allOf.length === 1 && !schema.allOf[0]?.properties && !schema.allOf[0]?.items) {
      // If allOf has single item and the type is not an object or array, then its a primitive
      if (schema.allOf[0].$ref) {
        return '{  }';
      }
      if (schema.allOf[0].readOnly && config.includeReadOnly) {
        const tempSchema = schema.allOf[0];
        return getSampleValueByType(tempSchema);
      }
      return;
    }

    schema.allOf.forEach(v => {
      if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
        const partialObj = schemaToSampleObj(v, config);
        Object.assign(objWithAllProps, partialObj);
      } else if (v.type === 'array' || v.items) {
        const partialObj = [schemaToSampleObj(v, config)];
        Object.assign(objWithAllProps, partialObj);
      } else if (v.type) {
        const prop = `prop${Object.keys(objWithAllProps).length}`;
        objWithAllProps[prop] = getSampleValueByType(v);
      } else {
        return '';
      }
    });

    obj = objWithAllProps;
  } else if (schema.oneOf) {
    // 1. First create example with scheme.properties
    const objWithSchemaProps = {};
    if (schema.properties) {
      for (const propertyName in schema.properties) {
        if (
          schema.properties[propertyName].properties ||
          schema.properties[propertyName].properties?.items
        ) {
          objWithSchemaProps[propertyName] = schemaToSampleObj(
            schema.properties[propertyName],
            config,
          );
        } else {
          objWithSchemaProps[propertyName] = getSampleValueByType(schema.properties[propertyName]);
        }
      }
    }

    if (schema.oneOf.length > 0) {
      /**
       * @example
       *    oneOf:
       *      - type: object
       *        properties:
       *          option1_PropA:
       *            type: string
       *          option1_PropB:
       *            type: string
       *      - type: object
       *        properties:
       *          option2_PropX:
       *            type: string
       *    properties:
       *      prop1:
       *        type: string
       *      prop2:
       *        type: string
       *        minLength: 10
       *
       *    The above Schema should generate the following 2 examples
       *
       *    Example-1
       *    {
       *      prop1: 'string',
       *      prop2: 'AAAAAAAAAA',       <-- min-length 10
       *      option1_PropA: 'string',
       *      option1_PropB: 'string'
       *    }
       *
       *    Example-2
       *    {
       *      prop1: 'string',
       *      prop2: 'AAAAAAAAAA',       <-- min-length 10
       *      option2_PropX: 'string'
       *    }
       */
      let i = 0;
      // Merge all examples of each oneOf-schema
      for (const key in schema.oneOf) {
        const oneOfSamples = schemaToSampleObj(schema.oneOf[key], config);
        for (const sampleKey in oneOfSamples) {
          // 2. In the final example include a one-of item along with properties
          let finalExample;
          if (Object.keys(objWithSchemaProps).length > 0) {
            if (oneOfSamples[sampleKey] === null || typeof oneOfSamples[sampleKey] !== 'object') {
              // This doesn't really make sense since every oneOf schema _should_ be an object if there are common properties, so we'll skip this
              continue;
            } else {
              finalExample = Object.assign(oneOfSamples[sampleKey], objWithSchemaProps);
            }
          } else {
            finalExample = oneOfSamples[sampleKey];
          }
          obj[`example-${i}`] = finalExample;
          addSchemaInfoToExample(schema.oneOf[key], obj[`example-${i}`]);
          i++;
        }
      }
    }
  } else if (schema.anyOf) {
    // First generate values for regular properties
    let commonObj;
    if (schema.type === 'object' || schema.properties) {
      commonObj = { 'example-0': {} };
      for (const propertyName in schema.properties) {
        if (schema.example) {
          commonObj = schema;
          break;
        }
        if (schema.properties[propertyName].deprecated && !config.includeDeprecated) {
          continue;
        }
        if (schema.properties[propertyName].readOnly && !config.includeReadOnly) {
          continue;
        }
        if (schema.properties[propertyName].writeOnly && !config.includeWriteOnly) {
          continue;
        }
        commonObj = mergePropertyExamples(
          commonObj,
          propertyName,
          schemaToSampleObj(schema.properties[propertyName], config),
        );
      }
    }

    // Combine every variant of the regular properties with every variant of the anyOf samples
    let i = 0;
    for (const key in schema.anyOf) {
      const anyOfSamples = schemaToSampleObj(schema.anyOf[key], config);
      for (const sampleKey in anyOfSamples) {
        if (typeof commonObj !== 'undefined') {
          for (const commonKey in commonObj) {
            obj[`example-${i}`] = { ...commonObj[commonKey], ...anyOfSamples[sampleKey] };
          }
        } else {
          obj[`example-${i}`] = anyOfSamples[sampleKey];
        }
        addSchemaInfoToExample(schema.anyOf[key], obj[`example-${i}`]);
        i++;
      }
    }
  } else if (schema.type === 'object' || schema.properties) {
    obj['example-0'] = {};
    addSchemaInfoToExample(schema, obj['example-0']);
    if (schema.example) {
      obj['example-0'] = schema.example;
    } else {
      for (const propertyName in schema.properties) {
        const prop = schema.properties[propertyName] as OpenAPISchema;
        if (prop?.deprecated && !config.includeDeprecated) {
          continue;
        }
        if (prop?.readOnly && !config.includeReadOnly) {
          continue;
        }
        if (prop?.writeOnly && !config.includeWriteOnly) {
          continue;
        }
        const propItems = prop?.items as OpenAPISchema;
        if (prop?.type === 'array' || propItems) {
          if (prop.example) {
            addPropertyExampleToObjectExamples(prop.example, obj, propertyName);
          } else if (propItems?.example) {
            // schemas and properties support single example but not multiple examples.
            addPropertyExampleToObjectExamples([propItems.example], obj, propertyName);
          } else {
            const itemSamples = schemaToSampleObj(
              Array.isArray(propItems) ? { allOf: propItems } : propItems,
              config,
            );
            if (config.useXmlTagForProp) {
              const xmlTagName = prop.xml?.name || propertyName;
              if (prop.xml?.wrapped) {
                const wrappedItemSample = JSON.parse(
                  `{ "${xmlTagName}" : { "${xmlTagName}" : ${JSON.stringify(
                    itemSamples['example-0'],
                  )} } }`,
                );
                obj = mergePropertyExamples(obj, xmlTagName, wrappedItemSample);
              } else {
                obj = mergePropertyExamples(obj, xmlTagName, itemSamples);
              }
            } else {
              const arraySamples = [];
              for (const key in itemSamples) {
                arraySamples[key] = [itemSamples[key]];
              }
              obj = mergePropertyExamples(obj, propertyName, arraySamples);
            }
          }
          continue;
        }
        obj = mergePropertyExamples(
          obj,
          propertyName,
          schemaToSampleObj(schema.properties[propertyName], config),
        );
      }
    }
  } else if (schema.type === 'array' || schema.items) {
    const schemaItems = schema.items as OpenAPISchema;
    if (schemaItems || schema.example) {
      if (schema.example) {
        obj['example-0'] = schema.example;
      } else if (schemaItems?.example) {
        // schemas and properties support single example but not multiple examples.
        obj['example-0'] = [schemaItems.example];
      } else {
        const samples = schemaToSampleObj(schemaItems, config);
        let i = 0;
        for (const key in samples) {
          obj[`example-${i}`] = [samples[key]];
          addSchemaInfoToExample(schemaItems, obj[`example-${i}`]);
          i++;
        }
      }
    } else {
      obj['example-0'] = [];
    }
  } else {
    return { 'example-0': getSampleValueByType(schema) };
  }
  return obj;
};

/**
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Mrinmoy Majumdar
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
export const generateXmlExample = ({
  includeReadOnly = true,
  includeWriteOnly = true,
  schema,
}: GenerateExampleProps): FinalExamples[] => {
  const finalExamples: FinalExamples[] = [];

  if (!schema) return finalExamples;

  const xmlRootStart = schema.xml?.name
    ? `<${schema.xml.name}${schema.xml.namespace ? ` xmlns="${schema.xml.namespace}"` : ''}>`
    : '<root>';
  const xmlRootEnd = schema.xml?.name ? `</${schema.xml.name}>` : '</root>';
  const samples = schemaToSampleObj(schema, {
    includeReadOnly,
    includeWriteOnly,
    includeDeprecated: true,
    useXmlTagForProp: true,
  });
  let i = 0;
  for (const samplesKey in samples) {
    if (!samples[samplesKey]) {
      continue;
    }
    const summary = samples[samplesKey]['::TITLE'] || `Example ${++i}`;
    const description = samples[samplesKey]['::DESCRIPTION'] || '';
    const exampleValue = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlRootStart}${json2xml(
      samples[samplesKey],
      1,
    )}\n${xmlRootEnd}`;

    finalExamples.push({
      exampleDescription: description,
      exampleId: samplesKey,
      exampleSummary: summary,
      exampleValue,
    });
  }

  return finalExamples;
};
