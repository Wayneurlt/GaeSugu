import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import { isFocus, newPhotoFile, newPhotoId, processPhoto } from "@/lib/admin/photos";

describe("photo names", () => {
  it("makes a short readable id from the description, unique in the library", () => {
    assert.equal(newPhotoId("Elders under an acacia tree", new Set()), "eldersUnderAnAcaciaTree");
    assert.equal(newPhotoId("IMG_1234.JPG", new Set()), "img1234");
    assert.equal(newPhotoId("Egret", new Set(["egret", "egret2"])), "egret3");
    assert.equal(newPhotoId("", new Set()), "photo");
    assert.match(newPhotoId("2024 trip", new Set()), /^photo/);
  });

  it("makes a safe file name in the right folder", () => {
    assert.match(newPhotoFile("Elders at the market", "/media"), /^\/media\/elders-at-the-market-[a-z0-9]+\.jpg$/);
    assert.match(newPhotoFile("Ça va? Ñandú!", "/photos"), /^\/photos\/ca-va-nandu-[a-z0-9]+\.jpg$/);
  });

  it("only accepts focus points like '50% 20%'", () => {
    assert.equal(isFocus("50% 20%"), true);
    for (const bad of ["center", "50%", "50% 20%; color: red", 5]) assert.equal(isFocus(bad), false, String(bad));
  });
});

describe("processPhoto", () => {
  it("shrinks large photos, strips camera and location data, and makes a blur preview", async () => {
    const big = await sharp({ create: { width: 3000, height: 2000, channels: 3, background: { r: 170, g: 90, b: 60 } } })
      .withExif({ IFD0: { Copyright: "camera owner" } })
      .jpeg()
      .toBuffer();
    const out = await processPhoto(big);
    assert.deepEqual([out.width, out.height], [1600, 1067]);
    const meta = await sharp(out.data).metadata();
    assert.equal(meta.format, "jpeg");
    assert.equal(meta.exif, undefined);
    assert.match(out.blur, /^data:image\/jpeg;base64,/);
  });

  it("leaves small photos at their size", async () => {
    const small = await sharp({ create: { width: 800, height: 600, channels: 3, background: "#2f3b33" } }).png().toBuffer();
    const out = await processPhoto(small);
    assert.deepEqual([out.width, out.height], [800, 600]);
  });

  it("rejects files that are not photos", async () => {
    await assert.rejects(processPhoto(Buffer.from("not an image")));
  });
});
