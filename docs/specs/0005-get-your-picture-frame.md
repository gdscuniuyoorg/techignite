# 0005. Get Your Picture photo frame

**Date**: 2026-11-11
**Status**: In Progress

## Summary

Add a public page at `/get-your-picture` where an attendee uploads a photo,
sees it placed inside the official "I Will Be Attending" frame artwork, and
downloads the framed result as a PNG.

The frame artwork lives at `public/images/template.jpg` (1280x1280 JPEG). The
white panel inside it is the photo slot. Everything runs in the browser: the
photo is never uploaded to a server.

## Context

- The event ships a square social frame artwork with a white panel where a
  person puts their face. The panel is not a plain rectangle: it has a large
  rounded top left corner, and the black and green checker squares of the
  mosaic are drawn on top of it.
- The artwork sits in `public/`, so it is served from the same origin as the
  site. That matters: a canvas that draws it stays untainted, so `toBlob`
  works and the download is a real file, not a broken preview.
- The site is a TanStack Start app with full document SSR. The compositing is
  canvas work, so it must only run in the browser.

## Requirements

**User stories**:

- As an attendee, I want to drop in my photo and see the framed result right
  away, so I know it looks right before I share it.
- As an attendee, I want to download the framed picture, so I can post it.
- As an attendee, I want my photo to stay on my device, so I am comfortable
  uploading my face to a conference website.

**Acceptance criteria**:

- **AC-1**: `/get-your-picture` renders a hero, a live preview canvas, a drop
  zone, a file picker, and a download control. It is reachable from the
  primary nav and the footer.
- **AC-2**: The page has its own title, meta description, canonical link, Open
  Graph and Twitter card tags, and a BreadcrumbList, via the shared SEO table
  in `src/lib/seo.ts`. It appears in `sitemap.xml` and `llms.txt`.
- **AC-3**: The uploaded photo is scaled and cropped so it fills the white
  panel completely. A cover crop is used: portrait photos lose top and bottom,
  landscape photos lose their sides, and neither is squashed.
- **AC-4**: The composite keeps the artwork intact. The rounded corner, the
  black checker squares and the green squares stay on top of the photo, and the
  small decorative white square of the mosaic stays white.
- **AC-5**: The panel is located in the artwork by flood filling the bright
  pixels from the centre of the panel, not by hardcoding a rectangle. A change
  to the artwork that moves the panel does not need a code change.
- **AC-6**: The download produces a 1280x1280 PNG named
  `techignite-26-my-picture.png`, and the file is a valid image.
- **AC-7**: Only JPG, PNG and WebP are accepted, and only up to 15 MB. Anything
  else is refused with an inline message, and the page stays usable.
- **AC-8**: The photo is never sent anywhere. The artwork is fetched once and
  reused, and the composite is produced entirely in the browser.
- **AC-9**: The preview canvas shows the bare frame artwork before any photo is
  chosen, so the panel is never an empty black box.
- **AC-10**: `bun run check` passes with zero errors, `bun run build`
  succeeds, `bun run smoke` passes, and `bun run test` passes.

## Decision

**Everything happens in the browser.** No server route, no storage, no
upload endpoint. An attendee's photo is personal, and a conference site has no
business hoarding it. The cost is that the artwork must be maskable at
runtime, which the flood fill handles.

**The panel is found by flood fill, not by a hardcoded rectangle.** The
artwork's panel has a rounded corner and mosaic squares sitting on top of it,
so a rectangle would either clip the corner or bury the squares. Flood filling
the bright pixels from the centre of the panel yields exactly the region the
photo should occupy, and the artwork's own luminance then fades the photo in
along the edges so the corner and the square edges stay crisp.

**The photo is composited, not pasted.** The artwork is drawn first, then each
pixel of the photo is blended over it using an opacity derived from the
artwork's luminance at that pixel. Bright artwork pixels (the panel) take the
photo fully, dark pixels (the mosaic squares) take none of it, and the pixels
in between (the antialiased edges) take a proportion. This keeps the frame
looking hand made rather than cut out.

**Slot geometry is verified against the file, not guessed.** The pure white
bounding box of the panel in `template.jpg` is x 423 to 860 and y 433 to 870,
which is the 438 by 438 slot recorded as `PHOTO_SLOT` in
`src/lib/photo-frame.ts`.

### Implementation skills

- `src/lib/photo-frame.ts` holds the geometry and the pixel work. The pure
  parts (cover crop, mask opacity, flood fill, dilation) are exported and unit
  tested. The browser parts (canvas compositing, artwork fetching) are thin
  wrappers over them.
- `src/features/get-picture/components/photo-frame-studio.tsx` holds the
  upload, preview and download UI.
- `src/features/get-picture/components/get-picture-hero.tsx` holds the page
  hero.
- `src/routes/get-your-picture.tsx` is the route.

## Build plan

1. `src/lib/photo-frame.ts` with the slot constants, the cover crop, the mask
   opacity ramp, the flood fill, the dilation, the canvas composite and the
   artwork loader.
2. `src/features/get-picture/components/` with the hero and the studio.
3. `src/routes/get-your-picture.tsx`, the route tree regenerated.
4. SEO entry in `src/lib/seo.ts`, plus the nav and footer links.
5. Tests in `scripts/photo-frame.test.mjs` against a fixture exported from the
   real artwork, plus the fixture build script.

## Consequences

- The artwork and the slot constants must agree. A change to the artwork
  needs `node scripts/build-photo-frame-fixture.mjs` re-run, and the mask
  tests then prove the panel is still found correctly.
- The composite costs one flood fill over 438 by 438 pixels and one pass over
  the same area. That runs in a few milliseconds, well inside a frame budget
  for a user triggered action.
- Large photos are decoded in the browser, so a 15 MB upload costs memory.
  The cap keeps that bounded.

## Follow-up

- The frame currently has no caption. The artwork reserves a white bar under
  the panel for a name, and adding a text field that renders into it is a
  natural next slice.
- A server side render is not needed, but a shared preview image of the empty
  frame would help the social card for this route.
