export function getItemDoesNotMatchAnyGroupErrorMessage(itemDescription: string): string {
  return `All items in the GraphQL definition should belong to some group in strict mode. ${itemDescription} doesn't match any of the groups.`;
}
