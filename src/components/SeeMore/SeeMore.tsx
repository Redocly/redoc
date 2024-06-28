import * as React from 'react';
import styled from 'styled-components';

const TOLERANCE_PX = 20;

interface SeeMoreProps {
  children?: React.ReactNode;
  height: string;
}

export function SeeMore({ children, height }: SeeMoreProps): JSX.Element {
  const ref = React.createRef() as React.RefObject<HTMLDivElement>;
  const [showMore, setShowMore] = React.useState(false);
  const [showLink, setShowLink] = React.useState(false);

  React.useEffect(() => {
    if (ref.current && ref.current.clientHeight + TOLERANCE_PX < ref.current.scrollHeight) {
      setShowLink(true);
    }
  }, [ref]);

  const onClickMore = () => {
    setShowMore(!showMore);
  };

  return (
    <>
      <Container
        ref={ref}
        className={showMore ? '' : 'container'}
        style={{ height: showMore ? 'auto' : height }}
      >
        {children}
      </Container>
      <ButtonContainer $dimmed={!showMore}>
        {showLink && (
          <ButtonLinkStyled onClick={onClickMore}>
            {showMore ? 'See less' : 'See more'}
          </ButtonLinkStyled>
        )}
      </ButtonContainer>
    </>
  );
}

const Container = styled.div`
  overflow-y: hidden;
`;

const ButtonContainer = styled.div<{ $dimmed?: boolean }>`
  text-align: center;
  line-height: 1.5em;
  ${({ $dimmed }) =>
    $dimmed &&
    `background-image: linear-gradient(to bottom, transparent,rgb(255 255 255));
     position: relative;
     top: -0.5em;
     padding-top: 0.5em;
     background-position-y: -1em;
    `}
`;

const ButtonLinkStyled = styled.a`
  cursor: pointer;
`;
