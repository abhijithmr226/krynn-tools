import { getRelatedTools, getTool } from "@/lib/tools";
import SpinnerWheelTool from "./SpinnerWheelTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("misc", "spinner-wheel")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function SpinnerWheelPage() {
  return <SpinnerWheelTool relatedTools={relatedTools} schema={schema} />;
}
