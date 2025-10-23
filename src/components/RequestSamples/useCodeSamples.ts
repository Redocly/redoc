import { useAtomValue } from 'jotai';

import type { Unstable_ExternalCodeSample } from '../../services/index.js';
import type { OperationModel } from '../../models/index.js';
import type { OpenAPIXCodeSample } from '../../types/index.js';

import { getLangKey, languageAtom } from '../../jotai/app.js';

export function useCodeSamples({ payload, definitionSamples }: OperationModel): {
  samples: Array<
    {
      key: string;
      title: string;
    } & (Unstable_ExternalCodeSample | OpenAPIXCodeSample)
  >;
} {
  const { languages } = useAtomValue(languageAtom);
  const orderMap = new Map(languages?.map(({ key, order }) => [key, order]));

  const allCodeSamples = definitionSamples.filter((item) => orderMap.has(getLangKey(item)));

  const payloadLabel = languages?.find(({ lang }) => lang === payload?.lang)?.title;
  const payloadLabelKey = payload && getLangKey({ label: payloadLabel, lang: payload.lang });

  if (payload && payloadLabelKey && orderMap.has(payloadLabelKey)) {
    allCodeSamples.push({
      ...payload,
      label: payloadLabel,
    });
  }

  // Adding new properties for UI purposes and sort samples
  const samples = allCodeSamples
    .map((sample) => {
      const title = sample.label ?? sample.lang;
      return {
        key: getLangKey(sample),
        title,
        order:
          typeof orderMap.get(title.toLowerCase()) === 'number'
            ? (orderMap.get(title.toLowerCase()) as number)
            : 9999,
        ...sample,
      };
    })
    .sort((a, b) => a.order - b.order);

  return { samples };
}
