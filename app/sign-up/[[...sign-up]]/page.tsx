import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F0F2FF] flex items-center justify-center p-4">
      <SignUp />
    </div>
  )
}
