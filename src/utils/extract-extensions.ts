export type GenericObject = Record<string, unknown>;

const redocExtensions: Record<string, true> = {
  'x-circular-ref': true,
  'x-allof-cycle': true,
  'x-complex': true,
  'x-parentRefs': true,
  'x-refsStack': true,
  'x-codeSamples': true,
  'x-displayName': true,
  'x-examples': true,
  'x-logo': true,
  'x-nullable': true,
  'x-servers': true,
  'x-tagGroups': true,
  'x-traitTag': true,
  'x-additionalPropertiesName': true,
  'x-explicitMappingOnly': true,
  'x-enumDescriptions': true,
  'x-badges': true,
  'x-keywords': true,
  'x-mcp': true,
  'x-metadata': true,
  'x-summary': true,
  'x-tags': true,
  'x-webhooks': true,
};

export function isRedocExtension(key: string): boolean {
  return key in redocExtensions;
}

export function extractExtensions(
  obj: GenericObject,
  showExtensions: string[] | true,
): GenericObject {
  return Object.keys(obj)
    .filter((key) => {
      if (showExtensions === true) {
        return key.startsWith('x-') && !isRedocExtension(key);
      }
      return key.startsWith('x-') && showExtensions.indexOf(key) > -1;
    })
    .reduce<GenericObject>((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

export function getExtensionsForDisplay(
  obj: GenericObject,
  showExtensions: string[] | boolean,
): GenericObject {
  if (showExtensions === false || showExtensions === undefined) {
    return {};
  }
  return extractExtensions(obj, showExtensions);
}
