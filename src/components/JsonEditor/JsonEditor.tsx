import * as React from 'react';
import { cloneDeep, isEqual } from 'lodash';
import JSONEditorRaw from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import 'ace-builds/src-noconflict/theme-monokai.js';
import 'ace-builds/src-noconflict/theme-twilight.js';
import 'ace-builds/src-noconflict/theme-ambiance.js';
import { JeFt, JeFtResize } from './styled.elements';
import { EmptyObject } from '../../types';

export enum Mode {
  tree = 'tree',
  form = 'form',
  view = 'view',
  code = 'code',
  text = 'text',
}

export enum Theme {
  monokai = 'ace/theme/monokai',
  twilight = 'ace/theme/twilight',
  ambiance = 'ace/theme/ambiance',
}

export type TMode = keyof typeof Mode;

interface IJSONEditorRaw extends Object {
  set: (json?: EmptyObject) => void;
  setText: (text?: string) => void;
  update: (json?: EmptyObject) => void;
  updateText: (text?: string) => void;
  setMode: (mode?: Mode) => void;
  setSchema: (schema?: EmptyObject, schemaRefs?: EmptyObject) => void;
  destroy: () => void;
  resize: () => void;
  setTheme: (theme: string) => void;
  ace: any;
}

interface IJsonEditor {
  json?: EmptyObject;
  text?: string;
  search?: boolean;
  schema?: EmptyObject;
  schemaRefs?: EmptyObject;
  mode?: Mode;
  modes?: Mode[];
  indentation?: number;
  modalAnchor?: HTMLElement;
  enableSort?: boolean;
  enableTransform?: boolean;
  onChangeText?: (text: string) => void;
  onChangeJSON?: (json: EmptyObject) => void;
  onModeChange?: (mode: Mode) => void;
  theme?: string;
}

interface JsonEditorState {
  contentMinH: number;
  contentH: number;
}

class JsonEditor extends React.Component<IJsonEditor, JsonEditorState> {
  jsoneditor?: IJSONEditorRaw | null = null;
  schema?: EmptyObject;
  schemaRefs?: EmptyObject;
  content: HTMLDivElement | null = null;
  container: HTMLDivElement | null = null;

  startResizeY?: number;
  startHeight?: number;

  state = {
    contentMinH: 260,
    contentH: 260,
  };

  componentDidMount() {
    const { json, text, ...opts } = this.props;

    this.jsoneditor = new JSONEditorRaw(this.container, opts);
    if (!this.jsoneditor) return;

    if (json) {
      this.jsoneditor.set(json);
    }
    if (text) {
      this.jsoneditor.setText(text);
    }
    this.schema = cloneDeep(opts.schema);
    this.schemaRefs = cloneDeep(opts.schemaRefs);
  }

  componentDidUpdate() {
    if (!this.jsoneditor) return;
    const { json, text, mode, schema, schemaRefs } = this.props;

    if (json) {
      this.jsoneditor.update(json);
    }
    if (text) {
      this.jsoneditor.updateText(text);
    }
    if (mode) {
      this.jsoneditor.setMode(mode);
    }

    // store a clone of the schema to keep track of when it actually changes
    const schemaChanged = !isEqual(schema, this.schema);
    const schemaRefsChanged = !isEqual(schemaRefs, this.schemaRefs);
    if (schemaChanged || schemaRefsChanged) {
      this.schema = cloneDeep(schema);
      this.schemaRefs = cloneDeep(schemaRefs);
      this.jsoneditor.setSchema(schema, schemaRefs);
    }
  }

  componentWillUnmount() {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

  focusView = () => {
    if (this.container) {
      this.container.focus();
    }
  };

  resizeMove = event => {
    event.preventDefault();
    const deltaY = this.startResizeY! - event.clientY;
    this.setState(state => ({
      ...state,
      contentH: Math.max(state.contentMinH, this.startHeight! - deltaY),
    }));
  };

  resizeUp = event => {
    event.preventDefault();
    document.removeEventListener('mousemove', this.resizeMove);
    document.removeEventListener('mouseup', this.resizeUp);
  };

  onResizeDown = event => {
    event.preventDefault();
    this.startResizeY = event.clientY;
    this.startHeight = this.content ? this.content.clientHeight : this.state.contentMinH;
    document.addEventListener('mousemove', this.resizeMove);
    document.addEventListener('mouseup', this.resizeUp);
  };

  render() {
    if (this.jsoneditor) {
      // delay said not to be necessary.. we have to call this for proper editor resizing
      // in code or text modes
      this.jsoneditor.resize();
    }
    return (
      <div>
        <div
          ref={node => {
            this.content = node;
          }}
          className="je-content"
          style={{
            minHeight: this.state.contentMinH,
            height: this.state.contentH,
          }}
          onClick={this.focusView}
        >
          <div
            className="jsoneditor-react-container"
            ref={node => (this.container = node)}
            style={{
              width: '100%',
              minHeight: this.state.contentMinH,
              height: this.state.contentH,
            }}
          />
        </div>
        <JeFt className="je-ft" onMouseDown={this.onResizeDown}>
          <JeFtResize className="je-ft-resize">
            <span>◢</span>
          </JeFtResize>
        </JeFt>
      </div>
    );
  }
}

export default JsonEditor;
