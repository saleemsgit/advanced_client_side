import React, { useMemo, useState, useEffect } from "react";
import { useCombobox } from "downshift";
import { DayPicker } from "react-day-picker";
import Slider from "rc-slider";

import "react-day-picker/dist/style.css";
import "rc-slider/assets/index.css";

export default function SearchForm({ properties = [], onFilterChange = () => {} }) {
  const prices = useMemo(() => properties.map((p) => Number(p.price) || 0), [properties]);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 1000000);

  const beds = useMemo(() => properties.map((p) => Number(p.bedrooms) || 0), [properties]);
  const minBeds = Math.min(...beds, 0);
  const maxBeds = Math.max(...beds, 6);

  const postcodeOptions = useMemo(() => {
    const set = new Set();
    properties.forEach((p) => {
      const pc = (p.postcodeArea || (p.location || "").split(/\s+/).slice(-1)[0] || "").trim();
      if (pc) set.add(pc.toUpperCase());
    });
    return Array.from(set).sort();
  }, [properties]);

  const [type, setType] = useState("all");
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [bedroomsRange, setBedroomsRange] = useState([minBeds, maxBeds]);
  const [dateAdded, setDateAdded] = useState(null);
  const [postcode, setPostcode] = useState("");
  const [showDate, setShowDate] = useState(false);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
    setInputValue,
  } = useCombobox({
    items: postcodeOptions,
    inputValue: postcode,
    onInputValueChange: ({ inputValue }) => setPostcode(inputValue || ""),
    onSelectedItemChange: ({ selectedItem }) => setPostcode(selectedItem || ""),
    itemToString: (item) => (item ? String(item) : ""),
  });

  useEffect(() => {
    onFilterChange({ type, priceRange, bedroomsRange, dateAdded, postcode });
  }, [type, priceRange, bedroomsRange, dateAdded, postcode, onFilterChange]);

  const reset = () => {
    setType("all");
    setPriceRange([minPrice, maxPrice]);
    setBedroomsRange([minBeds, maxBeds]);
    setDateAdded(null);
    setPostcode("");
    setInputValue("");
    setShowDate(false);
  };

  const pillBtn = (active) => ({
    borderRadius: 999,
    padding: "8px 12px",
    border: active ? "1px solid #111" : "1px solid rgba(0,0,0,0.12)",
    background: active ? "#111" : "#fff",
    color: active ? "#fff" : "#111",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
  });

  const labelStyle = { fontSize: 12, fontWeight: 800, color: "#333", marginBottom: 8, textTransform: "uppercase" };

  const fieldBox = {
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 14,
    padding: 14,
  };

  const inputStyle = {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    padding: "10px 12px",
    outline: "none",
    background: "#fff",
  };

  return (
    <section
      style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00))",
        borderRadius: 16,
        padding: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>Search filters</h3>
          <div style={{ marginTop: 6, color: "#555", fontSize: 13 }}>
            Adjust any filters. Results update automatically.
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          style={{
            border: "1px solid rgba(0,0,0,0.14)",
            background: "#fff",
            borderRadius: 12,
            padding: "10px 12px",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          Reset
        </button>
      </div>

      {/* Main grid */}
      <div
        className="sf-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 14,
        }}
      >
        {/* Type */}
        <div style={fieldBox}>
          <div style={labelStyle}>Property type</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "Any", value: "all" },
              { label: "House", value: "House" },
              { label: "Flat", value: "Flat" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                style={pillBtn(type === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Postcode */}
        <div style={{ ...fieldBox, position: "relative"  }}>
          <div style={labelStyle}>Postcode area</div>
          <div style={{ position: "relative", padding: 0, margin: 10, left: -15, right: -15 }}>
          <input
            {...getInputProps({ placeholder: "Try NW1, BR5, SE1" })}
            style={inputStyle}
            onFocus={() => {
              // just ensures it looks alive
            }}
          />

    <ul
      {...getMenuProps()}
      style={{
        position: "absolute",
        top: "100%",           // 👈 always just below input
        left: 0,
        right: 0,
        zIndex: 10,
        marginTop: 6,
        padding: 6,
        listStyle: "none",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 14,
        boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
        maxHeight: 220,
        overflowY: "auto",
        display: isOpen ? "block" : "none",
      }}
    >
            {(isOpen ? postcodeOptions : [])
              .filter((pc) => pc.includes((inputValue || "").toUpperCase()))
              .slice(0, 10)
              .map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  {...getItemProps({ item, index })}
                  style={{
                    padding: "10px 10px",
                    borderRadius: 10,
                    background: highlightedIndex === index ? "rgba(0,0,0,0.06)" : "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {item}
                </li>
              ))}
            {isOpen &&
              postcodeOptions.filter((pc) => pc.includes((inputValue || "").toUpperCase())).length === 0 && (
                <li style={{ padding: "10px 10px", color: "#666", fontSize: 13 }}>
                  No matches
                </li>
              )}
          </ul>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
            Current: <strong>{postcode ? postcode.toUpperCase() : "Any"}</strong>
          </div>
        </div>

        {/* Price slider */}
        <div style={{ ...fieldBox, gridColumn: "1 / -1" }}>
          <div style={labelStyle}>
            Price range{" "}
            <span style={{ textTransform: "none", fontWeight: 600, color: "#555" }}>
              (£{priceRange[0].toLocaleString()} – £{priceRange[1].toLocaleString()})
            </span>
          </div>
          <div style={{ padding: "10px 6px 4px" }}>
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              allowCross={false}
              value={priceRange}
              onChange={(vals) => setPriceRange(vals)}
            />
          </div>
        </div>

        {/* Beds slider */}
        <div style={{ ...fieldBox, gridColumn: "1 / -1" }}>
          <div style={labelStyle}>
            Bedrooms{" "}
            <span style={{ textTransform: "none", fontWeight: 600, color: "#555" }}>
              ({bedroomsRange[0]} – {bedroomsRange[1]})
            </span>
          </div>
          <div style={{ padding: "10px 6px 4px" }}>
            <Slider
              range
              min={minBeds}
              max={maxBeds}
              allowCross={false}
              value={bedroomsRange}
              onChange={(vals) => setBedroomsRange(vals)}
            />
          </div>
        </div>

        {/* Date toggle + picker */}
        <div style={{ ...fieldBox, gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={labelStyle}>Date added</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {dateAdded ? (
                  <>
                    Selected: <strong>{dateAdded.toLocaleDateString()}</strong>
                  </>
                ) : (
                  "Any date"
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setShowDate((s) => !s)}
                style={{
                  border: "1px solid rgba(0,0,0,0.14)",
                  background: "#fff",
                  borderRadius: 12,
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                {showDate ? "Hide" : "Pick date"}
              </button>

              <button
                type="button"
                onClick={() => setDateAdded(null)}
                style={{
                  border: "1px solid rgba(0,0,0,0.14)",
                  background: "#fff",
                  borderRadius: 12,
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {showDate && (
            <div
              style={{
                marginTop: 12,
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 14,
                padding: 10,
                background: "#fff",
              }}
            >
              <DayPicker mode="single" selected={dateAdded} onSelect={setDateAdded} />
            </div>
          )}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 820px) {
          .sf-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Nicer focus ring (modern look) */
        .sf-grid input:focus {
          border-color: rgba(26,115,232,0.9) !important;
          box-shadow: 0 0 0 4px rgba(26,115,232,0.15) !important;
        }
      `}</style>
    </section>
  );
}
