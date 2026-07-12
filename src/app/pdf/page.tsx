import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "PDF Tools – Free Online PDF Compressor, Merger, Splitter & More",
  description: "15+ free online PDF tools. Compress, merge, split, convert, and edit PDF files instantly in your browser. No upload required.",
};

export default function PdfCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "pdf" })} />;
}
