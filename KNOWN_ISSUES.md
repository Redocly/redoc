# Known Issues and Workarounds

This document outlines known issues in Redoc and their workarounds.

## readOnly Fields in Code Examples

**Issue**: readOnly fields are incorrectly displayed in code examples for PATCH requests and other operations where they should be excluded.

**Affected**: Request body examples, particularly with `allOf` schemas that add readOnly constraints

**Example Problem**:
```yaml
# This schema adds readOnly constraint for PATCH operations
requestBody:
  content:
    application/json:
      schema:
        allOf:
          - $ref: '#/components/schemas/BaseModel'
          - type: object
            properties:
              id:
                readOnly: true  # Should not appear in PATCH examples
```

**Current Behavior**: The `id` field appears in PATCH request examples even though it's marked as readOnly.

**Workarounds**:

1. **Manual Examples**: Provide explicit examples in your OpenAPI spec:
   ```yaml
   requestBody:
     content:
       application/json:
         schema:
           # ... your schema
         example:
           name: "Updated Name"
           # Exclude readOnly fields manually
   ```

2. **Schema Duplication**: Create separate schemas for different operations:
   ```yaml
   components:
     schemas:
       UserRead:
         properties:
           id: { type: string, readOnly: true }
           name: { type: string }
       UserWrite:
         properties:
           name: { type: string }
           # No id field
   ```

**Status**: Under investigation. The issue stems from differences between documentation rendering and example generation libraries.

**Related Issues**: #2722

---

## Contributing

If you encounter other issues, please:
1. Check existing issues first
2. Provide minimal reproduction cases
3. Include OpenAPI spec snippets when relevant

For more information, see our [main documentation](README.md).