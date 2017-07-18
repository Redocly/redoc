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

if (!IS_PRODUCTION) {
  require('@angular/platform-browser');
  require('@angular/platform-browser-dynamic');
  require('@angular/core');
  require('@angular/common');

  // RxJS
  require('rxjs/Rx');
}
