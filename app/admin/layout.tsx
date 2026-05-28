import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: '/admin',          label: 'Overview' },
    { href: '/admin/listings', label: 'Listings' },
    { href: '/admin/claims',   label: 'Claims'   },
    { href: '/admin/reviews',  label: 'Reviews'  },
    { href: '/admin/flags',    label: 'Flags'    },
    { href: '/admin/import',   label: 'Import'   },
  ]

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-[#1A3CFF]">LCarDrive</Link>
          <span className="bg-[#1A3CFF] text-white text-xs px-2 py-0.5 rounded font-medium">ADMIN</span>
        </div>
        <nav className="flex gap-4">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-gray-600 hover:text-[#1A3CFF] transition-colors">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="p-6">{children}</div>
    </div>
  )
}
