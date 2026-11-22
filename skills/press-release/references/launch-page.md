# Launch page design

Take cues from [Google Skills](https://www.skills.google/) for the direct benefit, confident display type, breathing room, and recognizable visual moments. Use the product's own identity and the subject of the release to decide what the page should feel like. The opening should be something the reader can remember or repeat.

## First screen

- Aim for an opening banner that takes about two thirds of the initial viewport. Let the beginning of the article show below it when space allows. Use the proportion as a layout target and let the banner grow to fit its content on narrow screens.
- Give one short headline the strongest visual weight. Name what changes for the reader. Highlight the words that carry the benefit with weight, slant, or the accent color. Follow it with a short lead that puts the reader in the situation where the feature matters.
- Compose the headline, lead, and any visual as one scene. Give them room on desktop and keep the promise readable early on a phone. A striking opening can come from type alone, a single illustration, or a glimpse of the product that reads at a glance. Place code blocks, terminal output, JSON, and full interactive demos in the article after the opening use case gives them context.
- Use the real product name when it is known, or a descriptive title for an unnamed proposal. Put version, date, navigation, and action links on the page when they orient the reader or help them act.

## Typography and color

- Choose a display face with a point of view and a comfortable face for reading. Set distinct roles for display, section headings, body, and captions. A geometric sans such as Google Sans Flex can give a friendly launch the right energy. An editorial serif can give a more narrative release a stronger voice. Use size, weight, line breaks, and spacing deliberately. Use monospace for code and values that benefit from alignment.
- Choose a canvas, text color, and a principal accent that fit the product's identity or the world the feature belongs to. Apply the accent consistently to the highlighted phrase and meaningful actions. Set foreground and background together. Use surface changes to support the reading order.

## The article below

- Continue the opening promise through a concrete use case, what changes, and what the reader should know to use it. Let the story determine the section headings. Pair a wide editorial grid with a comfortable prose measure so paragraphs stay easy to read.
- Give a screenshot, illustration, comparison, or demo a specific claim to show. Put it next to the passage it supports. Let a static example carry the story when interaction adds little. Use cards for facts that benefit from side-by-side reading and reserve controls for actions readers can actually take.
- Review the first screen and the scroll on desktop and mobile. The headline and highlighted phrase should be what the reader notices first. The first useful example should reinforce the same benefit. If swapping the name would make the page fit an unrelated product, sharpen the copy and visual direction.

## Optional HTML starter

Start from [base.html](../assets/base.html) for a document-style page with a banner, a title, and one reading column. Use Tailwind utilities for the layout and copy the daisyUI components below where they help. Spend the design effort on the headline, cover, type, palette, and the transition into the article.

Copy the base to your working folder and replace the example copy and title. Keep `<!-- release:styles -->` in the head. Use `product` for Google Sans Flex and Source Sans 3, or `editorial` for Fraunces and Source Sans 3. Choose the pair that fits the product. Set product colors in the source's theme variables if needed.

```sh
node /path/to/press-release/scripts/build-launch.mjs source.html announcement.html editorial
```

The [builder](../scripts/build-launch.mjs) needs Node and npm. It compiles Tailwind and daisyUI from the source and bundles the CSS and selected fonts in the finished HTML. Open the result directly to review it. Keep any additional images or scripts embedded when the deliverable must work offline.

### Optional background textures

Use a texture when it adds a visual idea that belongs to this release. Add `data-release-texture` to the banner or to a section in the source before running the builder. A plain surface is the starting point.

| Preset | Visual treatment |
| --- | --- |
| `streaks` | Scattered short strokes that suggest direction or movement. |
| `contours` | Organic contour lines for terrain, depth, or layers. |
| `dotted-waves` | Dotted curves that suggest a field or a flow. |
| `instrument` | Wide arcs, ticks, and alignment marks for an instrument-panel mood. |

```html
<header data-release-texture="streaks" style="--release-texture-opacity: 0.18">
  <!-- Existing banner content -->
</header>
```

The pattern uses the release's primary color. Override it with `--release-texture-color` and set strength with `--release-texture-opacity`. The pattern fades behind the copy. Use `--release-texture-clear-x` and `--release-texture-clear-y` to move the quiet area if the headline is centered or right-aligned. The builder embeds the selected textures for offline use.

### Copy-ready components

Use these within the flow of the article. A badge can identify a real version, a card can group a compact example, and a button can link to a real next step. Replace the sample labels and destinations.

```html
<span class="badge badge-outline">v1.0</span>

<a class="btn btn-primary" href="#example">Ver el ejemplo</a>

<figure id="example" class="card my-8 border border-base-300 bg-base-200">
  <div class="card-body">
    <h3 class="card-title font-display">Un caso de uso</h3>
    <p>Muestra qué cambia al usar la feature en esta situación.</p>
  </div>
</figure>

<details class="collapse collapse-arrow my-5 border border-base-300">
  <summary class="collapse-title font-semibold">Una pregunta práctica del lector</summary>
  <div class="collapse-content"><p>Una respuesta concreta.</p></div>
</details>
```

Typography reference [Material Design 3](https://m3.material.io/styles/typography/applying-type). Typeface reference [Making Google Sans Flex](https://design.google/library/google-sans-flex-font).
