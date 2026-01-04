// Simple favourites utility using localStorage
const STORAGE_KEY = 'favourites';

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    return [];
  }
}

function writeStorage(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    // ignore
  }
}

export function getFavourites() {
  return readStorage();
}

export function isFavourite(id) {
  if (!id) return false;
  const favs = readStorage();
  return favs.includes(id);
}

export function addFavourite(id) {
  if (!id) return getFavourites();
  const favs = readStorage();
  if (!favs.includes(id)) {
    favs.push(id);
    writeStorage(favs);
  }
  return favs;
}

export function removeFavourite(id) {
  if (!id) return getFavourites();
  let favs = readStorage();
  favs = favs.filter((x) => x !== id);
  writeStorage(favs);
  return favs;
}

export function toggleFavourite(id) {
  if (!id) return getFavourites();
  if (isFavourite(id)) return removeFavourite(id);
  return addFavourite(id);
}

export default {
  getFavourites,
  isFavourite,
  addFavourite,
  removeFavourite,
  toggleFavourite,
};
