"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";

interface Photo {
  id: number;
  url: string;
  src: { original: string };
}

interface PexelsResponse {
  photos: Photo[];
}

export default function PexelsSidebar({
  photos,
}: {
  photos: Photo[];
}) {
  const [image, setImage] = useState<Photo | null>(null);
  const [sideBar, setSideBar] = useState("Design");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState("");
  const [templatePhotos, setTemplatePhotos] = useState(photos)

  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1920;

  // const searchList = use(search)

  console.log("photos", photos);

  // Canvas rotation effect
  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.src.original;

    let angle = 0;
    let frameId: number;

    img.onload = () => {
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((-angle * Math.PI) / 180);

        const scale = Math.min(
          (canvas.width * 0.8) / img.width,
          (canvas.height * 0.8) / img.height
        );

        ctx.drawImage(
          img,
          (-img.width * scale) / 2,
          (-img.height * scale) / 2,
          img.width * scale,
          img.height * scale
        );

        ctx.restore();
        angle = (angle + 0.5) % 360;
        frameId = requestAnimationFrame(draw);
      };
      draw();
    };

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [image]);

  // Start recording canvas
  const startRecording = () => {
    if (!canvasRef.current) return;

    const stream = canvasRef.current.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
  };

  // Stop recording and download WebM
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = () => {
      const webmBlob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(webmBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "spin.webm";
      a.click();

      chunksRef.current = [];
    };

    mediaRecorderRef.current.stop();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file)
      setImage({
        id: Date.now(),
        src: { original: URL.createObjectURL(file) },
        url: URL.createObjectURL(file),
      });
  };

  const handleSideBarClick = (displayPanel: string) => {
    if (displayPanel === "Design") {
      setSideBar("Design");
    } else if (displayPanel === "Uploads") {
      setSideBar("Uploads");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  console.log("name", name);

  const handleSearchClick = async () => {
    if (!name) return;
    const res = await fetch(`/api/search?query=${encodeURIComponent(name)}&per_page=20`);
    const photos: Photo[] = await res.json();
    setTemplatePhotos(photos);
  };

  console.log('templatePhotos', templatePhotos)

  const renderSidePanel = () => {
    if (sideBar === "Design") {
      return (
        <div>
          <TextField
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      onClick={handleSearchClick}
                      style={{ cursor: "pointer" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            style={{ backgroundColor: "white", width: "100%" }}
            id="outlined-basic"
            label="Search Mobile Video Templates"
            variant="outlined"
            placeholder="Search Templates"
            onChange={handleSearchChange}
          />
          <Typography>Templates for you</Typography>
          <Stack direction="row" style={{ display: "flex", flexWrap: "wrap" }}>
            {templatePhotos.map((photo) => (
              <img
                style={{ height: "14em", width: "10em" }}
                title="default Pexel Templates"
                src={photo.src.original}
                key={photo.id}
              />
            ))}
          </Stack>
        </div>
      );
    } else if (sideBar === "Uploads") {
      return (
        <div>
          <Typography>Upload Side Bar</Typography>
          <input
            title="Upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
          />
          <div style={{ marginTop: "20px" }}>
            <canvas
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              ref={canvasRef}
              style={{
                width: "360px",
                height: "640px",
                display: image ? "block" : "none",
              }}
            />
            <div style={{ marginTop: "20px" }}>
              <Button onClick={startRecording}>Start Recording</Button>
              <Button onClick={stopRecording}>Stop & Download WebM</Button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Grid container>
        <Grid style={{ marginTop: "20px" }} size={1}>
          <Stack spacing={3}>
            <div>
              <Stack>
                <HomeIcon />
                <Link href="/">Home</Link>
              </Stack>
            </div>

            <div>
              <Stack>
                <AutoAwesomeMosaicIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSideBarClick("Design")}
                />
                <Typography>Design</Typography>
              </Stack>
            </div>

            <div>
              <Stack>
                <DriveFolderUploadIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSideBarClick("Uploads")}
                />
                <Typography>Uploads</Typography>
              </Stack>
            </div>
          </Stack>
        </Grid>
        <Grid style={{ marginTop: "20px" }} size={3}>
          {renderSidePanel()}
        </Grid>
      </Grid>
    </div>
  );
}
