import type { CSSProperties } from "react";
import Link from "next/link";
import Photo from "@/components/photo";
import type { PhotoId } from "@/lib/photos";
import { artefacts, ethics, getCategory, links, missionVision, regions } from "@/lib/site";

const display = "'Cormorant Garamond', serif";
const hand = "'Caveat', cursive";
const terracotta = "#A8432E";
const forest = "#2F3B33";
const sky = "#C9DCE3";
const maroon = "#6E1F1A";

const col = (gap: number, extra: CSSProperties = {}): CSSProperties => ({ display: "flex", flexDirection: "column", gap, ...extra });
const wrap: CSSProperties = { maxWidth: 1240, margin: "0 auto" };
const sectionHead: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 12,
  borderBottom: "1.5px solid #1C1C1A",
  paddingBottom: 14,
};
const subHead: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 };
const h3: CSSProperties = { margin: 0, fontFamily: display, fontWeight: 600, fontSize: 34 };
const seeAll: CSSProperties = { fontSize: 16, letterSpacing: "0.24em", borderBottom: "3px solid #B8954A", paddingBottom: 3 };
const cardTitle = (size: number): CSSProperties => ({ fontFamily: display, fontWeight: 600, fontSize: size, lineHeight: 1.15 });
const grid = (min: number, gap: number | string): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
  gap,
});

function Waves({ paths }: { paths: [string, string] }) {
  return (
    <svg
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 300 }}
    >
      <path d={paths[0]} fill="none" stroke="#FFFFFF" strokeWidth="26" strokeLinecap="round" />
      <path d={paths[1]} fill="none" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function Play() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r="27" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M23 18 L39 28 L23 38 Z" fill="#FFFFFF" />
    </svg>
  );
}

/** Polaroid tilt and tape angle for each region card. */
const tilts = [
  { rot: -2, tape: 3 },
  { rot: 1.5, tape: -4 },
  { rot: -1, tape: 2 },
  { rot: 2, tape: -2 },
  { rot: -1.5, tape: 4 },
];

const culture: { title: string; text: string; bg: string; photo: PhotoId; href: string }[] = [
  { title: "Traditions & Ceremonies", text: "Rites, gatherings and the meaning behind them.", bg: "#E8D3B8" , photo: "coastVillage", href: "/history-culture/traditions-ceremonies" },
  { title: "Elders, Healers & Rainmakers", text: "Raw stories, in their own words.", bg: "#E2C2B2" , photo: "sausageTree", href: "/history-culture/oral-history" },
  { title: "Folklore, Music & Food", text: "What we sing, tell and eat together.", bg: "#EBD9B4" , photo: "muralWall", href: "/history-culture/folklore-music-food" },
  { title: "Languages, Crafts & Artisans", text: "Words and skills passed down by hand.", bg: "#D6DFC4" , photo: "dugoutCanoes", href: "/history-culture/crafts-artisans" },
];

const myths = [
  { title: "The owl", text: "A bad omen, or a messenger? What the elders say.", href: "/articles/the-owl-omen-or-messenger" },
  { title: "The rainmaker", text: "How communities read the sky and the seasons.", href: "/articles/what-rainmakers-read" },
  { title: "The hyena", text: "Feared in folklore, yet part of the balance of the land.", href: "/articles/hares-and-hyenas" },
];

const bioStories: { kicker: string; bg: string; photo: PhotoId; href: string }[] = [
  { kicker: "WILDLIFE", bg: "#C9D6B8", photo: "kingfisher", href: "/animals-nature/wildlife" },
  { kicker: "ECOSYSTEMS & SACRED SITES", bg: "#D6DFC4", photo: "mossForest", href: "/animals-nature/sacred-places" },
  { kicker: "CONSERVATION STORIES", bg: "#BFD8C8", photo: "river", href: "/sustainability/conservation" },
];

const diaspora = getCategory("diaspora")!.topics.map((t) => ({ title: t.label, text: t.intro, href: `/diaspora/${t.slug}` }));

const articles: { kicker: string; title: string; bg: string; photo: PhotoId; href: string }[] = [
  { kicker: "FIELD NOTES · KAJIADO", title: "[Title of the first field story]", bg: "#D9D3C7", photo: "forestPath", href: "/articles/kajiado-first-trip" },
  { kicker: "INTERVIEW", title: "[Interview title]", bg: "#E8D3B8", photo: "boatman", href: "/history-culture/oral-history" },
  { kicker: "ESSAY", title: "[Essay title]", bg: "#E2C2B2", photo: "lonePalm", href: "/history-culture/roots-identity" },
];


const founders: { name: string; role: string; bg: string; photo: PhotoId }[] = [
  { name: "Naomi", role: "Co-founder · Culture, Identity & Storytelling", bg: "#E2C2B2", photo: "muralWall" },
  { name: "Jeff", role: "Co-founder · Wildlife Photography & Biodiversity", bg: "#C9D6B8", photo: "kingfisher" },
];

const mapText = (italic = true): Pick<CSSProperties, "fontStyle"> => ({ fontStyle: italic ? "italic" : "normal" });

function AfricaMap() {
  const label = { fill: "#FFFFFF", fillOpacity: 0.85, fontFamily: "Cormorant Garamond, serif", ...mapText() };
  return (
    <svg
      viewBox="0 0 760 600"
      role="img"
      aria-label="Hand-drawn map of Africa with Kenya highlighted as where Gae begins, and a dotted line showing the journey ahead across the continent"
      style={{ width: "100%", maxWidth: 680, height: "auto", overflow: "visible" }}
    >
      <path
        d="M113.6 17.6 L184 9.6 L241.6 8 L248 8 L240 32 L265.6 40.8 L312 60 L320 47.2 L352 48 L399.2 54.4 L418.4 53.6 L420 64 L432 88 L444 112 L457.6 147.2 L476 179.2 L501.6 200 L504.8 211.2 L520 220.8 L570.4 209.6 L571.2 220.8 L552 256 L522.4 288 L500 307.2 L487.2 322.4 L477.6 336 L474.4 358.4 L484 388 L485.6 424 L439.2 462.4 L444 496 L420.8 511.2 L408 543.2 L383.2 568 L364.8 576 L320 582.4 L307.2 576 L300 552 L281.6 516.8 L276 487.2 L256 440 L265.6 374.4 L258.4 352 L236 320 L235.2 300.8 L237.6 272 L228 268 L208 269.6 L187.2 252.8 L158.4 259.2 L100 268.8 L73.6 253.6 L54.4 236 L40 216 L20.8 186.4 L28 148 L24 136 L48 96 L83.2 60.8 L99.2 35.2 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M554.4 400 L563.2 428 L552 464 L537.6 504 L520 508 L509.6 488 L512 464 L514.4 436 L536 416 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M448 268.4 L464.8 275.2 L476 276.8 L486.4 270.4 L495.2 272 L488 281.6 L488 311.2 L492.8 317.6 L487.2 322.4 L480.8 329.6 L477.6 336.4 L473.6 341.6 L460.8 328 L432 312 L431.6 303.2 L436.8 295.2 L439.2 284 L431.2 270.4 L441.6 264.8 L447.2 267.2 Z"
        fill="#A8432E"
        fillOpacity="0.85"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <path
        d="M438 305 C 380 330, 320 300, 270 250 S 140 190, 70 205"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 9"
      />
      <circle cx="454" cy="318" r="6" fill="#F3D9A0" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="438" cy="305" r="5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M496 300 L600 300" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="608" y="292" fill="#FFFFFF" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="600" fontSize="34">
        Kenya
      </text>
      <text x="608" y="316" fill="#F3EADF" fontFamily="EB Garamond, serif" fontSize="13" letterSpacing="2">
        WHERE WE BEGIN
      </text>
      <text x="608" y="340" fill="#FFFFFF" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="20">
        Kajiado, our pilot
      </text>
      <text x="608" y="364" fill="#FFFFFF" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="20">
        then western Kenya
      </text>
      <text x="220" y="110" {...label} fontSize="24">North Africa</text>
      <text x="70" y="230" {...label} fontSize="22">West Africa</text>
      <text x="268" y="345" {...label} fontSize="22">Central Africa</text>
      <text x="420" y="225" {...label} fontSize="20">East Africa</text>
      <text x="310" y="505" {...label} fontSize="22">Southern Africa</text>
      <text x="580" y="470" {...label} fontSize="18">Indian Ocean</text>
      <text x="580" y="490" {...label} fontSize="18">Islands</text>
      <text x="150" y="285" fill="#F3EADF" fontFamily="Caveat, cursive" fontSize="24" transform="rotate(-6 150 285)">
        the journey ahead
      </text>
      <g transform="translate(60 470)" stroke="#FFFFFF" fill="none" strokeWidth="1.5">
        <circle r="26" strokeOpacity="0.6" />
        <path d="M0 -38 L5 0 L0 38 L-5 0 Z" fill="#FFFFFF" fillOpacity="0.9" />
        <path d="M-38 0 L0 -4 L38 0 L0 4 Z" fillOpacity="0.5" fill="#FFFFFF" />
      </g>
      <text x="56" y="420" fill="#FFFFFF" fontFamily="EB Garamond, serif" fontSize="13" letterSpacing="2">
        N
      </text>
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M560 120 Q566 112 572 120 Q578 112 584 120" />
        <path d="M594 100 Q598 95 602 100 Q606 95 610 100" />
        <path d="M610 132 Q613 128 616 132 Q619 128 622 132" />
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero photo */}
      <section id="top" style={{ position: "relative", height: "min(680px, 80vh)", background: "#3E4A3A" }}>
        <Photo id="longonot" priority style={{ position: "absolute", inset: 0 }} />
      </section>

      {/* Intro */}
      <section id="intro" style={{ background: forest, color: "#FFFFFF" }}>
        <div style={col(26, { maxWidth: 820, margin: "0 auto", padding: "88px 24px 96px", alignItems: "center", textAlign: "center" })}>
          <h1 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: "clamp(52px, 7vw, 84px)", lineHeight: 1.02 }}>
            A living archive of Africa.
          </h1>
          <div style={{ width: "100%", maxWidth: 640, height: 2, background: "#B8954A" }} />
          <div style={col(0, { fontSize: 22 })}>
            <span style={{ fontStyle: "italic" }}>Gae /[pronunciation]/</span>
            <span>a broken piece of a pot, in [language]</span>
          </div>
          <p style={{ margin: 0, fontSize: 22 }}>
            African knowledge is like a broken pot: fragmented, scattered, with pieces of our stories, languages and
            traditions slowly being lost. Gae is our way of gathering those pieces back together, so they are never lost
            again.
          </p>
          <p style={{ margin: 0, fontSize: 22 }}>
            We travel across Africa, starting in Kenya, to sit with elders, healers, rainmakers and artisans, to photograph
            communities and wildlife, and to keep records of artefacts and indigenous knowledge.
          </p>
          <p style={{ margin: 0, fontSize: 22 }}>
            Karibu Gae. <strong style={{ fontWeight: 600 }}>Karibu nyumbani.</strong>
          </p>
        </div>
      </section>

      {/* Explore Africa map */}
      <section
        id="explore"
        style={{ position: "relative", overflow: "hidden", background: "#5E878B", color: "#FFFFFF", minHeight: 820 }}
      >
        <Photo id="grassHillside" decorative style={{ position: "absolute", inset: 0 }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(62,98,102,0.84)" }} />
        <div
          style={{
            ...wrap,
            position: "relative",
            padding: "88px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div style={col(18, { flex: "1 1 380px", minWidth: 0 })}>
            <span style={{ fontSize: 15, letterSpacing: "0.34em", color: "#F3EADF" }}>EXPLORE AFRICA</span>
            <h2 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: "clamp(60px, 8vw, 116px)", lineHeight: 0.9 }}>
              Africa,
              <br />
              <em style={{ fontStyle: "italic" }}>piece</em> by piece.
            </h2>
            <span style={{ fontFamily: hand, fontSize: 36, color: "#F7EFE3" }}>and we begin at home</span>
            <p style={{ margin: 0, maxWidth: 420, fontSize: 21, color: "#F7EFE3" }}>
              Our first journey starts in Kajiado, near home, and then goes on to western Kenya, where our roots are.
            </p>
          </div>
          <div style={{ flex: "1 1 560px", minWidth: 0, display: "flex", justifyContent: "center" }}>
            <AfricaMap />
          </div>
        </div>
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ position: "absolute", left: 0, bottom: -1, width: "100%", height: 34 }}
        >
          <path
            d="M0 40 L0 20 Q 30 0 60 20 T 120 20 T 180 20 T 240 20 T 300 20 T 360 20 T 420 20 T 480 20 T 540 20 T 600 20 T 660 20 T 720 20 T 780 20 T 840 20 T 900 20 T 960 20 T 1020 20 T 1080 20 T 1140 20 T 1200 20 T 1260 20 T 1320 20 T 1380 20 T 1440 20 L1440 40 Z"
            fill="#EAD9A4"
          />
        </svg>
      </section>

      {/* The rest of the pot */}
      <section
        id="regions"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#EAD9A4",
          backgroundImage: "repeating-linear-gradient(90deg, #EAD9A4 0 80px, #F1E5BE 80px 160px)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -40,
            top: 40,
            width: 300,
            height: 300,
            backgroundImage: "radial-gradient(#B89558 1.6px, transparent 1.8px)",
            backgroundSize: "12px 12px",
            opacity: 0.35,
            borderRadius: "50%",
          }}
        />
        <svg
          viewBox="0 0 400 300"
          aria-hidden="true"
          style={{ position: "absolute", left: -60, bottom: -40, width: 420, height: 320 }}
        >
          <g fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round">
            <path d="M0 60 C 80 20, 140 120, 220 80 S 340 40, 400 90" />
            <path d="M0 120 C 80 80, 140 180, 220 140 S 340 100, 400 150" />
            <path d="M0 180 C 80 140, 140 240, 220 200 S 340 160, 400 210" />
          </g>
        </svg>
        <div style={col(48, { ...wrap, position: "relative", padding: "96px 24px 112px" })}>
          <div style={sectionHead}>
            <h3 style={{ margin: 0, fontFamily: display, fontWeight: 600, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1 }}>
              The rest of the pot
            </h3>
            <span style={{ fontSize: 18, letterSpacing: "0.4em", color: terracotta }}>★ ★ ★ ★ ★</span>
          </div>
          <div style={grid(200, "36px 26px")}>
            {regions.map((r, i) => ({ ...r, ...tilts[i % tilts.length] })).map((r) => (
              <Link
                key={r.slug}
                href={`/explore#${r.slug}`}
                style={col(10, {
                  background: "#FFFFFF",
                  padding: "12px 12px 18px",
                  transform: `rotate(${r.rot}deg)`,
                  position: "relative",
                })}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    width: 80,
                    height: 24,
                    marginLeft: -40,
                    background: "rgba(234,216,180,0.85)",
                    transform: `rotate(${r.tape}deg)`,
                  }}
                />
                <Photo id={r.photo} decorative sizes="220px" style={{ height: 230, background: r.bg }} />
                <span style={{ fontFamily: hand, fontWeight: 600, fontSize: 32, lineHeight: 1 }}>{r.name}</span>
                <span style={{ fontSize: 16, color: "#5A4A3C" }}>{r.text}</span>
              </Link>
            ))}
          </div>
          <span style={{ alignSelf: "center", fontFamily: hand, fontSize: 30, color: "#5A4A3C" }}>
            coming, one journey at a time
          </span>
        </div>
      </section>

      {/* Culture & Heritage */}
      <section id="culture" style={{ background: "#FBF8F1" }}>
        <div style={col(48, { ...wrap, padding: "96px 24px" })}>
          <div style={col(6, { alignItems: "center", textAlign: "center" })}>
            <h2
              style={{
                margin: 0,
                fontFamily: display,
                fontWeight: 600,
                fontSize: "clamp(40px, 4.6vw, 56px)",
                lineHeight: 1.05,
                color: terracotta,
              }}
            >
              Culture &amp; Heritage
            </h2>
            <span style={{ fontFamily: hand, fontSize: 30, color: "#5A4A3C" }}>
              the stories, traditions and knowledge we keep
            </span>
          </div>
          <div style={grid(220, "28px 22px")}>
            {culture.map((c) => (
              <Link key={c.title} href={c.href} style={col(12, { alignItems: "center", textAlign: "center" })}>
                <Photo
                  id={c.photo}
                  sizes="(max-width: 600px) 100vw, 300px"
                  style={{ width: "100%", height: 300, background: c.bg, borderRadius: "999px 999px 10px 10px" }}
                />
                <span style={{ fontFamily: display, fontWeight: 600, fontSize: 28, lineHeight: 1.1 }}>{c.title}</span>
                <span style={{ fontSize: 18, color: "#5A4A3C" }}>{c.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Myth, or meaning? */}
      <section id="myths" style={{ background: sky, position: "relative", overflow: "hidden" }}>
        <Waves
          paths={[
            "M-20 80 C 160 10, 260 170, 440 90 S 760 0, 920 110 S 1240 190, 1460 60",
            "M-20 210 C 200 150, 330 280, 560 200 S 960 120, 1140 230 S 1340 260, 1460 190",
          ]}
        />
        <div
          style={{
            ...wrap,
            position: "relative",
            padding: "120px 24px 96px",
            display: "flex",
            flexWrap: "wrap",
            gap: 48,
            alignItems: "flex-start",
          }}
        >
          <div style={col(18, { flex: "1 1 460px", minWidth: 0 })}>
            <span style={{ fontSize: 16, letterSpacing: "0.14em", color: "#2E3A40" }}>
              [CULTURE &amp; HERITAGE · MYTHS OR MEANING?]
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: display,
                fontWeight: 600,
                fontSize: "clamp(54px, 7vw, 92px)",
                lineHeight: 0.92,
                color: maroon,
              }}
            >
              Myth, or meaning?
            </h2>
            <p style={{ margin: 0, fontSize: 21, color: "#23303A" }}>
              African beliefs about animals, plants and places that were feared, dismissed or misunderstood. We go back to
              the communities who hold them and ask what they really mean.
            </p>
          </div>
          <div style={col(16, { flex: "1 1 380px", minWidth: 0 })}>
            <p style={{ margin: "0 0 8px", fontFamily: hand, fontWeight: 600, fontSize: 40, lineHeight: 1.1, color: maroon }}>
              “What the elders honoured, we were taught to fear.”
            </p>
            {myths.map((m) => (
              <Link key={m.title} href={m.href} style={col(2, { background: "#FFFFFF", padding: "20px 24px" })}>
                <span style={{ fontFamily: display, fontWeight: 600, fontSize: 26 }}>{m.title}</span>
                <span style={{ fontSize: 18, color: "#4A4238" }}>{m.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who are we? */}
      <section id="identity" style={{ background: "#FBF8F1" }}>
        <div
          style={{
            ...wrap,
            padding: "104px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: 64,
            alignItems: "center",
          }}
        >
          <Photo
            id="coastVillage"
            sizes="(max-width: 900px) 100vw, 480px"
            style={{ flex: "1 1 360px", minWidth: 0, height: 520, background: "#E2C2B2", borderRadius: "999px 999px 10px 10px" }}
          />
          <div style={col(22, { flex: "1 1 520px", minWidth: 0 })}>
            <span style={{ fontSize: 16, letterSpacing: "0.14em", color: terracotta }}>
              CULTURE &amp; HERITAGE · WHO ARE WE?
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: display,
                fontWeight: 500,
                fontStyle: "italic",
                fontSize: "clamp(40px, 4.6vw, 60px)",
                lineHeight: 1.08,
              }}
            >
              Who are we when we tell our own story?
            </h2>
            <p style={{ margin: 0, color: "#4A4238" }}>
              Essays on African identity: names, language, faith, dress, memory, and what it means to be African today.
            </p>
            <span style={{ fontFamily: hand, fontWeight: 600, fontSize: 40, color: terracotta }}>Naomi</span>
            <Link
              href="/history-culture/roots-identity"
              style={{ fontSize: 19, letterSpacing: "0.06em", textDecoration: "underline", textUnderlineOffset: 5 }}
            >
              Read: [First essay title]
            </Link>
          </div>
        </div>
      </section>

      {/* Biodiversity & Conservation */}
      <section id="biodiversity" style={{ background: "#DCE6D2", position: "relative", overflow: "hidden" }}>
        <Waves
          paths={[
            "M-20 90 C 180 20, 300 180, 500 100 S 820 10, 980 120 S 1280 200, 1460 70",
            "M-20 220 C 220 160, 360 290, 600 210 S 1000 130, 1180 240 S 1360 270, 1460 200",
          ]}
        />
        <div style={col(36, { ...wrap, position: "relative", padding: "120px 24px 96px" })}>
          <div style={sectionHead}>
            <h2 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: 52, lineHeight: 1 }}>
              Biodiversity &amp; Conservation
            </h2>
            <span style={{ fontFamily: hand, fontSize: 30, color: "#3E6B4A" }}>where people and nature meet</span>
          </div>
          <p style={{ margin: 0, maxWidth: 760, color: "#4A4238" }}>
            In Africa, people and the land cannot be separated. Clans have animal totems, trees are sacred, and healers
            know plants most of us have never heard of. When an animal or a forest disappears, a piece of our culture
            goes with it.
          </p>
          <Link
            href="/articles/wildlife-of-kajiado"
            style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", background: "#FFFFFF", padding: 0 }}
          >
            <Photo
              id="vervet"
              sizes="(max-width: 900px) 100vw, 620px"
              style={{ flex: "1 1 420px", minWidth: 0, height: 380, background: "#B7C7A8" }}
            />
            <div style={col(10, { flex: "1 1 360px", minWidth: 0, padding: 32 })}>
              <span style={{ fontSize: 15, letterSpacing: "0.24em", color: "#3E6B4A" }}>SPECIES SPOTLIGHT</span>
              <span style={{ fontFamily: display, fontWeight: 600, fontSize: 40, lineHeight: 1.1 }}>Vervet monkey</span>
              <span style={{ fontStyle: "italic", color: "#4A4238" }}>
                Chlorocebus pygerythrus · Tumbili (Swahili) · [Other local names]
              </span>
              <span style={{ color: "#4A4238" }}>
                [Where it lives, why it matters, what threatens it, and what communities believe about it.]
              </span>
            </div>
          </Link>
          <div style={grid(260, 28)}>
            {bioStories.map((b) => (
              <Link key={b.kicker} href={b.href} style={col(12)}>
                <Photo id={b.photo} sizes="(max-width: 900px) 100vw, 400px" style={{ height: 240, background: b.bg }} />
                <span style={{ fontSize: 15, letterSpacing: "0.24em", color: "#3E6B4A" }}>{b.kicker}</span>
                <span style={cardTitle(28)}>[Story title]</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Black & African Diaspora */}
      <section id="diaspora" style={{ background: "#F1DFD3", position: "relative", overflow: "hidden" }}>
        <Waves
          paths={[
            "M-20 70 C 200 0, 320 160, 540 80 S 880 0, 1040 100 S 1300 180, 1460 60",
            "M-20 200 C 240 140, 380 270, 620 190 S 1020 110, 1200 220 S 1370 250, 1460 180",
          ]}
        />
        <div style={col(40, { ...wrap, position: "relative", padding: "130px 24px 104px" })}>
          <div style={col(12, { alignItems: "center", textAlign: "center", maxWidth: 760, margin: "0 auto" })}>
            <h2
              style={{
                margin: 0,
                fontFamily: display,
                fontWeight: 600,
                fontSize: "clamp(40px, 5vw, 64px)",
                lineHeight: 1.02,
                color: maroon,
              }}
            >
              Black &amp; African Diaspora
            </h2>
            <p style={{ margin: 0, fontSize: 22, color: "#4A3A30" }}>
              For Black Americans, Caribbeans and Africans around the world finding their way home.
            </p>
          </div>
          <div style={grid(200, 18)}>
            {diaspora.map((d) => (
              <Link key={d.title} href={d.href} style={col(6, { background: "#FFFDF8", padding: 26 })}>
                <span style={{ fontFamily: display, fontWeight: 600, fontSize: 26 }}>{d.title}</span>
                <span style={{ fontSize: 18, color: "#5A4A3C" }}>{d.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Archive */}
      <section id="archive" style={col(88, { ...wrap, padding: "96px 24px" })}>
        <div style={sectionHead}>
          <h2 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: 52, lineHeight: 1 }}>The Archive</h2>
          <span style={{ fontFamily: hand, fontSize: 30, color: terracotta }}>
            everything we record, kept for the next generation
          </span>
        </div>

        <div id="articles" style={col(28)}>
          <div style={subHead}>
            <h3 style={h3}>Articles &amp; Essays</h3>
            <Link href="/articles" style={seeAll}>
              SEE ALL
            </Link>
          </div>
          <div style={grid(280, 28)}>
            {articles.map((a) => (
              <Link key={a.kicker} href={a.href} style={col(12)}>
                <Photo id={a.photo} sizes="(max-width: 900px) 100vw, 400px" style={{ height: 260, background: a.bg }} />
                <span style={{ fontSize: 14, letterSpacing: "0.24em", color: "#4A4238" }}>{a.kicker}</span>
                <span style={cardTitle(28)}>{a.title}</span>
                <span style={{ fontSize: 17, color: "#5A4A3C" }}>By [Name] | [X] mins</span>
              </Link>
            ))}
          </div>
        </div>

        <div id="gallery" style={col(28)}>
          <div style={subHead}>
            <h3 style={h3}>Photography</h3>
            <Link href="/photography" style={seeAll}>
              SEE ALL
            </Link>
          </div>
          <div
            id="potw"
            style={col(16, {
              position: "relative",
              overflow: "hidden",
              background: "#4A3A2E",
              color: "#FFFFFF",
              minHeight: 560,
              justifyContent: "flex-end",
              padding: 40,
            })}
          >
            <Photo id="egret" sizes="(max-width: 1240px) 100vw, 1192px" style={{ position: "absolute", inset: 0 }} />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(20,16,12,0.8) 0%, rgba(20,16,12,0.35) 45%, rgba(20,16,12,0) 75%)",
              }}
            />
            <span style={{ position: "relative", fontSize: 16, letterSpacing: "0.3em", color: "#F1E6D6" }}>PHOTO OF THE WEEK</span>
            <span
              style={{
                position: "relative",
                fontFamily: display,
                fontWeight: 600,
                fontSize: "clamp(44px, 6vw, 80px)",
                lineHeight: 0.95,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              [Photo title]
            </span>
            <p style={{ position: "relative", margin: 0, maxWidth: 640, fontSize: 20, color: "#F7F1E8" }}>
              [Two or three sentences about who or what is in the photo and the story behind it.]
            </p>
          </div>
          <div style={grid(200, 14)}>
            {(["beachCrows", "palmGrove", "clearLake", "hillsideWater"] as const).map((id) => (
              <Link key={id} href={id === "hillsideWater" ? "/photography/gallery/wildlife-and-land" : "/photography/gallery/coast-and-lakes"}>
                <Photo id={id} sizes="(max-width: 900px) 50vw, 300px" style={{ height: 220, background: "#D9D3C7" }} />
              </Link>
            ))}
          </div>
        </div>

        <div id="documentaries" style={col(28)}>
          <div style={subHead}>
            <h3 style={h3}>Documentaries</h3>
            <a href={links.youtube} style={seeAll}>
              WATCH ON YOUTUBE
            </a>
          </div>
          <div style={grid(280, 28)}>
            {(["lakeRocks", "palmFence"] as const).map((id) => (
              <Link key={id} href="/videos" style={col(12)}>
                <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#3E4A3A" }}>
                  <Photo id={id} sizes="(max-width: 900px) 100vw, 600px" style={{ position: "absolute", inset: 0 }} />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Play />
                  </div>
                </div>
                <span style={cardTitle(26)}>[Documentary title]</span>
              </Link>
            ))}
          </div>
        </div>

        <div id="artefacts" style={col(28)}>
          <div style={subHead}>
            <h3 style={h3}>Artefacts</h3>
            <Link href="/artefacts" style={seeAll}>
              SEE ALL
            </Link>
          </div>
          <div style={grid(220, 28)}>
            {artefacts.map((a) => (
              <Link key={a.slug} href={`/artefacts#${a.slug}`} style={col(10)}>
                <Photo id={a.photo} sizes="(max-width: 900px) 100vw, 400px" style={{ height: 240, background: "#EBD9B4" }} />
                <span style={{ fontFamily: display, fontWeight: 600, fontSize: 24 }}>{a.name}</span>
                <span style={{ fontSize: 16, color: "#5A4A3C" }}>
                  {a.community} · {a.county}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section id="involved" style={{ background: forest, color: "#FFFFFF" }}>
        <div style={col(32, { maxWidth: 1000, margin: "0 auto", padding: "96px 24px" })}>
          <div style={col(14)}>
            <h2 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: 52, lineHeight: 1 }}>Get Involved</h2>
            <div style={{ width: 120, height: 2, background: "#B8954A" }} />
          </div>
          <h3 id="events" style={{ margin: 0, fontSize: 18, letterSpacing: "0.24em", fontWeight: 500, color: "#E8D3A8" }}>
            EVENTS WE HOST
          </h3>
          <div style={col(0, { borderTop: "1px solid #5B6A5F" })}>
            {[
              { day: "[DD]", daySize: 48, month: "[MON]", kicker: "[EVENT TYPE]", title: "[Event name]", meta: "[Place] · [Time]", cta: "REGISTER", href: "/contact?topic=event" },
              { day: "•", daySize: 40, month: "ONGOING", kicker: "COMPETITIONS & CLUBS", title: "[Competition theme]", meta: "Online and in schools", cta: "JOIN", href: "/events/competitions-clubs" },
            ].map((e) => (
              <div
                key={e.cta}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "16px 36px",
                  padding: "26px 0",
                  borderBottom: "1px solid #5B6A5F",
                }}
              >
                <div style={col(0, { alignItems: "center", minWidth: 80, lineHeight: 1 })}>
                  <span style={{ fontFamily: display, fontWeight: 600, fontSize: e.daySize }}>{e.day}</span>
                  <span style={{ fontSize: 16, letterSpacing: "0.14em", color: "#E8D3A8" }}>{e.month}</span>
                </div>
                <div style={col(2, { flex: "1 1 360px", minWidth: 0 })}>
                  <span style={{ fontSize: 15, letterSpacing: "0.14em", color: "#E8D3A8" }}>{e.kicker}</span>
                  <span style={cardTitle(30)}>{e.title}</span>
                  <span style={{ color: "#E9EDE4" }}>{e.meta}</span>
                </div>
                <Link
                  href={e.href}
                  style={{
                    fontSize: 17,
                    letterSpacing: "0.08em",
                    border: "1px solid #FFFFFF",
                    padding: "11px 24px",
                    minHeight: 48,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {e.cta}
                </Link>
              </div>
            ))}
          </div>
          <div
            id="contribute"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 18,
              background: "#3A4A3D",
              padding: 28,
            }}
          >
            <div style={col(4, { flex: "1 1 420px", minWidth: 0 })}>
              <span style={{ fontFamily: display, fontWeight: 600, fontSize: 30 }}>Contribute to Gae</span>
              <span style={{ color: "#E9EDE4" }}>
                Photographers, writers, researchers and knowledge-holders: share a story or photograph with us.
              </span>
            </div>
            <Link
              href="/contribute"
              style={{
                fontSize: 17,
                letterSpacing: "0.08em",
                background: "#FFFFFF",
                color: "#1C1C1A",
                padding: "12px 26px",
                minHeight: 48,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              SUBMIT YOUR WORK
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" style={{ background: "#34432F", color: "#FFFFFF" }}>
        <div style={col(18, { maxWidth: 1000, margin: "0 auto", padding: "88px 24px", alignItems: "center", textAlign: "center" })}>
          <h2
            style={{
              margin: 0,
              fontFamily: "'EB Garamond', serif",
              fontWeight: 600,
              fontSize: "clamp(30px, 3.6vw, 44px)",
              letterSpacing: "0.16em",
              lineHeight: 1.2,
            }}
          >
            STORIES FROM HOME, IN YOUR INBOX
          </h2>
          <p style={{ margin: 0, maxWidth: 640, fontSize: 22, color: "#EEF2E9" }}>
            New stories, photographs and event invites from across Africa. Free, once a month.
          </p>
          <form style={col(12, { width: "100%", marginTop: 10 })}>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your email address"
              style={{
                width: "100%",
                minHeight: 60,
                padding: "0 20px",
                border: 0,
                background: "#FFFFFF",
                color: "#1C1C1A",
                fontFamily: "'EB Garamond', serif",
                fontSize: 20,
              }}
            />
            <button
              type="button"
              style={{
                width: "100%",
                minHeight: 64,
                border: 0,
                background: "#E9C46A",
                color: "#1C1C1A",
                fontFamily: "'EB Garamond', serif",
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: "0.3em",
                cursor: "pointer",
              }}
            >
              SIGN UP
            </button>
          </form>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ background: "#FBF8F1" }}>
        <div style={col(56, { maxWidth: 900, margin: "0 auto", padding: "104px 24px" })}>
          <div style={{ borderBottom: "1.5px solid #1C1C1A", paddingBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: 52, lineHeight: 1 }}>About Gae</h2>
          </div>
          <div id="mission" style={grid(300, 24)}>
            {missionVision.map((b) => (
              <InfoCard key={b.kicker} {...b} />
            ))}
          </div>
          <div id="founders" style={col(40)}>
            <h3 style={{ margin: 0, fontSize: 16, letterSpacing: "0.24em", fontWeight: 500, color: terracotta }}>
              OUR FOUNDERS · IN HONOUR OF OUR DAD
            </h3>
            {founders.map((f) => (
              <div key={f.name} style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
                <Photo id={f.photo} decorative sizes="180px" style={{ flex: "0 0 180px", height: 230, background: f.bg, borderRadius: "999px 999px 8px 8px" }} />
                <div style={col(6, { flex: "1 1 400px", minWidth: 0 })}>
                  <span style={{ fontFamily: display, fontWeight: 600, fontSize: 34, lineHeight: 1.1 }}>{f.name}</span>
                  <span style={{ fontStyle: "italic", color: terracotta }}>{f.role}</span>
                  <p style={{ margin: "8px 0 0", color: "#4A4238" }}>[Short bio, 60 to 100 words.]</p>
                </div>
              </div>
            ))}
          </div>
          <div id="ethics" style={col(14)}>
            <h3 style={{ margin: 0, fontSize: 16, letterSpacing: "0.24em", fontWeight: 500, color: terracotta }}>OUR ETHICS</h3>
            <div style={grid(300, 24)}>
              {ethics.map((e) => (
                <InfoCard key={e.kicker} {...e} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section id="support" style={{ background: terracotta, color: "#FFFFFF" }}>
        <div style={col(24, { maxWidth: 900, margin: "0 auto", padding: "96px 24px", alignItems: "center", textAlign: "center" })}>
          <h2 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: "clamp(44px, 5vw, 64px)", lineHeight: 1.02 }}>
            Help us gather the pieces.
          </h2>
          <p style={{ margin: 0, fontSize: 22, maxWidth: 620 }}>
            Every trip, interview and photograph is made possible by people like you.
          </p>
          <div style={{ width: "100%", maxWidth: 640, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a
              href={links.buyMeACoffee}
              style={{
                flex: "1 1 240px",
                fontSize: 18,
                letterSpacing: "0.16em",
                background: "#FFFFFF",
                color: "#1C1C1A",
                minHeight: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              BUY US A COFFEE
            </a>
            <Link
              href="/support#donate"
              style={{
                flex: "1 1 240px",
                fontSize: 18,
                letterSpacing: "0.16em",
                border: "2px solid #FFFFFF",
                minHeight: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              DONATE
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({ kicker, text }: { kicker: string; text: string }) {
  return (
    <div style={col(10, { background: "#FFFFFF", padding: 32 })}>
      <span style={{ fontSize: 16, letterSpacing: "0.24em", color: terracotta }}>{kicker}</span>
      <span style={{ fontFamily: display, fontWeight: 500, fontSize: 28, lineHeight: 1.3 }}>{text}</span>
    </div>
  );
}
