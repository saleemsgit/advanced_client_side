import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import propertiesData from "../data/properties.json";
import { isFavourite, toggleFavourite } from "../utils/favourites";
import { resolveImage } from "../utils/resolveImage";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default function PropertyPage() {
  const { id } = useParams();

  const properties = useMemo(
    () => (Array.isArray(propertiesData?.properties) ? propertiesData.properties : []),
    []
  );

  const property = useMemo(() => properties.find((p) => p.id === id), [properties, id]);

  // Safe derived arrays/fields
  const images = property?.images?.length
    ? property.images
    : property?.picture
    ? [property.picture]
    : [];

  const floorPlan = property?.floorPlan || property?.floorplan || null;
  const lat = property?.lat ?? property?.latitude ?? null;
  const lng = property?.lng ?? property?.longitude ?? null;

  const [fav, setFav] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Initialize state only when property is available
  useEffect(() => {
    if (!property) return;
    setFav(isFavourite(property.id));
    setMainImage(images[0] ? resolveImage(images[0]) : "");
    setLightboxIndex(0);
  }, [property, id]); // images derived from property, so no need to include separately

  if (!property) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Property not found.</p>
        <Link to="/">← Back to search</Link>
      </div>
    );
  }

  const handleFavourite = () => {
    toggleFavourite(property.id);
    setFav(isFavourite(property.id));
  };

  const openLightboxAt = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    if (!images.length) return;
    setLightboxIndex((i) => (i + 1) % images.length);
  };

  const prevImage = () => {
    if (!images.length) return;
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  };

  const mapSrc =
    lat != null && lng != null
      ? `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
      : null;

  return (
    <div style={{ padding: "1rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <Link to="/">← Back to search</Link>

        <button type="button" onClick={handleFavourite}>
          {fav ? "Remove from favourites" : "Add to favourites"}
        </button>
      </div>

      <h2 style={{ marginTop: 12 }}>
        {property.type} · {property.bedrooms} bedrooms
      </h2>
      <p style={{ margin: "6px 0" }}>
        <strong>£{Number(property.price).toLocaleString()}</strong>
      </p>
      <p style={{ margin: "6px 0", color: "#444" }}>{property.location}</p>

      {/* Gallery */}
      <div style={{ marginTop: 16 }}>
        {mainImage ? (
          <img
            src={mainImage}
            alt="Main property"
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "cover",
              borderRadius: 8,
              cursor: images.length ? "pointer" : "default",
            }}
            onClick={() => images.length && openLightboxAt(Math.max(0, images.findIndex(i => resolveImage(i) === mainImage)))}
          />
        ) : (
          <div style={{ padding: 24, background: "#f2f2f2", borderRadius: 8 }}>
            No image available
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          {images.map((img, index) => (
            <img
              key={`${img}-${index}`}
              src={resolveImage(img)}
              alt={`Thumbnail ${index + 1}`}
              width={90}
              height={65}
              style={{
                objectFit: "cover",
                borderRadius: 6,
                cursor: "pointer",
                border: resolveImage(img) === mainImage ? "2px solid #1a73e8" : "2px solid transparent",
              }}
              onClick={() => setMainImage(resolveImage(img))}
              onDoubleClick={() => openLightboxAt(index)}
            />
          ))}
        </div>

        {images.length > 0 && (
          <button type="button" style={{ marginTop: 10 }} onClick={() => openLightboxAt(0)}>
            View all images
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 18 }}>
        <Tabs>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Floor plan</Tab>
            <Tab>Map</Tab>
          </TabList>

          <TabPanel>
            <div style={{ padding: "0.75rem 0" }}>
              <p style={{ lineHeight: 1.5 }}>{property.description}</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div style={{ padding: "0.75rem 0" }}>
              {floorPlan ? (
                <img
                  src={resolveImage(floorPlan)}
                  alt="Floor plan"
                  style={{ width: "100%", maxWidth: 800, borderRadius: 8 }}
                />
              ) : (
                <p>No floor plan provided for this property.</p>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <div style={{ padding: "0.75rem 0" }}>
              {mapSrc ? (
                <iframe
                  title="Google map"
                  src={mapSrc}
                  width="100%"
                  height="360"
                  style={{ border: 0, borderRadius: 8 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <p>
                  No map coordinates provided. Add <code>lat</code> and <code>lng</code> to your JSON for this property.
                </p>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Lightbox (view all images) */}
      {lightboxOpen && images.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111",
              borderRadius: 10,
              padding: 12,
              maxWidth: 960,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ color: "#fff" }}>
                Image {lightboxIndex + 1} of {images.length}
              </div>
              <button type="button" onClick={closeLightbox}>
                Close
              </button>
            </div>

            <div style={{ marginTop: 10 }}>
              <img
                src={resolveImage(images[lightboxIndex])}
                alt={`Property image ${lightboxIndex + 1}`}
                style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 8 }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <button type="button" onClick={prevImage}>
                  ← Prev
                </button>
                <button type="button" onClick={nextImage}>
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
