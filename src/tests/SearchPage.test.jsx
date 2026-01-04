import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Mock SearchForm so we don't deal with sliders/DayPicker
jest.mock("../components/SearchForm", () => {
  return function MockSearchForm({ onFilterChange }) {
    return (
      <div>
        <button onClick={() => onFilterChange({ type: "House" })}>
          Trigger Search
        </button>
      </div>
    );
  };
});

// Mock ResultsList so we can assert it renders
jest.mock("../components/ResultsList", () => {
  return function MockResultsList({ properties }) {
    return <div>ResultsList rendered: {properties.length}</div>;
  };
});

// Mock favourites sidebar to keep test simple
jest.mock("../components/FavouritesPanel", () => () => <div>FavPanel</div>);
jest.mock("../components/RemoveDropZone", () => () => <div>RemoveZone</div>);

import SearchPage from "../pages/SearchPage";

test("SearchPage hides results until user searches, then shows results", () => {
  render(
    <BrowserRouter>
      <SearchPage />
    </BrowserRouter>
  );

  // Initially: guidance message, no results
  expect(
    screen.getByText(/Set your filters to start searching/i)
  ).toBeInTheDocument();

  // Trigger a search
  fireEvent.click(screen.getByText("Trigger Search"));

  // After search: results visible
  expect(screen.getByText(/ResultsList rendered/i)).toBeInTheDocument();
});
zU