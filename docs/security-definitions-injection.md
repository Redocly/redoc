# Injection security definitions

You can inject the Security Definitions widget anywhere in your specification `description`:

```markdown
...
## Authorization

Some description

<!-- Redoc-Inject: <security-definitions> -->
...
```
The inject instruction is wrapped in an HTML comment,
so it is **visible only in Redoc** and not visible, for instance, in the SwaggerUI.

## Default behavior

If the injection tag is not found in the description, it is appended to the end
of description under the `Authentication` header.

If the `Authentication` header is already present in the description,
Security Definitions are not inserted or rendered.
