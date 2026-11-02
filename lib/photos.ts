import type { StaticImageData } from "next/image";

import coastVillage from "@/public/photos/coast-village-thatched-houses.jpg";
import mossBark from "@/public/photos/moss-and-lichen-on-bark.jpg";
import dugoutCanoes from "@/public/photos/dugout-canoes-papyrus-shore.jpg";
import boatman from "@/public/photos/boatman-in-papyrus-channel.jpg";
import gantryCranes from "@/public/photos/old-gantry-cranes-with-birds.jpg";
import mossForest from "@/public/photos/moss-draped-forest-tree.jpg";
import beachCrows from "@/public/photos/crows-on-beach-fence-at-dusk.jpg";
import egret from "@/public/photos/egret-on-boat-bow.jpg";
import clearLake from "@/public/photos/clear-lake-shallows-pebbles.jpg";
import palmFence from "@/public/photos/coconut-palm-beach-fence.jpg";
import palmGrove from "@/public/photos/palm-grove-white-sand.jpg";
import sausageTree from "@/public/photos/sausage-tree-kigelia.jpg";
import lonePalm from "@/public/photos/lone-palm-in-open-field.jpg";
import grassHillside from "@/public/photos/tussock-grass-hillside.jpg";
import vervet from "@/public/photos/vervet-monkey.jpg";
import riftView from "@/public/photos/rift-valley-view-from-ridge.jpg";
import longonot from "@/public/photos/mt-longonot-summit-sign.jpg";
import forestPath from "@/public/photos/forest-path-under-canopy.jpg";
import kingfisher from "@/public/photos/pied-kingfisher-lakeside-fence.jpg";
import muralWall from "@/public/photos/beach-palms-mural-wall.jpg";
import river from "@/public/photos/brown-river-after-rain.jpg";
import lakeRocks from "@/public/photos/lake-shore-rocks-headland.jpg";
import hillsideWater from "@/public/photos/green-hillside-over-water.jpg";

export type PhotoInfo = {
  src: StaticImageData;
  alt: string;
  /** CSS object-position used when the photo is cropped to fit a frame. */
  focus?: string;
};

/**
 * Every photograph on the site, by a short id. Files live in /public/photos
 * (renamed, resized and stripped of location metadata). To add one, drop the
 * file in that folder, import it here and give it a clear alt text.
 */
export const photos = {
  coastVillage: { src: coastVillage, alt: "Thatched houses along a sandy lane under coconut palms" },
  mossBark: { src: mossBark, alt: "Close-up of moss and pale lichen growing on tree bark" },
  dugoutCanoes: { src: dugoutCanoes, alt: "Wooden dugout canoes moored on a muddy shore beside tall papyrus", focus: "50% 75%" },
  boatman: { src: boatman, alt: "A boatman with a long pole standing by dugout canoes in a papyrus-lined channel", focus: "50% 80%" },
  gantryCranes: { src: gantryCranes, alt: "Two rusted gantry cranes with birds perched along their beams under a cloudy sky" },
  mossForest: { src: mossForest, alt: "An old tree draped in hanging moss in a montane forest" },
  beachCrows: { src: beachCrows, alt: "Crows perched on a wooden fence along a white-sand beach at dusk" },
  egret: { src: egret, alt: "A white egret preening on the bow of a boat on a sunlit lake", focus: "45% 65%" },
  clearLake: { src: clearLake, alt: "Clear lake shallows over coloured pebbles, with swimmers and green hills beyond" },
  palmFence: { src: palmFence, alt: "A coconut palm leaning over a sandy beach path beside a driftwood fence" },
  palmGrove: { src: palmGrove, alt: "A grove of tall coconut palms on white sand" },
  sausageTree: { src: sausageTree, alt: "Branches of a sausage tree (Kigelia) with long fruits hanging against the sky" },
  lonePalm: { src: lonePalm, alt: "A lone palm tree and a bushy tree in an open green field at sunrise" },
  grassHillside: { src: grassHillside, alt: "Tussock grass and scrub on a steep green hillside" },
  vervet: { src: vervet, alt: "A vervet monkey resting its hands on a wooden plank", focus: "50% 45%" },
  riftView: { src: riftView, alt: "Looking down a scrub-covered ridge over a wide valley floor" },
  longonot: { src: longonot, alt: "The Mt Longonot summit sign, altitude 2,780 metres, above the Rift Valley", focus: "50% 55%" },
  forestPath: { src: forestPath, alt: "A red earth path through a tunnel of mossy trees" },
  kingfisher: { src: kingfisher, alt: "A pied kingfisher perched on an old concrete fence post by a lake", focus: "45% 50%" },
  muralWall: { src: muralWall, alt: "Coconut palms over a painted beach wall, with a man standing at its foot" },
  river: { src: river, alt: "A brown, full river between green banks under a blue sky" },
  lakeRocks: { src: lakeRocks, alt: "A calm lake with a hilly headland and rocks in the foreground" },
  hillsideWater: { src: hillsideWater, alt: "A bright green hillside rising straight out of choppy water" },
} satisfies Record<string, PhotoInfo>;

export type PhotoId = keyof typeof photos;

export function getPhoto(id: PhotoId): PhotoInfo {
  return photos[id];
}
