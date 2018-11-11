import * as React from 'react';

import {Markdown} from '../components';
import styled from '../styled-components';
import {ShelfIcon} from './shelfs';

export interface ReadMoreProps {
  content?: string;
}

interface ReadMoreState {
  open: boolean;
}

const ReadMoreWrapper = styled.div`
  position: relative;
  overflow: hidden;
  max-height: ${(props: ReadMoreState) => props.open ? 'auto' : '5em'};
  padding-bottom: ${(props: ReadMoreState) => props.open ? '3em' : '1em'};
`;

const ReadMoreButtonBackground = styled.div`
  position: absolute;
  cursor: pointer;
  text-align: center;
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.3), white);
  width: 100%;
  bottom: 0;
  padding: ${(props: ReadMoreState) => props.open ? '0' : '2em'};
`;

const ReadMoreButton = styled.span`
  background: #999;
  color: #fff;
  padding: 0.3em 0.75em;
  border-radius: 2px;
`;

const ReadMoreButtonText = styled.span`
  text-transform: uppercase;
`;

export class ReadMore extends React.Component<ReadMoreProps, ReadMoreState> {
  constructor(props: ReadMoreProps) {
    super(props);
    this.state = {
      open: false,
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  };

  render() {
    const { content } = this.props;

    if (!content) {
      return <ReadMoreWrapper open={false} />;
    }

    return (
      <ReadMoreWrapper open={this.state.open}>
        <ReadMoreButtonBackground onClick={this.toggle} open={this.state.open}>
          <ReadMoreButton>
            <ShelfIcon
              size={'1.5em'}
              color={'white'}
              direction={this.state.open ? 'up' : 'down'}
            />
            <ReadMoreButtonText>
              {this.state.open ? 'Read More' : 'Close'}
            </ReadMoreButtonText>
          </ReadMoreButton>
        </ReadMoreButtonBackground>
        <Markdown source={content} />
      </ReadMoreWrapper>
    );
  }
}
