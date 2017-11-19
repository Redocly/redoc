import { OpenAPISpec } from '../types';
import { SpecStore } from './models';
import { MenuStore } from './MenuStore';
import { ScrollService } from './ScrollService';
import { loadAndBundleSpec } from '../utils/loadAndBundleSpec';

type StoreData = {
  menu: {
    activeItemIdx: number;
  };
  spec: {
    url: string;
    data: any;
  };
};

export async function createStore(spec: object, specUrl: string) {
  const resolvedSpec = await loadAndBundleSpec(spec || specUrl);
  return new AppStore(resolvedSpec, specUrl);
}

export class AppStore {
  menu: MenuStore;
  spec: SpecStore;

  private scroll: ScrollService;

  constructor(spec: OpenAPISpec, specUrl?: string) {
    this.scroll = new ScrollService();
    this.spec = new SpecStore(spec, specUrl);
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
  toJS(): StoreData {
    return {
      menu: {
        activeItemIdx: this.menu.activeItemIdx,
      },
      spec: {
        url: this.spec.parser.specUrl,
        data: this.spec.parser.spec,
      },
    };
  }
  /**
   * deserialize store
   * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
   */
  // TODO:
  static fromJS(state: StoreData): AppStore {
    const inst = new AppStore(state.spec.data, state.spec.url);
    inst.menu.activeItemIdx = state.menu.activeItemIdx || 0;
    inst.menu.activate(inst.menu.flatItems[inst.menu.activeItemIdx]);
    return inst;
  }
}
