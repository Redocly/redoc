import * as React from 'react';

import styled from '../../styled-components';
import { ResolvedThemeInterface } from '../../theme';

export const SidebarCollapseButton = ({ options }: { options: ResolvedThemeInterface }) => {
  return (
    <SidebarCollapseContainer id="sidebar-callapse" options={options} onClick={collapse}>
      <SidebarCollapseSvg options={options} />
    </SidebarCollapseContainer>
  );
};

export const SidebarExpandButton = ({ options }: { options: ResolvedThemeInterface }) => {
  return (
    <SidebarExpandContainer id="sidebar-expand" options={options} onClick={expand}>
      <SidebarExpandSvg options={options} />
    </SidebarExpandContainer>
  );
};

let sidebarWidth: string;
let rightPanelWidth: string;

const SidebarCollapseContainer = styled.div`
  ${function ({ options }: { options: ResolvedThemeInterface }) {
    sidebarWidth = options.sidebar.width;
    rightPanelWidth = options.rightPanel.width;

    return `
      margin-left: calc(${options.sidebar.width} - ${options.sidebar.collapseBtn.size} / 2);
      top: ${options.sidebar.collapseBtn.top};
      z-index: 10;
      width: ${options.sidebar.collapseBtn.size};
      height: ${options.sidebar.collapseBtn.size};
      background: #fff;
      border: 1px solid #e9ebf0;
      border-radius: 50%;
      box-shadow: 0 0 5px 0 rgba(0,0,0,.06);
      cursor: pointer;
      position: fixed;

      @media screen and (max-width: 768px) {
        display: none;
      }

      @media print {
        display: none;
      }
    `;
  }};
`;

const SidebarExpandContainer = styled.div`
  ${({ options }: { options: ResolvedThemeInterface }) => `
    margin-left: 10px;
    top: ${options.sidebar.collapseBtn.top};
    z-index: 10;
    width: ${options.sidebar.collapseBtn.size};
    height: ${options.sidebar.collapseBtn.size};
    background: #fff;
    border: 1px solid #e9ebf0;
    border-radius: 50%;
    box-shadow: 0 0 5px 0 rgba(0,0,0,.06);
    cursor: pointer;
    position: fixed;
    display: none;

    @media screen and (max-width: 768px) {
      display: none;
    }

    @media print {
      display: none;
    }
  `};
`;

const SidebarCollapseSvg = ({ options }: { options: ResolvedThemeInterface }) => (
  <svg
    style={{
      textAlign: 'center',
      margin: `${parseFloat(options.sidebar.collapseBtn.size) / 4 - 1}px`,
    }}
    viewBox="0 0 8 10"
    version="1.1"
    width={parseFloat(options.sidebar.collapseBtn.size) / 2}
    height={parseFloat(options.sidebar.collapseBtn.size) / 2}
    fill="currentColor"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-159.000000, -57.000000)" fill="currentColor" fillRule="nonzero">
        <path
          d="M166.896194,58.6461941 C167.310408,58.6461941 167.646194,58.9819805 167.646194,59.3961941 C167.646194,59.7758898 167.36404,60.089685 166.997965,60.1393475 L166.896194,60.1461941 L162.64566,60.1456602 L162.646194,64.3961941 C162.646194,64.7758898 162.36404,65.089685 161.997965,65.1393475 L161.896194,65.1461941 C161.516498,65.1461941 161.202703,64.8640402 161.153041,64.4979646 L161.146194,64.3961941 L161.146194,59.3961941 C161.146194,59.0164983 161.428348,58.7027031 161.794424,58.6530407 L161.896194,58.6461941 L166.896194,58.6461941 Z"
          transform="translate(164.396194, 61.896194) rotate(-45.000000) translate(-164.396194, -61.896194) "
        ></path>
      </g>
    </g>
  </svg>
);

const SidebarExpandSvg = ({ options }: { options: ResolvedThemeInterface }) => (
  <svg
    style={{
      textAlign: 'center',
      margin: `${parseFloat(options.sidebar.collapseBtn.size) / 4 - 1}px`,
    }}
    viewBox="0 0 8 10"
    version="1.1"
    width={parseFloat(options.sidebar.collapseBtn.size) / 2}
    height={parseFloat(options.sidebar.collapseBtn.size) / 2}
    fill="currentColor"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-182.000000, -57.000000)" fill="currentColor" fillRule="nonzero">
        <g transform="translate(185.000000, 62.000000) scale(-1, 1) translate(-185.000000, -62.000000) translate(180.000000, 57.000000)">
          <path
            d="M7.89619408,1.64619408 C8.31040764,1.64619408 8.64619408,1.98198052 8.64619408,2.39619408 C8.64619408,2.77588984 8.3640402,3.08968504 7.99796464,3.13934746 L7.89619408,3.14619408 L3.64566017,3.14566017 L3.64619408,7.39619408 C3.64619408,7.77588984 3.3640402,8.08968504 2.99796464,8.13934746 L2.89619408,8.14619408 C2.51649831,8.14619408 2.20270312,7.8640402 2.15304069,7.49796464 L2.14619408,7.39619408 L2.14619408,2.39619408 C2.14619408,2.01649831 2.42834796,1.70270312 2.79442352,1.65304069 L2.89619408,1.64619408 L7.89619408,1.64619408 Z"
            transform="translate(5.396194, 4.896194) rotate(-45.000000) translate(-5.396194, -4.896194) "
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

const collapse = () => {
  const sidebarExpand = document.getElementById('sidebar-expand') as HTMLElement;
  const sidebarCollapase = document.getElementById('sidebar-callapse') as HTMLElement;

  const sidebar = document.getElementsByClassName('menu-content')[0] as HTMLElement;
  const main = document.getElementsByClassName('api-content')[0] as HTMLElement;
  const backgroundStub = document.getElementsByClassName('background-stub')[0] as HTMLElement;

  const firstVisibleElement: Element | null = findFirstVisibleElement(main);

  if (rightPanelWidth.endsWith('%')) {
    backgroundStub.style.width = rightPanelWidth;
  } else {
    const middleWidth = parseFloat(
      window.getComputedStyle(document.getElementsByClassName('middle-panel')[0] as HTMLElement)
        .width,
    );
    const rightWidth = parseFloat(rightPanelWidth);
    const percents = rightWidth / (middleWidth + rightWidth);
    backgroundStub.style.width = `calc(${rightPanelWidth} + ${percents} * ${sidebarWidth})`;
  }

  // hide sidebar, and set the width of api-content to 100%
  sidebarCollapase.style.display = 'none';
  sidebarExpand.style.display = 'inline';
  sidebar.style.display = 'none';
  main.style.width = '100%';

  // scrool to the first visible element
  if (firstVisibleElement) {
    const collapseOffset =
      (firstVisibleElement.getBoundingClientRect() as DOMRect).top + window.scrollY;
    window.scrollTo({ top: collapseOffset - 10 });
  }
};

const expand = () => {
  const sidebarExpand = document.getElementById('sidebar-expand') as HTMLElement;
  const sidebarCollapase = document.getElementById('sidebar-callapse') as HTMLElement;

  const sidebar = document.getElementsByClassName('menu-content')[0] as HTMLElement;
  const main = document.getElementsByClassName('api-content')[0] as HTMLElement;
  const backgroundStub = document.getElementsByClassName('background-stub')[0] as HTMLElement;

  const firstVisibleElement: Element | null = findFirstVisibleElement(main);

  if (rightPanelWidth.endsWith('%')) {
    const percents = parseInt(rightPanelWidth, 10);
    backgroundStub.style.width = `calc((100% - ${sidebarWidth}) * ${percents / 100})`;
  } else {
    backgroundStub.style.width = rightPanelWidth;
  }

  // show sidebar, and restore the width of api-content
  sidebarCollapase.style.display = 'inline';
  sidebarExpand.style.display = 'none';
  sidebar.style.display = 'flex';
  main.style.width = `calc(100% - ${sidebarWidth})`;

  // scroll to the first visible element
  if (firstVisibleElement) {
    const expandOffset =
      (firstVisibleElement.getBoundingClientRect() as DOMRect).top + window.scrollY;
    window.scrollTo({ top: expandOffset - 10 });
  }
};

// Try to find the first visible element in the current section or operation.
// Use the DOM content corresponding to the location hash instead of searching
// the entire document content to reduce the scope of the search.
// If current location hash is empty(in the page beginning), then find the first
// visible element in the whole container(api-content middle pannel).
function findFirstVisibleElement(container: Element): Element | null {
  const currentHash = decodeURI(window.location.hash);
  let sectionOrOperation: Element | null;
  if (currentHash === '') {
    sectionOrOperation = container;
  } else {
    sectionOrOperation = document.getElementById(currentHash.substring(1));
  }
  if (!sectionOrOperation) {
    console.error('Failed to find target with location hash: ' + currentHash.substring(1));
    return null;
  }

  const visibleEle = search(sectionOrOperation);
  if (visibleEle) {
    return visibleEle;
  }

  // Handling Cases:
  // The current location hash corresponds to a DOM content that has almost
  // entirely been scrolled above the viewport, except for the operation's
  // ending delimiter line at the bottom.
  const nextTarget = sectionOrOperation.nextElementSibling as Element;
  if (!nextTarget) {
    return visibleEle;
  }
  const nextVisibleEle = search(nextTarget);
  if (nextVisibleEle) {
    return nextVisibleEle;
  }
  return null;
}

// dfs search the first visible element in the section or operation
function search(parent: Element): Element | null {
  const children = Array.from(parent.children);
  let result: Element | null = null;

  // binary seach left boundary to find the first visible element
  function binarySearch(low: number, high: number): void {
    if (low > high) {
      return;
    }

    const mid = Math.floor((low + high) / 2);
    const child = children[mid] as Element;
    const rect: DOMRect = child.getBoundingClientRect();

    if (rect.bottom <= 0) {
      binarySearch(mid + 1, high);
    } else if (rect.top >= window.innerHeight) {
      binarySearch(low, mid - 1);
    } else {
      result = child;
      binarySearch(low, mid - 1);

      if (result === child && child.children.length > 0) {
        const closerChild = search(child);
        if (closerChild) result = closerChild;
      }
    }
  }

  binarySearch(0, children.length - 1);
  return result;
}
