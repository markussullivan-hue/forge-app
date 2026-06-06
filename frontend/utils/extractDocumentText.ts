// Dispatch a browser `File` to the appropriate plain-text extractor.
//
// All extraction happens entirely in the user's browser — the file bytes
// never traverse the network. The returned string is what eventually gets
// sent to the governance review workflow (same path as if the user pasted
// the text into the textarea manually).

import { extractDocxText } from './extractDocx'
import { extractPdfText } from './extractPdf'

export type SupportedExtension = 'pdf' | 'docx' | 'txt' | 'md'
export const SUPPORTED_EXTENSIONS: SupportedExtension[] = ['pdf', 'docx', 'txt', 'md']
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10 MB

export type ExtractedDocument = {
  text: string
  characterCount: number
  wordCount: number
  extension: SupportedExtension
}

export function getExtension(fileName: string): string {
  const idx = fileName.lastIndexOf('.')
  return idx >= 0 ? fileName.slice(idx + 1).toLowerCase() : ''
}

export function isSupportedExtension(ext: string): ext is SupportedExtension {
  return (SUPPORTED_EXTENSIONS as string[]).includes(ext)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function countWords(s: string): number {
  const trimmed = s.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export async function extractDocumentText(file: File): Promise<ExtractedDocument> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `File is ${formatBytes(file.size)}; the limit is ${formatBytes(MAX_UPLOAD_BYTES)}.`,
    )
  }
  const ext = getExtension(file.name)
  if (!isSupportedExtension(ext)) {
    throw new Error(
      `Unsupported file type ".${ext || 'unknown'}". Upload a .pdf, .docx, .txt or .md file.`,
    )
  }

  let text = ''
  if (ext === 'txt' || ext === 'md') {
    text = await file.text()
  } else if (ext === 'pdf') {
    const buf = await file.arrayBuffer()
    text = await extractPdfText(buf)
  } else if (ext === 'docx') {
    const buf = await file.arrayBuffer()
    text = await extractDocxText(buf)
  }

  // Normalise CRLF and trim trailing whitespace per line.
  text = text.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim()

  if (!text) {
    throw new Error(
      'No readable text could be extracted from this file. It may be a scanned image, encrypted, or empty.',
    )
  }

  return {
    text,
    characterCount: text.length,
    wordCount: countWords(text),
    extension: ext,
  }
}
