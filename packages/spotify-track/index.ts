import { IncomingMessage, ServerResponse } from 'http'
import { spotifyClient } from '@wejay/spotify-client'
import { createTrack, queryParam } from '@wejay/spotify-utils'

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const uri = queryParam({ path: req.url, param: 'uri' })

    const client = await spotifyClient()
    const { body } = await client.getTrack(uri)
    const track = createTrack(body)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ track }))
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: error.message }))
  }
}
