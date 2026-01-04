import React from "react";
import { useDrop } from "react-dnd";
import { useFavourites } from "../context/FavouritesContext";
import { DND_TYPES } from "./PropertyCard";

export default function RemoveDropZone() {
  const { removeFavourite } = useFavourites();

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: DND_TYPES.FAVOURITE,
      drop: (item) => removeFavourite(item.id),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [removeFavourite]
  );

  const active = isOver && canDrop;

  return (
    <div
      ref={dropRef}
      style={{
        borderRadius: 14,
        padding: 14,
        border: active ? "1px solid rgba(220,0,0,0.7)" : "1px dashed rgba(0,0,0,0.2)",
        background: active ? "rgba(220,0,0,0.08)" : "rgba(0,0,0,0.02)",
        color: active ? "rgba(220,0,0,0.95)" : "#444",
        fontSize: 13,
        textAlign: "center",
        marginTop: 12,
      }}
    >
      Drag a favourite here to remove
    </div>
  );
}
