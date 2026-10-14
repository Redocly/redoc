import { useEffect, useRef, useState } from 'react';

import { SPEC_OPTIONS } from './specs';

type DemoNavProps = {
  defaultSpec: string;
  value: string;
  cors: boolean;
  onUrlChange: (url: string) => void;
  onUpload: (file: File) => void;
  onCorsChange: (checked: boolean) => void;
};

export default function DemoNav({
  defaultSpec,
  value,
  cors,
  onUrlChange,
  onUpload,
  onCorsChange,
}: DemoNavProps) {
  const [inputValue, setInputValue] = useState(value);
  const [committedValue, setCommittedValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const blurTimeout = useRef<number>(undefined);

  if (value !== committedValue) {
    setCommittedValue(value);
    setInputValue(value);
  }

  useEffect(() => () => window.clearTimeout(blurTimeout.current), []);

  const selectUrl = (url: string) => {
    setInputValue(url === defaultSpec ? '' : url);
    onUrlChange(url);
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  return (
    <nav className="demo-nav">
      <div className="logo-wrapper">
        <a href={import.meta.env.BASE_URL} className="logo" aria-label="Redoc demo home">
          <svg
            viewBox="0 0 21.8182 21.8182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Redoc logo"
          >
            <path
              d="M16.8835 15.9588C19.7898 14.6506 21.8182 11.7315 21.8182 8.34588C21.8182 3.74361 18.0746 0 13.4723 0H3.21733C1.4446 0 0 1.4446 0 3.21733V18.6009C0 20.3736 1.4446 21.8182 3.21733 21.8182H18.1918C18.9695 21.8182 19.6364 21.3729 19.9325 20.6548C20.2308 19.9368 20.0732 19.1506 19.5256 18.6009L16.8835 15.9588ZM3.21733 1.30824H13.4723C17.3523 1.30824 20.5099 4.46591 20.5099 8.34588C20.5099 11.38 18.5774 13.9709 15.88 14.9531L6.24503 5.31605C6.12145 5.1946 5.95313 5.12429 5.78267 5.12429H3.21733C2.16477 5.12429 1.30824 4.26989 1.30824 3.2152C1.30824 2.16264 2.16477 1.30824 3.21733 1.30824ZM18.7244 20.1541C18.6903 20.2372 18.5497 20.5099 18.1918 20.5099H3.21733C2.16477 20.5099 1.30824 19.6534 1.30824 18.6009V5.80611C1.84304 6.20028 2.50568 6.43466 3.21733 6.43466H5.51207L18.6009 19.5234C18.8523 19.7791 18.7585 20.0689 18.7244 20.1541Z"
              fill="#1677FF"
            />
            <path
              d="M18.7244 20.1541C18.6903 20.2372 18.5497 20.5099 18.1918 20.5099H3.21733C2.16477 20.5099 1.30824 19.6534 1.30824 18.6009V5.80611C1.84304 6.20028 2.50568 6.43466 3.21733 6.43466H5.51207L18.6009 19.5234C18.8523 19.7791 18.7585 20.0689 18.7244 20.1541Z"
              fill="#1677FF"
            />
            <path
              d="M3.21733 1.30824H13.4723C17.3523 1.30824 20.5099 4.46591 20.5099 8.34588C20.5099 11.38 18.5774 13.9709 15.88 14.9531L6.24503 5.31605C6.12145 5.1946 5.95313 5.12429 5.78267 5.12429H3.21733C2.16477 5.12429 1.30824 4.26989 1.30824 3.2152C1.30824 2.16264 2.16477 1.30824 3.21733 1.30824Z"
              fill="#99CDFF"
            />
            <path
              d="M3.11716 14.0731H9.44529C9.8075 14.0731 10.0994 13.7812 10.0994 13.419C10.0994 13.0568 9.8075 12.7628 9.44529 12.7628H3.11716C2.75495 12.7628 2.46304 13.0568 2.46304 13.419C2.46304 13.7812 2.75495 14.0731 3.11716 14.0731Z"
              fill="#99CDFF"
            />
            <path
              d="M3.11716 11.4545H7.04401C7.40622 11.4545 7.70026 11.1626 7.70026 10.8004C7.70026 10.4382 7.40622 10.1463 7.04401 10.1463H3.11716C2.75495 10.1463 2.46304 10.4382 2.46304 10.8004C2.46304 11.1626 2.75495 11.4545 3.11716 11.4545Z"
              fill="#99CDFF"
            />
            <path
              d="M12.0639 15.3814H3.11716C2.75495 15.3814 2.46304 15.6733 2.46304 16.0355C2.46304 16.3977 2.75495 16.6918 3.11716 16.6918H12.0639C12.4261 16.6918 12.718 16.3977 12.718 16.0355C12.718 15.6733 12.424 15.3814 12.0639 15.3814Z"
              fill="#99CDFF"
            />
          </svg>
        </a>
      </div>
      <div className="controls">
        <div className="spec-picker">
          <div className={open ? 'combobox open' : 'combobox'}>
            <input
              ref={inputRef}
              value={inputValue}
              placeholder="Paste a spec URL or upload a file"
              autoComplete="off"
              spellCheck={false}
              role="combobox"
              aria-label="Spec URL"
              aria-expanded={open}
              aria-controls="spec-options"
              aria-autocomplete="list"
              aria-activedescendant={
                open && activeIndex >= 0 ? 'spec-option-' + activeIndex : undefined
              }
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => {
                window.clearTimeout(blurTimeout.current);
                setOpen(true);
              }}
              onBlur={() => {
                blurTimeout.current = window.setTimeout(close, 150);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  const delta = e.key === 'ArrowDown' ? 1 : -1;
                  setOpen(true);
                  setActiveIndex(
                    (index) => (index + delta + SPEC_OPTIONS.length) % SPEC_OPTIONS.length,
                  );
                } else if (e.key === 'Escape') {
                  close();
                } else if (e.key === 'Enter') {
                  const active = open && activeIndex >= 0 ? SPEC_OPTIONS[activeIndex] : undefined;
                  const url = active ? active.value : inputValue.trim();
                  if (!url) return;
                  close();
                  inputRef.current?.blur();
                  selectUrl(url);
                }
              }}
            />
            <button
              className="arrow"
              type="button"
              aria-label="Toggle examples list"
              aria-expanded={open}
              aria-controls="spec-options"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setOpen((wasOpen) => {
                  if (!wasOpen) inputRef.current?.focus();
                  return !wasOpen;
                });
                setActiveIndex(-1);
              }}
            >
              <svg
                viewBox="0 0 7.5 4.275"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.75 4.275L0 0.525L0.525 0L3.75 3.225L6.975 0L7.5 0.525L3.75 4.275Z"
                  fill="#3B3C45"
                />
              </svg>
            </button>
            <ul id="spec-options" role="listbox" aria-label="Example specs">
              {SPEC_OPTIONS.map((opt, index) => (
                <li
                  key={opt.value}
                  id={'spec-option-' + index}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    close();
                    selectUrl(opt.value);
                  }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
          <button
            className="upload-btn"
            type="button"
            aria-label="Upload file"
            data-tooltip="Upload file"
            onClick={() => uploadRef.current?.click()}
          >
            <svg
              viewBox="0 0 10.5 12.25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M0.875 7L1.49187 7.61687L4.8125 4.30062V12.25H5.6875V4.30062L9.00813 7.61687L9.625 7L5.25 2.625L0.875 7Z"
                fill="currentColor"
              />
              <path
                d="M0.875 2.625V0.875H9.625V2.625H10.5V0.875C10.5 0.642936 10.4078 0.420376 10.2437 0.256281C10.0796 0.0921872 9.85706 0 9.625 0H0.875C0.642936 0 0.420376 0.0921872 0.256281 0.256281C0.0921873 0.420376 0 0.642936 0 0.875V2.625H0.875Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <input
            ref={uploadRef}
            type="file"
            style={{ display: 'none' }}
            accept=".yaml,.yml,.json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setInputValue(file.name);
                onUpload(file);
              }
              e.target.value = '';
            }}
          />
        </div>
        <div className="cors-toggle">
          <input
            id="cors_checkbox"
            type="checkbox"
            checked={cors}
            onChange={(e) => onCorsChange(e.currentTarget.checked)}
          />
          <label htmlFor="cors_checkbox">Cors</label>
          <span
            className="cors-info tooltip-wide"
            tabIndex={0}
            data-tooltip="Cross-origin specs load through a proxy (on by default). Turn this off to fetch directly from the source server."
            aria-label="Cross-origin specs load through a proxy (on by default). Turn this off to fetch directly from the source server."
          >
            <svg
              viewBox="0 0 12.25 12.25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6.5625 8.75V5.25H4.8125V6.125H5.6875V8.75H4.375V9.625H7.875V8.75H6.5625Z"
                fill="#555761"
              />
              <path
                d="M6.125 2.625C5.99521 2.625 5.86833 2.66349 5.76041 2.7356C5.65249 2.80771 5.56838 2.9102 5.51871 3.03011C5.46904 3.15003 5.45604 3.28198 5.48136 3.40928C5.50668 3.53658 5.56919 3.65351 5.66097 3.74528C5.75274 3.83706 5.86967 3.89957 5.99697 3.92489C6.12427 3.95021 6.25622 3.93722 6.37614 3.88754C6.49605 3.83787 6.59854 3.75376 6.67065 3.64584C6.74276 3.53792 6.78125 3.41104 6.78125 3.28125C6.78125 3.10721 6.71211 2.94028 6.58904 2.81721C6.46597 2.69414 6.29904 2.625 6.125 2.625Z"
                fill="#555761"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.125 12.25C2.74251 12.25 0 9.50749 0 6.125C0 2.74251 2.74251 0 6.125 0C9.50749 0 12.25 2.74251 12.25 6.125C12.25 9.50749 9.50749 12.25 6.125 12.25ZM6.125 11.375C3.22576 11.375 0.875 9.02424 0.875 6.125C0.875 3.22576 3.22576 0.875 6.125 0.875C9.02424 0.875 11.375 3.22576 11.375 6.125C11.375 9.02424 9.02424 11.375 6.125 11.375Z"
                fill="#555761"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="github-wrapper">
        <iframe
          title="Star Redocly/redoc on GitHub"
          src="https://ghbtns.com/github-btn.html?user=Redocly&repo=redoc&type=star&count=true&size=large"
          frameBorder="0"
          scrolling="0"
          width="160px"
          height="30px"
        />
      </div>
    </nav>
  );
}
