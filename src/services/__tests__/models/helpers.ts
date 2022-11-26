import type { SchemaModel } from '../../models';

function printType(type: string | string[]): string {
  return `<${type}>`;
}

function printDescription(description: string | string[]): string {
  return description ? ` (${description})` : '';
}

export function circularDetailsPrinter(schema: SchemaModel): string {
  return schema.isCircular ? ' !circular' : '';
}

export function enumDetailsPrinter(schema: SchemaModel): string {
  return schema.enum ? `enum: [${schema.enum.toString()}]` : '';
}

export function printSchema(
  schema: SchemaModel,
  detailsPrinter: (schema: SchemaModel) => string = () => '',
  identLevel = 0,
  inline = false,
): string {
  if (!schema) return '';
  const ident = '  '.repeat(identLevel);

  if (schema.isPrimitive || schema.isCircular) {
    if (schema.type === 'array' && schema.items) {
      return `${inline ? ' ' : ident}[${printType(schema.items.type)}${detailsPrinter(
        schema.items,
      )}]${printDescription(schema.items.description)}`;
    } else {
      return `${inline ? ' ' : ident}${printType(schema.displayType)}${detailsPrinter(
        schema,
      )}${printDescription(schema.description)}`;
    }
  }

  if (schema.oneOf) {
    return (
      `${inline ? ' ' : ident}oneOf\n` +
      schema.oneOf
        .map(sub => {
          return (
            `${ident}  ${sub.title || sub.displayType} ->` +
            printSchema(sub, detailsPrinter, identLevel + 2, true)
          );
        })
        .join('\n')
    );
  }

  if (schema.fields) {
    const prefix = inline ? '\n' : '';
    return (
      prefix +
      schema.fields
        .map(f => {
          return `${ident}${f.name}${f.required ? '*' : ''}:${printSchema(
            f.schema,
            detailsPrinter,
            identLevel + 1,
            true,
          )}`;
        })
        .join('\n')
    );
  }

  if (schema.items) {
    return (
      `${inline ? ' ' : ident}[\n` +
      printSchema(schema.items, detailsPrinter, identLevel) +
      `\n${inline ? ident.slice(0, -2) : ident}]`
    );
  }

  return ' error';
}
