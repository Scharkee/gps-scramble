let { ScramblerAsync } = require("../dist");

test("ScramblerAsync parses coordinates", () => {
  let scrambler = new ScramblerAsync([40.758, -73.985]);
  expect(scrambler.x).toBe(40.758);
  expect(scrambler.y).toBe(-73.985);
  expect(scrambler[0]).toBe(40.758);
  expect(scrambler[1]).toBe(-73.985);
});

test("ScramblerAsync parses location by query", async () => {
  let scrambler = new ScramblerAsync("Times Square");
  await scrambler.init();

  // is near Times Square
  expect(scrambler.x).toBeCloseTo(40.758, 1);
  expect(scrambler.y).toBeCloseTo(-73.985, 1);
});
