import { useCallback, useEffect, useMemo, useState } from 'react';
import { load as loadYaml } from 'js-yaml';

import DemoNav from './DemoNav';
import Loader from './Loader';
import RedocStandalone from './RedocStandalone';
import { DEFAULT_SPEC } from './specs';

const BASE_URL = import.meta.env.BASE_URL;
const BASE_PATH = BASE_URL.replace(/\/$/, '') || '/';
const PAGE_BASE = new URL(BASE_URL, window.location.origin);
const CORS_PROXY = 'https://cors.redoc.ly/';

if (window.location.pathname === BASE_URL && BASE_PATH !== '/') {
  window.history.replaceState(
    undefined,
    '',
    BASE_PATH + window.location.search + window.location.hash,
  );
}

const STORAGE_KEY = 'redoc-demo-spec';

type StoredSpec = { kind: 'url'; url: string } | { kind: 'upload'; name: string; spec: object };

function isValidSpecUrl(url: string) {
  try {
    new URL(url, PAGE_BASE);
    return true;
  } catch {
    return false;
  }
}

function readStoredSpec(): StoredSpec | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSpec;
    if (parsed?.kind === 'url' && typeof parsed.url === 'string' && isValidSpecUrl(parsed.url)) {
      return parsed;
    }
    if (
      parsed?.kind === 'upload' &&
      typeof parsed.name === 'string' &&
      typeof parsed.spec === 'object' &&
      parsed.spec
    ) {
      return parsed;
    }
  } catch {}
  return null;
}

function saveStoredSpec(value: StoredSpec) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

type InitialSpec = { specUrl: string; uploadedSpec: object | null; uploadedName: string };

function getInitialSpec(): InitialSpec {
  const url = new URLSearchParams(window.location.search).get('url');
  if (url && isValidSpecUrl(url)) {
    return { specUrl: url, uploadedSpec: null, uploadedName: '' };
  }
  const stored = readStoredSpec();
  if (stored?.kind === 'url') {
    return { specUrl: stored.url, uploadedSpec: null, uploadedName: '' };
  }
  if (stored?.kind === 'upload') {
    return { specUrl: '', uploadedSpec: stored.spec, uploadedName: stored.name };
  }
  return { specUrl: DEFAULT_SPEC, uploadedSpec: null, uploadedName: '' };
}

function initialCors() {
  return !new URLSearchParams(window.location.search).has('nocors');
}

function buildSearch(specUrl: string, cors: boolean) {
  const params = new URLSearchParams();
  if (specUrl && specUrl !== DEFAULT_SPEC) params.set('url', specUrl);
  if (!cors) params.set('nocors', '');
  const search = params.toString();
  return search ? '?' + search : '';
}

function App() {
  const [initial] = useState(getInitialSpec);
  const [specUrl, setSpecUrl] = useState(initial.specUrl);
  const [uploadedSpec, setUploadedSpec] = useState<object | null>(initial.uploadedSpec);
  const [uploadedName, setUploadedName] = useState(initial.uploadedName);
  const [cors, setCors] = useState(initialCors);
  const [settledSpec, setSettledSpec] = useState<string | object | null>(null);

  const navValue = uploadedSpec ? uploadedName : specUrl === DEFAULT_SPEC ? '' : specUrl;

  const spec = useMemo(() => {
    if (uploadedSpec) return uploadedSpec;
    const absolute = new URL(specUrl, PAGE_BASE);
    if (specUrl !== DEFAULT_SPEC && cors && absolute.origin !== window.location.origin) {
      return CORS_PROXY + absolute.href;
    }
    return absolute.href;
  }, [uploadedSpec, specUrl, cors]);

  const loading = spec !== settledSpec;
  const handleSettled = useCallback(() => setSettledSpec(spec), [spec]);

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const url = params.get('url');
      if (!url || !isValidSpecUrl(url)) return;
      setCors(!params.has('nocors'));
      setUploadedSpec(null);
      setUploadedName('');
      setSpecUrl(url);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleUrlChange = useCallback(
    (url: string) => {
      if (!isValidSpecUrl(url)) {
        alert('This is not a valid spec URL: ' + url);
        return;
      }
      setUploadedSpec(null);
      setUploadedName('');
      setSpecUrl(url);
      saveStoredSpec({ kind: 'url', url });
      window.history.pushState(undefined, '', BASE_PATH + buildSearch(url, cors));
    },
    [cors],
  );

  const handleUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        let parsed: unknown;
        try {
          parsed = loadYaml(reader.result as string);
        } catch (err) {
          alert('Could not parse the file as YAML/JSON: ' + (err as Error).message);
          return;
        }
        if (!parsed || typeof parsed !== 'object') {
          alert('The file must contain a YAML or JSON object, got: ' + typeof parsed);
          return;
        }
        setSpecUrl('');
        setUploadedSpec(parsed);
        setUploadedName(file.name);
        saveStoredSpec({ kind: 'upload', name: file.name, spec: parsed });
        window.history.pushState(undefined, '', BASE_PATH + buildSearch('', cors));
      };
      reader.onerror = () => alert('Could not read the file: ' + file.name);
      reader.readAsText(file);
    },
    [cors],
  );

  const handleCorsChange = useCallback(
    (checked: boolean) => {
      setCors(checked);
      window.history.pushState(
        undefined,
        '',
        window.location.pathname +
          buildSearch(uploadedSpec ? '' : specUrl, checked) +
          window.location.hash,
      );
    },
    [uploadedSpec, specUrl],
  );

  return (
    <>
      <DemoNav
        defaultSpec={DEFAULT_SPEC}
        value={navValue}
        cors={cors}
        onUrlChange={handleUrlChange}
        onUpload={handleUpload}
        onCorsChange={handleCorsChange}
      />
      {loading && <Loader />}
      <RedocStandalone spec={spec} basePath={BASE_PATH} onSettled={handleSettled} />
    </>
  );
}

export default App;
