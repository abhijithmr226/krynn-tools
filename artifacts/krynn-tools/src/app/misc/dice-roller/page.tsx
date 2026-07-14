import { getRelatedTools, getTool } from "@/lib/tools";
import DiceRollerTool from "./DiceRollerTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("misc", "dice-roller")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function DiceRollerPage() {
  return (
    <DiceRollerTool
      title="Dice Roller Online Free"
      subtitle="Roll virtual dice online. D4, D6, D8, D10, D12, D20 dice roller."
      howToUse={[
        "Select the dice type you want to roll (D4, D6, D8, D10, D12, or D20) and how many dice to throw.",
        "Click the Roll button to roll the dice and watch the animation play out.",
        "View your results and roll history below — the history accumulates all your rolls in the current session.",
      ]}
      faq={[
        { question: "Are the dice rolls truly random?", answer: "Yes. Our dice roller uses crypto.getRandomValues() to generate cryptographically secure random results, providing fair rolls equivalent to physical dice." },
        { question: "What dice types are available?", answer: "We support all standard polyhedral dice used in tabletop RPGs: D4, D6, D8, D10, D12, and D20. You can roll up to 6 dice at once." },
        { question: "Does the roll history persist?", answer: "Roll history persists during your current browser session. If you refresh or close the page, the history resets. No data is stored on our servers." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
