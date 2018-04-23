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

  public editor: any;

  /*
  get aceEditor(): AceEditor {
    return this._aceEditor;
  }
  
  set aceEditor(aceEditor: AceEditor) {
    if (aceEditor) {
      this.aceEditor = this.aceEditor
    }
    else {
      console.log("Error: Undefined ace editor!");
    }
  }
  */

  render() {
    const { mediaTypes } = this.props;

    if (!mediaTypes.length) {
      return null;
    }
    let sample = {};
    for (let mediaType of mediaTypes) {
      if (mediaType.name.indexOf('json') > -1) {
        if (mediaType.examples) {
          sample = mediaType.examples && mediaType.examples.default && mediaType.examples.default.value;
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
        <AceEditor
          tabSize={1}
          fontSize={10}
          mode="json"
          theme="github"
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
