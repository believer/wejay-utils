declare module 'spotify-web-api-node' {
  interface Artist {
    name: string
  }

  interface AlbumCover {
    url: string
  }

  interface Album {
    images: AlbumCover[]
    name: string
    release_date: string
  }

  interface Track {
    album: Album
    artists: Artist[]
    duration_ms: number
    id: string
    name: string
    uri: string
  }

  interface SpotifyResult {
    tracks: {
      items: Track[]
    }
  }

  interface Config {
    clientId?: string
    clientSecret?: string
  }

  interface Token {
    access_token: string
  }

  type PromiseWithBody<T = {}> = { body: T }

  class SpotifyWebApi {
    constructor(config: Config)

    clientCredentialsGrant: () => PromiseWithBody<Token>
    searchTracks: (query: string) => PromiseWithBody<SpotifyResult>
    setAccessToken: (accessToken: string) => PromiseWithBody<SpotifyResult>
    getTrack: (id: string) => PromiseWithBody<Track>
  }

  export default SpotifyWebApi
}
