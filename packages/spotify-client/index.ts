import SpotifyWebApi from 'spotify-web-api-node'

export default async () => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  const { body: token } = await spotifyApi.clientCredentialsGrant()

  spotifyApi.setAccessToken(token.access_token)

  return spotifyApi
}
