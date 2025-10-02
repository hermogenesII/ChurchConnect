'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { supabase, type Profile } from '@/lib/supabase'

export default function MembersPage() {
  const router = useRouter()
  const { profile: currentUser, loading: authLoading } = useAuth()
  const [members, setMembers] = useState<Profile[]>([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')

  // Fetch members from the same church
  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentUser?.church_id) {
        // Fetch all members if no church_id (for development)
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('name')

          setMembers(data || [])
        } catch {
          // Silent fail
        } finally {
          setMembersLoading(false)
        }
        return
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('church_id', currentUser.church_id)
          .order('name')

        setMembers(data || [])
      } catch {
        // Silent fail
      } finally {
        setMembersLoading(false)
      }
    }

    // Only fetch when auth is not loading and we have a defined user
    if (!authLoading && currentUser !== undefined) {
      fetchMembers()
    }
  }, [currentUser, authLoading])

  // Filter members based on search and role
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      'MEMBER': 'bg-blue-100 text-blue-800',
      'CHURCH_ADMIN': 'bg-purple-100 text-purple-800', 
      'SYSTEM_ADMIN': 'bg-red-100 text-red-800'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (authLoading || membersLoading) {
    return (
      <div className="p-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-5 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-40 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="md:w-48">
              <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Members Table Skeleton */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="text-right py-4 px-6">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-4">
                      <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-black mb-2">
            Church Members
          </h1>
          <p className="text-neutral-600">
            Manage your church community members ({members.length} total)
          </p>
        </div>
        
        <button
          onClick={() => router.push('/church/members/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
        >
          <span className="text-lg">👤</span>
          Add New Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Total Members</p>
              <p className="text-2xl font-bold text-primary-900">{members.length}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Regular Members</p>
              <p className="text-2xl font-bold text-blue-600">
                {members.filter(m => m.role === 'MEMBER').length}
              </p>
            </div>
            <div className="text-2xl">🙋</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Admins</p>
              <p className="text-2xl font-bold text-purple-600">
                {members.filter(m => m.role === 'CHURCH_ADMIN').length}
              </p>
            </div>
            <div className="text-2xl">⚡</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">New This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {members.filter(m => {
                  const created = new Date(m.created_at || '')
                  const now = new Date()
                  const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
                  return created >= monthAgo
                }).length}
              </p>
            </div>
            <div className="text-2xl">✨</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-neutral-900"
            >
              <option value="all">All Roles</option>
              <option value="MEMBER">Members</option>
              <option value="CHURCH_ADMIN">Admins</option>
              <option value="SYSTEM_ADMIN">System Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm || selectedRole !== 'all' ? 'No members found' : 'No members yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedRole !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first church member!'
            }
          </p>
          {!searchTerm && selectedRole === 'all' && (
            <button
              onClick={() => router.push('/church/members/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Add First Member
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Joined</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {member.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-primary-900">{member.name || 'No name'}</p>
                        {member.phone && (
                          <p className="text-sm text-gray-500">{member.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{member.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(member.role || 'MEMBER')}`}>
                      {formatRole(member.role || 'MEMBER')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {member.created_at ? new Date(member.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mr-4">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}