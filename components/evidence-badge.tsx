import { evidenceLevels, type EvidenceLevel } from "@/lib/evidence";

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  return (
    <span className={`evidence-badge evidence-${level}`}>
      {evidenceLevels[level].label}
    </span>
  );
}
