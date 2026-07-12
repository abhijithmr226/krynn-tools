import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BMI Explained: What the Numbers Actually Mean",
  description: "Understand BMI categories, how to calculate yours, and what the numbers really tell you about your health.",
  keywords: ["BMI explained", "BMI calculator", "body mass index", "BMI categories", "health assessment"],
};

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
          BMI Explained: What the Numbers Actually Mean
        </h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
          <span>Published: February 20, 2026</span>
          <span>·</span>
          <span>Health</span>
          <span>·</span>
          <span>6 min read</span>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-[var(--color-border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/blog/bmi-calculator.svg"
            alt="BMI Calculator Tool Interface"
            className="w-full"
          />
        </div>

        <div className="prose max-w-none space-y-6 text-[var(--color-muted-foreground)] leading-relaxed">
          <p>
            Body Mass Index (BMI) is one of the most widely used health metrics in the 
            world. Doctors use it, insurance companies reference it, and fitness apps 
            display it. But what do the numbers actually mean, and how should you interpret 
            your own BMI? This guide breaks it down clearly.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            What Is BMI?
          </h2>
          <p>
            BMI is a simple numerical calculation based on your weight and height. It was 
            invented in the 1830s by Belgian mathematician Adolphe Quetelet and remains 
            a quick, non-invasive way to screen for potential weight-related health risks. 
            The formula is:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4 font-mono text-sm">
            <pre className="text-[var(--color-foreground)]">{`BMI = weight (kg) ÷ height² (m²)

Example: 70 kg ÷ (1.75 m)² = 22.9`}</pre>
          </div>
          <p>
            For those using imperial units, the formula is weight (lbs) × 703 ÷ 
            height (in²). Both formulas produce the same result.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            BMI Categories Explained
          </h2>
          <p>
            The World Health Organization classifies BMI into the following categories:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Below 18.5 — Underweight:</strong> 
              May indicate insufficient nutrition or underlying health conditions. People 
              in this range should consult a healthcare provider about healthy weight gain 
              strategies.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">18.5–24.9 — Normal weight:</strong> 
              Generally considered the healthy range for most adults. Associated with the 
              lowest risk of weight-related health problems.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">25.0–29.9 — Overweight:</strong> 
              Carries an increased risk of cardiovascular disease, type 2 diabetes, and 
              other metabolic conditions. Small lifestyle changes can often make a 
              significant difference.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">30.0–34.9 — Obesity (Class I):</strong> 
              Significantly elevated health risks. Medical intervention and structured 
              lifestyle programs are recommended.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">35.0–39.9 — Obesity (Class II):</strong> 
              High risk of serious health complications. Close medical supervision and 
              comprehensive treatment plans are typically necessary.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">40.0 and above — Obesity (Class III):</strong> 
              Also called morbid obesity. Carries the highest risk and often requires 
              intensive medical intervention.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            What BMI Does NOT Tell You
          </h2>
          <p>
            BMI is a screening tool, not a diagnostic one. It has important limitations 
            that everyone should understand:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">It does not distinguish muscle from fat:</strong> 
              Athletes and muscular individuals often have high BMIs despite having low 
              body fat. A bodybuilder at 85kg with 10% body fat may have the same BMI as 
              a sedentary person at 85kg with 30% body fat.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">It ignores fat distribution:</strong> 
              Where you carry fat matters. Visceral fat around the organs is more dangerous 
              than subcutaneous fat under the skin. BMI cannot tell the difference.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">It does not account for age or sex:</strong> 
              Women naturally have higher body fat percentages than men. Older adults often 
              have more body fat than younger adults at the same BMI.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">It varies by ethnicity:</strong> 
              Research shows that BMI thresholds for health risk differ across ethnic groups. 
              Asian populations face higher risks at lower BMIs, while some African populations 
              may face lower risks at higher BMIs.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Better Complementary Metrics
          </h2>
          <p>
            For a more complete picture of your health, consider these additional measurements 
            alongside BMI:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Waist circumference:</strong> Measuring 
              your waist gives insight into visceral fat levels. For men, above 40 inches 
              (102cm) and for women, above 35 inches (88cm) indicates increased health risk.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Waist-to-hip ratio:</strong> This 
              ratio provides a better picture of fat distribution than BMI alone. Ratios above 
              0.90 for men and 0.85 for women indicate higher risk.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Body fat percentage:</strong> Directly 
              measuring body fat (via calipers, DEXA scan, or bioelectrical impedance) gives 
              the most accurate assessment of body composition.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Blood markers:</strong> Cholesterol, 
              blood sugar, and blood pressure provide direct measures of metabolic health 
              that BMI cannot capture.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            How to Calculate Your BMI
          </h2>
          <p>
            The quickest way to find your BMI is using a calculator. Krynn Tools offers a 
            free{" "}
            <Link href="/calculators/bmi-calculator" className="text-[var(--color-primary)] hover:underline font-medium">
              BMI Calculator
            </Link>{" "}
            that gives you an instant result along with your category classification. Simply 
            enter your height and weight, and the tool does the math.
          </p>
          <p>
            For tracking purposes, calculate your BMI regularly (monthly is sufficient for 
            most people) and look at the trend over time rather than fixating on any single 
            measurement. A BMI that is gradually moving toward the normal range is a positive 
            sign, regardless of where it starts.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            What to Do with Your BMI Result
          </h2>
          <p>
            Here is a practical framework based on your result:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Underweight:</strong> Focus on 
              nutrient-dense foods, consult a healthcare provider, and rule out underlying 
              conditions. Gradual, healthy weight gain is the goal.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Normal weight:</strong> Maintain 
              your current habits. Focus on consistency rather than changes. Regular exercise 
              and balanced nutrition keep you here.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Overweight:</strong> Small, 
              sustainable changes to diet and activity levels can make a significant difference. 
              Even a 5–10% weight loss reduces health risks considerably.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Obese:</strong> Consider working 
              with a healthcare provider to develop a comprehensive plan. Medical guidance 
              is recommended for safe, effective weight management.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Conclusion
          </h2>
          <p>
            BMI is a useful starting point for understanding your weight relative to your 
            height, but it is only one piece of the health puzzle. Use it as a screening 
            tool, not a verdict. Combine it with other measurements, focus on sustainable 
            healthy habits, and consult healthcare professionals for personalized guidance. 
            The goal is not a specific number — it is long-term health and wellbeing.
          </p>
          <p>
            Want to know your BMI?{" "}
            <Link href="/calculators/bmi-calculator" className="text-[var(--color-primary)] hover:underline font-medium">
              Try Krynn Tools&apos; BMI Calculator
            </Link>{" "}
            — free, instant, and completely private.
          </p>
        </div>
      </article>
    </div>
  );
}
