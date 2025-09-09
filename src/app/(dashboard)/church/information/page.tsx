'use client'

import { useState } from 'react'

interface InfoSection {
  id: string
  title: string
  icon: string
  description: string
  fields: InfoField[]
}

interface InfoField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'email' | 'phone' | 'url' | 'date'
  value: string
  required?: boolean
}

export default function ChurchInformationPage() {
  const [editMode, setEditMode] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const infoSections: InfoSection[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: '🏛️',
      description: 'Core church details and contact information',
      fields: [
        { id: 'name', label: 'Church Name', type: 'text', value: 'Grace Community Church', required: true },
        { id: 'denomination', label: 'Denomination', type: 'text', value: 'Non-denominational' },
        { id: 'founded', label: 'Founded', type: 'date', value: '1985-06-15' },
        { id: 'website', label: 'Website', type: 'url', value: 'https://gracecommunitychurch.org' },
        { id: 'email', label: 'Main Email', type: 'email', value: 'info@gracecommunitychurch.org' },
        { id: 'phone', label: 'Phone Number', type: 'phone', value: '+1 (555) 123-4567' },
      ]
    },
    {
      id: 'address',
      title: 'Address & Location',
      icon: '📍',
      description: 'Physical address and location details',
      fields: [
        { id: 'street', label: 'Street Address', type: 'text', value: '123 Faith Avenue' },
        { id: 'city', label: 'City', type: 'text', value: 'Harmony' },
        { id: 'state', label: 'State/Province', type: 'text', value: 'CA' },
        { id: 'zip', label: 'ZIP/Postal Code', type: 'text', value: '12345' },
        { id: 'country', label: 'Country', type: 'text', value: 'United States' },
        { id: 'directions', label: 'Driving Directions', type: 'textarea', value: 'Located on the corner of Faith Ave and Hope Street, next to the community center.' },
      ]
    },
    {
      id: 'leadership',
      title: 'Leadership Team',
      icon: '👥',
      description: 'Pastor and key leadership information',
      fields: [
        { id: 'senior_pastor', label: 'Senior Pastor', type: 'text', value: 'Rev. John Smith' },
        { id: 'associate_pastor', label: 'Associate Pastor', type: 'text', value: 'Pastor Sarah Johnson' },
        { id: 'worship_leader', label: 'Worship Leader', type: 'text', value: 'Michael Chen' },
        { id: 'administrator', label: 'Church Administrator', type: 'text', value: 'Mary Williams' },
        { id: 'board_chair', label: 'Board Chair', type: 'text', value: 'David Thompson' },
      ]
    },
    {
      id: 'services',
      title: 'Service Information',
      icon: '⛪',
      description: 'Service times and worship details',
      fields: [
        { id: 'sunday_service', label: 'Sunday Service Time', type: 'text', value: '10:00 AM' },
        { id: 'sunday_school', label: 'Sunday School', type: 'text', value: '9:00 AM' },
        { id: 'wednesday_service', label: 'Wednesday Service', type: 'text', value: '7:00 PM' },
        { id: 'capacity', label: 'Sanctuary Capacity', type: 'text', value: '300' },
        { id: 'parking', label: 'Parking Spaces', type: 'text', value: '150' },
        { id: 'accessibility', label: 'Accessibility Features', type: 'textarea', value: 'Wheelchair accessible entrance, elevator to upper level, hearing loop system, large print bulletins available.' },
      ]
    },
    {
      id: 'mission',
      title: 'Mission & Values',
      icon: '🌟',
      description: 'Church mission statement and core values',
      fields: [
        { id: 'mission', label: 'Mission Statement', type: 'textarea', value: 'To glorify God by making disciples of Jesus Christ through worship, fellowship, discipleship, ministry, and evangelism.' },
        { id: 'vision', label: 'Vision Statement', type: 'textarea', value: 'A community where everyone can find hope, healing, and purpose in Jesus Christ.' },
        { id: 'values', label: 'Core Values', type: 'textarea', value: 'Love, Grace, Truth, Community, Service, Excellence' },
        { id: 'statement_of_faith', label: 'Statement of Faith', type: 'textarea', value: 'We believe in the Trinity, salvation by grace through faith, and the authority of Scripture.' },
      ]
    }
  ]

  const handleEdit = (sectionId: string) => {
    const section = infoSections.find(s => s.id === sectionId)
    if (section) {
      const initialData: Record<string, string> = {}
      section.fields.forEach(field => {
        initialData[field.id] = field.value
      })
      setFormData(initialData)
      setEditMode(sectionId)
    }
  }

  const handleSave = (sectionId: string) => {
    // TODO: Save to database
    console.log('Saving section:', sectionId, formData)
    setEditMode(null)
    setFormData({})
  }

  const handleCancel = () => {
    setEditMode(null)
    setFormData({})
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const renderField = (field: InfoField, isEditing: boolean) => {
    const value = isEditing ? (formData[field.id] ?? field.value) : field.value

    if (!isEditing) {
      return (
        <div key={field.id} className="py-3">
          <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {field.type === 'textarea' ? (
              <p className="whitespace-pre-wrap">{value || '—'}</p>
            ) : field.type === 'url' && value ? (
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                {value}
              </a>
            ) : field.type === 'email' && value ? (
              <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-700">
                {value}
              </a>
            ) : (
              value || '—'
            )}
          </dd>
        </div>
      )
    }

    return (
      <div key={field.id} className="py-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
          />
        ) : (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
          />
        )}
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">
          Church Information
        </h1>
        <p className="text-neutral-600">
          Manage and maintain comprehensive church information and details
        </p>
      </div>

      {/* Info Sections */}
      <div className="space-y-8">
        {infoSections.map(section => {
          const isEditing = editMode === section.id
          
          return (
            <div key={section.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-primary-900">{section.title}</h2>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={() => handleEdit(section.id)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(section.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Section Content */}
              <div className="px-6 py-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  {section.fields.map(field => renderField(field, isEditing))}
                </dl>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Actions */}
      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
          <span className="text-lg">📄</span>
          Export Information
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition-colors flex items-center gap-2">
          <span className="text-lg">🖨️</span>
          Print Directory
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition-colors flex items-center gap-2">
          <span className="text-lg">📧</span>
          Share Information
        </button>
      </div>
    </div>
  )
}