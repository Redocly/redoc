import type { OpenAPIExternalDocumentation } from '../../types/index.js';

import { Markdown } from '../Markdown/index.js';
import { ExternalDocumentation } from '../ExternalDocumentation/index.js';

interface DescriptionProps {
  description?: string | GenericObject;
  externalDocs?: OpenAPIExternalDocumentation;
}
export function Description({ description, externalDocs }: DescriptionProps) {
  if (!description) return null;

  return (
    <>
      <Markdown source={description} />
      {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
    </>
  );
}
