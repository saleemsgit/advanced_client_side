import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDrag } from "react-dnd";
import { useFavourites } from "../context/FavouritesContext";
import { resolveImage } from "../utils/resolveImage";

export const DND_TYPES = {
  PROPERTY: "PROPERTY",
  FAVOURITE: "FAVOURITE",
};

export default function PropertyCard({ property }) {
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();
  const fav = isFavourite(property.id);

  const price =
    property.price != null ? `£${Number(property.price).toLocaleString()}` : "Price N/A";

  const title = property.location || "Property";
  const type = property.type || "N/A";
  const beds = property.bedrooms != null ? property.bedrooms : "–";
  const baths = property.bathrooms != null ? property.bathrooms : "–"; // add bathrooms in JSON if you want
  const summary = property.shortDescription || property.description || "";

  const images = useMemo(() => {
    const arr = Array.isArray(property.images) ? property.images.filter(Boolean) : [];
    if (property.picture) arr.unshift(property.picture);
    // de-dupe while preserving order
    return Array.from(new Set(arr));
  }, [property.images, property.picture]);

  // Resolve image paths (JSON stores "images/xxx.jpg" paths that are in src/images)
  const mainImgRaw = images[1] || "/placeholder.png";
  const sideImg1Raw = images[1] || mainImgRaw;
  const sideImg2Raw = images[2] || mainImgRaw;

  const mainImg = resolveImage(mainImgRaw);
  const sideImg1 = resolveImage(sideImg1Raw);
  const sideImg2 = resolveImage(sideImg2Raw);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_TYPES.PROPERTY,
      item: { property },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [property]
  );

  const toggleFav = () => {
    if (fav) removeFavourite(property.id);
    else addFavourite(property);
  };

  return (
    <article
      ref={dragRef}
      title="Drag this card to Favourites"
      style={{
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        opacity: isDragging ? 0.55 : 1,
        cursor: "grab",
      }}
    >
      {/* Top label bar */}
      <div
        style={{
          background: "#0f7a80",
          color: "#fff",
          fontWeight: 700,
          letterSpacing: 0.4,
          padding: "8px 12px",
          fontSize: 12,
          textTransform: "uppercase",
        }}
      >
        Featured Property
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.7fr 1.1fr",
          gap: 0,
          minHeight: 220,
        }}
      >
        {/* Left big image */}
        <div style={{ position: "relative" }}>
          <img
            src={mainImg}
            alt={`Property ${property.id}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* Price bar bottom-left */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              background: "#0f7a80",
              color: "#fff",
              padding: "10px 14px",
              fontSize: 22,
              fontWeight: 800,
              lineHeight: 1,
              minWidth: 160,
            }}
          >
            {price}
          </div>
        </div>

        {/* Middle stacked images */}
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr" }}>
          <img
            src={sideImg1}
            alt="Preview 1"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <img
            src={sideImg2}
            alt="Preview 2"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Right details */}
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  marginBottom: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </div>
              <div style={{ color: "#444", fontSize: 13 }}>
                <strong style={{ fontWeight: 700 }}>{type}</strong>
                <span style={{ marginLeft: 10 }}>🛏 {beds}</span>
                <span style={{ marginLeft: 10 }}>🛁 {baths}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleFav}
              style={{
                border: "1px solid rgba(0,0,0,0.18)",
                background: fav ? "#111" : "#fff",
                color: fav ? "#fff" : "#111",
                borderRadius: 10,
                padding: "8px 10px",
                cursor: "pointer",
                height: 38,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {fav ? "Saved" : "Save"}
            </button>
          </div>

          <div
            style={{
              color: "#333",
              fontSize: 13,
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {summary}
          </div>

          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#666" }}>
              {property.added?.day && property.added?.month && property.added?.year
                ? `Added on ${property.added.day} ${property.added.month} ${property.added.year}`
                : ""}
            </div>

            <Link
              to={`/property/${property.id}`}
              style={{
                textDecoration: "none",
                fontWeight: 800,
                color: "#0f7a80",
              }}
            >
              View →
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive tweak without extra CSS files */}
      <style>{`
        @media (max-width: 900px) {
          article {
            border-radius: 12px;
          }
        }
      `}</style>
    </article>
  );
}
