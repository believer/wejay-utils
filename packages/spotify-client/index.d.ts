export interface Artist {
  name: string
}

export interface AlbumCover {
  url: string
}

export interface Album {
  id: string
  images: AlbumCover[]
  name: string
  release_date: string
}

export interface Track {
  album: Album
  artists: Artist[]
  duration_ms: number
  id: string
  name: string
  uri: string
}

export interface PlaylistOwner {
  display_name: string
}

export interface Playlist {
  owner: PlaylistOwner
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

type PromiseWithBody<T = {}> = Promise<{ body: T }>

declare class SpotifyWebApi {
  constructor(config: Config)

  clientCredentialsGrant: () => PromiseWithBody<Token>
  searchTracks: (query: string) => PromiseWithBody<SpotifyResult>
  setAccessToken: (accessToken: string) => void
  getTrack: (id: string) => PromiseWithBody<Track>
  getPlaylist: (id: string) => PromiseWithBody<Playlist>
}

export declare function spotifyClient(): Promise<SpotifyWebApi>
