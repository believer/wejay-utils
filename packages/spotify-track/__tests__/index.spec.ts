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
let getTrack: jest.Mock

beforeEach(() => {
  req = {
    url: '/?uri=test',
  }

  res = {
    end: jest.fn(),
    writeHead: jest.fn(),
  }

  getTrack = jest.fn().mockResolvedValue({ body: 'track' })
  ;(spotifyClient as jest.Mock).mockResolvedValue({
    getTrack,
  })
  ;(queryParam as jest.Mock).mockReturnValue('test')
})

afterEach(jest.clearAllMocks)

test('gets query param for uri', async () => {
  await handler(req, res)

  expect(queryParam).toHaveBeenCalledWith({
    path: req.url,
    param: 'uri',
  })
})

test('create a spotify client', async () => {
  await handler(req, res)

  expect(spotifyClient).toHaveBeenCalled()
})

test('gets track information from spotify', async () => {
  await handler(req, res)

  expect(getTrack).toHaveBeenCalledWith('test')
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
    `"{\\"track\\":{\\"name\\":\\"test\\"}}"`
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
