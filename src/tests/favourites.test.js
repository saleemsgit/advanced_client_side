import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavouritesProvider, useFavourites } from "../context/FavouritesContext";

function TestHarness() {
  const { favourites, addFavourite, removeFavourite, clearFavourites } = useFavourites();

  const p1 = { id: "prop1", price: 100, type: "House", bedrooms: 2, picture: "x.jpg" };
  const p2 = { id: "prop2", price: 200, type: "Flat", bedrooms: 1, picture: "y.jpg" };

  return (
    <div>
      <div data-testid="count">{favourites.length}</div>

      <button onClick={() => addFavourite(p1)}>add1</button>
      <button onClick={() => addFavourite(p1)}>add1-again</button>
      <button onClick={() => addFavourite(p2)}>add2</button>

      <button onClick={() => removeFavourite("prop1")}>remove1</button>
      <button onClick={clearFavourites}>clear</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test("favourites: add, prevent duplicates, remove, clear", () => {
  render(
    <FavouritesProvider>
      <TestHarness />
    </FavouritesProvider>
  );

  const count = screen.getByTestId("count");

  expect(count).toHaveTextContent("0");

  fireEvent.click(screen.getByText("add1"));
  expect(count).toHaveTextContent("1");

  fireEvent.click(screen.getByText("add1-again"));
  expect(count).toHaveTextContent("1");

  fireEvent.click(screen.getByText("add2"));
  expect(count).toHaveTextContent("2");

  fireEvent.click(screen.getByText("remove1"));
  expect(count).toHaveTextContent("1");

  fireEvent.click(screen.getByText("clear"));
  expect(count).toHaveTextContent("0");
});
