import * as React from 'react';
import JsonEditor, { Mode, Theme } from './JsonEditor';
import { EmptyObject } from '../../types';

// const schema = {
//   title: 'Example Schema',
//   type: 'object',
//   properties: {
//     array: {
//       type: 'array',
//       items: {
//         type: 'number'
//       }
//     },
//     boolean: {
//       type: 'boolean',
//     },
//     number: {
//       type: 'number'
//     }
//   },
//   required: ['array', 'boolean']
// };

// const json = {
//   array: [1, 2, 3],
//   boolean: true,
//   string: 'four'
// }

const modes = [];

interface JsonEditorWrapperProps {
  schema?: EmptyObject;
  text?: string;
  json?: EmptyObject;
  onChange?: (value: any) => void;
  theme?: string;
}

interface JsonEditorWrapperState {
  schema?: EmptyObject;
  text?: string;
  json?: EmptyObject;
  mode: Mode;
}

// TODO
// - messy json / text interplay
// - schema validation
class JsonEditorWrapper extends React.Component<JsonEditorWrapperProps, JsonEditorWrapperState> {
  constructor(props: JsonEditorWrapperProps) {
    super(props);

    const { schema, text } = this.props;
    const defaultSchema = {};

    this.state = {
      schema: schema || defaultSchema,
      text: text || '',
      json: {}, //text || '',
      mode: Mode.code,
    };
  }

  onChangeText = (text: string) => {
    this.setState({ text });
    if (this.props.onChange) {
      this.props.onChange(text);
    }
  };

  onChangeJSON = (text: string) => {
    this.setState({ text });
    if (this.props.onChange) {
      this.props.onChange(text);
    }
  };

  onModeChange = (mode: Mode) => {
    this.setState({ mode });
  };

  render() {
    const { theme } = this.props;
    const { schema, text, mode } = this.state;
    return (
      <div className="je-wrapper">
        <JsonEditor
          search={false}
          schema={schema}
          text={text}
          mode={mode}
          modes={modes}
          theme={theme || Theme.twilight}
          indentation={4}
          enableSort={false}
          enableTransform={false}
          onChangeText={this.onChangeText}
          // onChangeJSON={this.onChangeJSON}
          onModeChange={this.onModeChange}
        />
      </div>
    );
  }
}

export default JsonEditorWrapper;
