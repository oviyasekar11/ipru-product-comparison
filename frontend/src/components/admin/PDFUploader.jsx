import { useState, useRef, useCallback } from 'react'
import { Upload, File, CheckCircle2, XCircle, Loader2, Trash2, Eye, RefreshCw } from 'lucide-react'

const INSURERS = ['ICICI Prudential', 'HDFC Life', 'Max Life', 'SBI Life', 'Tata AIA', 'Bajaj Allianz', 'LIC', 'Other']
const CATEGORIES = ['Term', 'ULIP', 'Endowment', 'Whole Life', 'Child Plan', 'Retirement', 'Health Rider']

function FileRow({ file, onRemove }) {
  const statusMap = {
    pending:    { icon: Loader2, color: 'text-gray-400', label: 'Queued', spin: false },
    processing: { icon: Loader2, color: 'text-blue-500', label: 'Processing', spin: true },
    done:       { icon: CheckCircle2, color: 'text-green-500', label: 'Indexed', spin: false },
    error:      { icon: XCircle, color: 'text-red-500', label: 'Failed', spin: false },
  }
  const s = statusMap[file.status] || statusMap.pending
  const Icon = s.icon

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <File className="w-5 h-5 text-red-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">{file.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500">{file.insurer}</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500">{file.category}</span>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${s.color}`}>
        <Icon className={`w-4 h-4 ${s.spin ? 'animate-spin' : ''}`} />
        {s.label}
      </div>
      <button onClick={() => onRemove(file.id)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

let idCounter = 1

export default function PDFUploader() {
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [insurer, setInsurer] = useState('ICICI Prudential')
  const [category, setCategory] = useState('Term')
  const fileRef = useRef()

  const addFiles = useCallback((rawFiles) => {
    const newFiles = Array.from(rawFiles)
      .filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
      .map(f => ({
        id: idCounter++,
        name: f.name,
        size: f.size,
        status: 'pending',
        insurer,
        category,
        raw: f,
      }))
    setFiles(prev => [...prev, ...newFiles])
  }, [insurer, category])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const simulateProcessing = () => {
    setFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, status: 'processing' } : f))
    setTimeout(() => {
      setFiles(prev => prev.map(f =>
        f.status === 'processing' ? { ...f, status: Math.random() > 0.1 ? 'done' : 'error' } : f
      ))
    }, 2500)
  }

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const pendingCount = files.filter(f => f.status === 'pending').length
  const doneCount = files.filter(f => f.status === 'done').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Upload Product Brochures</h2>
        <p className="text-sm text-gray-500 mt-1">Upload PDF brochures to add them to the knowledge base. They will be automatically parsed and indexed.</p>
      </div>

      {/* Metadata selectors */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Insurer</label>
          <select
            value={insurer}
            onChange={e => setInsurer(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-ipru-blue/30"
          >
            {INSURERS.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-ipru-blue/30"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
          ${dragging
            ? 'border-ipru-orange bg-orange-50 scale-[1.01]'
            : 'border-gray-300 bg-gray-50 hover:border-ipru-blue hover:bg-blue-50'
          }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragging ? 'text-ipru-orange' : 'text-gray-400'}`} />
        <p className="text-sm font-semibold text-gray-700">
          {dragging ? 'Drop PDFs here' : 'Drag & drop PDFs here, or click to browse'}
        </p>
        <p className="text-xs text-gray-400 mt-1.5">PDF files only · No size limit</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">
              {files.length} file{files.length > 1 ? 's' : ''} · {doneCount} indexed
            </span>
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <button
                  onClick={simulateProcessing}
                  className="flex items-center gap-1.5 text-xs bg-ipru-blue text-white px-4 py-2 rounded-lg hover:bg-ipru-blue-light transition-colors font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Process {pendingCount} file{pendingCount > 1 ? 's' : ''}
                </button>
              )}
              <button
                onClick={() => setFiles([])}
                className="text-xs text-gray-400 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {files.map(f => <FileRow key={f.id} file={f} onRemove={removeFile} />)}
          </div>
        </div>
      )}
    </div>
  )
}
