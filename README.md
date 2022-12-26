# HTML to Markdown (for IFTTT)
**Convert HTML content to a (simplified) Markdown representation for IFTTT applets**

This is a simple TypeScript HTML parser which is designed to convert HTML content to a simplified Markdown representation.
It is designed to be a simple drop-in solution in the IFTTT **Filter** block and is particularly useful when handling RSS
feed content and emitting to a platform which doesn't support HTML.

## Usage
When using this converter, you will need to copy the content of the `parser.ts` file into your IFTTT Applet's **Filter** block
before using it.

```typescript
// <--- Insert parser.ts content here --->

Todoist.createTask.setTaskDescription(htmlToMarkdown(Feed.newFeedItem.EntryContent))
```