import { lazy } from "react";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const ResumeBuilderTool = lazy(() => import("./ResumeBuilderTool"));

const tool = getTool("misc", "resume-builder")!;
const related = getRelatedTools(tool);
const schema = generateToolSchema(tool);

export default function ResumeBuilderPage() {
  return (
    <ToolLayout
      title="Free Online Resume Builder"
      subtitle="Create a professional resume in minutes. Fill in your details, choose a template, and download as PDF. 100% free, no signup required."
      howToUse={[
        "Fill in your personal details, work experience, education, and skills.",
        "Choose a resume template style that matches your industry.",
        "Preview your resume in real-time as you type.",
        "Download your finished resume as a PDF file.",
      ]}
      faq={[
        {
          question: "Is the resume builder really free?",
          answer: "Yes. Our resume builder is 100% free with no hidden charges, watermarks, or signup required. You can create and download unlimited resumes.",
        },
        {
          question: "Can I customize the template?",
          answer: "Yes. Choose from multiple professional templates including Modern, Classic, Minimal, and Creative styles. Each template is designed to pass ATS scanners.",
        },
        {
          question: "Is my data stored on a server?",
          answer: "No. All resume data stays in your browser. Nothing is uploaded or stored on any server. Your information is completely private.",
        },
        {
          question: "What format is the resume exported in?",
          answer: "Your resume is exported as a high-quality PDF file that's ready to send to employers. PDF format ensures your formatting stays consistent across all devices.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <ResumeBuilderTool />
    </ToolLayout>
  );
}
