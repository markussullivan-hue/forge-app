// Ambient declarations for Vite's `?url` asset-import suffix. Allows
// `import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'` to
// type-check as a string without pulling in the whole vite/client triple-
// slash reference.

declare module '*?url' {
  const src: string
  export default src
}
