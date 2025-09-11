import * as React from 'react';
import { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import styled from 'styled-components';
import { Loading } from '../../src';
import { Redoc } from '../../src/components/Redoc/Redoc';
import { AppStore } from '../../src/services/AppStore';
import { loadAndBundleSpec } from '../../src/utils/loadAndBundleSpec';

const API_SOURCES = [
  { name: 'Supergrid', url: '../swagger/sg/swagger.json' },
  { name: 'What If', url: '../swagger/t5/swagger.json' },
];

const RedocPlayground = () => {
  const [store, setStore] = useState<AppStore | null>(null);
  const [selectedApi, setSelectedApi] = useState(0);
  const [showDownloadButton, setShowDownloadButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const redocOptions = {
    hideDownloadButton: window.location.protocol === 'file:',
    theme: {
      colors: {
        primary: {
          main: '#37B5FF',
        },
      },
      typography: {
        fontWeightRegular: '400',
        fontWeightBold: '700',
        fontWeightLight: '300',
        fontFamily: '\'Open Sans\', sans-serif',
        headings: {
          fontFamily: '\'Open Sans\', sans-serif',
        },
      },
      menu: {
        backgroundColor: '#fff',
      },
      logo: {
        maxWidth: '150px',
        maxHeight: '60px',
        gutter: '10px 20px',
      },
      rightPanel: {
        textColor: '#000',
        headerTextColor: '#697386',
        backgroundColor: '#fff',
        tabPanelBackgroundColor: '#f5f5f5',
      },
      codeSample: {
        endpointBackgroundColor: '#59618d',
      },
      schema: {
        defaultDetailsWidth: '100%',
      },
    },
  };

  const loadApi = async (apiIndex: number) => {
    try {
      setLoading(true);
      if (store) { store.dispose(); }

      const specUrl = API_SOURCES[apiIndex].url;
      const spec = await loadAndBundleSpec(specUrl);
      const newStore = new AppStore(spec, specUrl, redocOptions);
      setStore(newStore);
    } catch (error) {
      console.error('Error loading API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.location.protocol === 'file:') {
      setShowDownloadButton(false);
    }
    loadApi(selectedApi);
  }, []);

  const handleApiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(e.target.value, 10);
    setSelectedApi(newIndex);
    loadApi(newIndex);
  };

  return (
    <div>
      <Header>
        {showDownloadButton && (
          <DownloadButton
            target="_blank"
            href="../Export/ExportApiDoc"
            className="download-button"
          >
            Download HTML Version
          </DownloadButton>
        )}
        <span style={{ marginLeft: '14px' }}>
          <label htmlFor="ApiSources">Tempus Api: </label>
          <select id="ApiSources" value={selectedApi} onChange={handleApiChange}>
            {API_SOURCES.map((api, index) => (
              <option key={index} value={index}>{api.name}</option>
            ))}
          </select>
        </span>
      </Header>

      <div id="redoc">
        {loading && (
          <Loading color={redocOptions.theme.colors.primary.main} />
          )}
        {!loading && store && <Redoc store={store} />}
      </div>
    </div>
  );
};

const Header = styled.div`
  text-align: right;
  height: 30px;
  padding: 19px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  line-height: 1.5em;
  font-size: 14px;
`;

const DownloadButton = styled.a`
  border: 1px solid rgb(55, 181, 255);
  color: rgb(55, 181, 255);
  font-weight: normal;
  margin-left: 0.5em;
  padding: 4px 8px;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`;

// Рендеринг
const renderRoot = () => {
  render(
    <AppContainer>
      <RedocPlayground />
    </AppContainer>,
    document.getElementById('example'),
  );
};

renderRoot();

// Hot Module Replacement
if (module.hot) {
  module.hot.accept(() => {
    renderRoot();
  });
}
