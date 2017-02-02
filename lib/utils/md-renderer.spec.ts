'use strict';

import { MdRenderer } from '../../lib/utils/md-renderer';

describe('Utils', () => {
  describe('Markdown renderer', () => {
    let mdRender: MdRenderer;
    beforeEach(() => {
      mdRender = new MdRenderer();
    });
    it('should return a level-1 heading even though only level-2 is present', () => {
      mdRender.renderMd('## Sub Intro');
      Object.keys(mdRender.headings).length.should.be.equal(1);
      should.exist(mdRender.headings['sub-intro']);
    });
    it('should return a level-2 heading as a child of level-1', () => {
      mdRender.renderMd('# Introduction \n ## Sub Intro');
      Object.keys(mdRender.headings).length.should.be.equal(1);
      should.exist(mdRender.headings['introduction']);
      should.exist(mdRender.headings['introduction'].children);
      Object.keys(mdRender.headings['introduction'].children).length.should.be.equal(1);
    });
  });
});
