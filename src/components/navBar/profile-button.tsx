'use client'

import { signOut, useSession } from 'next-auth/react'

// TODO: Make this a nice profile button with some actual use!
export function ProfileButton() {
  const auth = useSession()
  if (!auth.data) return null

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <button
              className="btn btn-ghost"
              onClick={async () => await signOut()}
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
