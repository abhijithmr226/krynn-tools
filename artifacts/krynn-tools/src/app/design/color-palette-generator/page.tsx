import { getRelatedTools, getTool } from "@/lib/tools";
import ColorPaletteTool from "./ColorPaletteTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("design", "color-palette-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function ColorPaletteGeneratorPage() {
  return (
    <ColorPaletteTool
      title="Color Palette Generator Free"
      subtitle="Generate beautiful color palettes from any color."
      howToUse={[
        "Pick a seed color using the color picker or enter a hex value directly.",
        "Choose a palette type: complementary, analogous, triadic, or split-complementary.",
        "Copy any color's hex value by clicking the copy button on the swatch.",
      ]}
      faq={[
        { question: "What are color harmonies?", answer: "Color harmonies are combinations of colors that are visually pleasing based on their positions on the color wheel. They include complementary, analogous, triadic, and split-complementary schemes." },
        { question: "What is the difference between palette types?", answer: "Complementary uses opposite colors, analogous uses adjacent colors, triadic uses three evenly spaced colors, and split-complementary uses a base plus two colors adjacent to its complement." },
        { question: "Can I use these palettes in my designs?", answer: "Yes. All generated palettes are free to use. Click the copy button on any swatch to get the hex value for use in your CSS, design tools, or code." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
