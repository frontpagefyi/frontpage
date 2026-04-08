"use client";

import { useState } from "react";
import { ColorSwatch } from "@/components/color-swatch";
import { TypeSpecimen } from "@/components/type-specimen";
import { WeightSpecimen } from "@/components/weight-specimen";
import { SpacingScale } from "@/components/spacing-scale";
import { RadiusScale } from "@/components/radius-scale";
import { ElevationScale } from "@/components/elevation-scale";
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

const tabs = [
  { id: "colors", label: "Colors", description: "Surface, text, accent, and brand color tokens. All OKLCH for perceptual uniformity." },
  { id: "typography", label: "Typography", description: "Three typefaces — sans, serif, mono — with weights and scale specimens." },
  { id: "spacing", label: "Spacing", description: "4px base grid. All spacing tokens are multiples of the base unit." },
  { id: "shape", label: "Shape & Depth", description: "Border radius tokens and shadow elevation levels." },
  { id: "components", label: "Components", description: "Core UI components built with the design tokens." },
] as const;

type TabId = (typeof tabs)[number]["id"];

function TabPanel({ id }: { id: TabId }) {
  switch (id) {
    case "colors":
      return (
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Surfaces</h3>
            <div className="grid grid-cols-5 gap-4">
              {surfaceColors.map((color) => (
                <ColorSwatch key={color.name} {...color} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Text</h3>
            <div className="grid grid-cols-4 gap-4">
              {textColors.map((color) => (
                <ColorSwatch key={color.name} {...color} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Accents</h3>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              {accentColors.map((color) => (
                <ColorSwatch key={color.name} {...color} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Brand Indigo</h3>
            <div className="grid grid-cols-11 gap-1.5">
              {indigoScale.map((color) => (
                <ColorSwatch key={color.name} {...color} />
              ))}
            </div>
          </div>
        </div>
      );

    case "typography":
      return (
        <div className="space-y-10">
          <div className="space-y-8">
            <TypeSpecimen
              family="Source Sans 3"
              cssClass="font-sans"
              description="Primary body typeface. UI text, paragraphs, labels."
            />
            <TypeSpecimen
              family="Source Serif 4"
              cssClass="font-serif"
              description="Heading typeface. Titles, post headings, display text."
            />
            <TypeSpecimen
              family="JetBrains Mono"
              cssClass="font-mono"
              description="Monospace. Code snippets, token values, technical content."
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Weights</h3>
            <WeightSpecimen family="Source Sans 3" cssClass="font-sans" />
            <WeightSpecimen family="Source Serif 4" cssClass="font-serif" />
            <WeightSpecimen family="JetBrains Mono" cssClass="font-mono" />
          </div>
        </div>
      );

    case "spacing":
      return <SpacingScale />;

    case "shape":
      return (
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Border Radius</h3>
            <RadiusScale />
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Elevation</h3>
            <ElevationScale />
          </div>
        </div>
      );

    case "components":
      return <ComponentShowcase />;
  }
}

export default function FoundationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("colors");
  const activeTabMeta = tabs.find((t) => t.id === activeTab)!;

  return (
    <main className="p-4 lg:p-8">
      <div className="mb-6">
        <h1
          className="font-serif text-3xl font-bold"
          style={{ lineHeight: "1.2", letterSpacing: "-0.025em" }}
        >
          Foundations
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          Design tokens powering the Frontpage design system.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile: horizontal pills */}
        <nav className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-bg-elevated text-text-primary"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Desktop: vertical sidebar */}
        <nav className="hidden lg:block w-44 shrink-0 sticky top-16 self-start">
          <ul className="space-y-0.5">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 text-[13px] rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-bg-elevated text-text-primary font-medium border-l-2 border-accent-secondary"
                      : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated/50"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          <div key={activeTab} className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">{activeTabMeta.label}</h2>
              <p className="text-sm text-text-muted mt-1">{activeTabMeta.description}</p>
            </div>
            <TabPanel id={activeTab} />
          </div>
        </div>
      </div>
    </main>
  );
}
