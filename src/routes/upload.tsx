import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  ArrowLeft,
  Camera,
  ImageIcon,
  Leaf,
  Sparkles,
  Upload as UploadIcon,
  X,
} from "lucide-react";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Your Meal — PlateIQ" },
      {
        name: "description",
        content:
          "Upload a photo of your meal to get instant AI-powered nutrition analysis and a personalised health score from PlateIQ.",
      },
      { property: "og:title", content: "Upload Your Meal — PlateIQ" },
      {
        property: "og:description",
        content:
          "Upload a photo of your meal to get instant AI-powered nutrition analysis from PlateIQ.",
      },
    ],
  }),
  component: UploadPage,
});

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png"];

function UploadPage() {
  const navigate = useNavigate();
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | undefined | null) => {
    setError(null);
    if (!file) return;
    const isAllowed =
      ALLOWED.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);
    if (!isAllowed) {
      setError("Unsupported format. Please upload a JPG, JPEG or PNG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is over 10 MB. Try a smaller photo.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setFileName(file.name);
    setFileSize(file.size);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) =>
    handleFile(e.target.files?.[0]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName("");
    setFileSize(0);
    if (galleryRef.current) galleryRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const prettySize = (b: number) =>
    b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">PlateIQ</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft transition hover:-translate-y-0.5 hover:bg-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-6 md:pt-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Step 1 of 2 — Upload
          </span>
          <h1 className="mt-5 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">
            Upload your meal.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            Drag a photo into the box below, pick one from your gallery, or snap a fresh
            shot — we'll handle the rest.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative mt-10 overflow-hidden rounded-[2rem] border-2 border-dashed bg-card p-6 shadow-soft transition-all duration-300 md:p-10 ${
            dragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50"
          }`}
        >
          {preview ? (
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border bg-secondary/40">
                <img
                  src={preview}
                  alt="Selected meal preview"
                  className="mx-auto max-h-[420px] w-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={clearPreview}
                className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-card"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate pr-3">{fileName}</span>
                <span>{prettySize(fileSize)}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <UploadIcon className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-display text-xl font-semibold">
                Drag & drop your photo here
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                or choose one of the options below. Your image stays on your device until
                you hit analyze.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5"
                >
                  <ImageIcon className="h-4 w-4" />
                  Upload from gallery
                </button>
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary"
                >
                  <Camera className="h-4 w-4 text-accent" />
                  Take a photo
                </button>
              </div>
            </div>
          )}

          <input
            ref={galleryRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={onInput}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onInput}
          />
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5">
            Supported: <span className="font-medium text-foreground">JPG · JPEG · PNG</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5">
            Max size: <span className="font-medium text-foreground">10 MB</span>
          </span>
        </div>

        {/* Analyze CTA */}
        <div className="mt-10 flex flex-col items-center">
          <button
            type="button"
            disabled={!preview}
            onClick={() => navigate({ to: "/results" })}
            className="group inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-primary px-8 py-5 text-base font-medium text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Analyze Meal
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            {preview
              ? "Looks delicious. Tap to get your nutrition breakdown."
              : "Add a photo to enable analysis."}
          </p>
        </div>
      </main>
    </div>
  );
}
