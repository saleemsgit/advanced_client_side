import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const FavouritesContext = createContext(null);
const STORAGE_KEY = "favourites_v1";

function safeRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => safeRead()); // store full property objects

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // ignore
    }
  }, [favourites]);

  const isFavourite = useCallback(
    (id) => favourites.some((p) => p.id === id),
    [favourites]
  );

  const addFavourite = useCallback((property) => {
    if (!property?.id) return;
    setFavourites((prev) => {
      if (prev.some((p) => p.id === property.id)) return prev; // no duplicates
      return [...prev, property];
    });
  }, []);

  const removeFavourite = useCallback((id) => {
    if (!id) return;
    setFavourites((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearFavourites = useCallback(() => setFavourites([]), []);

  const value = useMemo(
    () => ({ favourites, addFavourite, removeFavourite, clearFavourites, isFavourite }),
    [favourites, addFavourite, removeFavourite, clearFavourites, isFavourite]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used inside <FavouritesProvider>");
  return ctx;
}
