import type { Metadata } from "next";
import { NewsletterBlock, PageHero } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Newsletter · Gae Sugu",
  description: "New articles, photo essays and event invites from across Kenya. Free, once a month.",
};

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        title="Newsletter"
        hand="stories from home"
        intro="Once a month: new articles, photo essays, the photo of the week and invites to our events. Free, and you can leave any time."
        crumbs={[{ label: "Newsletter" }]}
      />
      <NewsletterBlock />
    </>
  );
}
