import 'prismjs';
import 'prismjs/components/prism-actionscript.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-php.js';
import 'prismjs/components/prism-coffeescript.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-haskell.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-lua.js';
import 'prismjs/components/prism-matlab.js';
import 'prismjs/components/prism-perl.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-r.js';
import 'prismjs/components/prism-ruby.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-swift.js';
import 'prismjs/components/prism-objectivec.js';
import 'prismjs/components/prism-scala.js';
import 'prismjs/components/prism-markup.js'; // xml

import 'dropkickjs/build/css/dropkick.css';
import 'prismjs/themes/prism-dark.css';
import 'hint.css/hint.base.css';

interface Element {
  scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
};

if (!(<any>Element).prototype.scrollIntoViewIfNeeded) {
  (<any>Element).prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

    var parent = this.parentNode,
        parentComputedStyle = window.getComputedStyle(parent, null),
        parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
        parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
        overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
        overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
        overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
        overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
        alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      this.scrollIntoView(alignWithTop);
    }
  };
}
