import { OpenAPISpec } from '../types';
import { SpecStore } from './models';
import { MenuStore } from './MenuStore';
import { ScrollService } from './ScrollService';
import { loadAndBundleSpec } from '../utils/loadAndBundleSpec';
import { RedocNormalizedOptions, RedocRawOptions } from './RedocNormalizedOptions';

type StoreData = {
  menu: {
    activeItemIdx: number;
  };
  spec: {
    url: string;
    data: any;
  };
  options: RedocRawOptions;
};

export async function createStore(
  spec: object,
  specUrl: string | undefined,
  options: RedocRawOptions = {},
) {
  const resolvedSpec = await loadAndBundleSpec(spec || specUrl);
  return new AppStore(resolvedSpec, specUrl, options);
}

export class AppStore {
  menu: MenuStore;
  spec: SpecStore;
  rawOptions: RedocRawOptions;
  options: RedocNormalizedOptions;

  private scroll: ScrollService;

  constructor(spec: OpenAPISpec, specUrl?: string, options: RedocRawOptions = {}) {
    this.rawOptions = options;
    this.options = new RedocNormalizedOptions(options);
    this.scroll = new ScrollService(this.options);
    this.spec = new SpecStore(spec, specUrl, this.options);
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
      options: this.rawOptions,
    };
  }
  /**
   * deserialize store
   * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
   */
  // TODO:
  static fromJS(state: StoreData): AppStore {
    const inst = new AppStore(state.spec.data, state.spec.url, state.options);
    inst.menu.activeItemIdx = state.menu.activeItemIdx || 0;
    inst.menu.activate(inst.menu.flatItems[inst.menu.activeItemIdx]);
    return inst;
  }
}
