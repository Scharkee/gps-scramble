let { Scrambler, ScramblerAsync } = require("../dist");

test("Scrambler produces a point within a given distance", () => {
  let scrambler = new Scrambler([40.758, -73.985]);
  let location = scrambler.within(100, "m");

  expect(location.x).toBeCloseTo(scrambler.x, 1);
  expect(location.y).toBeCloseTo(scrambler.y, 1);
});

test("Scrambler produces a point within a given distance", async () => {
  if (!process.env.BING_API_KEY) {
    return;
  }
  let scrambler = new ScramblerAsync("Times Square");
  let location = await scrambler.within(100, "m");

  expect(location.x).toBeCloseTo(scrambler.x, 1);
  expect(location.y).toBeCloseTo(scrambler.y, 1);
});
