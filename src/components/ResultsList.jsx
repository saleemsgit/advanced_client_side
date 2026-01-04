import React from "react";
import PropertyCard from "./PropertyCard";

export default function ResultsList({ properties }) {
  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <div style={{ marginTop: 12, padding: 14, background: "#fff", borderRadius: 12 }}>
        No properties found.
      </div>
    );
  }

  return (
    <section style={{ marginTop: 12 }}>
      {/* Results header bar (Rightmove-ish) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          background: "#fff",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 14, color: "#333" }}>
          <strong>{properties.length.toLocaleString()}</strong> results
        </div>

        {/* Sort dropdown placeholder (optional) */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#555" }}>Sort:</span>
          <select
            defaultValue="relevance"
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#fff",
            }}
            onChange={() => {
              // optional: hook this to sort later
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="highest">Highest price</option>
            <option value="lowest">Lowest price</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Stacked list of full-width cards */}
      <div style={{ display: "grid", gap: 14 }}>
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
