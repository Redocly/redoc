import type { MDXComponentMeta } from '../types';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

const TestComponent = () => null;

describe('Markdown renderer', () => {
  let renderer: MarkdownRenderer;
  beforeEach(() => {
    renderer = new MarkdownRenderer(
      new RedocNormalizedOptions({
        allowedMdComponents: {
          'security-definitions': {
            component: TestComponent,
            propsSelector: () => ({}),
          },
        },
      }),
    );
  });

  test('should return a level-1 heading even though only level-2 is present', () => {
    renderer.renderMd('## Sub Intro', true);
    expect(Object.keys(renderer.headings)).toHaveLength(1);
    expect(renderer.headings[0].name).toEqual('Sub Intro');
  });

  test('should return a level-2 heading as a child of level-1', () => {
    const headings = renderer.extractHeadings('# Introduction \n ## Sub Intro');
    expect(headings).toHaveLength(1);
    expect(headings[0].name).toEqual('Introduction');
    expect(headings[0].items).toBeDefined();
    expect(headings[0].items).toHaveLength(1);
  });

  test('renderMdWithComponents should work with legacy syntax', () => {
    const source = 'Hello!\n<!-- ReDoc-Inject: <security-definitions> -->\nBye';
    const parts = renderer.renderMdWithComponents(source);
    expect(parts).toHaveLength(3);
    expect(parts[0]).toEqual('<p>Hello!</p>\n');
    expect(typeof parts[1]).toEqual('object');
    expect((parts[1] as MDXComponentMeta).component).toEqual(TestComponent);
    expect(parts[2]).toEqual('<p>Bye</p>\n');
  });

  test('renderMdWithComponents should work with mdx-like syntax', () => {
    const source = 'Hello!\n<security-definitions/>\nBye';
    const parts = renderer.renderMdWithComponents(source);
    expect(parts).toHaveLength(3);
    expect(parts[0]).toEqual('<p>Hello!</p>\n');
    expect(typeof parts[1]).toEqual('object');
    expect((parts[1] as MDXComponentMeta).component).toBe(TestComponent);
    expect(parts[2]).toEqual('<p>Bye</p>\n');
  });

  test('renderMdWithComponents should parse attribute names', () => {
    const source = '<security-definitions pointer={"test"} />';
    const parts = renderer.renderMdWithComponents(source);
    expect(parts).toHaveLength(1);
    const part = parts[0] as MDXComponentMeta;
    expect(part.component).toBe(TestComponent);
    expect(part.props).toEqual({ pointer: 'test' });
  });

  test('renderMdWithComponents should parse string attribute names', () => {
    const source = '<security-definitions pointer="test" />';
    const parts = renderer.renderMdWithComponents(source);
    expect(parts).toHaveLength(1);
    const part = parts[0] as MDXComponentMeta;
    expect(part.component).toBe(TestComponent);
    expect(part.props).toEqual({ pointer: 'test' });
  });

  test('renderMdWithComponents should parse string attribute with spaces new-lines', () => {
    const source = '<security-definitions \n pointer = "test" \n   flag-dash={ \nfalse } />';
    const parts = renderer.renderMdWithComponents(source);
    expect(parts).toHaveLength(1);
    const part = parts[0] as MDXComponentMeta;
    expect(part.component).toBe(TestComponent);
    expect(part.props).toEqual({ pointer: 'test', 'flag-dash': false });
  });

  test('renderMdWithComponents should parse children', () => {
    const source = '<security-definitions> Test Test </security-definitions>';
    const parts = renderer.renderMdWithComponents(source);
    expect(parts).toHaveLength(1);
    const part = parts[0] as MDXComponentMeta;
    expect(part.component).toBe(TestComponent);
    expect(part.props).toEqual({ children: ' Test Test ' });
  });

  test('renderMdWithComponents should parse children', () => {
    const source = '<security-definitions> Test Test </security-definitions>';
    const parts = renderer.renderMdWithComponents(source);
    expect(parts).toHaveLength(1);
    const part = parts[0] as MDXComponentMeta;
    expect(part.component).toBe(TestComponent);
    expect(part.props).toEqual({ children: ' Test Test ' });
  });

  test('should properly extract title from text', () => {
    const rawTexts = ['text before\n# Test', 'text before\n  # Test', 'text before\n# Test\n'];
    rawTexts.forEach(text => {
      const headings = renderer.extractHeadings(text);
      expect(headings).toHaveLength(1);
      expect(headings[0].name).toEqual('Test');
      expect(headings[0].description).toEqual('');
    });

    const rawTexts2 = ['# Test \n text after', '# Test \ntext after'];
    rawTexts2.forEach(text => {
      const headings = renderer.extractHeadings(text);
      expect(headings).toHaveLength(1);
      expect(headings[0].name).toEqual('Test');
      expect(headings[0].description).toEqual('text after');
    });
  });
});
