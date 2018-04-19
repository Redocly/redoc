import { observer } from 'mobx-react';
import * as React from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/mode/curly';
import 'brace/theme/github';
import 'brace/theme/monokai';


import { MediaTypeModel } from '../../services/models';
import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';

import { MediaTypeSamples } from '../PayloadSamples/MediaTypeSamples';

import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { InvertedSimpleDropdown, MimeLabel } from '../PayloadSamples/styled.elements';

export interface ConsoleEditorProps {
  mediaTypes: MediaTypeModel[]
}

@observer
export class ConsoleEditor extends React.Component<ConsoleEditorProps> {
  render() {
    const { mediaTypes } = this.props;

    if (!mediaTypes.length) {
      return null;
    }
    let sample = {};
    for (let mediaType of mediaTypes) {
      if (mediaType.name.indexOf('json') > -1) {
        if (mediaType.examples) {
          sample = mediaType.examples && mediaType.examples.default;
        }
        break;
      }
    }


    /*
    let body = {};
    if(mimeContent.mediaTypes && mimeContent.mediaTypes.length>0){
      body = mimeContent.mediaTypes[0];
      if(body.examples && body.examples.default) {

      }
    }
    */
    return (
      <div>
        <h3>ConsoleEditor</h3>
        <AceEditor
          tabSize={1}
          fontSize={10}
          mode="json"
          theme="monokai"
          name="request-builder-editor"
          editorProps={{ $blockScrolling: true }}
          value={JSON.stringify(sample, null, 2)}
          width="100%"
          height="400px"
        />
      </div>
    );
  }

}
