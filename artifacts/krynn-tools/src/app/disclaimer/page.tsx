
export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">Disclaimer</h1>
      <div className="prose max-w-none text-[var(--color-muted-foreground)] space-y-6">
        <p><strong>Last updated:</strong> January 1, 2026</p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">General Information</h2>
        <p>
          The information provided by Krynn Tools on krynntools.online is for general informational purposes only. 
          All information is provided in good faith; however, we make no representation or warranty of any kind, 
          express or implied, regarding the accuracy, adequacy, validity, reliability, or completeness of any 
          information on the site.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Tool Results</h2>
        <p>
          While we strive to provide accurate results, we cannot guarantee that all tools will always produce 
          100% accurate outputs. Users should verify critical results independently. Calculations and conversions 
          are approximations and may have minor rounding differences.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">External Links</h2>
        <p>
          Our site may contain links to external websites. We are not responsible for the content or practices 
          of any third-party sites.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Professional Advice</h2>
        <p>
          Our tools are not substitutes for professional advice (medical, financial, legal, or otherwise). 
          Always consult with a qualified professional for specific advice.
        </p>
      </div>
    </div>
  );
}
