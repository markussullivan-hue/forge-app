// PDF text extraction via pdfjs-dist.
//
// We import the worker as a URL (Vite ?url asset import). This bundles the
// worker file as a same-origin static asset so it satisfies the strict
// `worker-src 'self'` Content-Security-Policy applied to published Retool
// apps.

import * as pdfjsLib from 'pdfjs-dist'
// eslint-disable-next-line import/no-unresolved
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl as string

type TextItem = { str: string; hasEOL?: boolean }

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
  const pdf = await loadingTask.promise
  try {
    const pages: string[] = []
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const content = await page.getTextContent()
      const items = content.items as TextItem[]
      // pdf.js gives us positioned text fragments. Join with spaces; insert
      // newlines where the layout flagged an end-of-line so paragraphs survive.
      let pageText = ''
      for (const item of items) {
        if (typeof item.str === 'string') pageText += item.str
        if (item.hasEOL) pageText += '\n'
        else pageText += ' '
      }
      pages.push(pageText.replace(/[ \t]+\n/g, '\n').trim())
      page.cleanup()
    }
    return pages.join('\n\n').replace(/\n{3,}/g, '\n\n').trim()
  } finally {
    await pdf.destroy()
  }
}
