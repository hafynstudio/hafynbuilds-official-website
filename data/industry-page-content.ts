import type { IndustryVisualTheme } from "@/types/industry";

export interface IndustryPageContent {
  eyebrow: string;
  headline: string;
  intro: string;
  outcome: string;
  useCases: string[];
  deliveryNote: string;
  visualTheme: IndustryVisualTheme;
}

/**
 * Industry-specific positioning only. Package scope and pricing remain in the
 * existing industry-packages and industry-package-pricing data sources.
 */
export const industryPageContent: Record<string, IndustryPageContent> = {
  restaurant: {
    eyebrow: "Digital systems for hospitality",
    headline: "A restaurant website that keeps tables moving.",
    intro: "Your menu, reservations, location, and next great service should work together. We build restaurant experiences that make the decision to visit feel immediate — on the phone, between bookings, and after closing time.",
    outcome: "Turn hungry visitors into reservations, enquiries, and repeat guests.",
    useCases: ["Menus that are easy to scan on mobile", "Reservation and WhatsApp journeys built around service hours", "Local discovery pages for locations, events, and specials"],
    deliveryNote: "Built around the way your front-of-house team actually operates.",
    visualTheme: "warm",
  },
  "cafe-coffee-shop": {
    eyebrow: "Digital systems for cafés",
    headline: "Make your café the place people look up first.",
    intro: "A café is atmosphere, ritual, and neighbourhood memory. We translate that feeling into a fast digital home for your menu, story, locations, loyalty moments, and the next reason to drop in.",
    outcome: "Give regulars a reason to return and new customers a reason to choose you.",
    useCases: ["Menu and location experiences that feel as considered as the space", "Event, loyalty, and community content that can be updated", "Local search foundations for every café location"],
    deliveryNote: "Brand-first design with practical tools for busy café teams.",
    visualTheme: "warm",
  },
  "bakery-pastry": {
    eyebrow: "Digital systems for bakeries",
    headline: "Let every order start with something worth craving.",
    intro: "Seasonal menus change quickly, custom orders need clarity, and the best products deserve more than a flat list. We build bakery and patisserie sites that make discovery, pre-ordering, and collection feel effortless.",
    outcome: "Showcase the craft while giving customers a clear path to order.",
    useCases: ["Product and seasonal collection showcases", "Custom-order and pre-order enquiry flows", "Wholesale and celebration-cake journeys with the right context"],
    deliveryNote: "Image-led presentation backed by dependable ordering paths.",
    visualTheme: "warm",
  },
  "catering-events-food": {
    eyebrow: "Digital systems for caterers",
    headline: "Make your next event enquiry feel already understood.",
    intro: "Catering decisions are made on confidence: menu range, capacity, service style, and proof. We structure those answers into a site that helps hosts, venues, and corporate buyers move from inspiration to a useful brief.",
    outcome: "Replace vague enquiries with better-qualified event conversations.",
    useCases: ["Event portfolio and menu storytelling", "Quote requests that capture date, guest count, and service needs", "Corporate and venue-facing paths for repeat business"],
    deliveryNote: "Built to reduce back-and-forth before your team sends a quote.",
    visualTheme: "warm",
  },
  "medical-clinic": {
    eyebrow: "Digital systems for patient trust",
    headline: "A clearer first step for every patient.",
    intro: "Patients want to know who will treat them, what to expect, and how to book without friction. We build calm, accessible clinic experiences that put services, clinicians, and appointment intent in the right order.",
    outcome: "Make trust visible before the first appointment.",
    useCases: ["Doctor and specialist profiles with useful context", "Appointment request journeys organised by service", "Patient education content that supports informed decisions"],
    deliveryNote: "Reassuring structure for practices where clarity matters.",
    visualTheme: "clean",
  },
  "dental-practice": {
    eyebrow: "Digital systems for dental care",
    headline: "Build confidence before the first smile.",
    intro: "Dental patients compare expertise, comfort, treatments, and outcomes. We turn that decision into a precise digital experience, from treatment explanations and before-and-after work to a booking action that is easy to find.",
    outcome: "Help the right patients understand the value of your practice sooner.",
    useCases: ["Treatment pages written for real patient questions", "Before-and-after presentation with clear context", "Booking and consultation journeys for different needs"],
    deliveryNote: "Professional, patient-first design without clinical jargon overload.",
    visualTheme: "clean",
  },
  pharmacy: {
    eyebrow: "Digital systems for pharmacies",
    headline: "Put trusted access to care one clear click away.",
    intro: "A pharmacy site has to balance speed, location, product discovery, and sensitive actions. We design the information architecture around what customers need now — opening hours, services, prescription support, and local access.",
    outcome: "Make essential pharmacy services easier to find and act on.",
    useCases: ["Location-first service and opening-hour journeys", "Product and health-service discovery", "Prescription, enquiry, and repeat-customer pathways"],
    deliveryNote: "Clear navigation for high-intent visits and everyday convenience.",
    visualTheme: "clean",
  },
  "physiotherapy-rehabilitation": {
    eyebrow: "Digital systems for recovery",
    headline: "Show people how progress begins.",
    intro: "People looking for physiotherapy need confidence in the process, the practitioner, and the next appointment. We build recovery-focused experiences that explain treatment clearly and turn uncertainty into a practical first step.",
    outcome: "Make your approach to treatment as understandable as your services.",
    useCases: ["Condition and treatment explainers", "Practitioner-led trust and recovery stories", "Session requests structured around the patient’s goal"],
    deliveryNote: "Calm, informative journeys for patients and referring professionals.",
    visualTheme: "clean",
  },
  hospital: {
    eyebrow: "Digital systems for hospitals",
    headline: "Make complex care easier to navigate.",
    intro: "Hospitals serve many audiences at once: patients, families, clinicians, departments, and partners. We build structured digital systems that make services, specialists, departments, and access points easier to understand.",
    outcome: "Turn a large care organisation into a clearer digital experience.",
    useCases: ["Department and service discovery", "Doctor directories and referral pathways", "Patient-first access to locations, contact, and appointment information"],
    deliveryNote: "Information architecture designed for scale, not just a homepage refresh.",
    visualTheme: "clean",
  },
  "accounting-firm": {
    eyebrow: "Digital systems for professional services",
    headline: "Make financial confidence easier to choose.",
    intro: "Clients are not buying a list of accounting services. They are choosing judgement, responsiveness, and a partner who understands the stakes. We build credibility-first sites that connect expertise to the next conversation.",
    outcome: "Turn expertise into qualified enquiries with less explanation.",
    useCases: ["Service pages built around client decisions", "Sector and capability proof that supports trust", "Enquiry paths that separate urgent needs from long-term advisory work"],
    deliveryNote: "Precise, professional presentation with a clear commercial path.",
    visualTheme: "professional",
  },
  "tutoring-centre": {
    eyebrow: "Digital systems for education",
    headline: "Help every learner find the right next lesson.",
    intro: "Parents and learners want to understand subjects, teachers, outcomes, and schedules quickly. We build tutoring experiences that make the offer legible and the enrolment journey feel personal rather than administrative.",
    outcome: "Turn learning goals into confident enrolment conversations.",
    useCases: ["Subject and programme discovery", "Tutor profiles and teaching approach", "Enquiry flows that capture level, goals, and preferred schedule"],
    deliveryNote: "Structured for families making high-consideration education decisions.",
    visualTheme: "clean",
  },
  "school-university": {
    eyebrow: "Digital systems for institutions",
    headline: "Make your institution easier to understand before the visit.",
    intro: "Students and families navigate a large number of questions before they apply: programmes, departments, culture, deadlines, and campus life. We create an organised digital front door that respects that journey.",
    outcome: "Give every prospective student a clearer route to belonging.",
    useCases: ["Admissions and programme information architecture", "Department, faculty, and campus storytelling", "Events and enquiry paths for applicants and families"],
    deliveryNote: "A scalable foundation for institutions with many audiences and pages.",
    visualTheme: "clean",
  },
  "hair-salon": {
    eyebrow: "Digital systems for beauty brands",
    headline: "Turn your best work into the next appointment.",
    intro: "A salon is chosen through visual confidence, personal fit, and convenience. We build portfolio-led experiences that make styles, services, team expertise, and booking intent work as one.",
    outcome: "Let the quality of your work do more of the selling.",
    useCases: ["Portfolio and stylist-led discovery", "Service and price-range clarity", "Fast booking and WhatsApp paths for high-intent visitors"],
    deliveryNote: "Editorial presentation with practical appointment conversion.",
    visualTheme: "elegant",
  },
  "beauty-spa": {
    eyebrow: "Digital systems for wellness spaces",
    headline: "Make the first visit feel like the right decision.",
    intro: "A spa experience begins before the treatment room. We build calm, image-led digital journeys that communicate atmosphere, treatments, practitioner confidence, and the simple action of booking.",
    outcome: "Translate a premium in-person experience into digital trust.",
    useCases: ["Treatment menus that explain the experience", "Atmosphere and space storytelling", "Booking and enquiry flows for new and returning clients"],
    deliveryNote: "A quiet, premium interface designed to reduce booking hesitation.",
    visualTheme: "elegant",
  },
  "general-contractor": {
    eyebrow: "Digital systems for the built environment",
    headline: "Make your next project easier to trust.",
    intro: "Construction buyers want evidence: what you build, how you work, where you operate, and whether your team can deliver. We create project-led digital experiences that turn capability into a credible conversation.",
    outcome: "Give serious prospects the proof they need before they request a quote.",
    useCases: ["Project portfolios organised by scope and outcome", "Service and coverage clarity", "Quote-request journeys for residential, commercial, and ongoing work"],
    deliveryNote: "Built around proof, process, and the realities of project-led sales.",
    visualTheme: "warm",
  },
  "real-estate-developer": {
    eyebrow: "Digital systems for property development",
    headline: "Give every development a stronger first impression.",
    intro: "Property decisions depend on confidence in the place, the plan, and the people behind it. We build development experiences that make listings, floor plans, amenities, investor information, and enquiries easy to navigate.",
    outcome: "Move interest from a listing glance to a serious property conversation.",
    useCases: ["Development and unit discovery", "Floor plans, amenities, and location storytelling", "Investor and buyer enquiry paths with different intent"],
    deliveryNote: "A visual system for properties that need both aspiration and clarity.",
    visualTheme: "warm",
  },
  "auto-repair-workshop": {
    eyebrow: "Digital systems for automotive service",
    headline: "Make the right repair feel easy to book.",
    intro: "When a vehicle needs attention, customers want speed, clarity, and confidence. We build workshop sites that organise services, symptoms, proof, availability, and contact around the urgent decision in front of the driver.",
    outcome: "Turn a stressful repair search into a clear service request.",
    useCases: ["Service menus organised by vehicle need", "Before-and-after proof and workshop credibility", "Appointment, quote, and WhatsApp paths for urgent enquiries"],
    deliveryNote: "Practical conversion design for drivers who need answers quickly.",
    visualTheme: "professional",
  },
  "hotel-boutique": {
    eyebrow: "Digital systems for hospitality stays",
    headline: "Make the stay start before check-in.",
    intro: "Guests choose a stay through atmosphere, confidence, and the details that make a visit feel worth it. We build hotel and boutique-stay experiences that bring rooms, amenities, location, and direct-booking intent together.",
    outcome: "Turn browsing into a confident direct enquiry or booking.",
    useCases: ["Room and suite storytelling", "Amenity, experience, and location discovery", "Direct-booking and enquiry journeys that protect the brand experience"],
    deliveryNote: "A considered digital front desk for independent stays and boutique properties.",
    visualTheme: "elegant",
  },
  "travel-agency": {
    eyebrow: "Digital systems for travel planning",
    headline: "Make the next journey easier to imagine.",
    intro: "Travellers need inspiration first, then reassurance: what is included, how the itinerary works, and who will help when plans change. We build travel experiences that move naturally from destination discovery to a useful enquiry.",
    outcome: "Turn destination interest into better-qualified travel conversations.",
    useCases: ["Destination and itinerary storytelling", "Package discovery organised around traveller intent", "Enquiry flows that capture dates, style, group, and budget context"],
    deliveryNote: "Designed for travel brands that sell confidence as much as access.",
    visualTheme: "elegant",
  },
  "logistics-courier": {
    eyebrow: "Digital systems for logistics",
    headline: "Make your operational reach visible.",
    intro: "Logistics buyers want to know where you go, what you move, how reliably you operate, and how to start a conversation. We build B2B-facing experiences that turn coverage, fleet, service levels, and enquiry into one clear system.",
    outcome: "Help the right commercial lead understand your capability faster.",
    useCases: ["Coverage and service-area discovery", "Fleet and delivery capability storytelling", "Contract and quote enquiry paths for business customers"],
    deliveryNote: "Built to communicate operational confidence without burying the buyer in detail.",
    visualTheme: "professional",
  },
};

export const generatedIndustryImageIds = [
  "restaurant",
  "cafe-coffee-shop",
  "bakery-pastry",
  "catering-events-food",
  "medical-clinic",
  "dental-practice",
  "pharmacy",
  "physiotherapy-rehabilitation",
  "hospital",
  "accounting-firm",
  "tutoring-centre",
  "school-university",
  "hair-salon",
  "beauty-spa",
  "general-contractor",
] as const;

export const pendingIndustryImageIds = [
  "real-estate-developer",
  "travel-agency",
  "hotel-boutique",
  "logistics-courier",
  "auto-repair-workshop",
] as const;

export function getIndustryPageContent(industryId: string): IndustryPageContent {
  return industryPageContent[industryId] ?? {
    eyebrow: "Digital systems for ambitious businesses",
    headline: "A digital system built around how you work.",
    intro: "We turn the way your business operates into a clear, credible, and conversion-ready digital experience.",
    outcome: "Make the next step easier for the people you serve.",
    useCases: ["Clear service and offer architecture", "A responsive experience for every device", "A reliable path from first visit to enquiry"],
    deliveryNote: "Built with the same engineering standard as every HAFYN BUILDS engagement.",
    visualTheme: "professional",
  };
}
