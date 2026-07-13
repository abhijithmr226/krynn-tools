"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

function validateJson(text: string): ValidationResult {
  if (!text.trim()) {
    return { valid: false, error: "Input is empty." };
  }
  try {
    JSON.parse(text);
    return { valid: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    const lineMatch = msg.match(/position (\d+)/);
    let line: number | undefined;
    if (lineMatch) {
      const pos = parseInt(lineMatch[1], 10);
      line = text.substring(0, pos).split("\n").length;
    }
    return { valid: false, error: msg, line };
  }
}

export default function JsonValidatorTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = useCallback(() => {
    setResult(validateJson(input));
  }, [input]);

  return (
    <ToolLayout
      title="JSON Validator Online Free"
      subtitle="Validate JSON syntax with error line highlighting."
      howToUse={[
        "Paste your JSON data into the text area below.",
        "Click the Validate button to check for syntax errors.",
        "View the validation result: valid or error with line number.",
      ]}
      faq={[
        { question: "What JSON errors are detected?", answer: "The validator detects syntax errors like missing commas, unclosed brackets, incorrect quotes, trailing commas, and invalid characters." },
        { question: "Does it check JSON structure?", answer: "No, it only validates JSON syntax. For schema validation, use a dedicated JSON Schema validator." },
        { question: "Is my data stored?", answer: "No. All validation happens in your browser. Your JSON data never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...\n\nExample: {"name": "John", "age": 30}'
            className="min-h-[250px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <button
          onClick={handleValidate}
          disabled={!input.trim()}
          className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
        >
          Validate JSON
        </button>

        {result && (
          <div
            className={`rounded-lg border p-4 ${
              result.valid
                ? "border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.valid ? (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Valid JSON</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-semibold">Invalid JSON</span>
                </>
              )}
            </div>
            {!result.valid && (
              <p className="mt-2 text-sm">
                {result.error}
                {result.line && ` (near line ${result.line})`}
              </p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
