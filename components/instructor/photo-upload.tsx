'use client'
import { useState, useRef } from 'react'
import { Camera, Loader2, Upload } from 'lucide-react'
import Image from 'next/image'

interface Props {
  currentPhoto?: string | null
  onUploaded?: (url: string) => void
}

export function PhotoUpload({ currentPhoto, onUploaded }: Props) {
  const [preview, setPreview]   = useState<string | null>(currentPhoto || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const inputRef                = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError('')

    // Client-side validation
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB')
      return
    }

    // Show instant preview
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('photo', file)

      const res  = await fetch('/api/portal/photo', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
        setPreview(currentPhoto || null)
        return
      }

      setPreview(data.url)
      onUploaded?.(data.url)
    } catch {
      setError('Upload failed. Please try again.')
      setPreview(currentPhoto || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {/* Photo preview circle */}
      <div className="relative">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
          {preview ? (
            <Image src={preview} alt="Profile" width={96} height={96} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera size={28} className="text-gray-300" />
            </div>
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
            <Loader2 size={24} className="text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload button + info */}
      <div className="flex-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:border-[#1A3CFF] hover:text-[#1A3CFF] transition-colors disabled:opacity-50"
        >
          <Upload size={15} />
          {uploading ? 'Uploading...' : preview ? 'Change photo' : 'Upload photo'}
        </button>
        <p className="text-xs text-gray-400 mt-1.5">JPEG, PNG or WebP · Max 2MB · Square recommended</p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  )
}
