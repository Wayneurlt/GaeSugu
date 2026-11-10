import Link from "next/link";
import Header from "@/components/Header";
import { Footer } from "@/components/blocks";
import { getSite } from "@/lib/site";

export default async function NotFound() {
  const { navSections, links } = await getSite();
  return (
    <>
      <Header sections={navSections} coffeeHref={links.buyMeACoffee} />
      <main>
    <section className="container mid section center stack-md">
      <span className="hand terracotta">a missing piece</span>
      <h1 className="display-lg">We could not find that page.</h1>
      <p className="muted" style={{ margin: 0 }}>
        It may have moved, or it is a piece we have not picked up yet.
      </p>
      <Link href="/" className="see-more">
        BACK HOME
      </Link>
    </section>
      </main>
      <Footer />
    </>
  );
}
