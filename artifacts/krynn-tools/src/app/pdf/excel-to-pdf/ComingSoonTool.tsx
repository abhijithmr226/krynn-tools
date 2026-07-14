import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  toolName: string;
  description: string;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function ComingSoonTool({ toolName, description, relatedTools, schema }: Props) {
  return (
    <ToolLayout
      title={`${toolName} — Coming Soon`}
      subtitle={description}
      howToUse={[
        "This tool is currently under development.",
        "Excel-to-PDF conversion requires server-side processing.",
        "We are working on implementing it using a secure server pipeline.",
        "Stay tuned — it will be available soon!",
      ]}
      faq={[
        {
          question: "Why is this tool not available yet?",
          answer: "Converting Excel files to PDF requires parsing spreadsheet data, which cannot be done entirely in the browser. We are implementing a secure server-side solution.",
        },
        {
          question: "Can I use any alternative?",
          answer: "In the meantime, you can use office software like Microsoft Excel or Google Sheets to export your spreadsheets as PDF.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-muted)]">
          <svg className="h-10 w-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-[var(--color-foreground)]">Coming Soon</h3>
        <p className="text-[var(--color-muted-foreground)] max-w-md mx-auto">
          {description} Server-side processing is required for this conversion and is currently being developed.
        </p>
      </div>
    </ToolLayout>
  );
}
