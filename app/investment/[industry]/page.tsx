import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industries } from "@/data/industries";
import { generatedIndustryImageIds } from "@/data/industry-page-content";
import { getPackagesForIndustry } from "@/data/industry-packages";
import { getVisibleIndustries } from "@/lib/industries/provider";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";
import { IndustryPageExperience } from "@/components/investment/IndustryPageExperience";
import { JsonLd } from "@/components/seo/JsonLd";

interface IndustryPageProps {
  params: Promise<{ industry: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getVisibleIndustries().map((industry) => ({ industry: industry.id }));
}

export async function generateMetadata({
  params,
}: IndustryPageProps): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = industries.find((item) => item.id === slug);

  const generatedHero = industry && generatedIndustryImageIds.includes(
    industry.id as (typeof generatedIndustryImageIds)[number]
  );
  const routeOgImage = industry && generatedHero
    ? `/images/industries/${industry.id}.webp`
    : undefined;

  const seoCopy: Record<string, { title: string; description: string }> = {
    restaurant: { title: "Restaurant Websites & Digital Ordering", description: "Restaurant websites by HAFYN BUILDS with menus, table bookings, delivery journeys, and digital ordering designed around how guests discover and choose you." },
    "cafe-coffee-shop": { title: "Café & Coffee Shop Websites, Menus & Loyalty", description: "Build a café website that makes your menu, atmosphere, locations, and loyalty offer easy to explore. HAFYN BUILDS creates polished coffee shop experiences." },
    "bakery-pastry": { title: "Bakery & Pastry Websites for Custom Orders", description: "Show seasonal bakes, celebration cakes, custom orders, and collection times clearly. HAFYN BUILDS builds bakery websites that turn browsing into enquiries." },
    "catering-events-food": { title: "Catering Websites & Event Enquiry Systems", description: "Present menus, event packages, past work, and capacity clearly with a catering website built for qualified enquiries, quote requests, and confident decisions." },
    "medical-clinic": { title: "Medical Clinic Websites & Patient Booking", description: "Give patients a clear route to services, doctors, locations, and appointments. HAFYN BUILDS creates medical clinic websites with journeys and clear next steps." },
    "dental-practice": { title: "Dental Practice Websites & Online Booking", description: "Explain treatments, show patient outcomes, answer key questions, and make booking simple with a dental practice website designed for trust and conversion." },
    hospital: { title: "Hospital Websites & Patient Access Systems", description: "Organise departments, doctors, services, and patient information in a hospital website that makes essential care pathways easier to find and understand." },
    "physiotherapy-rehabilitation": { title: "Physiotherapy Websites & Recovery Bookings", description: "Explain treatment journeys, introduce practitioners, and support session booking with a physiotherapy website built for clarity, confidence, and patient care." },
    "hair-salon": { title: "Hair Salon Websites & Online Booking", description: "Show services, stylists, work, and availability in a hair salon website that helps clients choose confidently, discover your work, and book without friction." },
    "beauty-spa": { title: "Beauty Spa Websites & Treatment Booking", description: "Turn treatments, ambience, pricing, and availability into a clear beauty spa website that gives visitors the confidence to discover and book their next visit." },
    "real-estate-developer": { title: "Real Estate Developer Websites & Listings", description: "Present developments, floor plans, locations, and investment information through a real estate developer website built for serious buyers and enquiries." },
    "general-contractor": { title: "General Contractor Websites & Quote Requests", description: "Show project quality, service scope, sectors, and credentials with a general contractor website designed to earn better-fit quote requests from serious clients." },
    "school-university": { title: "School & University Websites & Admissions", description: "Make programmes, departments, admissions, events, and essential information easier to navigate with a school or university website built for every audience." },
    "tutoring-centre": { title: "Tutoring Centre Websites & Enrolment", description: "Present subjects, tutor expertise, programmes, and enrolment steps in a tutoring centre website that helps families find support and start with confidence." },
    pharmacy: { title: "Pharmacy Websites & Prescription Services", description: "Make products, prescription uploads, locations, and pharmacy services clear with a digital experience designed around trust, access, and local discovery." },
    "accounting-firm": { title: "Accounting Firm Websites for Qualified Leads", description: "Clarify services, sectors, expertise, and next steps with an accounting firm website built to establish credibility and generate better-qualified enquiries." },
    "travel-agency": { title: "Travel Agency Websites & Itinerary Planning", description: "Turn destinations, itineraries, expertise, and enquiry paths into a travel agency website that helps visitors imagine the journey and take the next step." },
    "hotel-boutique": { title: "Hotel Websites & Direct Booking Experiences", description: "Show rooms, amenities, and atmosphere through a hotel website designed to build confidence, encourage direct booking enquiries, and support discovery clearly." },
    "logistics-courier": { title: "Logistics & Courier Websites & Tracking", description: "Explain coverage, services, fleet capability, and contract enquiries with a logistics and courier website built for B2B decisions and qualified conversations." },
    "auto-repair-workshop": { title: "Auto Repair Websites & Service Booking", description: "Make repairs, servicing, availability, and trust signals clear with an auto repair website that turns local searches into booked work online for drivers." },
  };
  const copy = industry ? seoCopy[industry.id] : undefined;

  return buildMetadata({
    title: copy?.title ?? "Industry Not Found",
    description: copy?.description,
    ogImage: routeOgImage,
    path: `/investment/${slug}`,
  });
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { industry: slug } = await params;
  const industry = getVisibleIndustries().find((item) => item.id === slug);

  if (!industry) notFound();

  const packages = getPackagesForIndustry(industry.id);
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Investment", url: `${SITE_URL}/investment` },
    { name: industry.name, url: `${SITE_URL}/investment/${industry.id}` },
  ]);
  const serviceJsonLd = serviceSchema(industry);

  return (
    <>
      <JsonLd id="industry-breadcrumb-schema" data={breadcrumbJsonLd} />
      <JsonLd id="industry-service-schema" data={serviceJsonLd} />
      <IndustryPageExperience industry={industry} packages={packages} />
    </>
  );
}
