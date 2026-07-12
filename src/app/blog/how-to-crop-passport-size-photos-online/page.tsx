import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Crop Passport Size Photos Online",
  description: "Learn how to crop passport size photos online for free. Includes US, UK, India, and other country-specific photo dimensions.",
  keywords: ["passport photo crop","passport size photo","crop photo online","passport photo dimensions"],
  alternates: { canonical: "https://krynntools.online/blog/how-to-crop-passport-size-photos-online" },
  openGraph: {
    title: "How to Crop Passport Size Photos Online",
    description: "Learn how to crop passport size photos online for free. Includes US, UK, India, and other country-specific photo dimensions.",
    type: "article",
    url: "https://krynntools.online/blog/how-to-crop-passport-size-photos-online",
    images: [{ url: "https://krynntools.online/images/blog/compress-image.svg", width: 1200, height: 630 }],
    publishedTime: "2026-07-12T00:00:00Z",
    authors: ["Krynn Tools"],
  },
};

export default function BlogPost() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline cursor-pointer"
      >
        ← Back to Blog
      </Link>

      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "How to Crop Passport Size Photos Online — Free Photo Cropper",
              description: "Learn how to crop passport size photos online for free.",
              datePublished: "2026-07-12",
              author: { "@type": "Organization", name: "Krynn Tools" },
              publisher: { "@type": "Organization", name: "Krynn Tools", logo: { "@type": "ImageObject", url: "/logo.png" } },
              mainEntityOfPage: { "@type": "WebPage", "@id": "https://krynntools.online/blog/how-to-crop-passport-size-photos-online" },
            }),
          }}
        />

        <h1 className="mb-4 text-3xl font-bold text-[var(--color-foreground)]">
          How to Crop Passport Size Photos Online
        </h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
          <span>Published: July 12, 2026</span>
          <span>·</span>
          <span>Image</span>
          <span>·</span>
          <span>6 min read</span>
        </div>

        <div className="prose max-w-none space-y-6 text-[var(--color-muted-foreground)] leading-relaxed">
          <p>
            Need a passport photo for a visa application, ID card, or official document?
            Going to a photo studio costs money and takes time. With the right online tool,
            you can crop any photo to the exact passport dimensions from the comfort of your
            home — for free.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Standard Passport Photo Sizes by Country
          </h2>
          <p>
            Passport photo requirements vary by country. Here are the most common
            dimensions:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg border border-[var(--color-border)] text-sm">
              <thead>
                <tr className="bg-[var(--color-muted)]">
                  <th className="border border-[var(--color-border)] px-4 py-2 text-left font-semibold text-[var(--color-foreground)]">Country</th>
                  <th className="border border-[var(--color-border)] px-4 py-2 text-left font-semibold text-[var(--color-foreground)]">Size (inches)</th>
                  <th className="border border-[var(--color-border)] px-4 py-2 text-left font-semibold text-[var(--color-foreground)]">Size (mm)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-[var(--color-border)] px-4 py-2">United States</td><td className="border border-[var(--color-border)] px-4 py-2">2 x 2</td><td className="border border-[var(--color-border)] px-4 py-2">51 x 51</td></tr>
                <tr className="bg-[var(--color-muted)]/50"><td className="border border-[var(--color-border)] px-4 py-2">United Kingdom</td><td className="border border-[var(--color-border)] px-4 py-2">3.5 x 4.5</td><td className="border border-[var(--color-border)] px-4 py-2">35 x 45</td></tr>
                <tr><td className="border border-[var(--color-border)] px-4 py-2">India</td><td className="border border-[var(--color-border)] px-4 py-2">2 x 2</td><td className="border border-[var(--color-border)] px-4 py-2">35 x 45</td></tr>
                <tr className="bg-[var(--color-muted)]/50"><td className="border border-[var(--color-border)] px-4 py-2">Canada</td><td className="border border-[var(--color-border)] px-4 py-2">2 x 2</td><td className="border border-[var(--color-border)] px-4 py-2">50 x 70</td></tr>
                <tr><td className="border border-[var(--color-border)] px-4 py-2">Schengen/EU</td><td className="border border-[var(--color-border)] px-4 py-2">1.4 x 1.8</td><td className="border border-[var(--color-border)] px-4 py-2">35 x 45</td></tr>
                <tr className="bg-[var(--color-muted)]/50"><td className="border border-[var(--color-border)] px-4 py-2">Australia</td><td className="border border-[var(--color-border)] px-4 py-2">1.6 x 2</td><td className="border border-[var(--color-border)] px-4 py-2">40 x 50</td></tr>
                <tr><td className="border border-[var(--color-border)] px-4 py-2">Japan</td><td className="border border-[var(--color-border)] px-4 py-2">1.4 x 1.8</td><td className="border border-[var(--color-border)] px-4 py-2">35 x 45</td></tr>
                <tr className="bg-[var(--color-muted)]/50"><td className="border border-[var(--color-border)] px-4 py-2">China</td><td className="border border-[var(--color-border)] px-4 py-2">1.4 x 2</td><td className="border border-[var(--color-border)] px-4 py-2">33 x 48</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Common Passport Photo Mistakes
          </h2>
          <p>
            Before cropping, make sure your source photo meets these basic requirements.
            Even the perfect crop will be rejected if the photo itself does not comply:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Wrong aspect ratio:</strong> The
              most common reason for rejection. Each country has specific width-to-height
              ratios that must be exact.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Head not centered:</strong> Your
              face should be centered in the frame with equal space on both sides.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Incorrect head size:</strong> Most
              countries require your head to occupy 50-70% of the photo height.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Background not white/light:</strong> Most
              passport photos require a plain white or very light gray background.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Low resolution:</strong> The photo
              should be at least 300 DPI for print quality.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            How to Crop a Passport Photo with Krynn Tools
          </h2>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                <strong className="text-[var(--color-foreground)]">Open the cropper:</strong> Go to{" "}
                <Link href="/image/crop-image" className="text-[var(--color-primary)] hover:underline">
                  /image/crop-image
                </Link>{" "}
                in your browser.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Upload your photo:</strong> Drag
                and drop your photo or click to browse. JPG, PNG, and WebP are supported.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Select a preset:</strong> Choose
                a passport photo preset from the size dropdown. The tool will automatically
                lock the crop area to the correct aspect ratio.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Adjust position:</strong> Drag
                the crop area to center your face. The preview shows exactly what will be
                in the final photo.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Download:</strong> Click
                &quot;Crop Image&quot; to process, then download your perfectly sized passport
                photo.
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Other Useful Photo Presets
          </h2>
          <p>
            The{" "}
            <Link href="/image/crop-image" className="text-[var(--color-primary)] hover:underline font-medium">
              Krynn Tools Image Cropper
            </Link>{" "}
            includes more than just passport sizes. You can also crop to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Profile pictures:</strong> 500x500px
              square for social media profiles.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Instagram post:</strong> 1080x1080px
              square for feed posts.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Instagram story:</strong> 1080x1920px
              vertical for stories and reels.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">YouTube thumbnail:</strong> 1280x720px
              for video thumbnails.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Facebook cover:</strong> Optimized
              dimensions for Facebook page and profile covers.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Privacy First: Why Client-Side Processing Matters
          </h2>
          <p>
            Passport photos contain your face — sensitive biometric data. Uploading them
            to random online services is a privacy risk. Krynn Tools processes your photo
            entirely in your browser. The image never leaves your device, making it safe
            to use with any photo, regardless of how personal it may be.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Conclusion
          </h2>
          <p>
            Cropping passport photos does not require a studio visit or expensive software.
            With{" "}
            <Link href="/image/crop-image" className="text-[var(--color-primary)] hover:underline font-medium">
              Krynn Tools&apos; Image Cropper
            </Link>
            , you get precise preset sizes for passport photos from multiple countries,
            plus social media presets — all processed privately in your browser.
          </p>
        </div>
      </article>
    </div>
  );
}
