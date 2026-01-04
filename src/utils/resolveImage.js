// Utility to resolve image paths referenced in JSON to actual imported assets
// It uses webpack's require.context to bundle images from src/images so that
// paths like "images/prop1_1.jpg" work when used directly as image srcs.

const imagesContext = require.context("../images", false, /\.(png|jpe?g|svg|gif)$/);

export function resolveImage(path) {
  if (!path) return "/placeholder.png";

  // If path is a JSON-style path like "images/prop1_1.jpg", try to resolve
  // it from src/images via the require.context. If that fails, fall back to
  // a root-relative path (e.g. "/images/...").
  if (typeof path === "string" && path.startsWith("images/")) {
    const filename = path.replace(/^images\//, "");
    try {
      return imagesContext(`./${filename}`);
    } catch (err) {
      // If the asset doesn't exist in src/images, return a single placeholder
      // SVG from the public folder so the UI always shows an image.
      return "/images/placeholder.svg";
    }
  }

  // If the path is already an absolute path or an external URL, return it unchanged
  return path;
}
