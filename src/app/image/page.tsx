import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Image Tools – Free Online Image Compressor, Resizer & Converter",
  description: "15+ free online image tools. Compress, resize, convert, and edit images without uploading to a server. Works in your browser.",
};

export default function ImageCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "image" })} />;
}
