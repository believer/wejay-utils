import { IncomingMessage, ServerResponse } from 'http'
import SpotifyWebApi from 'spotify-web-api-node'
import url from 'url'
import { ParsedUrlQuery } from 'querystring'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

const validateQuery = (query: ParsedUrlQuery) => {
  if (!query.q) {
    throw new Error('No search query (q) provided')
  }

  return query
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { q } = validateQuery(url.parse(req.url || '', true).query)
    const { body: token } = await spotifyApi.clientCredentialsGrant()

    spotifyApi.setAccessToken(token.access_token)

    const { body } = await spotifyApi.searchTracks(
      typeof q === 'string' ? q : q[0]
    )

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
