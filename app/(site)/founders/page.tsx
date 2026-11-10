import type { Metadata } from "next";

import { Founders, PageHero, SupportBlock } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Founders · Gae Sugu",
  description: "Naomi and Jeff, the siblings behind Gae Sugu.",
};

export default async function FoundersPage() {
  const { pages } = await getSite();
  return (
    <>
      <PageHero
        title={pages.founders.title}
        hand={pages.founders.hand}
        intro={pages.founders.intro}
        crumbs={[{ label: "Our Founders" }]}
      />
      <Founders withHeading={false} />
      <SupportBlock />
    </>
  );
}
