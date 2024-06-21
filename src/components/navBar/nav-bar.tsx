import { ProfileButton } from './profile-button'

export function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-md sticky">
      <div className="flex-1 text-2xl font-bold px-6 text-primary">
        SummatOr
      </div>
      <ProfileButton />
    </div>
  )
}
