import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Misc Tools – Free Online Random Number Generator, Dice Roller & More",
  description: "8+ free online miscellaneous tools. Random numbers, dice roller, coin flip, barcode generator, and more.",
};

export default function MiscCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "misc" })} />;
}
