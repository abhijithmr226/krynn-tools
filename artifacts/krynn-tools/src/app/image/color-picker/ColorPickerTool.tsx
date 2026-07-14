import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface PickedColor {
  hex: string;
  rgb: string;
  hsl: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return `hsl(0, 0%, ${Math.round(l * 100)}%)`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorPickerTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pickedColor, setPickedColor] = useState<PickedColor | null>(null);
  const [history, setHistory] = useState<PickedColor[]>([]);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const drawImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxW = 600;
    const maxH = 500;
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
      setError("Please upload a JPG, PNG, WebP, or GIF image.");
      return;
    }
    setError("");
    setFile(f);
    setPickedColor(null);
    setHistory([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        drawImage(img);
      };
      img.src = url;
    };
    reader.readAsDataURL(f);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const color: PickedColor = {
      hex: rgbToHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: rgbToHsl(r, g, b),
    };
    setPickedColor(color);
    setHistory((prev) => [color, ...prev.filter((c) => c.hex !== color.hex)].slice(0, 10));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout
      title="Color Picker from Image Online Free"
      subtitle="Pick exact colors from any image. Free, instant color extraction tool."
      howToUse={[
        "Upload an image by dragging it into the drop zone.",
        "Click anywhere on the image to pick a color.",
        "View the HEX, RGB, and HSL values of the selected color.",
        "Click a color value to copy it to your clipboard.",
      ]}
      faq={[
        {
          question: "How accurate is the color picker?",
          answer: "The color picker extracts the exact pixel color value from the image, so it is 100% accurate for the specific pixel you click.",
        },
        {
          question: "Can I pick colors from any image format?",
          answer: "Yes. The tool supports JPG, PNG, WebP, and GIF images. Any image that can be rendered in the browser can be used.",
        },
        {
          question: "Is my image uploaded?",
          answer: "No. All processing happens in your browser using the Canvas API getImageData. Your image never leaves your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".jpg,.jpeg,.png,.webp,.gif" onFile={handleFile} />
        )}

        {file && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                <button
                  onClick={() => { setFile(null); setPickedColor(null); setHistory([]); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="max-w-full rounded-md cursor-crosshair"
                  style={{ maxHeight: 500 }}
                />
              </div>
              <p className="mt-2 text-center text-xs text-[var(--color-muted-foreground)]">
                Click anywhere on the image to pick a color
              </p>
            </div>

            {pickedColor && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 shrink-0 rounded-lg border border-[var(--color-border)]"
                    style={{ backgroundColor: pickedColor.hex }}
                  />
                  <div className="space-y-1 flex-1">
                    {[
                      { label: "HEX", value: pickedColor.hex },
                      { label: "RGB", value: pickedColor.rgb },
                      { label: "HSL", value: pickedColor.hsl },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => copyToClipboard(item.value)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm font-mono hover:bg-[var(--color-muted)] cursor-pointer transition-colors duration-200"
                      >
                        <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">{item.label}</span>
                        <span className="text-[var(--color-foreground)]">{item.value}</span>
                        <span className="ml-auto text-xs text-[var(--color-muted-foreground)]">Click to copy</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Color History</label>
                <div className="flex flex-wrap gap-2">
                  {history.map((c, i) => (
                    <button
                      key={`${c.hex}-${i}`}
                      onClick={() => copyToClipboard(c.hex)}
                      className="group relative h-10 w-10 cursor-pointer rounded-lg border border-[var(--color-border)] transition-transform duration-200 hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                      title={c.hex}
                    >
                      <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}
      </div>
    </ToolLayout>
  );
}
