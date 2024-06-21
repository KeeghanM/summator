import { removeTags } from '@/util/remove-tags'
import Anthropic from '@anthropic-ai/sdk'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { feeds, authKey } = (await request.json()) as {
      feeds: {
        rss: string
        priority: number
        name: string
      }[]
      authKey: string
    }
    if (authKey !== process.env.SUMMARY_AUTH_KEY)
      return new Response('Unauthenticated', { status: 401 })
    if (feeds === undefined || feeds.length === 0)
      return new Response('No data found', { status: 400 })

    const parser = new XMLParser()
    const builder = new XMLBuilder({
      processEntities: false,
    })
    // For each of the selected feeds, go and get 1 item from each
    // Then grab the content out
    const data = await Promise.all(
      feeds.map(async (feed) => {
        try {
          const response = await fetch(feed.rss)
          const xml = await response.text()
          const lastItems = parser
            .parse(xml)
            .rss.channel.item.slice(0, feed.priority)
          const results = await Promise.all(
            lastItems.map(async (item: { link: string }) => {
              try {
                const resp = await fetch(item.link)
                const html = await resp.text()
                const doc = parser.parse(html)
                const bodyText = removeTags(
                  builder.build(doc?.html?.head?.body ?? ''),
                )
                return {
                  source: item.link,
                  body: bodyText,
                }
              } catch (error) {
                console.error(
                  `Fetching item ${item.link}:`,
                  error instanceof Error ? error.message : error,
                )
              }
            }),
          )
          return {
            site: feed.name,
            priority: feed.priority,
            content: results,
          }
        } catch (error) {
          console.error(
            `Fetching feed ${feed.rss}:`,
            error instanceof Error ? error.message : error,
          )
        }
      }),
    )

    const summary = (await anthropic.messages.create({
      system:
        'You are summarising news articles for a "Daily Summary" email. Return an HTML email with the summaries of these articles. RETURN ONLY THE EMAIL CONTENT. Include links to the original articles.',
      messages: [
        {
          role: 'user',
          content: JSON.stringify(data),
        },
      ],
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1200,
    })) as {
      content: { text: string }[]
    }

    return new Response(JSON.stringify({ text: summary.content[0].text }))
  } catch (error) {
    console.error(error)
    return new Response(
      error instanceof Error ? error.message : 'An unknown error occured',
      { status: 500 },
    )
  }
}
