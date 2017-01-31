'use strict';

import { MdRenderer } from '../../lib/utils/md-renderer';

describe('Utils', () => {
  describe('Markdown renderer', () => {
    let mdRender;
    beforeEach(() => {
      mdRender = new MdRenderer();
    });
    it('should return a level-1 heading even though level-2 is passed', () => {
      mdRender.renderMd('## Sub Intro');
      expect(mdRender.firstLevelHeadings.length).toEqual(1);
      expect(mdRender.firstLevelHeadings).toEqual(['Sub Intro']);
    });
    it('should return a level-1 heading and a level-2', () => {
      mdRender.renderMd('# Introduction \n ## Sub Intro');
      expect(mdRender.firstLevelHeadings.length).toEqual(1);
      expect(mdRender.firstLevelHeadings).toEqual(['Introduction']);
      expect(mdRender.secondLevelHeadings).toEqual(['Introduction/Sub Intro']);
    });
  });
});
