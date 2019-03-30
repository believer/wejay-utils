import { IncomingMessage, ServerResponse } from 'http'
import url from 'url'
import { ParsedUrlQuery } from 'querystring'
import spotifyClient from '@wejay/spotify-client'

const validateQuery = (query: ParsedUrlQuery) => {
  if (!query.q) {
    throw new Error('No search query (q) provided')
  }

  return query
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { searchTracks } = await spotifyClient()
    const { q } = validateQuery(url.parse(req.url || '', true).query)

    const { body } = await searchTracks(typeof q === 'string' ? q : q[0])

    const tracks = body.tracks.items.map(track => ({
      albumName: track.album.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      cover: track.album.images[1] ? track.album.images[1].url : '',
      duration: track.duration_ms,
      id: track.id,
      name: track.name,
      releaseDate: track.album.release_date,
      uri: track.uri,
    }))

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ tracks }))
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: error.message }))
  }
}
