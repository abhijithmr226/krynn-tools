import { getRelatedTools, getTool } from "@/lib/tools";
import UsernameValidatorTool from "./UsernameValidatorTool";
import { generateToolSchema } from "@/lib/seo";

const tool = getTool("social-media", "username-validator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name, slug: t.slug, categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function UsernameValidatorPage() {
  return <UsernameValidatorTool relatedTools={relatedTools} schema={schema} />;
}
