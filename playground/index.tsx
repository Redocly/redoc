import { createRoot } from 'react-dom/client';

import Playground from './Playground';

const root = createRoot(document.getElementById('root'));

setTimeout(() => root.render(<Playground />), 100);
