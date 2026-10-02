import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('Streaming Content Types - Response Samples', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/streaming-test-cases');
  });

  test.describe('JSONL (application/jsonl)', () => {
    test.describe('Inline examples', () => {
      test('should render base object with inline examples', async () => {
        await apiDocs.clickThroughMenu('JSONL', 'JSONL base object with inline examples');
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlinlineexamplebase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();

        await expect(responseSample).toContainText(
          `{"id":"user_123","name":"John Doe","email":"john.doe@example.com","active":true}`,
        );
      });

      test('should render array with inline examples', async () => {
        await apiDocs.clickThroughMenu('JSONL', 'JSONL array with inline examples');
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlinlineexamplearray');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `[{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}]`,
        );
      });

      test('should render complex nested object with inline examples', async () => {
        await apiDocs.clickThroughMenu('JSONL', 'JSONL complex nested object with inline examples');
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlinlineexamplecomplex');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `{"id":"user_123","profile":{"name":"John Doe","email":"john.doe@example.com","preferences":{"theme":"dark","notifications":{"email":true,"push":false}}},"metadata":{"tags":["premium","verified"],"createdAt":"2024-01-15T10:00:00Z"}}`,
        );
      });

      test('should render oneOf polymorphic objects with inline examples', async () => {
        await apiDocs.clickThroughMenu(
          'JSONL',
          'JSONL oneOf polymorphic objects with inline examples',
        );
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlinlineexampleoneof');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `{"type":"user_created","userId":"user_123","timestamp":"2024-01-15T10:00:00Z","data":{"name":"John Doe","email":"john@example.com"}}`,
        );
        await expect(responseSample).toContainText(
          `{"type":"user_updated","userId":"user_123","timestamp":"2024-01-15T11:00:00Z","changes":["email","name"]}`,
        );
        await expect(responseSample).toContainText(
          `{"type":"user_deleted","userId":"user_123","timestamp":"2024-01-15T12:00:00Z"}`,
        );
      });
    });

    test.describe('Schema-only (generated)', () => {
      test('should generate base object from schema', async () => {
        await apiDocs.clickThroughMenu('JSONL', 'JSONL base object (schema-only, no examples)');
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlschemaonlybase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `{"id":"string","name":"string","email":"user@example.com","active":true}`,
        );
      });

      test('should generate array from schema', async () => {
        await apiDocs.clickThroughMenu('JSONL', 'JSONL array (schema-only, no examples)');
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlschemaonlyarray');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `[{"operationId":"string","status":"success","resourceId":"string","createdAt":"2019-08-24T14:15:22Z"}]`,
        );
      });

      test('should generate complex nested from schema', async () => {
        await apiDocs.clickThroughMenu('JSONL', 'JSONL complex nested (schema-only, no examples)');
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlschemaonlycomplex');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `{"id":"string","profile":{"name":"string","email":"user@example.com","preferences":{"theme":"light","notifications":{"email":true,"push":true}}},"metadata":{"tags":["string"],"createdAt":"2019-08-24T14:15:22Z"}}`,
        );
      });
    });

    test.describe('Custom examples', () => {
      test('should render base object with custom example file', async () => {
        await apiDocs.clickThroughMenu('JSONL', 'JSONL base object with custom example file');
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlcustomexamplebase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `{"id":"user_001","name":"Alice Johnson","email":"alice.johnson@example.com","active":true}`,
        );
        await expect(responseSample).toContainText(
          `{"id":"user_002","name":"Bob Smith","email":"bob.smith@example.com","active":false}`,
        );
      });

      test('should render array with custom example file', async () => {
        await apiDocs.clickThroughMenu('JSONL', 'JSONL array with custom example file');
        const section = apiDocs.section('/streaming-test-cases/jsonl/jsonlcustomexamplearray');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `{"id":"user_001","name":"Alice Johnson","email":"alice.johnson@example.com","active":true}`,
        );
        await expect(responseSample).toContainText(
          `{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}`,
        );
      });
    });
  });

  test.describe('JSON-Seq (application/json-seq)', () => {
    test.describe('Inline examples', () => {
      test('should render base object with inline examples', async () => {
        await apiDocs.clickThroughMenu('JSON-Seq', 'JSON-Seq base object with inline examples');
        const section = apiDocs.section('/streaming-test-cases/json-seq/jsonseqinlineexamplebase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E{"id":"event_456","type":"notification","message":"User profile updated","timestamp":"2024-01-15T12:00:00Z"}0x0A`,
        );
      });

      test('should render array with inline examples', async () => {
        await apiDocs.clickThroughMenu('JSON-Seq', 'JSON-Seq array with inline examples');
        const section = apiDocs.section('/streaming-test-cases/json-seq/jsonseqinlineexamplearray');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E[{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}]0x0A`,
        );
      });

      test('should render complex nested object with inline examples', async () => {
        await apiDocs.clickThroughMenu('JSON-Seq', 'JSON-Seq complex nested with inline examples');
        const section = apiDocs.section(
          '/streaming-test-cases/json-seq/jsonseqinlineexamplecomplex',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E{"id":"evt_456","type":"complex_event","payload":{"user":{"id":"user_789","actions":[{"action":"login","timestamp":"2024-01-15T10:00:00Z"}]},"context":{"sessionId":"sess_abc123","metadata":{"ip":"192.168.1.1","userAgent":"Mozilla/5.0"}}},"timestamp":"2024-01-15T12:00:00Z"}0x0A`,
        );
      });

      test('should render oneOf polymorphic objects with inline examples', async () => {
        await apiDocs.clickThroughMenu(
          'JSON-Seq',
          'JSON-Seq oneOf polymorphic with inline examples',
        );
        const section = apiDocs.section('/streaming-test-cases/json-seq/jsonseqinlineexampleoneof');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E{"type":"event_created","eventId":"evt_001","timestamp":"2024-01-15T10:00:00Z"}0x0A`,
        );
        await expect(responseSample).toContainText(
          `0x1E{"type":"event_updated","eventId":"evt_001","changes":["status","priority"],"timestamp":"2024-01-15T11:00:00Z"}0x0A`,
        );
      });
    });

    test.describe('Schema-only (generated)', () => {
      test('should generate base object from schema', async () => {
        await apiDocs.clickThroughMenu(
          'JSON-Seq',
          'JSON-Seq base object (schema-only, no examples)',
        );
        const section = apiDocs.section('/streaming-test-cases/json-seq/jsonseqschemaonlybase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E{"id":"string","type":"string","message":"string","timestamp":"2019-08-24T14:15:22Z"}0x0A`,
        );
      });

      test('should generate array from schema', async () => {
        await apiDocs.clickThroughMenu('JSON-Seq', 'JSON-Seq array (schema-only, no examples)');
        const section = apiDocs.section('/streaming-test-cases/json-seq/jsonseqschemaonlyarray');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E[{"operationId":"string","status":"success","resourceId":"string","createdAt":"2019-08-24T14:15:22Z"}]0x0A`,
        );
      });

      test('should generate complex nested from schema', async () => {
        await apiDocs.clickThroughMenu(
          'JSON-Seq',
          'JSON-Seq complex nested (schema-only, no examples)',
        );
        const section = apiDocs.section('/streaming-test-cases/json-seq/jsonseqschemaonlycomplex');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E{"id":"string","type":"string","payload":{"user":{"id":"string","actions":[{"action":"string","timestamp":"2019-08-24T14:15:22Z"}]},"context":{"sessionId":"string","metadata":{"property1":"string","property2":"string"}}},"timestamp":"2019-08-24T14:15:22Z"}0x0A`,
        );
      });
    });

    test.describe('Custom examples', () => {
      test('should render base object with custom example file', async () => {
        await apiDocs.clickThroughMenu('JSON-Seq', 'JSON-Seq base object with custom example file');
        const section = apiDocs.section('/streaming-test-cases/json-seq/jsonseqcustomexamplebase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E{"id":"event_001","type":"notification","message":"User profile updated","timestamp":"2024-01-15T12:00:00Z"}0x0A`,
        );
        await expect(responseSample).toContainText(
          `0x1E{"id":"event_002","type":"alert","message":"System maintenance scheduled","timestamp":"2024-01-15T12:05:00Z"}0x0A`,
        );
      });

      test('should render array with custom example file', async () => {
        await apiDocs.clickThroughMenu('JSON-Seq', 'JSON-Seq array with custom example file');
        const section = apiDocs.section('/streaming-test-cases/json-seq/jsonseqcustomexamplearray');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(
          `0x1E{"id":"event_001","type":"notification","message":"User profile updated","timestamp":"2024-01-15T12:00:00Z"}0x0A`,
        );
      });
    });
  });

  test.describe('SSE (text/event-stream)', () => {
    test.describe('Inline examples', () => {
      test('should render base event with inline examples', async () => {
        await apiDocs.clickThroughMenu('SSE', 'SSE base event with inline examples');
        const section = apiDocs.section('/streaming-test-cases/sse/sseinlineexamplebase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(`event: message
data: {"message": "Hello World", "user": "john"}
id: evt_001
retry: 3000`);
      });

      test('should render complex nested event with inline examples', async () => {
        await apiDocs.clickThroughMenu('SSE', 'SSE complex nested event with inline examples');
        const section = apiDocs.section('/streaming-test-cases/sse/sseinlineexamplecomplex');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(`event: user_action
data: {"userId":"123","action":"login","session":{"id":"sess_abc","duration":3600},"metadata":{"ip":"192.168.1.1","userAgent":"Mozilla/5.0"}}
id: evt_complex_001
retry: 5000`);
      });

      test('should render oneOf polymorphic events with inline examples', async () => {
        await apiDocs.clickThroughMenu('SSE', 'SSE oneOf polymorphic events with inline examples');
        const section = apiDocs.section('/streaming-test-cases/sse/sseinlineexampleoneof');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(`event: type1
data: {"action":"created","resource":"user"}
id: sse_001`);
        await expect(responseSample).toContainText(`event: type2
data: {"action":"updated","resource":"order"}
id: sse_002`);
      });
    });

    test.describe('Schema-only (generated)', () => {
      test('should generate base event from schema', async () => {
        await apiDocs.clickThroughMenu('SSE', 'SSE base event (schema-only, no examples)');
        const section = apiDocs.section('/streaming-test-cases/sse/sseschemaonlybase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(`event: string
          data: string
          id: string
          retry: 0`);
      });

      test('should generate complex nested from schema', async () => {
        await apiDocs.clickThroughMenu('SSE', 'SSE complex nested (schema-only, no examples)');
        const section = apiDocs.section('/streaming-test-cases/sse/sseschemaonlycomplex');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(`event: string
          data: string
          id: string
          retry: 0`);
      });
    });

    test.describe('Custom examples', () => {
      test('should render base event with custom example file', async () => {
        await apiDocs.clickThroughMenu('SSE', 'SSE base event with custom example file');
        const section = apiDocs.section('/streaming-test-cases/sse/ssecustomexamplebase');
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText(`
          id: evt_002
          event: user_update
          data: {"userId": "123", "action": "updated", "fields": ["email", "name"]}`);
      });
    });
  });

  test.describe('Multipart/Mixed (multipart/mixed)', () => {
    test.describe('Inline examples', () => {
      test('should render base object with inline examples', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed base object with inline examples',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartinlineexamplebase',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText(`{
          "id": "doc_001",
          "title": "Sample Document",
          "content": "This is sample content",
          "createdAt": "2024-01-15T10:00:00Z"
        }`);
      });

      test('should render array with inline examples', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed array with inline examples (demonstrates array normalization)',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartinlineexamplearray',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText(`{
          "operationId": "op_001",
          "status": "success",
          "resourceId": "user_789",
          "createdAt": "2024-01-15T11:00:00Z"
        }`);
        await expect(responseSample).toContainText(`{
          "operationId": "op_002",
          "status": "success",
          "updatedFields": [
            "email"
          ],
          "updatedAt": "2024-01-15T11:00:05Z"
        }`);
      });

      test('should render complex nested object with inline examples', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed complex nested with inline examples',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartinlineexamplecomplex',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText('"id": "doc_123"');
        await expect(responseSample).toContainText('"title": "Complex Document"');
        await expect(responseSample).toContainText('"author": {');
      });

      test('should render oneOf polymorphic objects with inline examples', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed oneOf polymorphic objects with inline examples',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartinlineexampleoneof',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText('"type": "user_created"');
        await expect(responseSample).toContainText('"type": "user_updated"');
        await expect(responseSample).toContainText('"type": "user_deleted"');
      });

      test('should render mixed types (JSON and binary) with inline examples', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed with JSON and binary with inline examples',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartinlineexamplemixedtypes',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText('Content-Type: application/json');
        await expect(responseSample).toContainText('Content-Type: application/pdf');
        await expect(responseSample).toContainText('[Binary data]');
      });
    });

    test.describe('Schema-only (generated)', () => {
      test('should generate base object from schema', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed base object (schema-only, no examples)',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartschemaonlybase',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText(`{
          "id": "string",
          "title": "string",
          "content": "string",
          "createdAt": "2019-08-24T14:15:22Z"
        }`);
      });

      test('should generate array from schema', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed array (schema-only, no examples) - demonstrates array normalization',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartschemaonlyarray',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText(`{
  "operationId": "string",
  "status": "success",
  "resourceId": "string",
  "createdAt": "2019-08-24T14:15:22Z"
}`);
        await expect(responseSample).toContainText(`{
  "operationId": "string",
  "status": "success",
  "updatedFields": [
    "string"
  ],
  "updatedAt": "2019-08-24T14:15:22Z"
}`);
      });

      test('should generate complex nested from schema', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed complex nested (schema-only, no examples)',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartschemaonlycomplex',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText('"id": "string"');
        await expect(responseSample).toContainText('"metadata": {');
        await expect(responseSample).toContainText('"content": {');
      });
    });

    test.describe('Custom examples', () => {
      test('should render base object with custom example file', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed base object with custom example file',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartcustomexamplebase',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText('"id": "doc_001"');
        await expect(responseSample).toContainText('"title": "Sample Document"');
      });

      test('should render array with custom example file', async () => {
        await apiDocs.clickThroughMenu(
          'Multipart/Mixed',
          'Multipart/Mixed array with custom example file',
        );
        const section = apiDocs.section(
          '/streaming-test-cases/multipartmixed/multipartcustomexamplearray',
        );
        const responseSample = section.getResponseSample();

        await expect(responseSample).toBeVisible();
        await expect(responseSample).toContainText('--boundary-separator');
        await expect(responseSample).toContainText('"id": "doc_001"');
        await expect(responseSample).toContainText('"operationId": "op_001"');
      });
    });
  });
});
