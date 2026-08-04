export interface OriginStoryStage {
  id: string;
  index: string;
  label: string;
  description: string;
}

export interface OriginStoryContent {
  sectionLabel: string;
  heading: string;
  founderVoice: string;
  body: readonly string[];
  principle: string;
  blueprint: {
    projectLabel: string;
    statusLabel: string;
    coreLabel: string;
    stages: readonly OriginStoryStage[];
    accessibleDescription: string;
  };
}

export interface StatementSection {
  id: "mission" | "vision";
  eyebrow: string;
  statement: string;
  supportingLine: string;
}

export interface MissionPrinciple {
  id: string;
  label: string;
  icon: "layers" | "shield" | "ban";
}

export interface EcosystemPreviewItem {
  id: string;
  name: string;
}

export interface EcosystemSubsidiary {
  id: string;
  name: string;
  focus: string;
}

export interface EcosystemDiagramContent {
  eyebrow: string;
  heading: string;
  supportingLine: string;
  root: {
    name: string;
    subtitle: string;
  };
  activeNode: {
    name: string;
    badge: string;
    subtitle: string;
  };
  subsidiaries: readonly EcosystemSubsidiary[];
  statusLabel: string;
  accessibleDescription: string;
}

/**
 * BuildStandard — one declaration + supporting tags per engineering standard.
 * icon: maps to a Lucide icon name for the visual indicator.
 * Not a checklist item — a declaration with evidence tags.
 */
export interface BuildStandard {
  id: string;
  declaration: string;
  tags: readonly string[];
  icon: "zap" | "shield" | "layers" | "cpu" | "brain" | "anchor";
}
