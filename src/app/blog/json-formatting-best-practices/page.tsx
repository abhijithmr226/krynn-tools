import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JSON Formatting Best Practices for Developers",
  description: "Master JSON formatting with best practices for indentation, naming, validation, and tooling. Clean, readable JSON every time.",
  keywords: ["JSON formatting", "JSON best practices", "JSON validator", "JSON formatter", "developer tips"],
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
          JSON Formatting Best Practices for Developers
        </h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
          <span>Published: February 10, 2026</span>
          <span>·</span>
          <span>Developer</span>
          <span>·</span>
          <span>8 min read</span>
        </div>

        <div className="prose max-w-none space-y-6 text-[var(--color-muted-foreground)] leading-relaxed">
          <p>
            JSON (JavaScript Object Notation) is the backbone of modern web development. 
            From API responses to configuration files, from database documents to log data, 
            JSON appears everywhere. Yet many developers treat formatting as an afterthought, 
            leading to inconsistent, hard-to-read files that slow down debugging and 
            collaboration.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Why JSON Formatting Matters
          </h2>
          <p>
            Properly formatted JSON is not just about aesthetics — it directly impacts 
            productivity and code quality:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Readability:</strong> When you open a 
              JSON file in an API response viewer or text editor, proper indentation and 
              spacing let you find the data you need in seconds rather than minutes.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Debugging:</strong> Malformed JSON 
              is one of the most common causes of API errors. Proper formatting makes syntax 
              errors immediately visible.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Version control:</strong> Consistent 
              formatting prevents noisy diffs in Git, making code reviews faster and more 
              meaningful.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Collaboration:</strong> When a team 
              shares a consistent JSON style, everyone can read and modify files without 
              fighting the formatting.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Indentation: Spaces vs. Tabs
          </h2>
          <p>
            The most common formatting choice is indentation style. Here is the conventional 
            wisdom:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Use 2 spaces:</strong> This is the 
              de facto standard for JSON. The official JSON specification and most style guides 
              (Google, Prettier defaults) recommend 2-space indentation.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Avoid tabs:</strong> Tabs render 
              differently across editors and terminals. Spaces produce consistent alignment 
              everywhere.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Be consistent:</strong> Whatever you 
              choose, apply it everywhere in your project. Inconsistency is worse than a 
              suboptimal choice.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Naming Conventions
          </h2>
          <p>
            JSON keys should follow a consistent naming convention. The most widely adopted 
            standard is camelCase:
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4 font-mono text-sm">
            <pre className="text-[var(--color-foreground)]">{`{
  "firstName": "Jane",
  "lastName": "Doe",
  "emailAddress": "jane@example.com",
  "createdAt": "2026-01-15T10:30:00Z"
}`}</pre>
          </div>
          <p>
            Avoid mixing conventions like snake_case and camelCase in the same project. 
            If your backend API uses snake_case (common in Python/Ruby ecosystems), consider 
            transforming keys at the boundary rather than mixing styles internally.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Quoting and Commas
          </h2>
          <p>
            These are the two most common sources of JSON syntax errors:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Always use double quotes:</strong> JSON 
              does not allow single quotes for strings. Every key and string value must use 
              double quotes (&quot;&quot;).
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">No trailing commas:</strong> The last 
              element in an array or object must not be followed by a comma. This is the #1 
              syntax error developers encounter.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">No comments:</strong> Standard JSON 
              does not support comments. If you need documentation, put it in a separate 
              file or use JSONC (JSON with Comments) where supported.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Data Types and Values
          </h2>
          <p>
            Use the correct types intentionally:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Strings for everything that is text:</strong> 
              Even numeric-looking IDs should be strings if they are not used in arithmetic.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Numbers without quotes:</strong> 
              Ages, counts, prices, and coordinates should be numeric, not strings. &quot;age&quot;: 30 
              not &quot;age&quot;: &quot;30&quot;.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Booleans as true/false:</strong> Not 
              &quot;yes&quot;/&quot;no&quot;, not 1/0. Use actual boolean values.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Null for explicit absence:</strong> Use 
              null to indicate a field is intentionally empty, rather than omitting it entirely 
              (unless the API contract specifies omission).
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">ISO 8601 for dates:</strong> Store dates 
              as strings in ISO 8601 format: &quot;2026-01-15T10:30:00Z&quot;. This is universally 
              parseable and sortable.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Structure and Nesting
          </h2>
          <p>
            Keep your JSON structure flat when possible:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Avoid deep nesting:</strong> More than 
              3–4 levels of nesting makes JSON hard to read and work with. Flatten structures 
              by embedding related IDs instead of full objects.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Group related fields:</strong> Use 
              nested objects to logically group related data (address, preferences, metadata) 
              rather than prefixing flat keys.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Use arrays for ordered collections:</strong> 
              Arrays are for lists of similar items. Objects are for key-value structures with 
              named fields. Do not use arrays when you mean objects.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Validation and Formatting Tools
          </h2>
          <p>
            Always validate JSON before committing or deploying it. A single misplaced comma 
            can break an entire application. Use a{" "}
            <Link href="/dev/json-formatter" className="text-[var(--color-primary)] hover:underline font-medium">
              JSON formatter
            </Link>{" "}
            to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Catch syntax errors early:</strong> 
              Paste your JSON into a validator before pushing to production.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Auto-format for consistency:</strong> 
              Use a formatter to normalize indentation, spacing, and line breaks across your 
              entire codebase.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Minify for production:</strong> Strip 
              whitespace and newlines to reduce payload size for API responses.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Pretty-print for debugging:</strong> 
              Expand minified JSON into a readable format when inspecting API responses.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Common Mistakes to Avoid
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Mixing types:</strong> Do not store the 
              same field as a string in some records and a number in others. Pick one type 
              and stick with it.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Overloading strings:</strong> Do not 
              encode complex data (dates, enums, booleans) as strings when proper types are 
              available.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Inconsistent null handling:</strong> 
              Decide whether missing fields are null or omitted entirely, and apply that 
              rule consistently.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Forgetting to validate:</strong> Always 
              run a JSON linter in your CI pipeline to catch errors before they reach 
              production.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Conclusion
          </h2>
          <p>
            Good JSON formatting is a small habit that pays big dividends. Consistent 
            indentation, proper naming conventions, correct data types, and regular validation 
            will make your APIs more reliable, your debugging faster, and your team more 
            productive. Start by standardizing your formatting with a tool, enforce it in 
            your CI pipeline, and watch the quality of your data layer improve.
          </p>
          <p>
            Need to format or validate JSON quickly?{" "}
            <Link href="/dev/json-formatter" className="text-[var(--color-primary)] hover:underline font-medium">
              Try Krynn Tools&apos; JSON Formatter
            </Link>{" "}
            — free, instant, and completely private.
          </p>
        </div>
      </article>
    </div>
  );
}
