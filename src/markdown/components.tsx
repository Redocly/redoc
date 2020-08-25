import * as React from 'react';
import {
  DarkRightPanel,
  H1,
  H2,
  MiddlePanel,
  PropertiesTable,
  Row,
  Section,
  ShareLink,
} from '../common-elements';
import Highlighter from './code/Highlighter';

const H1Comp = ({ children, ...props }) => {
  return (
    <H1 id={props.id}>
      <ShareLink to={props.id as string} />
      {children}
    </H1>
  );
};

const H2Comp = ({ children, ...props }) => (
  <H2 id={props.id}>
    <ShareLink to={props.id as string} />
    {children}
  </H2>
);

const Wrapper = ({ children }) => {
  const getSections = (children) => {
    let currentSection: any[] = [];
    let currentId: number | null = null;
    let currentCodeBlocks: any[] = [];
    const result: any[] = [];

    children.forEach((child) => {
      const type = child.props.mdxType;
      if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(type)) {
        if (currentSection.length > 0) {
          result.push({
            id: currentId,
            middle: currentSection,
            right: currentCodeBlocks,
          });
        }
        currentId = child.props.id;
        currentSection = [];
        currentCodeBlocks = [];
      }
      if (['code', 'pre', 'blockquote'].includes(type)) {
        currentCodeBlocks.push(child);
      } else {
        currentSection.push(child);
      }
    });

    if (currentSection.length > 0) {
      result.push({ id: currentId, middle: currentSection, right: currentCodeBlocks });
    }

    return result;
  };

  const sections = getSections(children);

  return (
    <>
      {sections.map((section) => (
        <Section key={`section-${section.id}`} id={section.id}>
          <Row id={section.id}>
            {section.middle && <MiddlePanel>{section.middle}</MiddlePanel>}
            {section.right && <DarkRightPanel>{section.right}</DarkRightPanel>}
          </Row>
        </Section>
      ))}
    </>
  );
};

export default {
  code: Highlighter,
  h1: H1Comp,
  h2: H2Comp,
  table: PropertiesTable,
  wrapper: Wrapper,
};
