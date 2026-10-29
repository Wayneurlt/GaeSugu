import type { Metadata } from "next";
import { Founders, PageHero, SupportBlock } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Our Founders · Gae Sugu",
  description: "Naomi and Jeff, the siblings behind Gae Sugu.",
};

export default function FoundersPage() {
  return (
    <>
      <PageHero
        title="Our Founders"
        hand="a brother and sister on the road"
        intro="Jeff documents the wildlife and biodiversity; Naomi documents the cultures that live around them. Together they are starting in Kajiado, then heading to western Kenya, where their own roots are."
        crumbs={[{ label: "Our Founders" }]}
      />
      <Founders withHeading={false} />
      <SupportBlock />
    </>
  );
}
