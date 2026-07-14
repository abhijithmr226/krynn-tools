import { lazy } from "react";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const MergePdfTool = lazy(() => import("./MergePdfTool"));

const tool = getTool("pdf", "merge-pdf")!;
const related = getRelatedTools(tool);


const schema = generateToolSchema(tool);

export default function MergePdfPage() {
  return (
    <ToolLayout
      title="Merge PDF Files Online Free"
      subtitle="Combine multiple PDF files into one document. Free, fast, and secure."
      howToUse={[
        "Upload two or more PDF files by dragging them into the drop zone.",
        "Arrange the files in your desired order using the move up/down buttons.",
        "Click the Merge PDF button to combine all files.",
        "Download the merged PDF document instantly.",
      ]}
      faq={[
        {
          question: "How many PDF files can I merge at once?",
          answer: "You can merge as many PDF files as your browser's memory allows. For the best experience, we recommend merging up to 20 files at a time.",
        },
        {
          question: "Will merging affect the quality of my PDFs?",
          answer: "No. Merging PDFs simply combines the pages from each file into a single document. There is no quality loss during the process.",
        },
        {
          question: "Can I reorder the files before merging?",
          answer: "Yes. After uploading your files, you can use the move up and move down buttons to arrange them in any order before merging.",
        },
        {
          question: "Are my files safe when merging?",
          answer: "Absolutely. All merging is performed locally in your browser using pdf-lib. Your files are never uploaded to any server.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <MergePdfTool />
    </ToolLayout>
  );
}
