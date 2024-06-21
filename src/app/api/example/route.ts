process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
import { sources } from '@/components/hero/example/sources'
import { XMLParser } from 'fast-xml-parser'

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const selectedSources = (await request.json()) as {
      sources: [{ name: string; value: number }]
    }
    const feeds = sources.filter((source) =>
      selectedSources.sources.some(
        (selected) => selected.name === source.label,
      ),
    )

    const parser = new XMLParser()
    const data: {
      name: string
      source: string
      body: string
    }[] = []

    feeds.map(async (feed) => {
      const response = await fetch(feed.rss)
      const xml = await response.text()
      const lastItems = parser.parse(xml).rss.channel.item.slice(0, 1)
      lastItems.forEach(async (item: { link: string }) => {
        const resp = await fetch(item.link)
        if (!resp.ok) throw new Error('Failed to fetch')
        const html = await resp.text()
        const doc = new DOMParser().parseFromString(html, 'text/html')
        const bodyText = doc.body.textContent
        data.push({
          name: feed.label,
          source: item.link,
          body: bodyText ?? '',
        })
      })
    })

    const summary = await anthropic.messages.create({
      system:
        'You are summarising news articles for a "Daily Summary" email. Return an HTML email with the summaries of the articles.',
      messages: [
        {
          role: 'user',
          content: JSON.stringify(data),
        },
      ],
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
    })

    console.log(summary.content)

    return new Response(
      JSON.stringify({
        __html: summary.content,
        data,
      }),
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    return new Response('Error!', { status: 500 })
  }
}
