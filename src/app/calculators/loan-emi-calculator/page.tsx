import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import EmiCalculatorTool from "./EmiCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "loan-emi-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function LoanEmiCalculatorPage() {
  return (
    <EmiCalculatorTool
      title="Loan EMI Calculator Free"
      subtitle="Calculate loan EMI with amortization schedule."
      howToUse={[
        "Enter the loan amount, annual interest rate, and loan tenure.",
        "Choose between months or years for the tenure unit.",
        "Click Calculate to see your monthly EMI, total interest, and a first-year amortization summary.",
      ]}
      faq={[
        { question: "What is EMI?", answer: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender on a specified date each month, covering both principal and interest." },
        { question: "How is EMI calculated?", answer: "EMI = P Ã— r Ã— (1 + r)^n / ((1 + r)^n - 1), where P is the principal loan amount, r is the monthly interest rate, and n is the total number of monthly installments." },
        { question: "Can I prepay my loan?", answer: "Most loans allow prepayment, which reduces the outstanding principal and saves on interest. This calculator shows the standard amortization schedule without prepayment." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
