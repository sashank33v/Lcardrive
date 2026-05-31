'use client'
import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  url:  string
  name: string
}

export function ShareButton({ url, name }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const fullUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${url}`
      : url

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${name} — Driving Instructor | LCarDrive`,
          text:  `Check out ${name} on LCarDrive`,
          url:   fullUrl,
        })
        return
      } catch { /* user cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = fullUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share profile"
      className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
    >
      {copied
        ? <Check size={16} className="text-green-600" />
        : <Share2 size={16} className="text-gray-700" />
      }
    </button>
  )
}
