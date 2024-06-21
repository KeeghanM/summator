process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
import { sources } from '@/components/hero/example/sources'
import { db } from '@/db/db'
import { exampleSummaries } from '@/db/schema'
import { and, eq, gt } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    // Get out the selected sources from the example form
    const selectedSources = (await request.json()) as {
      sources: [{ name: string; priority: number }]
    }

    // Check if a summary for these settings has already been made in the last 24 hours
    // Seems like we're doing a lot of work here, but it's still less expensive than
    // hitting the AI every time. Especially if just the plain default form, with no changes,
    // is getting spammed.
    const key = selectedSources.sources
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((key, source) => {
        return (key += source.name + source.priority.toString())
      }, '')

    // TODO: BRING THIS BACK - only off for debugging
    // const now = new Date()
    // const twentyFourHoursAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24)
    // const summaries = await db
    //   .select({ text: exampleSummaries.text })
    //   .from(exampleSummaries)
    //   .where(
    //     and(
    //       eq(exampleSummaries.key, key),
    //       gt(exampleSummaries.generated, twentyFourHoursAgo),
    //     ),
    //   )

    // if (summaries.length >= 1) {
    //   return new Response(
    //     JSON.stringify({
    //       __html: summaries[0].text,
    //     }),
    //   )
    // }

    // If we get here, then we need to generate some new text using the AI Summary endpoint
    // First, we get the feed URL's based on the submitted sources
    const feeds = selectedSources.sources.map((selectedSource) => {
      return {
        rss: sources.find((source) => source.label === selectedSource.name)!
          .rss,
        priority: selectedSource.priority,
        name: selectedSource.name,
      }
    })

    // Now we pass the sources into the summarise endpoint as if it was a normal summary event
    const response = await fetch(`${process.env.BASE_API_URL}/api/summarise`, {
      method: 'POST',
      body: JSON.stringify({
        feeds,
        authKey: process.env.SUMMARY_AUTH_KEY,
      }),
    })
    if (!response.ok) throw new Error(response.statusText)

    // We can now return the html/text
    const data = await response.json()

    // But before we do, we need to store it (and it's key) for future use
    // await db.insert(exampleSummaries).values({
    //   key,
    //   text: data.text,
    //   generated: new Date(),
    // })

    return new Response(
      JSON.stringify({
        __html: data.text,
      }),
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    return new Response('Error!', { status: 500 })
  }
}
