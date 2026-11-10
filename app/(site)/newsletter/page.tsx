import type { Metadata } from "next";

import { NewsletterBlock, PageHero } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Newsletter · Gae Sugu",
  description: "New articles, photo essays and event invites from across Kenya. Free, once a month.",
};

export default async function NewsletterPage() {
  const { pages } = await getSite();
  return (
    <>
      <PageHero
        title={pages.newsletter.title}
        hand={pages.newsletter.hand}
        intro={pages.newsletter.intro}
        crumbs={[{ label: "Newsletter" }]}
      />
      <NewsletterBlock />
    </>
  );
}
