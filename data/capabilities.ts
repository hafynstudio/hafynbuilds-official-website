import type { Capability } from "@/types/capability";

/**
 * The 5 core capability disciplines of HAFYN BUILDS (PRD §2.2.4).
 * AI Systems carries isFeatured:true — this is the data signal that
 * drives the bento grid's 2×2 featured cell on the Home teaser AND the
 * first "compile sequence" on the Capabilities page (Phase 8).
 * displayOrder controls render sequence on both pages; isFeatured
 * controls layout size on Home only (Capabilities page renders all 5 in
 * displayOrder, none "featured" — every sequence gets equal weight in
 * the horizontal terminal timeline).
 *
 * codeLines / statusSteps / fileName / deployedLabel were added in
 * Phase 8. codeLines for "ai-systems" is preserved character-for-character
 * from the original CapabilitiesTeaser.tsx AI_CODE_LINES constant — moving
 * this array here (rather than leaving it hardcoded in the component) is
 * itself a Phase 8 fix: content was previously baked into a component,
 * which the Master Prompt's data-architecture rule explicitly forbids.
 * FeaturedCard now reads capability.codeLines — Home's rendered output
 * is unchanged.
 */
export const capabilities: Capability[] = [
  {
    id: "ai-systems",
    name: "AI Systems",
    shortDescription:
      "Intelligent agents, LLM integrations, and AI-native products built for production — not demos.",
    icon: "Brain",
    isFeatured: true,
    displayOrder: 1,
    fileName: "agent.ts",
    codeLines: [
      "const agent = new HafynAgent({",
      "  model: 'gpt-4o',",
      "  tools: [searchWeb, writeCode],",
      "  memory: PersistentMemory,",
      "});",
      "",
      "await agent.deploy({ env: 'production' });",
      "// ✓ Agent live — production monitored",
    ],
    statusSteps: [
      "Initializing agent runtime...",
      "Loading tools: searchWeb, writeCode...",
      "Running safety checks...",
      "✓ Deployed — production monitored",
    ],
    deployedLabel: "Live agent — reasoning in production",
  },
  {
    id: "web-apps",
    name: "Web Apps",
    shortDescription:
      "Full-stack applications engineered for speed, scale, and zero technical debt.",
    icon: "Globe",
    isFeatured: false,
    displayOrder: 2,
    fileName: "dashboard.tsx",
    codeLines: [
      "export function Dashboard() {",
      "  const { data } = useQuery(GET_METRICS);",
      "",
      "  return (",
      "    <Layout>",
      "      <MetricsGrid data={data} />",
      "    </Layout>",
      "  );",
      "}",
    ],
    statusSteps: [
      "Compiling components...",
      "Optimizing bundle size...",
      "Running Lighthouse checks...",
      "✓ Deployed to production",
    ],
    deployedLabel: "Live dashboard — real-time metrics",
  },
  {
    id: "software-saas",
    name: "Software & SaaS",
    shortDescription:
      "Multi-tenant platforms and SaaS products built to grow with your business.",
    icon: "Layers",
    isFeatured: false,
    displayOrder: 3,
    fileName: "platform.ts",
    codeLines: [
      "const tenant = await Tenant.create({",
      "  plan: 'growth',",
      "  isolation: 'schema',",
      "});",
      "",
      "await tenant.provision();",
      "// ✓ Tenant provisioned in 1.4s",
    ],
    statusSteps: [
      "Provisioning tenant infrastructure...",
      "Applying schema isolation...",
      "Running migration checks...",
      "✓ Platform live",
    ],
    deployedLabel: "Multi-tenant platform — 3 tenants active",
  },
  {
    id: "automation",
    name: "Automation",
    shortDescription:
      "Business process automation that eliminates manual work and compounds over time.",
    icon: "Workflow",
    isFeatured: false,
    displayOrder: 4,
    fileName: "pipeline.ts",
    codeLines: [
      "const flow = new Workflow()",
      "  .on('webhook.received')",
      "  .transform(normalizePayload)",
      "  .route(byCondition)",
      "  .run();",
      "",
      "// ✓ Pipeline registered",
    ],
    statusSteps: [
      "Registering triggers...",
      "Validating transform logic...",
      "Testing routing conditions...",
      "✓ Pipeline live",
    ],
    deployedLabel: "Automation pipeline — running 24/7",
  },
  {
    id: "enterprise-solutions",
    name: "Enterprise Solutions",
    shortDescription:
      "Large-scale, security-first systems built for regulated industries and complex organisations.",
    icon: "Building2",
    isFeatured: false,
    displayOrder: 5,
    fileName: "architecture.ts",
    codeLines: [
      "const system = new EnterpriseArchitecture({",
      "  compliance: ['ISO27001', 'SOC2', 'GDPR'],",
      "  redundancy: 'multi-region',",
      "});",
      "",
      "await system.harden();",
      "// ✓ Architecture certified",
    ],
    statusSteps: [
      "Applying security hardening...",
      "Verifying compliance controls...",
      "Load-testing failover...",
      "✓ Architecture certified",
    ],
    deployedLabel: "Enterprise-grade — multi-region, compliant",
  },
];
