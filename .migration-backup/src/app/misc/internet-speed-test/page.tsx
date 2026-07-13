import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import InternetSpeedTestTool from "./InternetSpeedTestTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("misc", "internet-speed-test")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function InternetSpeedTestPage() {
  return (
    <InternetSpeedTestTool
      title="Internet Speed Test Online Free"
      subtitle="Test your internet download speed with a simple client-side speed test."
      howToUse={[
        "Click the Start Test button to begin the speed test.",
        "The test downloads a small file and measures the transfer speed.",
        "View your download speed in Mbps and the test result details.",
      ]}
      faq={[
        { question: "How does this speed test work?", answer: "The test downloads a known-size file from a server and measures how long the transfer takes. Speed = Data transferred / Time. It provides an approximation of your download bandwidth." },
        { question: "Is this test accurate?", answer: "This is a simplified test and may not be as accurate as dedicated speed test services. Results can vary based on server load, network conditions, and browser performance." },
        { question: "What affects my speed test results?", answer: "WiFi vs wired connection, network congestion, server distance, browser extensions, and background downloads can all impact results." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
