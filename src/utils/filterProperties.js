// filterProperties(properties, criteria)
// criteria: {
//   type: 'House' | 'Flat' | 'all' | undefined,
//   priceRange: [min, max],
//   bedroomsRange: [min, max],
//   dateAdded: Date (on or after),
//   postcode: string (partial match case-insensitive)
// }

export function parsePropertyDate(p) {
  if (!p) return null;
  if (p.dateAdded) {
    const d = new Date(p.dateAdded);
    return isNaN(d.getTime()) ? null : d;
  }
  if (p.added && p.added.year) {
    try {
      const month = p.added.month || 'January';
      const day = p.added.day || 1;
      const year = p.added.year;
      // parse by constructing a string like 'June 1, 2025'
      const d = new Date(`${month} ${day}, ${year}`);
      return isNaN(d.getTime()) ? null : d;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function filterProperties(properties = [], criteria = {}) {
  if (!Array.isArray(properties)) return [];
  const { type, priceRange, bedroomsRange, dateAdded, postcode } = criteria || {};

  return properties.filter((p) => {
    // type
    if (type && type !== 'all') {
      const ptype = (p.type || p.Type || '').toString().toLowerCase();
      if (ptype !== type.toString().toLowerCase()) return false;
    }

    // price
    if (Array.isArray(priceRange) && typeof priceRange[0] === 'number' && typeof priceRange[1] === 'number') {
      const price = Number(p.price);
      if (isNaN(price)) return false;
      if (price < priceRange[0] || price > priceRange[1]) return false;
    }

    // bedrooms
    if (Array.isArray(bedroomsRange) && typeof bedroomsRange[0] === 'number' && typeof bedroomsRange[1] === 'number') {
      const b = Number(p.bedrooms);
      if (isNaN(b)) return false;
      if (b < bedroomsRange[0] || b > bedroomsRange[1]) return false;
    }

    // date added (on or after)
    if (dateAdded instanceof Date && !isNaN(dateAdded.getTime())) {
      const pDate = parsePropertyDate(p);
      if (!pDate) return false;
      if (pDate < dateAdded) return false;
    }

    // postcode matching - check postcodeArea or location string
    if (postcode && postcode.toString().trim() !== '') {
      const pc = postcode.toString().trim().toUpperCase();
      if (p.postcodeArea && p.postcodeArea.toString().toUpperCase() === pc) {
        // match
      } else {
        const loc = (p.location || p.Location || '').toString().toUpperCase();
        if (!loc.includes(pc)) return false;
      }
    }

    return true;
  });
}

export default filterProperties;
