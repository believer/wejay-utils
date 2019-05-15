import { IncomingMessage, ServerResponse } from 'http'
import { spotifyClient } from '@wejay/spotify-client'
import { createTrack, queryParam } from '@wejay/spotify-utils'

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    console.log(req.url)

    const q = queryParam({ path: req.url, param: 'q' })

    console.log(q)

    const client = await spotifyClient()
    const { body } = await client.searchTracks(q)

    console.log(body)
    const tracks = body.tracks.items.map(createTrack)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ tracks }))
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: error.message }))
  }
}
