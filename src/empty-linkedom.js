// Browser-bundle stub for `linkedom` (see vite.config.ts).
// The real module is only needed in the `typeof window === 'undefined'` branch
// of src/adapters/utils/dompurify.ts; the tsgo build keeps the real import
// for the portal's Node/SSR path. Must be a named export — rollup hard-errors on
// missing named exports.
export const parseHTML = () => {
  throw new Error('linkedom is not available in browser bundles');
};
