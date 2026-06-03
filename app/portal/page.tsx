import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import {
  User, MapPin, DollarSign, Calendar,
  Sparkles, Camera, CheckCircle2, Circle,
  ArrowRight, Search, Shield
} from 'lucide-react'
import { supabaseServer } from '@/lib/clients/supabase-server'

function calcCompleteness(i: any): { score: number; missing: string[] } {
  const checks = [
    { done: !!i.profile_photo_url,                  label: 'Add a profile photo'        },
    { done: !!i.bio?.trim(),                         label: 'Write your bio'             },
    { done: !!i.hourly_rate,                         label: 'Set your hourly rate'       },
    { done: !!i.transmission,                        label: 'Set transmission type'      },
    { done: !!i.phone?.trim(),                       label: 'Add phone number'           },
    { done: !!i.vehicle_make,                        label: 'Add vehicle details'        },
    { done: (i.availability_days || []).length > 0,  label: 'Set available days'         },
    { done: (i.familiar_test_centres || []).length > 0, label: 'Add test centres'       },
    { done: (i.languages || []).length > 0,          label: 'Add languages spoken'       },
    { done: !!i.years_experience,                    label: 'Add years of experience'    },
  ]
  const done    = checks.filter(c => c.done).length
  const missing = checks.filter(c => !c.done).map(c => c.label)
  return { score: Math.round((done / checks.length) * 100), missing }
}

export default async function PortalDashboard() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: instructor } = await supabaseServer
    .from('instructors')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  // ── No profile found — onboarding screen ──
  if (!instructor) {
    return (
      <div className="space-y-5">

        {/* Welcome banner */}
        <div className="bg-[#1A3CFF] rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Welcome to LCarDrive! 👋</h1>
          <p className="text-blue-200 text-sm">
            Get your free instructor profile set up in 3 easy steps.
          </p>
        </div>

        {/* 3 steps */}
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              step: '1',
              title: 'Find your listing',
              desc:  'Search for your name in our directory. We may already have your listing from public records.',
              Icon:  Search,
              href:  '/search',
              label: 'Search now',
              done:  false,
            },
            {
              step: '2',
              title: 'Claim your profile',
              desc:  'Verify your ADI registration number to prove you\'re the instructor.',
              Icon:  Shield,
              href:  '/search',
              label: 'Find & claim',
              done:  false,
            },
            {
              step: '3',
              title: 'Complete your profile',
              desc:  'Add your photo, bio, pricing and availability to rank higher in search.',
              Icon:  User,
              href:  '/portal/profile',
              label: 'Edit profile',
              done:  false,
            },
          ].map(({ step, title, desc, Icon, href, label }) => (
            <div key={step} className="bg-white rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#1A3CFF] text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                {step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 mb-0.5">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
              <Link href={href} className="flex-shrink-0">
                <button className="flex items-center gap-1.5 bg-[#1A3CFF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap">
                  {label} <ArrowRight size={12} />
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm text-blue-800 font-semibold mb-1">✦ Completely free</p>
          <p className="text-sm text-blue-700">
            LCarDrive is free for instructors. No subscription, no commission, no hidden fees.
            Claim your listing and start getting found by learners today.
          </p>
        </div>

      </div>
    )
  }

  // ── Has profile — dashboard ──
  const { score, missing } = calcCompleteness(instructor)

  const progressColor =
    score >= 80 ? 'bg-green-500' :
    score >= 50 ? 'bg-yellow-500' :
    'bg-red-400'

  const QUICK_ACTIONS = [
    { href: '/portal/profile',       label: 'Edit Profile',    Icon: User,        desc: 'Name, bio, photo'       },
    { href: '/portal/pricing',       label: 'Set Pricing',     Icon: DollarSign,  desc: 'Hourly rate & packages' },
    { href: '/portal/availability',  label: 'Availability',    Icon: Calendar,    desc: 'Days & time slots'      },
    { href: '/portal/service-areas', label: 'Service Areas',   Icon: MapPin,      desc: 'Suburbs you cover'      },
  ]

  return (
    <div className="space-y-5">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {instructor.first_name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {score >= 80 ? 'Your profile is looking great!' : 'Complete your profile to rank higher in search results.'}
        </p>
      </div>

      {/* Profile completeness */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-gray-900">Profile Strength</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {score < 50 ? 'Add more details to get found' :
               score < 80 ? 'Almost there — keep going!' :
               'Your profile is complete!'}
            </p>
          </div>
          <span className={`text-3xl font-bold ${
            score >= 80 ? 'text-green-600' :
            score >= 50 ? 'text-yellow-600' : 'text-red-500'
          }`}>{score}%</span>
        </div>

        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full transition-all ${progressColor}`} style={{ width: `${score}%` }} />
        </div>

        {missing.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">To complete</p>
            {missing.slice(0, 4).map(item => (
              <div key={item} className="flex items-center gap-2">
                <Circle size={14} className="text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
            {missing.length > 4 && (
              <p className="text-xs text-gray-400 pl-5">+{missing.length - 4} more items</p>
            )}
          </div>
        )}

        {missing.length === 0 && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 size={16} />
            <span className="text-sm font-medium">All sections complete!</span>
          </div>
        )}
      </div>

      {/* Verification status */}
      {!instructor.is_verified && (
        <div className={`rounded-2xl p-4 border ${
          instructor.is_claimed
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-blue-50 border-blue-100'
        }`}>
          <p className={`font-semibold text-sm ${instructor.is_claimed ? 'text-yellow-800' : 'text-blue-800'}`}>
            {instructor.is_claimed
              ? '⏳ Claim under review — we\'ll verify within 48 hours'
              : '⚠️ Profile not yet claimed'}
          </p>
          {!instructor.is_claimed && (
            <Link href={`/claim/${instructor.id}`} className="text-xs text-blue-700 underline mt-1 inline-block">
              Claim your profile →
            </Link>
          )}
        </div>
      )}

      {instructor.is_verified && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Profile Verified ✅</p>
            <p className="text-xs text-green-700">You appear higher in search results</p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ href, label, Icon, desc }) => (
            <Link key={href} href={href}>
              <div className="bg-white rounded-2xl p-4 hover:shadow-sm hover:border-gray-200 border border-transparent transition-all cursor-pointer h-full">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#1A3CFF]" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI bio prompt */}
      {!instructor.bio && (
        <div className="bg-gradient-to-r from-purple-600 to-[#1A3CFF] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-1">Write your bio with AI</p>
              <p className="text-white/80 text-xs mb-3">Generate a professional bio in seconds.</p>
              <Link href="/portal/profile#bio">
                <button className="flex items-center gap-1.5 bg-white text-purple-700 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-purple-50 transition-colors">
                  Generate Bio <ArrowRight size={12} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Photo prompt */}
      {!instructor.profile_photo_url && (
        <div className="bg-white rounded-2xl p-5 border-2 border-dashed border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Camera size={22} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Add a profile photo</p>
              <p className="text-xs text-gray-500 mt-0.5">Profiles with photos get 3× more views</p>
            </div>
            <Link href="/portal/profile">
              <button className="text-xs bg-[#1A3CFF] text-white px-3 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Add photo
              </button>
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}
