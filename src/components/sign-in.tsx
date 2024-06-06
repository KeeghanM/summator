import { signIn } from '@/auth'

export function SignIn() {
  return (
    <form
      action={async (formData) => {
        'use server'
        await signIn('resend', formData)
      }}
      className="flex flex-col md:flex-row gap-4 items-center justify-center bg-gray-100 bg-opacity-10 p-4 rounded-lg border border-gray-700 shadow-md"
    >
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="input input-bordered w-full max-w-xs"
      />
      <button
        type="submit"
        className="btn btn-primary"
      >
        Log In
      </button>
    </form>
  )
}
