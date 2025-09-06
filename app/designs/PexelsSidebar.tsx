"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Grid, Stack, Typography, Button } from "@mui/material";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

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
  const [image, setImage] = useState<Photo | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas dimensions for Instagram Reels/Stories
  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1920;

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

        // rotate counter-clockwise
        ctx.rotate((-angle * Math.PI) / 180);

        // scale image to fit canvas with padding
        const scale = Math.min(
          (canvas.width * 0.8) / img.width,
          (canvas.height * 0.8) / img.height
        );
        const w = img.width * scale;
        const h = img.height * scale;

        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();

        angle = (angle + 0.5) % 360; // slower spin
        frameId = requestAnimationFrame(draw);
      };
      draw();
    };

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [image]);

  const startRecording = () => {
    if (!canvasRef.current) return;

    const stream = canvasRef.current.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "spin.webm";
      a.click();

      chunksRef.current = [];
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage({ id: Date.now(), src: { original: url }, url });
    }
  };

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
            onChange={handleUpload}
          />

          <div style={{ marginTop: "20px" }}>
            {/* Canvas preview shrunk for screen */}
            <canvas
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              ref={canvasRef}
              style={{
                border: "1px solid #ccc",
                width: "360px",
                height: "640px",
                display: image ? "block" : "none",
              }}
            />

            <div style={{ marginTop: "20px" }}>
              <Button onClick={startRecording}>Start Recording</Button>
              <Button onClick={stopRecording}>Stop & Download</Button>
            </div>
          </div>
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
      </Grid>
    </div>
  );
}