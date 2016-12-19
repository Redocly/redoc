'use strict';

import { OptionsService } from './options.service';

describe('Options Service', () => {
  let tmpDiv;
  let optionsService;

  function build(html) {
    tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = html;
    document.body.appendChild(tmpDiv);
    return tmpDiv.lastChild;
  }

  afterEach(() => {
    if (tmpDiv) document.body.removeChild(tmpDiv);
    tmpDiv = false;
  });

  beforeEach(() => {
    optionsService = new OptionsService();
  });

  it('should parse numeric scrollYOffset', () => {
    var elem = build(`<redoc scroll-y-offset="50"></redoc>`);
    optionsService.parseOptions(elem);
    optionsService.options.scrollYOffset().should.be.equal(50);
  });

  it('should parse selector scrollYOffset', () => {
    var elem = build(`<div id="test" style="position: fixed; height: 50px; top:0"> </div>
          <redoc scroll-y-offset="#test"></redoc>`);
    optionsService.parseOptions(elem);
    optionsService.options.scrollYOffset().should.be.equal(50);
  });

  it('should return 0 for incorrect selector scrollYOffset', () => {
    var elem = build(`<div id="test" style="position: fixed; height: 50px; top:0"> </div>
          <redoc scroll-y-offset="#test2"></redoc>`);
    optionsService.parseOptions(elem);
    optionsService.options.scrollYOffset().should.be.equal(0);
  });

  it('should handle function scrollYOffset', () => {
    optionsService.options = { scrollYOffset: () => 123 };
    var elem = build(`<redoc></redoc>`);
    optionsService.parseOptions(elem);
    optionsService.options.scrollYOffset().should.be.equal(123);
  });

  it('should convert expandResponses options to Set', () => {
    optionsService.options = { expandResponses: '200,300' };
    optionsService._normalizeOptions();
    optionsService.options.expandResponses.should.be.instanceof(Set);
    Array.from(optionsService.options.expandResponses.values()).should.deepEqual(['200', '300']);
  });

  it('should preserve special value "all" as string', () => {
    optionsService.options = { expandResponses: 'all' };
    optionsService._normalizeOptions();
    optionsService.options.expandResponses.should.be.of.type('string');
    optionsService.options.expandResponses.should.be.equal('all');
  });
});
