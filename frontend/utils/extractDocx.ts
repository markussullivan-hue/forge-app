// Minimal .docx text extractor.
//
// A .docx file is a ZIP archive. We only care about the entry named
// "word/document.xml" — the runs of body text live in <w:t> elements there.
//
// We avoid a ZIP/inflate library (jszip/pako are license-blocked here) and
// instead:
//   1. Locate the End-of-Central-Directory (EOCD) record by scanning the
//      tail of the file for its signature.
//   2. Walk the central directory entries, find "word/document.xml".
//   3. Jump to the local file header for that entry, skip past its variable-
//      length filename + extra-field bytes, then read the compressed data.
//   4. If compression method = 8 (DEFLATE) decompress via DecompressionStream;
//      method = 0 (stored) is used as-is.
//   5. Strip XML to plain text, preserving paragraph + tab boundaries.

const EOCD_SIG = 0x06054b50
const CDFH_SIG = 0x02014b50
const LFH_SIG = 0x04034b50

const decoder = new TextDecoder('utf-8')

function readUInt32LE(view: DataView, offset: number): number {
  return view.getUint32(offset, true)
}
function readUInt16LE(view: DataView, offset: number): number {
  return view.getUint16(offset, true)
}

function findEocd(view: DataView): number {
  // EOCD is at least 22 bytes; comment may extend it up to 22 + 0xFFFF.
  const maxBack = Math.min(view.byteLength, 22 + 0xffff)
  const start = view.byteLength - maxBack
  for (let i = view.byteLength - 22; i >= start; i--) {
    if (readUInt32LE(view, i) === EOCD_SIG) return i
  }
  return -1
}

type CentralEntry = {
  fileName: string
  compressionMethod: number
  compressedSize: number
  uncompressedSize: number
  localHeaderOffset: number
}

function readCentralDirectory(
  buf: ArrayBuffer,
  view: DataView,
  cdOffset: number,
  cdEntries: number,
): CentralEntry[] {
  const out: CentralEntry[] = []
  let p = cdOffset
  for (let i = 0; i < cdEntries; i++) {
    if (readUInt32LE(view, p) !== CDFH_SIG) break
    const compressionMethod = readUInt16LE(view, p + 10)
    const compressedSize = readUInt32LE(view, p + 20)
    const uncompressedSize = readUInt32LE(view, p + 24)
    const fileNameLength = readUInt16LE(view, p + 28)
    const extraLength = readUInt16LE(view, p + 30)
    const commentLength = readUInt16LE(view, p + 32)
    const localHeaderOffset = readUInt32LE(view, p + 42)
    const fileName = decoder.decode(new Uint8Array(buf, p + 46, fileNameLength))
    out.push({
      fileName,
      compressionMethod,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
    })
    p += 46 + fileNameLength + extraLength + commentLength
  }
  return out
}

async function inflateRaw(compressed: Uint8Array): Promise<Uint8Array> {
  // DecompressionStream is supported in all modern browsers (Chrome 80+,
  // Firefox 113+, Safari 16.4+). 'deflate-raw' matches the ZIP DEFLATE format
  // (no zlib header).
  const stream = new Blob([compressed as BlobPart]).stream().pipeThrough(
    new DecompressionStream('deflate-raw'),
  )
  const inflated = await new Response(stream).arrayBuffer()
  return new Uint8Array(inflated)
}

function xmlToText(xml: string): string {
  // <w:p> = paragraph, <w:br/> = line break, <w:tab/> = tab, <w:t>text</w:t>.
  // Replace structural elements with whitespace, strip remaining tags, decode
  // basic entities. This is intentionally simple — good enough for governance
  // documents where we only need readable plain text for the LLM.
  let out = xml
  out = out.replace(/<w:tab\b[^/>]*\/>/g, '\t')
  out = out.replace(/<w:br\b[^/>]*\/>/g, '\n')
  out = out.replace(/<\/w:p>/g, '\n')
  // Strip all remaining tags.
  out = out.replace(/<[^>]+>/g, '')
  // Decode common XML entities.
  out = out
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
  // Collapse triple-or-more newlines.
  out = out.replace(/\n{3,}/g, '\n\n')
  return out.trim()
}

export async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  const view = new DataView(buffer)
  const eocd = findEocd(view)
  if (eocd < 0) throw new Error('Not a valid .docx file (no ZIP end record found).')
  const cdEntries = readUInt16LE(view, eocd + 10)
  const cdOffset = readUInt32LE(view, eocd + 16)
  const entries = readCentralDirectory(buffer, view, cdOffset, cdEntries)
  const docEntry = entries.find((e) => e.fileName === 'word/document.xml')
  if (!docEntry) {
    throw new Error('This file does not look like a Word document (no word/document.xml).')
  }

  // Read local file header to find the actual data start.
  const lhOffset = docEntry.localHeaderOffset
  if (readUInt32LE(view, lhOffset) !== LFH_SIG) {
    throw new Error('Corrupt .docx — local file header signature missing.')
  }
  const lhFileNameLen = readUInt16LE(view, lhOffset + 26)
  const lhExtraLen = readUInt16LE(view, lhOffset + 28)
  const dataStart = lhOffset + 30 + lhFileNameLen + lhExtraLen
  const compressed = new Uint8Array(buffer, dataStart, docEntry.compressedSize)

  let xmlBytes: Uint8Array
  if (docEntry.compressionMethod === 0) {
    xmlBytes = compressed
  } else if (docEntry.compressionMethod === 8) {
    xmlBytes = await inflateRaw(compressed)
  } else {
    throw new Error(
      `Unsupported compression method (${docEntry.compressionMethod}) in .docx archive.`,
    )
  }
  const xml = decoder.decode(xmlBytes)
  return xmlToText(xml)
}
