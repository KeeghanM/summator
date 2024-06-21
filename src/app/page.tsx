import { Hero } from '@/components/hero/hero'
import { SignIn } from '@/components/sign-in'

export default async function Home() {
  const session = {} //await auth()
  return (
    <>
      <Hero />
      {/* <SignIn /> */}
    </>
  )
}

