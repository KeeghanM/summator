import Anthropic from '@anthropic-ai/sdk'
import { XMLParser } from 'fast-xml-parser'
import { createElement } from 'react'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { feeds, authKey } = (await request.json()) as {
      feeds: {
        label: string
        rss: string
      }[]
      authKey: string
    }
    if (authKey !== process.env.SUMMARY_AUTH_KEY)
      return new Response('Unauthenticated', { status: 401 })
    if (feeds === undefined || feeds.length === 0)
      return new Response('No data found', { status: 400 })

    const parser = new XMLParser()
    const data: {
      name: string
      source: string
      body: string
    }[] = []

    // For each of the selected feeds, go and get 1 item from each
    // Then grab the content out
    feeds.map(async (feed) => {
      const response = await fetch(feed.rss)
      const xml = await response.text()
      const lastItems = parser.parse(xml).rss.channel.item.slice(0, 1)
      lastItems.forEach(async (item: { link: string }) => {
        const resp = await fetch(item.link)
        if (!resp.ok) throw new Error('Failed to fetch') // TODO: Handle nicely
        const html = await resp.text()
        const doc = parser.parse(html)
        const bodyText = doc?.body?.textContent
        if (!bodyText) throw new Error('No content found') // TODO: Handle nicely
        data.push({
          name: feed.label,
          source: item.link,
          body: bodyText ?? '',
        })
      })
    })

    const summary = await anthropic.messages.create({
      system:
        'You are summarising news articles for a "Daily Summary" email. Return an HTML email with the summaries of these articles.',
      messages: [
        {
          role: 'user',
          content: JSON.stringify(data),
        },
      ],
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
    })

    console.log(summary)

    return new Response(JSON.stringify({ text: summary.content }))
  } catch (error) {
    console.error(error)
    return new Response(
      error instanceof Error ? error.message : 'An unknown error occured',
      { status: 500 },
    )
  }
}
