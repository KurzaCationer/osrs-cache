import React, { useState } from 'react'
import JsonView from '@uiw/react-json-view'
import { Check, Copy } from 'lucide-react'
import { css } from './styled-system/css'

interface JsonViewerProps {
  value: any
  collapsed?: boolean | number
  keyName?: string | false
}

const customTheme = {
  '--w-rjv-font-family': 'inherit',
  '--w-rjv-color': '#f97316', // Orange for keys (using general color for now as key color)
  '--w-rjv-key-color': '#f97316',
  '--w-rjv-background-color': 'transparent',
  '--w-rjv-line-color': '#323232',
  '--w-rjv-arrow-color': '#94a3b8',
  
  '--w-rjv-curlybraces-color': '#94a3b8',
  '--w-rjv-colon-color': '#94a3b8',
  '--w-rjv-brackets-color': '#94a3b8',

  '--w-rjv-type-string-color': '#22c55e', // Green
  '--w-rjv-type-int-color': '#3b82f6',    // Blue
  '--w-rjv-type-float-color': '#3b82f6',  // Blue
  '--w-rjv-type-bigint-color': '#3b82f6', // Blue
  '--w-rjv-type-boolean-color': '#a855f7', // Purple
  '--w-rjv-type-null-color': '#64748b',    // Slate
  '--w-rjv-type-nan-color': '#ef4444',     // Red
  '--w-rjv-type-undefined-color': '#64748b',
  
  // Layout constraints
  maxHeight: '500px',
  overflow: 'auto',
  display: 'block',
} as React.CSSProperties

/**
 * A beautiful, collapsible JSON viewer with a copy-to-clipboard feature.
 */
export function JsonViewer({ value, collapsed = 1, keyName = false }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={css({ 
      position: 'relative', 
      bg: 'bg.muted', 
      rounded: 'lg', 
      p: '4',
      border: '1px solid',
      borderColor: 'border.subtle',
      fontSize: 'xs',
      fontFamily: 'mono',
      w: 'full',
      maxWidth: '100%',
    })}>
      <div className={css({ 
        position: 'absolute', 
        top: '2', 
        right: '2', 
        zIndex: 10 
      })}>
        <button
          onClick={handleCopy}
          className={css({
            p: '1.5',
            bg: 'bg.surface',
            border: '1px solid',
            borderColor: 'border.default',
            rounded: 'md',
            cursor: 'pointer',
            color: copied ? 'success.default' : 'text.muted',
            _hover: { bg: 'bg.active', color: 'text.main' },
            transition: 'all'
          })}
          title="Copy JSON"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      
      <JsonView 
        value={value} 
        collapsed={collapsed}
        keyName={keyName}
        displayDataTypes={false}
        displayObjectSize={true}
        enableClipboard={false} // We use our own custom button
        style={customTheme}
      />
    </div>
  )
}
