// Renders field guidance (help text + optional ChatGPT/Claude prompt) from
// the central FIELD_GUIDANCE map. Drop <FieldGuidance id="<stateKey>" />
// under any wizard field. Renders nothing if the id has no entry.
//
// The ChatGPT/Claude links pre-fill the suggested prompt via each provider's
// ?q= URL parameter. ChatGPT supports this natively; Claude supports it but
// has toggled it off before, so the prompt is also shown with a Copy button
// as a guaranteed fallback.

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { FIELD_GUIDANCE } from './fieldGuidance'

const buildChatGptUrl = (prompt: string) =>
  `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`

const buildClaudeUrl = (prompt: string) =>
  `https://claude.ai/new?q=${encodeURIComponent(prompt)}`

export function FieldGuidance({ id }: { id: string }) {
  const g = FIELD_GUIDANCE[id]
  const [copied, setCopied] = useState(false)
  if (!g) return null

  const copyPrompt = async () => {
    if (!g.prompt) return
    try {
      await navigator.clipboard.writeText(g.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable — the prompt is still shown for manual copy.
    }
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{g.help}</p>

      {g.prompt ? (
        <div className="text-xs text-muted-foreground">
          <span>Need ideas? Open </span>
          <a
            className="underline hover:text-foreground"
            href={buildChatGptUrl(g.prompt)}
            target="_blank"
            rel="noopener noreferrer"
          >
            ChatGPT
          </a>
          <span> or </span>
          <a
            className="underline hover:text-foreground"
            href={buildClaudeUrl(g.prompt)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Claude
          </a>
          <span> with this prompt:</span>
          <div className="mt-1 flex items-start gap-2">
            <span className="italic">“{g.prompt}”</span>
            <button
              type="button"
              onClick={copyPrompt}
              aria-label="Copy suggested prompt"
              className="inline-flex shrink-0 items-center gap-1 underline hover:text-foreground"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
