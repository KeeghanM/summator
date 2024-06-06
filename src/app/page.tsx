import { auth } from '@/auth'
import { SignIn } from '@/components/sign-in'

export default async function Home() {
  const session = await auth()
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">Summator</h1>
      <p>
        Sick of not knowing whats going on in the world? Too busy to keep up to
        date with everything
      </p>
      <p>
        With Summator, you can pass it a series of RSS Feeds and it will keep
        you up to date with the latest news.
      </p>
      <p>
        You will receive a daily email with summarised, and ranked news articles
        from the feeds you have provided. You can then vote on the articles you
        like, and Summator will learn what you like and provide you with more of
        the same.
      </p>
      <div>
        {session?.user ? (
          <></>
        ) : (
          <>
            <SignIn />
          </>
        )}
      </div>
    </main>
  )
}

