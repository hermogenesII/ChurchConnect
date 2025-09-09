'use client'

import { useState } from 'react'

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  location: string
  condition: 'excellent' | 'good' | 'fair' | 'needs_repair'
  lastChecked: string
  value?: number
  notes?: string
}

const sampleInventory: InventoryItem[] = [
  // Audio/Visual Equipment
  { id: '1', name: 'Wireless Microphone Set', category: 'audio', quantity: 4, unit: 'sets', location: 'Sound Booth', condition: 'excellent', lastChecked: '2024-01-15', value: 800 },
  { id: '2', name: 'Projector - Main Sanctuary', category: 'visual', quantity: 1, unit: 'unit', location: 'Main Sanctuary', condition: 'good', lastChecked: '2024-01-10', value: 2500 },
  { id: '3', name: 'Sound Mixing Board', category: 'audio', quantity: 1, unit: 'unit', location: 'Sound Booth', condition: 'excellent', lastChecked: '2024-01-12', value: 3200 },
  
  // Furniture
  { id: '4', name: 'Sanctuary Chairs', category: 'furniture', quantity: 150, unit: 'chairs', location: 'Main Sanctuary', condition: 'good', lastChecked: '2024-01-08', value: 7500 },
  { id: '5', name: 'Folding Tables', category: 'furniture', quantity: 20, unit: 'tables', location: 'Fellowship Hall', condition: 'fair', lastChecked: '2024-01-05' },
  { id: '6', name: 'Office Desks', category: 'furniture', quantity: 8, unit: 'desks', location: 'Admin Office', condition: 'good', lastChecked: '2024-01-14' },
  
  // Kitchen Supplies
  { id: '7', name: 'Industrial Coffee Maker', category: 'kitchen', quantity: 2, unit: 'units', location: 'Kitchen', condition: 'excellent', lastChecked: '2024-01-13', value: 600 },
  { id: '8', name: 'Disposable Cups', category: 'kitchen', quantity: 500, unit: 'cups', location: 'Kitchen Storage', condition: 'excellent', lastChecked: '2024-01-11' },
  
  // Maintenance
  { id: '9', name: 'HVAC Filter Replacements', category: 'maintenance', quantity: 12, unit: 'filters', location: 'Utility Room', condition: 'excellent', lastChecked: '2024-01-09' },
  { id: '10', name: 'LED Light Bulbs', category: 'maintenance', quantity: 25, unit: 'bulbs', location: 'Storage Closet', condition: 'excellent', lastChecked: '2024-01-07' },
]

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const categories = [
    { id: 'all', name: 'All Items', icon: '📦' },
    { id: 'audio', name: 'Audio Equipment', icon: '🎤' },
    { id: 'visual', name: 'Visual Equipment', icon: '📺' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'kitchen', name: 'Kitchen Supplies', icon: '☕' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' },
  ]

  const filteredItems = sampleInventory.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getConditionColor = (condition: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      needs_repair: 'bg-red-100 text-red-800'
    }
    return colors[condition as keyof typeof colors]
  }

  const totalValue = sampleInventory
    .filter(item => item.value)
    .reduce((sum, item) => sum + (item.value || 0), 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">
            Church Inventory
          </h1>
          <p className="text-neutral-600">
            Track and manage church assets, equipment, and supplies
          </p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
          <span className="text-lg">➕</span>
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-primary-900">{sampleInventory.length}</p>
            </div>
            <div className="text-2xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-primary-900">${totalValue.toLocaleString()}</p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Need Attention</p>
              <p className="text-2xl font-bold text-red-600">
                {sampleInventory.filter(item => item.condition === 'needs_repair').length}
              </p>
            </div>
            <div className="text-2xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Categories</p>
              <p className="text-2xl font-bold text-primary-900">{categories.length - 1}</p>
            </div>
            <div className="text-2xl">📂</div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Categories */}
        <div className="w-64">
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <h3 className="font-semibold text-primary-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-gray-50 text-gray-700">
                <span className="text-xl">📋</span>
                <span className="font-medium">Generate Report</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-gray-50 text-gray-700">
                <span className="text-xl">📤</span>
                <span className="font-medium">Export Inventory</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-gray-50 text-gray-700">
                <span className="text-xl">🔍</span>
                <span className="font-medium">Schedule Audit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <input
              type="text"
              placeholder="Search items, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
            />
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Item</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Quantity</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Location</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Condition</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Checked</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-primary-900">{item.name}</p>
                        {item.value && (
                          <p className="text-sm text-gray-500">${item.value.toLocaleString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium">{item.quantity}</span>
                      <span className="text-gray-500 ml-1">{item.unit}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{item.location}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getConditionColor(item.condition)}`}>
                        {item.condition.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{item.lastChecked}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mr-4">
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-red-600 text-sm font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}