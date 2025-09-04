"use client";
import * as React from "react";
import { useState } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import Link from "next/link";

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
  const [sidebar, setSideBar] = useState("Upload");
  const [image, setImage] = useState(photos[0]);
  console.log("photos", photos);

  const renderSideBar = () => {
    if (sidebar === "Upload") {
      return (
        <div>
          <Typography>Upload Side Bar</Typography>
          <input
            title="Upload Files"
            placeholder="Upload Files"
            type="file"
            accept="image/*"
          />
          <img
            style={{
              width: "200px",
              height: "200px",
              
            }}
            className="spin"
            alt="Test Photo"
            src={image.src.original}
          ></img>

          <style>{`
        .spin {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
      );
    } else if (sidebar === "Templates") {
      return (
        <div>
          <Typography>Templates</Typography>
        </div>
      );
    }
  };
  return (
    <div>
      <Grid container>
        <Grid size={2}>
          <Stack spacing={3}>
            <div>
              <DriveFolderUploadIcon />
              <Typography>Upload</Typography>
            </div>
            <div>
              <AutoAwesomeMosaicIcon />
              <Typography>Templates</Typography>
            </div>
          </Stack>
        </Grid>
        <Grid size={5}>{renderSideBar()}</Grid>
        {/* <Grid size={5}>
        {photos.map((photo) => (
          <img style={{height: '400px', width: '400px'}} key={photo.id} src={photo.src.original} alt={photo.src.original}></img>
        ))}
      </Grid> */}
      </Grid>
    </div>
  );
}
