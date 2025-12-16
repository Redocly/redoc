import { useEffect, useRef } from 'react';

import type { ContentItemModel } from '../../models/index.js';

import { removeLeadingSlash } from '@redocly/theme/core/openapi';

import { getElementById } from '../Content/useAutoScroll.js';
import { useLocation } from '../../hooks/useLocation.js';

function useScrollOnRender(item: ContentItemModel, routingBasePath: string) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pathname = removeLeadingSlash(location.pathname.replace(routingBasePath, ''));

  useEffect(() => {
    if (ref.current && item.href && removeLeadingSlash(item.href) === pathname) {
      if (typeof ref?.current?.scrollIntoView === 'function') {
        ref.current.scrollIntoView();
      }
      if (location.hash) {
        const element = getElementById(location.hash.replace('#', '').toLowerCase());
        if (element) {
          element.scrollIntoView();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export default useScrollOnRender;
