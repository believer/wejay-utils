import { Track } from '@wejay/spotify-client'
import url from 'url'
import { ParsedUrlQuery } from 'querystring'

export const createTrack = (track: Track) => ({
  albumName: track.album.name,
  artist: track.artists.map(artist => artist.name).join(', '),
  cover: track.album.images[1] ? track.album.images[1].url : '',
  duration: track.duration_ms,
  id: track.id,
  name: track.name,
  releaseDate: track.album.release_date,
  uri: track.uri,
})

const validateQuery = (query: ParsedUrlQuery, param: string) => {
  if (!query[param]) {
    throw new Error(`No "${param}" provided`)
  }

  return query
}

interface QueryParamProps {
  path?: string
  param: string
}

export const queryParam = ({ path, param }: QueryParamProps): string => {
  const qs = validateQuery(url.parse(path || '', true).query, param)
  const outParam = qs[param]

  return encodeURIComponent(Array.isArray(outParam) ? outParam[0] : outParam)
}
