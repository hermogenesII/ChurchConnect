'use client'

import { useRouter } from 'next/navigation'

export default function MembersPage() {
  const router = useRouter()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">
            Church Members
          </h1>
          <p className="text-neutral-600">
            Manage your church community members
          </p>
        </div>
        
        <button
          onClick={() => router.push('/church/members/add')}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
        >
          <span className="text-lg">👤</span>
          Add New Member
        </button>
      </div>

      {/* Members List - TODO: Implement with real data */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <p className="text-neutral-500 text-center py-8">
          Member management coming soon...
          <br />
          <span className="text-sm">Click &quot;Add New Member&quot; to start registering members!</span>
        </p>
      </div>
    </div>
  )
}