'use client'

import { useState } from 'react'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'document' | 'image' | 'video' | 'audio'
  size?: string
  modified: string
  category: string
}

const sampleFiles: FileItem[] = [
  // Folders
  { id: '1', name: 'Sermons', type: 'folder', modified: '2024-01-15', category: 'sermons' },
  { id: '2', name: 'Events Photos', type: 'folder', modified: '2024-01-10', category: 'media' },
  { id: '3', name: 'Administrative', type: 'folder', modified: '2024-01-08', category: 'admin' },
  
  // Documents
  { id: '4', name: 'Church Constitution.pdf', type: 'document', size: '2.4 MB', modified: '2024-01-12', category: 'admin' },
  { id: '5', name: 'Sunday Service Bulletin.docx', type: 'document', size: '156 KB', modified: '2024-01-14', category: 'worship' },
  { id: '6', name: 'Budget Report 2024.xlsx', type: 'document', size: '890 KB', modified: '2024-01-09', category: 'finance' },
  
  // Media
  { id: '7', name: 'Christmas Service.mp4', type: 'video', size: '1.2 GB', modified: '2024-01-05', category: 'media' },
  { id: '8', name: 'Choir Practice.mp3', type: 'audio', size: '45 MB', modified: '2024-01-11', category: 'music' },
  { id: '9', name: 'Church Anniversary.jpg', type: 'image', size: '3.2 MB', modified: '2024-01-13', category: 'media' },
]

export default function FilesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const categories = [
    { id: 'all', name: 'All Files', count: sampleFiles.length },
    { id: 'sermons', name: 'Sermons', count: sampleFiles.filter(f => f.category === 'sermons').length },
    { id: 'admin', name: 'Administrative', count: sampleFiles.filter(f => f.category === 'admin').length },
    { id: 'media', name: 'Media', count: sampleFiles.filter(f => f.category === 'media').length },
    { id: 'worship', name: 'Worship', count: sampleFiles.filter(f => f.category === 'worship').length },
    { id: 'finance', name: 'Finance', count: sampleFiles.filter(f => f.category === 'finance').length },
  ]

  const filteredFiles = selectedCategory === 'all' 
    ? sampleFiles 
    : sampleFiles.filter(file => file.category === selectedCategory)

  const getFileIcon = (type: string) => {
    const icons = {
      folder: '📁',
      document: '📄',
      image: '🖼️',
      video: '🎥',
      audio: '🎵'
    }
    return icons[type as keyof typeof icons] || '📄'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">
            Files & Documents
          </h1>
          <p className="text-neutral-600">
            Manage your church files, documents, and media
          </p>
        </div>
        
        <div className="flex gap-4">
          {/* View Mode Toggle */}
          <div className="flex rounded-xl border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              List
            </button>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
            <span className="text-lg">📤</span>
            Upload Files
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Categories */}
        <div className="w-64">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Usage */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mt-6">
            <h3 className="font-semibold text-primary-900 mb-4">Storage</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Used</span>
                <span>2.8 GB of 10 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Upgrade Storage →
            </button>
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="flex-1">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-gentle transition-all cursor-pointer group"
                >
                  <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">
                    {getFileIcon(file.type)}
                  </div>
                  <h3 className="font-medium text-primary-900 text-center mb-2 truncate">
                    {file.name}
                  </h3>
                  <div className="text-sm text-gray-500 text-center space-y-1">
                    {file.size && <p>{file.size}</p>}
                    <p>{file.modified}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Size</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Modified</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(file => (
                    <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getFileIcon(file.type)}</span>
                          <span className="font-medium text-primary-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{file.size || '—'}</td>
                      <td className="py-4 px-6 text-gray-600">{file.modified}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}