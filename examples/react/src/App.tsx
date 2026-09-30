import { RedocStandalone } from 'redoc';

const CAFE =
  'https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml';

export function App() {
  return <RedocStandalone specUrl={CAFE} />;
}
