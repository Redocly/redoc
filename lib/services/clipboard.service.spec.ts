'use strict';

import { Clipboard } from './clipboard.service';

describe('Clipboard Service', () => {
  let el:Node;
  let copiedText = null;

  function createEl(html) {
    let tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = html;
    document.body.appendChild(tmpDiv);
    return tmpDiv.lastChild;
  }

  beforeEach(() => {
    spyOn(Clipboard, 'copySelected').and.callFake(() => {
      copiedText = window.getSelection().toString();
      return true;
    });
  });

  afterEach(() => {
    copiedText = null;
    if (el && el.parentNode) el.parentNode.removeChild(el);
    (<jasmine.Spy>Clipboard.copySelected).and.callThrough();
  });

  it('selectElement should select element text', () => {
    el = createEl('<div>Test</div>');
    Clipboard.selectElement(el);
    let selected = window.getSelection().toString();
    selected.should.be.equal('Test');
  });

  it('deselect should clear selection', () => {
    el = createEl('<div>Test</div>');
    Clipboard.selectElement(el);
    let selected = window.getSelection().toString();
    selected.should.be.equal('Test');
    Clipboard.deselect();
    window.getSelection().toString().should.be.equal('');
  });

  it('copyElement should copy and deselect', () => {
    el = createEl('<div>Test</div>');
    Clipboard.copyElement(el);
    copiedText.should.be.equal('Test');
    window.getSelection().toString().should.be.equal('');
  });

  it('copyCustom should copy custom text', () => {
    Clipboard.copyCustom('Custom text');
    copiedText.should.be.equal('Custom text');
  });
});
