import React, { useMemo, useState, useCallback } from "react";
import propertiesData from "../data/properties.json";
import SearchForm from "../components/SearchForm";
import ResultsList from "../components/ResultsList";
import filterProperties from "../utils/filterProperties";
import FavouritesPanel from "../components/FavouritesPanel";
import RemoveDropZone from "../components/RemoveDropZone";

export default function SearchPage() {
  const properties = useMemo(() => {
    return Array.isArray(propertiesData?.properties) ? propertiesData.properties : [];
  }, []);

  // filters chosen in the form
  const [filters, setFilters] = useState({});

  // controls whether results should appear at all
  const [hasSearched, setHasSearched] = useState(false);

  // called by SearchForm every time user changes a filter
  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters || {});
    setHasSearched(true); // show results once user starts filtering
  }, []);

  const clearFilters = () => {
    setFilters({});
    setHasSearched(false); // hide results again
  };

  const filteredProperties = useMemo(() => {
    if (!hasSearched) return [];
    return filterProperties(properties, filters);
  }, [hasSearched, properties, filters]);

  return (
    <div style={{ background: "#f6f7f9", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
        {/* Top header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Property Search</h2>
            <p style={{ margin: "6px 0 0", color: "#555" }}>
              Use filters to narrow results. Drag cards to Favourites.
            </p>
          </div>

          <button
            onClick={clearFilters}
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#fff",
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer",
              height: 40,
              fontWeight: 700,
            }}
          >
            Clear filters
          </button>
        </header>

        {/* Layout: left results + right favourites */}
        <div
          className="_grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 16,
            marginTop: 14,
          }}
        >
          {/* Left column */}
          <main>
            {/* Filter form */}
            <section
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 14,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <SearchForm properties={properties} onFilterChange={handleFilterChange} />
            </section>

            {/* Results */}
            <section style={{ marginTop: 14 }}>
              {!hasSearched ? (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: 14,
                    border: "1px solid rgba(0,0,0,0.06)",
                    color: "#555",
                  }}
                >
                  Set your filters to start searching.
                </div>
              ) : (
                <>
                  <p style={{ margin: "0 0 10px", color: "#444" }}>
                    Showing <strong>{filteredProperties.length}</strong> result(s)
                  </p>
                  <ResultsList properties={filteredProperties} />
                </>
              )}
            </section>
          </main>

          {/* Right column */}
          <aside>
            <FavouritesPanel />
            <RemoveDropZone />
          </aside>
        </div>

        {/* Mobile layout */}
        <style>{`
          @media (max-width: 900px) {
            ._grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
