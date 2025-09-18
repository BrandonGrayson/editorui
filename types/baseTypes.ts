export interface Photo {
  id: number;
  url: string;
  src: { original: string };
}

interface PexelsResponse {
  photos: Photo[];
}

export interface CanvasItem {
  id: string;         // unique ID for React keys & manipulation
  type: "image" | "text"; // element type
  x: number;          // x position on canvas
  y: number;          // y position on canvas
  width: number;      // item width
  height: number;     // item height
  rotation: number;   // degrees of rotation
  src: { original: string };      // image source (for type "image")
  text?: string;      // text content (for type "text")
  fontSize?: number;  // font size (for type "text")
  color?: string;     // text color or background fill
  zIndex: number;     // stacking order (what’s on top)
}