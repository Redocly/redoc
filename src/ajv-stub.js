// Stands in for openapi-core's schema validator, which only assertion and example-lint rules construct.
export class Ajv2020 {
  constructor() {
    throw new Error('Schema validation is not available in this build.');
  }
}

export default Ajv2020;
