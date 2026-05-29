'use client'
import { useState, useRef } from 'react'
import { Upload, Download, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminImportPage() {
  const [file, setFile]         = useState<File | null>(null)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef                = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) {
      alert('Please upload a .csv file only')
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res  = await fetch('/api/admin/import', { method: 'POST', body: formData })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: 'Upload failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csv = `first_name,last_name,suburb,postcode,state,phone,adi_registration,licence_types,transmission
Sarah,Mitchell,Footscray,3011,VIC,0412345001,ADI123001,car,auto
James,Pham,Sunshine,3020,VIC,0412345002,ADI123002,car,manual
Priya,Sharma,Coburg,3058,VIC,0412345003,ADI123003,car,auto
Michael,Chen,Werribee,3030,VIC,0412345004,ADI123004,"car,motorbike",both`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'lcardrive_import_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CSV Bulk Import</h1>
          <p className="text-gray-500 text-sm mt-1">Import multiple instructor listings at once</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download size={15} /> Download Template
        </button>
      </div>

      {/* CSV Format Guide */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
        <p className="text-sm font-semibold text-blue-800 mb-2">Required CSV columns:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {['first_name','last_name','suburb','postcode','state','phone','adi_registration','licence_types','transmission'].map(col => (
            <code key={col} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
              {col}
            </code>
          ))}
        </div>
        <p className="text-xs text-blue-600 mt-2">
          licence_types: car, motorbike, truck, bus (comma-separated) · transmission: auto, manual, both
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors mb-4 ${
          dragOver ? 'border-[#1A3CFF] bg-blue-50' : 'border-gray-200 hover:border-[#1A3CFF] hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Upload size={36} className="text-gray-300 mx-auto mb-3" />
        {file ? (
          <div>
            <p className="font-semibold text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-gray-700">Drop your CSV file here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse</p>
          </div>
        )}
      </div>

      {/* Import button */}
      {file && !loading && !result && (
        <button
          onClick={handleImport}
          className="w-full bg-[#1A3CFF] text-white font-semibold py-4 rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Upload size={18} /> Import {file.name}
        </button>
      )}

      {loading && (
        <div className="w-full bg-[#1A3CFF] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" /> Importing... please wait
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-4">
          {result.error ? (
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={24} />
              <p className="font-semibold">{result.error}</p>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-gray-900 text-lg mb-4">Import Complete</h3>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <CheckCircle size={24} className="text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-green-700">{result.imported}</p>
                  <p className="text-xs text-green-600">Imported</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <AlertCircle size={24} className="text-yellow-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-yellow-700">{result.skipped}</p>
                  <p className="text-xs text-yellow-600">Skipped</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <XCircle size={24} className="text-red-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-red-700">{result.errors?.length ?? 0}</p>
                  <p className="text-xs text-red-600">Errors</p>
                </div>
              </div>

              {result.errors?.length > 0 && (
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-700 mb-2">Errors:</p>
                  <ul className="space-y-1">
                    {result.errors.map((e: string, i: number) => (
                      <li key={i} className="text-xs text-red-600">• {e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => { setFile(null); setResult(null) }}
                className="w-full mt-4 border-2 border-[#1A3CFF] text-[#1A3CFF] font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Import Another File
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
