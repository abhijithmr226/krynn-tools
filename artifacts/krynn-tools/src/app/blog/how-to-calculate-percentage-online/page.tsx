import { Link } from "wouter";
import BlogAd from "../BlogAd";


export default function BlogPost() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline cursor-pointer"
      >
        ← Back to Blog
      </Link>

      <article>
        <h1 className="mb-4 text-3xl font-bold text-[var(--color-foreground)]">
          How to Calculate Percentage Online (With Examples)
        </h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
          <span>Published: July 12, 2026</span>
          <span>·</span>
          <span>Calculators</span>
          <span>·</span>
          <span>10 min read</span>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-[var(--color-border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/blog/percentage-calculator.svg"
            alt="Percentage Calculator Tool Interface"
            className="w-full"
          />
        </div>

        <BlogAd />

        <div className="prose max-w-none space-y-6 text-[var(--color-muted-foreground)] leading-relaxed">
          <p>
            Percentages are everywhere — in shopping discounts, tax calculations, academic grades,
            business reports, and financial analysis. Whether you are figuring out how much you
            save during a sale, calculating a tip, or analyzing growth rates in a spreadsheet,
            understanding how to calculate percentages is an essential skill. The Krynn Tools{" "}
            <Link href="/calculators/percentage-calculator" className="text-[var(--color-primary)] hover:underline font-medium">
              Percentage Calculator
            </Link>{" "}
            handles the math for you instantly, but understanding the formulas behind the
            calculations helps you verify results and apply them in real-world situations.
          </p>

          <p>
            This guide covers every common percentage calculation — from basic percentages to
            percentage increase, decrease, difference, and reverse calculations — with clear
            examples for each.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            The Basic Percentage Formula
          </h2>
          <p>
            At its core, a percentage is simply a fraction out of 100. The fundamental formula
            for calculating a percentage is:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <p className="font-mono text-sm text-[var(--color-foreground)]">
              Percentage = (Part / Whole) × 100
            </p>
          </div>
          <p>
            If you scored 85 out of 100 on a test, your percentage is (85 / 100) × 100 = 85%.
            If you earned $450 on a $1,500 investment, your return percentage is (450 / 1500) ×
            100 = 30%.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Calculate What Percent A Is Of B
          </h2>
          <p>
            The most common percentage question: &quot;What percent of 200 is 50?&quot; Use the
            formula:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <p className="font-mono text-sm text-[var(--color-foreground)]">
              Percentage = (A / B) × 100
            </p>
          </div>
          <p>
            <strong className="text-[var(--color-foreground)]">Example:</strong> What percent of
            80 is 20?
          </p>
          <p>
            Percentage = (20 / 80) × 100 = 25%. So 20 is 25% of 80.
          </p>
          <p>
            <strong className="text-[var(--color-foreground)]">Real-world example:</strong> A
            store sells 120 items in a day and 45 of them are shoes. What percentage of sales
            were shoes?
          </p>
          <p>
            Percentage = (45 / 120) × 100 = 37.5%. Shoes accounted for 37.5% of daily sales.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Calculate X Percent of Y
          </h2>
          <p>
            When you know the percentage and need to find the actual amount, use:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <p className="font-mono text-sm text-[var(--color-foreground)]">
              Result = (Percentage / 100) × Whole
            </p>
          </div>
          <p>
            <strong className="text-[var(--color-foreground)]">Example:</strong> What is 15% of
            300?
          </p>
          <p>
            Result = (15 / 100) × 300 = 45. So 15% of 300 is 45.
          </p>
          <p>
            <strong className="text-[var(--color-foreground)]">Real-world example:</strong> A
            restaurant bill is $85 and you want to leave a 20% tip. How much is the tip?
          </p>
          <p>
            Tip = (20 / 100) × 85 = $17.00. Your total bill with tip is $102.00.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Percentage Increase
          </h2>
          <p>
            Percentage increase tells you how much a value has grown relative to its original
            value. This is commonly used for tracking price changes, growth rates, and
            performance improvements:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <p className="font-mono text-sm text-[var(--color-foreground)]">
              Percentage Increase = ((New Value - Old Value) / Old Value) × 100
            </p>
          </div>
          <p>
            <strong className="text-[var(--color-foreground)]">Example:</strong> A product
            price increases from $40 to $50. What is the percentage increase?
          </p>
          <p>
            Increase = ((50 - 40) / 40) × 100 = (10 / 40) × 100 = 25%. The price increased
            by 25%.
          </p>
          <p>
            <strong className="text-[var(--color-foreground)]">Real-world example:</strong> Your
            website traffic grew from 5,000 to 7,500 monthly visitors. What is the growth rate?
          </p>
          <p>
            Growth = ((7,500 - 5,000) / 5,000) × 100 = 50%. Your traffic grew by 50%.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Percentage Decrease
          </h2>
          <p>
            Percentage decrease measures how much a value has dropped relative to its original
            value:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <p className="font-mono text-sm text-[var(--color-foreground)]">
              Percentage Decrease = ((Old Value - New Value) / Old Value) × 100
            </p>
          </div>
          <p>
            <strong className="text-[var(--color-foreground)]">Example:</strong> A stock drops
            from $120 to $90. What is the percentage decrease?
          </p>
          <p>
            Decrease = ((120 - 90) / 120) × 100 = (30 / 120) × 100 = 25%. The stock
            decreased by 25%.
          </p>
          <p>
            <strong className="text-[var(--color-foreground)]">Real-world example:</strong> A
            company reduces its workforce from 200 employees to 170. What is the percentage
            reduction?
          </p>
          <p>
            Reduction = ((200 - 170) / 200) × 100 = 15%. The workforce was reduced by 15%.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Percentage Difference
          </h2>
          <p>
            Percentage difference compares two values without specifying which is the original.
            It answers: &quot;How different are these two numbers in percentage terms?&quot;
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <p className="font-mono text-sm text-[var(--color-foreground)]">
              Percentage Difference = (|A - B| / ((A + B) / 2)) × 100
            </p>
          </div>
          <p>
            <strong className="text-[var(--color-foreground)]">Example:</strong> Product A costs
            $80 and Product B costs $100. What is the percentage difference?
          </p>
          <p>
            Difference = (|80 - 100| / ((80 + 100) / 2)) × 100 = (20 / 90) × 100 = 22.22%.
          </p>
          <p>
            This is different from percentage increase or decrease because it uses the average of
            the two values as the baseline, making the comparison symmetric.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Reverse Percentage: Finding the Original Value
          </h2>
          <p>
            Sometimes you know the final value and the percentage change, and you need to find
            the original value. This is common when working with discounts or tax-inclusive prices:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <p className="font-mono text-sm text-[var(--color-foreground)]">
              Original Value = Final Value / (1 + Percentage/100) <br />
              Original Value = Final Value / (1 - Percentage/100)
            </p>
          </div>
          <p>
            <strong className="text-[var(--color-foreground)]">Example (after increase):</strong>{" "}
            A salary increased by 10% to $55,000. What was the original salary?
          </p>
          <p>
            Original = 55,000 / (1 + 10/100) = 55,000 / 1.10 = $50,000.
          </p>
          <p>
            <strong className="text-[var(--color-foreground)]">Example (after decrease):</strong>{" "}
            A jacket on sale for 30% off costs $70. What was the original price?
          </p>
          <p>
            Original = 70 / (1 - 30/100) = 70 / 0.70 = $100. The original price was $100.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            How to Use the Krynn Tools Percentage Calculator
          </h2>
          <p>
            The Krynn Tools percentage calculator handles all of these calculations without
            requiring you to memorize formulas. Here is how to use it:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                <strong className="text-[var(--color-foreground)]">Open the tool:</strong> Navigate
                to the{" "}
                <Link href="/calculators/percentage-calculator" className="text-[var(--color-primary)] hover:underline">
                  Percentage Calculator
                </Link>{" "}
                in your browser.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Select calculation type:</strong>{" "}
                Choose between finding a percentage of a number, calculating what percent one
                number is of another, percentage increase, decrease, or difference.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Enter your values:</strong> Type
                the numbers into the input fields. The calculator updates in real time.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Get the result:</strong> The
                answer appears instantly, along with the formula and step-by-step calculation.
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Common Percentage Mistakes
          </h2>
          <p>
            Percentage calculations seem simple, but mistakes are surprisingly common. Here are
            the most frequent errors:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Confusing increase and
              decrease:</strong> A 50% increase followed by a 50% decrease does NOT return you
              to the original value. A $100 item increased by 50% becomes $150, but decreasing
              $150 by 50% gives $75 — you are still down $25.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Using the wrong baseline:</strong>{" "}
              The denominator in a percentage calculation must be the correct reference value.
              &quot;30% more than 200&quot; uses 200 as the baseline, not 230.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Adding percentages
              directly:</strong> A 10% increase followed by a 20% increase is NOT a 30%
              total increase. The correct total increase is (1.10 × 1.20) - 1 = 32%.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Forgetting to multiply by
              100:</strong> The formula (Part / Whole) gives a decimal, not a percentage.
              Always multiply by 100 to convert to percentage form.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Practical Applications
          </h2>
          <p>
            Percentage calculations appear in virtually every area of daily life:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Shopping discounts:</strong> A
              25% discount on a $200 item saves you $50, bringing the price to $150.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Tax calculations:</strong> Sales
              tax of 8.5% on a $300 purchase adds $25.50, making the total $325.50.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Academic grades:</strong> Scoring
              42 out of 50 on an exam gives you 84% — a solid B+.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Financial returns:</strong> An
              investment that grows from $10,000 to $12,500 has a 25% return.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Body fat percentage:</strong>{" "}
              Understanding what percentage of body weight is fat helps track fitness progress.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Battery percentage:</strong> Your
              phone showing 35% means 35% of the battery capacity remains.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Quick Reference Table
          </h2>
          <p>
            Here are some commonly used percentage calculations for quick reference:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>1% of 1,000 = 10</li>
            <li>5% of 1,000 = 50</li>
            <li>10% of 1,000 = 100</li>
            <li>15% of 1,000 = 150</li>
            <li>20% of 1,000 = 200</li>
            <li>25% of 1,000 = 250</li>
            <li>50% of 1,000 = 500</li>
            <li>75% of 1,000 = 750</li>
            <li>100% of 1,000 = 1,000</li>
          </ul>
          <p>
            Memorizing these common percentages helps with mental math, but for anything beyond
            simple fractions, a calculator ensures accuracy.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Conclusion
          </h2>
          <p>
            Percentage calculations are among the most practical math skills you can have. From
            shopping and cooking to business analysis and academic work, percentages appear
            constantly. Understanding the formulas helps you verify results and catch errors, while
            a reliable online calculator handles the arithmetic quickly and accurately.
          </p>
          <p>
            Ready to calculate?{" "}
            <Link href="/calculators/percentage-calculator" className="text-[var(--color-primary)] hover:underline font-medium">
              Try Krynn Tools&apos; Percentage Calculator
            </Link>{" "}
            — free, instant, and works right in your browser. No sign-up required.
          </p>
        </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "How to Calculate Percentage Online (With Examples)",
            description: "Learn how to calculate percentages, percentage increase, decrease, and difference. Free online percentage calculator with step-by-step examples.",
            image: "https://www.krynntools.online/images/blog/percentage-calculator.svg",
            datePublished: "2026-07-12T00:00:00Z",
            dateModified: "2026-07-12T00:00:00Z",
            author: { "@type": "Organization", name: "Krynn Tools", url: "https://www.krynntools.online" },
            publisher: { "@type": "Organization", name: "Krynn Tools", url: "https://www.krynntools.online", logo: { "@type": "ImageObject", url: "https://www.krynntools.online/logo.png" } },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.krynntools.online/blog/how-to-calculate-percentage-online" },
          }),
        }}
      />
      </article>
    </div>
  );
}
