import { IncomingMessage, ServerResponse } from 'http'
import { spotifyClient } from '@wejay/spotify-client'
import { queryParam } from '@wejay/spotify-utils'

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const uri = queryParam({ path: req.url, param: 'uri' })

    const client = await spotifyClient()
    const { body } = await client.getPlaylist(uri)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        playlist: {
          owner: body.owner.display_name,
        },
      })
    )
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: error.message }))
  }
}
