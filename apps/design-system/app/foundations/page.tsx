import { ColorSwatch } from "@/components/color-swatch";
import { TypeSpecimen } from "@/components/type-specimen";
import { SpacingScale } from "@/components/spacing-scale";
import { RadiusScale } from "@/components/radius-scale";
import { WeightSpecimen } from "@/components/weight-specimen";
import { ElevationScale } from "@/components/elevation-scale";
import { ThemePreview } from "@/components/theme-preview";
import { ComponentShowcase } from "@/components/component-showcase";

const surfaceColors = [
  { name: "bg-base", value: "oklch(13.6% 0.02 270)", cssVar: "--color-bg-base" },
  { name: "bg-surface", value: "oklch(18% 0.018 270)", cssVar: "--color-bg-surface" },
  { name: "bg-elevated", value: "oklch(22% 0.016 270)", cssVar: "--color-bg-elevated" },
  { name: "bg-overlay", value: "oklch(26% 0.014 270)", cssVar: "--color-bg-overlay" },
  { name: "bg-interactive", value: "oklch(30% 0.012 270)", cssVar: "--color-bg-interactive" },
];

const textColors = [
  { name: "text-primary", value: "oklch(95% 0.005 270)", cssVar: "--color-text-primary" },
  { name: "text-secondary", value: "oklch(75% 0.02 270)", cssVar: "--color-text-secondary" },
  { name: "text-muted", value: "oklch(62% 0.025 270)", cssVar: "--color-text-muted" },
  { name: "text-inverse", value: "oklch(13.6% 0.02 270)", cssVar: "--color-text-inverse" },
];

const accentColors = [
  { name: "accent-primary", value: "oklch(75% 0.18 75)", cssVar: "--color-accent-primary" },
  { name: "accent-secondary", value: "oklch(55% 0.2 280)", cssVar: "--color-accent-secondary" },
  { name: "accent-success", value: "oklch(72% 0.19 150)", cssVar: "--color-accent-success" },
  { name: "accent-warning", value: "oklch(85% 0.16 85)", cssVar: "--color-accent-warning" },
  { name: "accent-destructive", value: "oklch(55% 0.22 25)", cssVar: "--color-accent-destructive" },
  { name: "accent-live", value: "oklch(60% 0.27 25)", cssVar: "--color-accent-live" },
];

const indigoScale = [
  { name: "50", value: "oklch(97.78% 0.0108 259)", cssVar: "--color-indigo-50" },
  { name: "100", value: "oklch(93.56% 0.0321 259)", cssVar: "--color-indigo-100" },
  { name: "200", value: "oklch(88.11% 0.0609 259)", cssVar: "--color-indigo-200" },
  { name: "300", value: "oklch(82.67% 0.0908 259)", cssVar: "--color-indigo-300" },
  { name: "400", value: "oklch(74.22% 0.1398 259)", cssVar: "--color-indigo-400" },
  { name: "500", value: "oklch(64.78% 0.1472 259)", cssVar: "--color-indigo-500" },
  { name: "600", value: "oklch(57.33% 0.1299 259)", cssVar: "--color-indigo-600" },
  { name: "700", value: "oklch(46.89% 0.1067 259)", cssVar: "--color-indigo-700" },
  { name: "800", value: "oklch(39.44% 0.0898 259)", cssVar: "--color-indigo-800" },
  { name: "900", value: "oklch(32% 0.0726 259)", cssVar: "--color-indigo-900" },
  { name: "950", value: "oklch(23.78% 0.054 259)", cssVar: "--color-indigo-950" },
];

export default function FoundationsPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold">Foundations</h1>
        <p className="text-text-muted mt-2">
          Design tokens powering the Frontpage design system. Colors use OKLCH
          for perceptual uniformity.
        </p>
      </div>

      {/* Surface Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Surface Colors</h2>
        <div className="grid grid-cols-5 gap-4">
          {surfaceColors.map((color) => (
            <ColorSwatch key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Text Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Text Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          {textColors.map((color) => (
            <ColorSwatch key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Accent Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Accent Colors</h2>
        <div className="grid grid-cols-6 gap-4">
          {accentColors.map((color) => (
            <ColorSwatch key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Indigo Scale */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Indigo Scale</h2>
        <div className="grid grid-cols-11 gap-2">
          {indigoScale.map((color) => (
            <ColorSwatch key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Community Themes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Community Themes</h2>
        <p className="text-sm text-text-muted">
          Communities can override CSS custom properties to create distinct
          visual identities while sharing the same component library.
        </p>
        <ThemePreview />
      </section>

      {/* Typography */}
      <section className="space-y-8">
        <h2 className="text-xl font-semibold">Typography</h2>
        <TypeSpecimen
          family="Source Sans 3"
          cssClass="font-sans"
          description="Primary body typeface. Used for all UI text, paragraphs, and labels."
        />
        <TypeSpecimen
          family="Source Serif 4"
          cssClass="font-serif"
          description="Heading typeface. Used for titles, post headings, and display text."
        />
        <TypeSpecimen
          family="JetBrains Mono"
          cssClass="font-mono"
          description="Monospace typeface. Used for code snippets, token values, and technical content."
        />
      </section>

      {/* Font Weights */}
      <section className="space-y-8">
        <h2 className="text-xl font-semibold">Font Weights</h2>
        <WeightSpecimen family="Source Sans 3" cssClass="font-sans" />
        <WeightSpecimen family="Source Serif 4" cssClass="font-serif" />
        <WeightSpecimen family="JetBrains Mono" cssClass="font-mono" />
      </section>

      {/* Spacing */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Spacing Scale</h2>
        <p className="text-sm text-text-muted">
          Based on a 4px grid. All spacing tokens are multiples of the base unit.
        </p>
        <SpacingScale />
      </section>

      {/* Radius */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Radius Scale</h2>
        <p className="text-sm text-text-muted">
          Border radius tokens for consistent rounding across components.
        </p>
        <RadiusScale />
      </section>

      {/* Elevation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Elevation Scale</h2>
        <p className="text-sm text-text-muted">
          Shadow levels for layering and depth. Higher levels indicate elements
          closer to the user.
        </p>
        <ElevationScale />
      </section>

      {/* Component Preview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Component Preview</h2>
        <p className="text-sm text-text-muted">
          Core components built with the design tokens above.
        </p>
        <ComponentShowcase />
      </section>
    </main>
  );
}
