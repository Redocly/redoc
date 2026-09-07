/* tslint:disable:no-implicit-dependencies */
import { mount } from 'enzyme';
import * as React from 'react';

// Import through the barrel first: importing the leaf modules directly hits a
// circular-import cycle via common-elements/index.
import { JsonViewer, SourceCode } from '../';
import { CallbackTitle } from '../Callbacks/CallbackTitle';
import { Extensions } from '../Fields/Extensions';
import { RequiredScopesRow } from '../SecurityRequirement/RequiredScopesRow';
import { OAuthFlow } from '../SecurityRequirement/OAuthFlow';
import { ConstraintsView } from '../Fields/FieldConstraints';
import { OptionsProvider } from '../OptionsProvider';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';
import {
  ConstraintItem,
  ExampleValue,
  PatternLabel,
  RecursiveLabel,
  TypeName,
  TypePrefix,
  TypeTitle,
} from '../../common-elements/fields';
import { withTheme } from '../testProviders';

const html = (node: React.ReactElement) => mount(withTheme(node)).html();

// Elements whose text is derived from the spec: type keywords, patterns,
// example/default/enum values. These must never be machine-translated.
describe('translate="no" on code-sensitive renderings', () => {
  it('marks schema type names', () => {
    expect(html(<TypeName>string</TypeName>)).toContain('translate="no"');
  });

  it('marks schema patterns', () => {
    expect(html(<PatternLabel>^[a-z]+$</PatternLabel>)).toContain('translate="no"');
  });

  it('marks example and default values', () => {
    expect(html(<ExampleValue>{'"abc"'}</ExampleValue>)).toContain('translate="no"');
  });

  it('marks highlighted code samples', () => {
    // Covers request samples (curl/JS/Python) and every non-JSON example.
    expect(html(<SourceCode lang="bash" source="curl -X GET /pets" />)).toContain('translate="no"');
  });

  it('marks the JSON sample container', () => {
    const out = html(<JsonViewer data={{ a: 1 }} />);
    expect(out).toContain('class="redoc-json" translate="no"');
  });

  it('marks OAuth scope names', () => {
    expect(html(<RequiredScopesRow scopes={['write:pets']} />)).toContain(
      '<code translate="no">write:pets</code>',
    );
  });

  it('marks OAuth flow type and URLs', () => {
    const out = html(
      <OAuthFlow
        type="authorizationCode"
        flow={{ authorizationUrl: 'https://e.x/auth', tokenUrl: 'https://e.x/token' } as any}
      />,
    );
    expect(out).toContain('<code translate="no">authorizationCode </code>');
    expect(out).toContain('https://e.x/token');
    expect(out.match(/<code translate="no"/g)!.length).toBeGreaterThanOrEqual(3);
  });

  it('marks the HTTP verb and the callback name', () => {
    const out = html(<CallbackTitle name="{$request.body#/callbackUrl}" httpVerb="post" />);
    expect(out.match(/translate="no"/g)!.length).toBe(2);
    expect(out).toContain('{$request.body#/callbackUrl}');
  });

  it('marks x- extension names and their values', () => {
    // Extensions only render when showExtensions is on.
    const out = mount(
      withTheme(
        <OptionsProvider value={new RedocNormalizedOptions({ showExtensions: true })}>
          <Extensions extensions={{ 'x-internal-id': 'abc' }} />
        </OptionsProvider>,
      ),
    ).html();
    expect(out).toContain('internal-id');
    // Both the extension key and its value are marked.
    expect(out.match(/translate="no"/g)!.length).toBe(2);
  });
});

// Redoc-authored UI prose. `humanizeConstraints()` produces English strings such
// as "non-empty" and ">= 5 characters"; schema titles and "Array of" are author
// or label text. All of these must stay translatable.
describe('prose stays translatable', () => {
  it('does not mark humanized constraints', () => {
    expect(html(<ConstraintItem>non-empty</ConstraintItem>)).not.toContain('translate=');
    expect(html(<ConstraintsView constraints={['non-empty', '>= 5 characters']} />)).not.toContain(
      'translate=',
    );
  });

  it('does not mark the type prefix, schema title, or recursive label', () => {
    expect(html(<TypePrefix>Array of </TypePrefix>)).not.toContain('translate=');
    expect(html(<TypeTitle>Pet</TypeTitle>)).not.toContain('translate=');
    expect(html(<RecursiveLabel>recursive</RecursiveLabel>)).not.toContain('translate=');
  });
});
