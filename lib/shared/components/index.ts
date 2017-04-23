'use strict';
import { DropDown } from './DropDown/drop-down';
import { StickySidebar } from './StickySidebar/sticky-sidebar';
import { Tabs, Tab } from './Tabs/tabs';
import { Zippy } from './Zippy/zippy';
import { CopyButton } from './CopyButton/copy-button.directive';
import { SelectOnClick } from './SelectOnClick/select-on-click.directive';
import { DynamicNg2Viewer, DynamicNg2Wrapper } from './DynamicNg2Viewer/dynamic-ng2-viewer.component';
import { LazyFor, LazyTasksService, LazyTasksServiceSync } from './LazyFor/lazy-for';
import { PerfectScrollbar } from './PerfectScrollbar/perfect-scrollbar';

export const REDOC_COMMON_DIRECTIVES = [
  PerfectScrollbar, DropDown, StickySidebar, Tabs, Tab, Zippy, CopyButton, SelectOnClick, DynamicNg2Viewer, DynamicNg2Wrapper, LazyFor
];

export { DropDown, StickySidebar, Tabs, Tab, Zippy, CopyButton, SelectOnClick, DynamicNg2Viewer, DynamicNg2Wrapper, LazyFor }
export { LazyTasksService, LazyTasksServiceSync, PerfectScrollbar }
