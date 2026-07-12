import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Krynn Tools. Report bugs, request new tools, or send us feedback.",
  alternates: { canonical: "https://krynntools.online/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
