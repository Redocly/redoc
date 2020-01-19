import { observer } from 'mobx-react';
import * as React from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/curly';
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/theme/monokai';

import { MediaTypeModel } from '../../services/models';

export interface ConsoleEditorProps {
  mediaTypes: MediaTypeModel[];
}

@observer
export class ConsoleEditor extends React.Component<ConsoleEditorProps> {

  editor: any;

  render() {
    const { mediaTypes } = this.props;

    if (!mediaTypes.length) {
      return null;
    }
    let sample = {};
    for (const mediaType of mediaTypes) {
      if (mediaType.name.indexOf('json') > -1) {
        if (mediaType.examples) {
          const example = getDefaultOrFirst(mediaType.examples);
          sample = example && example.value;
        }
        break;
      }
    }

    return (
      <div>
        <AceEditor
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          fontSize={10}
          mode="json"
          theme="monokai"
          name="request-builder-editor"
          editorProps={{ $blockScrolling: true }}
          value={JSON.stringify(sample, null, 2)}
          ref={(ace: AceEditor) => (this.editor = ace)}
          width="100%"
          height="400px"
        />
      </div>
    );
  }

}

function getDefaultOrFirst(object) {
  if (typeof object === 'object') {
    if (typeof object.default === 'object') {
      return object.default;
    } else {
      return object[Object.keys(object)[0]];
    }
  } else {
    return false;
  }
}
