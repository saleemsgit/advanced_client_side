import React from "react";
import { useDrop, useDrag } from "react-dnd";
import { Link } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext";
import { DND_TYPES } from "./PropertyCard";
import { resolveImage } from "../utils/resolveImage";

function FavouriteRow({ property }) {
  const { removeFavourite } = useFavourites();

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_TYPES.FAVOURITE,
      item: { id: property.id },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [property.id]
  );

  return (
    <div
      ref={dragRef}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
        opacity: isDragging ? 0.55 : 1,
        cursor: "grab",
      }}
      title="Drag to Remove area to delete"
    >
      <img
        src={resolveImage(property.picture || property.images?.[0] || "/placeholder.png")}
        alt="Favourite"
        width={52}
        height={40}
        style={{ borderRadius: 8, objectFit: "cover" }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          £{Number(property.price).toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: "#555" }}>
          {property.type} · {property.bedrooms} bed
        </div>
        <Link to={`/property/${property.id}`} style={{ fontSize: 12 }}>
          Open →
        </Link>
      </div>

      <button
        type="button"
        onClick={() => removeFavourite(property.id)}
        style={{
          border: "1px solid rgba(0,0,0,0.15)",
          background: "#fff",
          borderRadius: 8,
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default function FavouritesPanel() {
  const { favourites, addFavourite, clearFavourites } = useFavourites();

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: DND_TYPES.PROPERTY,
      drop: (item) => addFavourite(item.property),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [addFavourite]
  );

  const active = isOver && canDrop;

  return (
    <aside
      ref={dropRef}
      style={{
        position: "sticky",
        top: 16,
        alignSelf: "start",
        background: active ? "rgba(26,115,232,0.12)" : "rgba(0,0,0,0.03)",
        border: active ? "1px dashed rgba(26,115,232,0.8)" : "1px solid rgba(0,0,0,0.06)",
        borderRadius: 14,
        padding: 14,
        minHeight: 240,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Favourites</h3>
        <button
          type="button"
          onClick={clearFavourites}
          disabled={favourites.length === 0}
          style={{
            border: "1px solid rgba(0,0,0,0.15)",
            background: "#fff",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: favourites.length ? "pointer" : "not-allowed",
            opacity: favourites.length ? 1 : 0.5,
          }}
        >
          Clear
        </button>
      </div>

      <p style={{ margin: "8px 0 10px", color: "#555", fontSize: 13 }}>
        Drag a result card here or press Favourite.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {favourites.length === 0 ? (
          <div style={{ color: "#666", fontSize: 13, padding: 10 }}>
            No favourites yet.
          </div>
        ) : (
          favourites.map((p) => <FavouriteRow key={p.id} property={p} />)
        )}
      </div>
    </aside>
  );
}
