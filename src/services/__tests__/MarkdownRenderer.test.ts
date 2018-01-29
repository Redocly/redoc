import { MarkdownRenderer } from '../MarkdownRenderer';

describe('Markdown renderer', () => {
  let renderer: MarkdownRenderer;
  beforeEach(() => {
    renderer = new MarkdownRenderer();
  });

  test('should return a level-1 heading even though only level-2 is present', () => {
    renderer.renderMd('## Sub Intro', false);
    expect(Object.keys(renderer.headings)).toHaveLength(1);
    expect(renderer.headings[0].name).toEqual('Sub Intro');
  });
  test('should return a level-2 heading as a child of level-1', () => {
    renderer.renderMd('# Introduction \n ## Sub Intro', false);
    expect(renderer.headings).toHaveLength(1);
    expect(renderer.headings[0].name).toEqual('Introduction');
    expect(renderer.headings[0].items).toBeDefined();
    expect(renderer.headings[0].items).toHaveLength(1);
  });
});
