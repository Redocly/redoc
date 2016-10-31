'use strict';
import { DropDown } from './DropDown/drop-down';
import { StickySidebar } from './StickySidebar/sticky-sidebar';
import { Tabs, Tab } from './Tabs/tabs';
import { Zippy } from './Zippy/zippy';
import { CopyButton } from './CopyButton/copy-button.directive';
import { SelectOnClick } from './SelectOnClick/select-on-click.directive';
import { DynamicNg2Viewer, DynamicNg2Wrapper } from './DynamicNg2Viewer/dynamic-ng2-viewer.component';

export const REDOC_COMMON_DIRECTIVES = [
  DropDown, StickySidebar, Tabs, Tab, Zippy, CopyButton, SelectOnClick, DynamicNg2Viewer, DynamicNg2Wrapper
];

export { DropDown, StickySidebar, Tabs, Tab, Zippy, CopyButton, SelectOnClick, DynamicNg2Viewer, DynamicNg2Wrapper }
