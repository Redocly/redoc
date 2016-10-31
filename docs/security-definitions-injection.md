# Injection security definitions

You can inject Security Definitions widget into any place of your specification `description`:

```markdown
...
# Authorization
Some description

<!-- ReDoc-Inject: <security-definitions> -->
...
```
Inject instruction is wrapped into HTML comment so it is **visible only in ReDoc**. It won't be visible e.g. in SwaggerUI.

# Default behavior
If injection tag is not found in the description it will be appended to the end
of description under `Authentication` header.

If `Authentication` header is already present in the description, Security Definitions won't be inserted and rendered at all.
