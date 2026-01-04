import filterProperties, { parsePropertyDate } from "../utils/filterProperties";

const sample = [
  {
    id: "p1",
    type: "House",
    bedrooms: 3,
    price: 500000,
    location: "London NW1",
    added: { month: "October", day: 12, year: 2022 },
  },
  {
    id: "p2",
    type: "Flat",
    bedrooms: 1,
    price: 250000,
    location: "London SE1",
    added: { month: "December", day: 1, year: 2025 },
  },
];

test("parsePropertyDate returns a valid Date from added fields", () => {
  const d = parsePropertyDate(sample[0]);
  expect(d).toBeInstanceOf(Date);
  expect(Number.isNaN(d.getTime())).toBe(false);
});

test("filterProperties filters by type + priceRange + bedroomsRange", () => {
  const out = filterProperties(sample, {
    type: "House",
    priceRange: [400000, 600000],
    bedroomsRange: [2, 4],
    postcode: "",
    dateAdded: null,
  });

  expect(out).toHaveLength(1);
  expect(out[0].id).toBe("p1");
});

test("filterProperties filters by dateAdded (on/after)", () => {
  const out = filterProperties(sample, {
    type: "all",
    priceRange: [0, 1000000],
    bedroomsRange: [0, 10],
    postcode: "",
    dateAdded: new Date("2025-01-01"),
  });

  expect(out).toHaveLength(1);
  expect(out[0].id).toBe("p2");
});

test("filterProperties filters by postcode substring match", () => {
  const out = filterProperties(sample, {
    type: "all",
    priceRange: [0, 1000000],
    bedroomsRange: [0, 10],
    postcode: "NW1",
    dateAdded: null,
  });

  expect(out).toHaveLength(1);
  expect(out[0].id).toBe("p1");
});
