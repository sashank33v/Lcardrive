import Link from 'next/link'
import { Shield } from 'lucide-react'

const LINKS = {
  'Find Instructors': [
    { label: 'Search by Suburb',  href: '/search'             },
    { label: 'AI Match',          href: '/find-my-instructor' },
    { label: 'Browse Melbourne',  href: '/search'             },
  ],
  'Instructors': [
    { label: 'Claim Your Profile', href: '/search'   },
    { label: 'Instructor Portal',  href: '/portal'   },
    { label: 'How It Works',       href: '/#how'     },
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use',   href: '#' },
    { label: 'Contact Us',     href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#1A2444] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-[#1A2444]" />
            </div>
            <span className="font-bold text-lg text-white">LCarDrive</span>
          </div>
          <p className="text-sm text-blue-200 leading-relaxed">
            Melbourne's trusted driving instructor directory. Verified, local, free.
          </p>
          <p className="text-xs text-blue-300 mt-4">
            © {new Date().getFullYear()} LCarDrive. All rights reserved.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-4">{heading}</p>
            <ul className="space-y-2.5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-blue-100 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-blue-900/60 py-4">
        <p className="text-center text-xs text-blue-400">
          LCarDrive is a free directory for learner drivers and driving instructors across Melbourne, Victoria, Australia.
        </p>
      </div>
    </footer>
  )
}
