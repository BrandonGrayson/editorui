import { Grid } from "@mui/material";
import * as React from "react";

interface Photo {
  id: number;
  url: string;
  src: {
    original: string;
  };
}

interface PexelsResponse {
  photos: Photo[];
}

export default function PexelsSidebar({ photos }: PexelsResponse) {

    console.log('photos', photos)
  return (
    <Grid container>
      <Grid size={5}>
        {photos.map((photo) => (
          <img style={{height: '400px', width: '400px'}} key={photo.id} src={photo.src.original} alt={photo.src.original}></img>
        ))}
      </Grid>
    </Grid>
  );
}
