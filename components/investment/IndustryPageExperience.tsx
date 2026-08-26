import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Layers3, Sparkles } from "lucide-react";
import { PackageCard } from "@/components/investment/PackageCard";
import {
  generatedIndustryImageIds,
  getIndustryPageContent,
} from "@/data/industry-page-content";
import type { Industry } from "@/types/industry";
import type { IndustryPackage } from "@/types/industry-package";

interface IndustryPageExperienceProps {
  industry: Industry;
  packages: IndustryPackage[];
}

export function IndustryPageExperience({
  industry,
  packages,
}: IndustryPageExperienceProps) {
  const content = getIndustryPageContent(industry.id);
  const hasGeneratedHeroImage = generatedIndustryImageIds.includes(
    industry.id as (typeof generatedIndustryImageIds)[number]
  );
  const imagePath = `/images/industries/${industry.id}.png`;

  return (
    <article className="min-h-screen bg-bg-deep">
      <section className="relative isolate overflow-hidden border-b border-border-hairline">
        <div className="absolute inset-0 -z-20 bg-blueprint-grid opacity-50" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-bg-deep via-bg-deep/85 to-accent/10" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.85fr)] lg:items-center lg:gap-16 lg:px-12 lg:pb-28 lg:pt-40">
          <div>
            <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
              <Link href="/" className="transition-colors hover:text-text-primary">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/investment" className="transition-colors hover:text-text-primary">Investment</Link>
              <span aria-hidden="true">/</span>
              <span className="text-accent">{industry.name}</span>
            </nav>

            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">{content.eyebrow}</p>
            <h1 className="max-w-3xl font-sans text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-7xl">
              {content.headline}
            </h1>
            <p className="mt-7 max-w-2xl font-sans text-base leading-relaxed text-text-secondary sm:text-lg">
              {content.intro}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center gap-3 rounded-sm border border-accent bg-accent px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep">
                Start a build <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/investment" className="inline-flex items-center gap-3 rounded-sm border border-border-hairline px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-primary transition-colors hover:border-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep">
                All industries
              </Link>
            </div>
          </div>

          <div
            className="relative aspect-[4/3] overflow-hidden rounded-card border border-border-hairline bg-bg-elevated shadow-card-hover"
            data-asset-status={hasGeneratedHeroImage ? "generated" : "placeholder-pending"}
          >
            {hasGeneratedHeroImage ? (
              <Image
                src={imagePath}
                alt={`${industry.name} digital experience visual`}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgb(62_123_250_/_0.22),transparent_24%),linear-gradient(135deg,#070910_0%,#0f1931_48%,#0a0a0b_100%)]"
                role="img"
                aria-label={`${industry.name} hero visual placeholder pending final asset generation`}
              >
                <div className="absolute inset-0 bg-blueprint-grid opacity-60" aria-hidden="true" />
                <div className="absolute bottom-7 right-7 h-32 w-32 rounded-full border border-accent/30 shadow-[0_0_60px_rgb(62_123_250_/_0.25)]" aria-hidden="true" />
                <div className="absolute bottom-14 right-14 h-16 w-16 rounded-full border border-accent/50" aria-hidden="true" />
                <div className="absolute left-6 top-6 max-w-[180px]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Visual study pending</p>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-text-secondary">The page is content-complete. The final industry hero image will be swapped in after the next generation quota reset.</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">{industry.category}</p>
                <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-white">{content.deliveryNote}</p>
              </div>
              <Sparkles className="shrink-0 text-accent" size={22} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12 lg:py-24" aria-labelledby="outcome-heading">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">The HAFYN approach</p>
          <h2 id="outcome-heading" className="max-w-lg font-sans text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">{content.outcome}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {content.useCases.map((useCase) => (
            <div key={useCase} className="rounded-card border border-border-hairline bg-bg-elevated p-5">
              <Check size={18} className="mb-8 text-accent" aria-hidden="true" />
              <p className="font-sans text-sm leading-relaxed text-text-secondary">{useCase}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border-hairline bg-bg-primary/40" aria-labelledby="packages-heading">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">{industry.name} packages</p>
              <h2 id="packages-heading" className="font-sans text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Choose the system your next stage needs.</h2>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
              <Layers3 size={16} className="text-accent" aria-hidden="true" />
              {packages.length} packages · one engineering standard
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label={`${industry.name} package options`}>
            {packages.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-20">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">Ready when you are</p>
          <h2 className="mt-3 max-w-2xl font-sans text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Tell us what your business needs to run better.</h2>
        </div>
        <Link href="/contact" className="inline-flex shrink-0 items-center gap-3 rounded-sm border border-text-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-primary transition-colors hover:bg-text-primary hover:text-bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep">
          Start a conversation <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-12">
        <Link href="/investment" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary transition-colors hover:text-text-primary">
          <ArrowLeft size={14} aria-hidden="true" /> Back to investment
        </Link>
      </div>
    </article>
  );
}
