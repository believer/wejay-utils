import { IncomingMessage, ServerResponse } from 'http'
import url from 'url'
import { ParsedUrlQuery } from 'querystring'
import { spotifyClient } from '@wejay/spotify-client'

const validateQuery = (query: ParsedUrlQuery) => {
  if (!query.uri) {
    throw new Error('No track URI (uri) provided')
  }

  return query
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const client = await spotifyClient()
    const { uri } = validateQuery(url.parse(req.url || '', true).query)

    const { body: track } = await client.getTrack(
      typeof uri === 'string' ? uri : uri[0]
    )

    const outputTrack = {
      albumName: track.album.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      cover: track.album.images[1] ? track.album.images[1].url : '',
      duration: track.duration_ms,
      id: track.id,
      name: track.name,
      releaseDate: track.album.release_date,
      uri: track.uri,
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ track: outputTrack }))
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: error.message }))
  }
}
