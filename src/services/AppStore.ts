import { SpecStore } from './models';
import { MenuStore } from './MenuStore';
import { ScrollService } from './ScrollService';

export class AppStore {
  menu: MenuStore;
  scroll: ScrollService;
  spec: SpecStore;
  static i = 25;

  // TODO: store serialization ???

  constructor() {
    this.scroll = new ScrollService();
    this.spec = new SpecStore();
    this.menu = new MenuStore(this.spec, this.scroll);
  }

  dispose() {
    this.scroll.dispose();
    this.menu.dispose();
  }

  /**
   * serializes store
   * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
   */
  // TODO:
  toJS() {
    return {
      menu: {
        activeMenuIdx: this.menu.activeItemIdx,
      },
      spec: {
        parser: {
          specUrl: this.spec.parser.specUrl,
          spec: this.spec.parser.spec,
        },
      },
    };
  }
  /**
   * deserialize store
   * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
   */
  // TODO:
  static fromJS(state): AppStore {
    const inst = new AppStore();
    inst.spec.parser.specUrl = state.spec.parser.specUrl;
    inst.spec.parser.spec = state.spec.parser.spec;
    inst.menu.activeItemIdx = state.menu.activeItemIdx || 0;
    inst.menu.activate(inst.menu.flatItems[inst.menu.activeItemIdx]);
    return inst;
  }
}
