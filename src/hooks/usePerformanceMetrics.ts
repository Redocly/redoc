import { onCLS, onLCP, onFCP, onTTFB } from 'web-vitals';

import { useMount } from '@redocly/theme/core/openapi';

interface WebVitals {
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time To First Byte
}

type PerformanceMetricsProps = {
  setAtom: (data: Record<string, any>) => void;
};

export function usePerformanceMetrics({ setAtom }: PerformanceMetricsProps) {
  useMount(() => {
    const metricsTracker = {} as WebVitals;

    const metricsPromises = [
      new Promise((resolve) => onCLS((metric) => resolve({ name: 'cls', value: metric.value }))),
      new Promise((resolve) => onLCP((metric) => resolve({ name: 'lcp', value: metric.value }))),
      new Promise((resolve) => onFCP((metric) => resolve({ name: 'fcp', value: metric.value }))),
      new Promise((resolve) => onTTFB((metric) => resolve({ name: 'ttfb', value: metric.value }))),
    ];

    Promise.allSettled(metricsPromises).then((results) => {
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { name, value } = result.value as { name: keyof WebVitals; value: number };
          metricsTracker[name] = Math.round(value);
        }
      });

      setAtom(metricsTracker);
    });
  });
}
