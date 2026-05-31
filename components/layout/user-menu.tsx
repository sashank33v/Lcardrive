'use client'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export function UserMenu() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) return <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />

  if (isSignedIn) return <UserButton />

  return (
    <Link href="/sign-in">
      <button className="text-sm font-semibold text-[#1A3CFF] hover:underline">
        Sign in
      </button>
    </Link>
  )
}
