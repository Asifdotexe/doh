# Design & UX Specification

## 1. Aesthetic Direction: Neo-Brutalism
We are completely avoiding glassmorphism, soft gradients, and standard generic UI (no Bootstrap/Tailwind defaults). The design will be bold, unapologetic, and highly contrast-driven. 

### Key Characteristics:
- **Borders:** Thick, stark black borders (e.g., `border: 3px solid #000;`) on buttons, cards, and input fields.
- **Shadows:** Hard, solid shadows rather than blurred drop-shadows (e.g., `box-shadow: 6px 6px 0px #000;`).
- **Colors:** High-saturation, unapologetic colors against harsh white or stark off-white backgrounds.
- **Typography:** Big, bold, and readable. Sans-serif (like Inter, Space Grotesk, or Clash Display) mixed with monospace accents.

## 2. Color Palette (Draft)
- **Background:** `#F4F4F0` (Stark off-white to reduce absolute eye strain while keeping high contrast).
- **Primary Accent (Do'h Yellow):** `#FFD000` (Used for primary buttons, active states).
- **Secondary Accent (Bubblegum Pink):** `#FF90E8` (Used for tags, secondary actions).
- **Tertiary Accent (Electric Blue):** `#3B82F6` (Used for links, hover states).
- **Text & Borders:** `#000000` (Pure black for maximum contrast and brutalist feel).

## 3. Typography
- **Headings:** Bold and oversized. (e.g., Space Grotesk or a brutalist standard).
- **Body:** Highly legible Sans-serif.
- **Tags/UI Labels:** Monospace (e.g., JetBrains Mono or Courier) for a raw, "terminal" feel.

## 4. Animation & Interaction
- **Feel:** "Zippy" and "Snappy."
- **Physics:** Spring-based animations with zero overshoot and very fast durations (e.g., 150ms).
- **Hover States:** Instead of color fades, elements should physically translate (e.g., button presses down, removing the hard shadow to simulate clicking).
- **Topic Generation:** When a user clicks "Spin Again," the text should snap out and snap in rapidly, perhaps with a subtle glitch or raw text scramble effect, avoiding generic cross-fades.

## 5. UI Layout
- Centered, focused view.
- **Header:** Logo ("Do'h") on the left, "Submit Topic" button on the right.
- **Main Area:** 
  - A pill-shaped tag indicating the category (e.g., `[ Science & Tech ]`).
  - A massive text block displaying the argument/topic.
  - A giant, unmissable button below it: "SPARK ANOTHER" or "NEXT".
- **Footer:** Minimal credits and GitHub repo link.
