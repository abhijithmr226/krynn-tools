import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface DecodedJwt {
  header: object;
  payload: object;
  signature: string;
}

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return atob(base64);
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format. A JWT must have three parts separated by dots.");
  }

  try {
    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    const signature = Array.from(new Uint8Array(
      Uint8Array.from(decodeBase64Url(parts[2]), (c) => c.charCodeAt(0))
    ))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return { header, payload, signature };
  } catch {
    throw new Error("Failed to decode JWT. The token appears to be malformed.");
  }
}

export default function JwtDecoderTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const handleDecode = useCallback(() => {
    setError("");
    setDecoded(null);
    try {
      const result = decodeJwt(input);
      setDecoded(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JWT token");
    }
  }, [input]);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const sections = decoded
    ? [
        { label: "Header", data: decoded.header, key: "header" },
        { label: "Payload", data: decoded.payload, key: "payload" },
      ]
    : [];

  return (
    <ToolLayout
      title="JWT Decoder Online Free"
      subtitle="Decode JSON Web Tokens online. View JWT header, payload, and signature."
      howToUse={[
        "Paste your JWT token into the text area below.",
        "Click the \"Decode\" button to parse the token.",
        "View the decoded header, payload, and signature with copy buttons.",
      ]}
      faq={[
        { question: "What is a JWT token?", answer: "JWT (JSON Web Token) is a compact, URL-safe means of representing claims between two parties. It consists of three parts: header, payload, and signature, all base64url-encoded and separated by dots." },
        { question: "Can this tool verify or validate a JWT?", answer: "No. This tool only decodes the token for inspection. It does not verify the cryptographic signature or validate claims like expiration. For verification, use a JWT library with the original secret or public key." },
        { question: "Is my token data sent to a server?", answer: "No. All decoding happens entirely in your browser using the native atob() function. Your JWT token never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            className="min-h-[160px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDecode}
            disabled={!input.trim()}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Decode
          </button>
          {decoded && (
            <>
              <button
                onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), "header")}
                className="btn-secondary px-4 py-2.5 font-semibold cursor-pointer"
              >
                {copied === "header" ? "Copied!" : "Copy Header"}
              </button>
              <button
                onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), "payload")}
                className="btn-secondary px-4 py-2.5 font-semibold cursor-pointer"
              >
                {copied === "payload" ? "Copied!" : "Copy Payload"}
              </button>
              <button
                onClick={() => handleCopy(decoded.signature, "signature")}
                className="btn-secondary px-4 py-2.5 font-semibold cursor-pointer"
              >
                {copied === "signature" ? "Copied!" : "Copy Signature"}
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {decoded && (
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.key}>
                <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                  {section.label}:
                </label>
                <pre className="max-h-64 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)]">
                  {JSON.stringify(section.data, null, 2)}
                </pre>
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Signature (Hex):
              </label>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-muted-foreground)] break-all">
                {decoded.signature}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
