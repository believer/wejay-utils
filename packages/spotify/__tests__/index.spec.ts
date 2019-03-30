import got from "got";
import { getTrack, search } from "../";

describe("#search", () => {
  beforeEach(function() {
    (got.get as jest.Mock).mockResolvedValue({
      body: {
        tracks: [{ name: "test" }]
      }
    });
  });

  test("calls the correct url", async () => {
    await search("test");

    expect(got.get).toHaveBeenCalledWith(
      "https://wejay-utils.believer.now.sh/search?q=test",
      { json: true }
    );
  });

  test("gets data returned", async () => {
    await expect(search("test")).resolves.toMatchInlineSnapshot(`
Array [
  Object {
    "name": "test",
  },
]
`);
  });
});

describe("#getTrack", () => {
  beforeEach(function() {
    (got.get as jest.Mock).mockResolvedValue({
      body: {
        track: { name: "test" }
      }
    });
  });

  test("calls the correct url", async () => {
    await getTrack("1337");

    expect(got.get).toHaveBeenCalledWith(
      "https://wejay-utils.believer.now.sh/search?q=test",
      { json: true }
    );
  });

  test("gets data returned", async () => {
    await expect(getTrack("1337")).resolves.toMatchInlineSnapshot(`
Object {
  "name": "test",
}
`);
  });
});
