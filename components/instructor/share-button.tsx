'use client'
import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface Props {
  url: string
  name: string
}

export function ShareButton({ url, name }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

    // Try native share first (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${name} — Driving Instructor | LCarDrive`,
          text: `Check out ${name}, a driving instructor on LCarDrive`,
          url: fullUrl,
        })
        return
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Final fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = fullUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
      aria-label="Share profile"
    >
      {copied ? (
        <Check size={16} className="text-green-600" />
      ) : (
        <Share2 size={16} className="text-gray-700" />
      )}
    </button>
  )
}
