import Header from "@/components/Header";
import { Footer } from "@/components/blocks";
import { getSite } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { navSections, links } = await getSite();
  return (
    <>
      <Header sections={navSections} coffeeHref={links.buyMeACoffee} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
