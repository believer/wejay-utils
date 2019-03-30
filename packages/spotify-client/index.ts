import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

export function spotifyClient() {
  return spotifyApi.clientCredentialsGrant().then(({ body }) => {
    spotifyApi.setAccessToken(body.access_token)
    return spotifyApi
  })
}
