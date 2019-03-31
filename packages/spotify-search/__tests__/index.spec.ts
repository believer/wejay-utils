import handler from '../index'
import { spotifyClient } from '@wejay/spotify-client'
import { queryParam } from '@wejay/spotify-utils'

jest.mock('@wejay/spotify-client')
jest.mock('@wejay/spotify-utils', () => ({
  createTrack: jest.fn().mockReturnValue({ name: 'test' }),
  queryParam: jest.fn(),
}))

let req: any
let res: any
let searchTracks: jest.Mock

beforeEach(() => {
  req = {
    url: '/?q=test',
  }

  res = {
    end: jest.fn(),
    writeHead: jest.fn(),
  }

  searchTracks = jest.fn().mockResolvedValue({
    body: {
      tracks: {
        items: [{ name: 'track one' }, { name: 'track two' }],
      },
    },
  })
  ;(spotifyClient as jest.Mock).mockResolvedValue({
    searchTracks,
  })
  ;(queryParam as jest.Mock).mockReturnValue('1')
})

afterEach(jest.clearAllMocks)

test('gets query param for uri', async () => {
  await handler(req, res)

  expect(queryParam).toHaveBeenCalledWith({
    path: req.url,
    param: 'q',
  })
})

test('create a spotify client', async () => {
  await handler(req, res)

  expect(spotifyClient).toHaveBeenCalled()
})

test('searches spotify for tracks', async () => {
  await handler(req, res)

  expect(searchTracks).toHaveBeenCalledWith('1')
})

test('sets status code and header', async () => {
  await handler(req, res)

  expect(res.writeHead).toHaveBeenCalledWith(200, {
    'Content-Type': 'application/json',
  })
})

test('returns data', async () => {
  await handler(req, res)

  expect(res.end.mock.calls[0][0]).toMatchInlineSnapshot(
    `"{\\"tracks\\":[{\\"name\\":\\"test\\"},{\\"name\\":\\"test\\"}]}"`
  )
})

test('handles errors', async () => {
  ;(spotifyClient as jest.Mock).mockReset()
  ;(spotifyClient as jest.Mock).mockRejectedValue({ message: 'Broken' })

  await handler(req, res)

  expect(res.writeHead).toHaveBeenCalledWith(500, {
    'Content-Type': 'application/json',
  })
  expect(res.end.mock.calls[0][0]).toMatchInlineSnapshot(
    `"{\\"error\\":\\"Broken\\"}"`
  )
})
