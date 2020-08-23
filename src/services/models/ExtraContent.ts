import { action, observable } from 'mobx';
import { ContentItemModel } from '..';
import { OpenAPIExternalDocumentation } from '../../types';
import { IMenuItem } from '../MenuStore';

export class ExtraContent implements IMenuItem {
  //#region IMenuItem fields
  id: string;
  absoluteIdx?: number;
  name: string;
  description?: string;
  type = 'extra' as const;
  content: JSX.Element

  items: ContentItemModel[] = [];
  parent?: ExtraContent;
  externalDocs?: OpenAPIExternalDocumentation;

  @observable
  active: boolean = false;
  @observable
  expanded: boolean = false;

  depth: number;
  level: number;

  constructor({ id, name, depth }) {
    this.id = id
    this.name = name
    this.depth = depth
  }

  /**
  * set operation as active (used by side menu)
  */
  @action
  activate() {
    this.active = true;
  }

  /**
  * set operation as inactive (used by side menu)
  */
  @action
  deactivate() {
    this.active = false;
  }

  expand() {
    if (this.parent) {
      this.parent.expand();
    }
  }

  collapse() {
    /* do nothing */
  }
}
