import { Link } from "wouter";
import BlogAd from "../BlogAd";
import BlogMidAd from "../BlogMidAd";
import TrustpilotCta from "../TrustpilotCta";


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
          How EMI Is Calculated on a Loan (With Formula)
        </h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
          <span>Published: February 25, 2026</span>
          <span>·</span>
          <span>Finance</span>
          <span>·</span>
          <span>8 min read</span>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-[var(--color-border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/blog/loan-emi-calculator.png"
            alt="Loan EMI Calculator Tool Interface"
            className="w-full"
          />
        </div>

        <BlogAd />



        <BlogMidAd />

        <TrustpilotCta />

        <div className="prose max-w-none space-y-6 text-[var(--color-muted-foreground)] leading-relaxed">
          <p>
            Whether you are taking out a home loan, car loan, or personal loan, the monthly 
            installment — known as EMI (Equated Monthly Installment) — is the number that 
            matters most. Understanding how EMI is calculated helps you make informed 
            borrowing decisions, compare loan offers, and plan your finances with confidence.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            What Is EMI?
          </h2>
          <p>
            EMI stands for Equated Monthly Installment. It is a fixed payment amount that a 
            borrower makes to a lender each month over a specified loan tenure. Each EMI 
            consists of two parts: principal repayment (reducing the loan balance) and 
            interest payment (the cost of borrowing). In the early years of a loan, a larger 
            portion of each EMI goes toward interest. As the loan matures, more of each 
            payment goes toward reducing the principal.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            The EMI Formula
          </h2>
          <p>
            The standard formula used by most lenders worldwide for calculating EMI is the 
            reducing balance method:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4 font-mono text-sm">
            <pre className="text-[var(--color-foreground)]">{`EMI = P × r × (1 + r)^n ÷ ((1 + r)^n - 1)

Where:
  P = Principal loan amount
  r = Monthly interest rate (annual rate ÷ 12)
  n = Total number of monthly payments (tenure in months)`}</pre>
          </div>
          <p>
            This formula ensures that each monthly payment is exactly the same amount, 
            while the split between principal and interest shifts over time.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Worked Example
          </h2>
          <p>
            Let us calculate the EMI for a real scenario:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Loan amount:</strong> ₹10,00,000 
              (₹10 lakh)
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Annual interest rate:</strong> 8.5%
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Loan tenure:</strong> 20 years 
              (240 months)
            </li>
          </ul>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4 font-mono text-sm">
            <pre className="text-[var(--color-foreground)]">{`Monthly rate (r) = 8.5% ÷ 12 = 0.007083

EMI = 10,00,000 × 0.007083 × (1.007083)^240
      ÷ ((1.007083)^240 - 1)

EMI = 10,00,000 × 0.007083 × 5.336
      ÷ (5.336 - 1)

EMI ≈ ₹8,678 per month`}</pre>
          </div>
          <p>
            Over 240 months, you would pay a total of ₹20,82,720. Of that, ₹10,82,720 is 
            interest — meaning you paid roughly 108% of the loan amount in interest alone.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            How the Principal-Interest Split Changes Over Time
          </h2>
          <p>
            One of the most important things to understand about EMI is that the composition 
            changes every month:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Month 1:</strong> Of your ₹8,678 
              EMI, approximately ₹7,083 goes to interest and only ₹1,595 reduces your 
              principal. You barely make a dent in the actual loan.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Month 120 (year 10):</strong> The 
              split is roughly ₹4,500 interest and ₹4,178 principal. You are now paying 
              almost equal amounts toward both.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Month 240 (final month):</strong> 
              Only about ₹60 goes to interest while ₹8,618 reduces the remaining balance. 
              Almost the entire payment goes to clearing the loan.
            </li>
          </ul>
          <p>
            This front-loading of interest is why making prepayments early in the loan term 
            has the greatest impact on total interest paid.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Factors That Affect Your EMI
          </h2>
          <p>
            Three variables determine your EMI, and understanding how each one affects the 
            result helps you negotiate better terms:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Loan amount:</strong> Higher principal 
              means higher EMI, proportionally. Doubling the loan amount doubles the EMI.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Interest rate:</strong> Even small 
              changes in interest rate have significant effects. A 0.5% rate reduction on a 
              ₹50 lakh home loan can save over ₹5 lakh in total interest.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Tenure:</strong> Longer tenure means 
              lower monthly EMI but substantially more total interest paid. Extending a loan 
              from 15 to 20 years reduces the EMI but can add years of additional interest.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Reducing Balance vs. Flat Rate
          </h2>
          <p>
            Most modern loans use the reducing balance method, where interest is calculated 
            on the outstanding balance each month. However, some lenders — particularly for 
            certain personal loans — use a flat rate method, where interest is calculated on 
            the original principal for the entire tenure.
          </p>
          <p>
            The flat rate method always results in a higher effective interest rate. For 
            example, a &quot;9% flat rate&quot; loan actually has an effective annual rate closer 
            to 16%. Always ask whether a quoted rate is flat or reducing balance, and 
            convert to the standard if possible for accurate comparison.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            How to Reduce Your Total Interest Burden
          </h2>
          <p>
            Several strategies can help you pay less interest over the life of a loan:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Make prepayments:</strong> Even small 
              extra payments toward principal early in the loan can save lakhs in interest. 
              Most lenders allow annual prepayments without penalty.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Choose a shorter tenure:</strong> If 
              you can afford higher EMIs, a shorter tenure dramatically reduces total interest. 
              A 15-year home loan costs roughly 40% less interest than a 30-year loan.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Negotiate the interest rate:</strong> 
              Shop around and negotiate. Even a 0.25% reduction on a large loan saves 
              significant money over time.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Increase EMI annually:</strong> If your 
              income grows, increasing your EMI proportionally accelerates repayment and 
              reduces total interest.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Calculate Your EMI Instantly
          </h2>
          <p>
            Instead of working through the formula by hand, use a calculator for instant, 
            accurate results. The Krynn Tools{" "}
            <Link href="/calculators/loan-emi-calculator" className="text-[var(--color-primary)] hover:underline font-medium">
              Loan EMI Calculator
            </Link>{" "}
            lets you enter your loan amount, interest rate, and tenure to see your exact 
            monthly EMI along with a complete amortization schedule showing the 
            principal-interest split for every month.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Conclusion
          </h2>
          <p>
            Understanding EMI calculation empowers you to make smarter financial decisions. 
            The formula reveals how interest rate, tenure, and principal interact, and why 
            the same EMI can mean very different things depending on the loan terms. Use 
            a calculator to compare scenarios, plan prepayments, and ensure you are getting 
            the best deal on your next loan.
          </p>
          <p>
            Want to calculate your EMI?{" "}
            <Link href="/calculators/loan-emi-calculator" className="text-[var(--color-primary)] hover:underline font-medium">
              Try Krynn Tools&apos; Loan EMI Calculator
            </Link>{" "}
            — free, instant, and completely private.
          </p>
        </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "How EMI Is Calculated on a Loan (With Formula)",
            description: "Understand how loan EMI is calculated with the reducing balance formula.",
            image: "https://www.krynntools.online/images/blog/loan-emi-calculator.png",
            datePublished: "2026-02-25T00:00:00Z",
            dateModified: "2026-02-25T00:00:00Z",
            author: { "@type": "Organization", name: "Krynn Tools", url: "https://www.krynntools.online" },
            publisher: { "@type": "Organization", name: "Krynn Tools", url: "https://www.krynntools.online", logo: { "@type": "ImageObject", url: "https://www.krynntools.online/logo.png" } },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.krynntools.online/blog/how-emi-is-calculated-on-loan" },
          }),
        }}
      />
      </article>
    </div>
  );
}
