import * as yaml from 'js-yaml';
import * as React from 'react';
import { RefObject, useRef } from 'react';
import styled from '../../src/styled-components';

const Button = styled.button`
  background-color: #fff;
  color: #333;
  padding: 2px 10px;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  border: 1px solid #ccc;
  font-size: 16px;
  height: 28px;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 1;
  outline: none;
  white-space: nowrap;
  @media (max-width: 699px) {
    display: none;
  }
`;

const FileInput = props => {
  const hiddenFileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  function handleClick() {
    if (hiddenFileInput && hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  }

  function uploadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      props.onUpload(yaml.load(reader.result));
    };
    reader.readAsText(file);
  }

  return (
    <span>
      <Button onClick={handleClick}>Upload a file</Button>
      <input type="file" style={{ display: 'none' }} onChange={uploadFile} ref={hiddenFileInput} />
    </span>
  );
};

export default FileInput;
