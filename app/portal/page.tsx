'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, DollarSign, Calendar, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

export default function PortalPage() {
  const [instructor, setInstructor] = useState<any>(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    fetch('/api/portal')
      .then(r => r.json())
      .then(d => { setInstructor(d.instructor); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const completeness = instructor?.profile_completeness || 0

  const quickActions = [
    { href: '/portal/profile',       label: 'Edit Profile',    sub: 'Update your details',  icon: User       },
    { href: '/portal/pricing',       label: 'Pricing',         sub: 'Manage rates',          icon: DollarSign },
    { href: '/portal/availability',  label: 'Availability',    sub: 'Set your schedule',     icon: Calendar   },
  ]

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{instructor?.first_name ? `, ${instructor.first_name}` : ''}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your profile today.</p>
      </div>

      {/* Profile strength */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Profile Strength</span>
          <span className="text-sm font-bold text-[#1A3CFF]">{completeness}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
          <div
            className="bg-[#1A3CFF] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Complete your profile to rank higher in search results.
          </p>
          {completeness < 100 && (
            <Link href="/portal/profile" className="text-xs text-[#1A3CFF] font-semibold whitespace-nowrap ml-2">
              Finish Setup →
            </Link>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ href, label, sub, icon: Icon }) => (
            <Link key={href} href={href}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <Icon size={22} className="text-[#1A3CFF] mb-2" />
              <p className="font-semibold text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-500">{sub}</p>
            </Link>
          ))}
          <Link href="/portal/service-areas"
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 text-sm">Service Areas</p>
              <p className="text-xs text-gray-500">Manage your coverage suburbs</p>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </Link>
        </div>
      </div>

      {/* AI Bio writer card */}
      <div className="bg-[#1A2444] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-white" />
          <h3 className="text-white font-bold">Write a professional bio</h3>
        </div>
        <p className="text-blue-300 text-sm mb-4">
          Struggling with what to say? Let AI generate an engaging bio in seconds.
        </p>
        <Link href="/portal/profile#bio">
          <button className="w-full bg-[#1A3CFF] text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-colors">
            ✨ Try AI Writer
          </button>
        </Link>
      </div>

      {/* Claim status */}
      {!instructor?.is_claimed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-1">Profile not claimed</p>
          <p className="text-xs text-yellow-700 mb-3">
            Find your listing in the directory and claim it to connect it to your account.
          </p>
          <Link href="/search">
            <button className="text-xs bg-yellow-500 text-white px-4 py-2 rounded-xl font-medium">
              Find My Listing
            </button>
          </Link>
        </div>
      )}

      {instructor?.is_verified && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Profile Verified ✅</p>
            <p className="text-xs text-green-700">Your verified badge is live on your profile.</p>
          </div>
        </div>
      )}

    </div>
  )
}
