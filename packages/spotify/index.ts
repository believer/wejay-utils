import got from 'got'

const client = async (url: string, selector: string) => {
  const { body } = await got.get(`https://wejay-utils.believer.now.sh${url}`, {
    json: true,
  })

  return body[selector]
}

export const search = (q: string) => client(`/search?q=${q}`, 'tracks')

export const getTrack = (uri: string) => client(`/track?uri=${uri}`, 'track')