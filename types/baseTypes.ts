export interface Photo {
  id: number;
  url: string;
  src: { original: string };
}

interface PexelsResponse {
  photos: Photo[];
}