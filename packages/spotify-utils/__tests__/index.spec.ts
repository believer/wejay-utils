import { createTrack, queryParam } from '../index'

describe('#createTrack', () => {
  test('should parse a spotify track into an easier structure', () => {
    const track = {
      album: {
        images: [
          {
            url: 'first.jpg',
          },
          {
            url: 'second.jpg',
          },
        ],
        name: '30 Seconds to Mars',
        release_date: '2000-01-01',
      },
      artists: [{ name: '30 Seconds to Mars' }],
      duration_ms: 100000,
      id: '1337',
      name: 'Echelon',
      uri: 'spotify:track:1337',
    }

    expect(createTrack(track)).toMatchInlineSnapshot(`
Object {
  "albumName": "30 Seconds to Mars",
  "artist": "30 Seconds to Mars",
  "cover": "second.jpg",
  "duration": 100000,
  "id": "1337",
  "name": "Echelon",
  "releaseDate": "2000-01-01",
  "uri": "spotify:track:1337",
}
`)
  })
})

describe('#queryParam', () => {
  test('returns a query param', () => {
    expect(queryParam({ path: '/?q=test', param: 'q' })).toEqual('test')
  })

  test('throws an error if param does not exist', () => {
    expect(() => queryParam({ path: '/?t=test', param: 'q' })).toThrowError(
      'No "q" provided'
    )
  })
})
