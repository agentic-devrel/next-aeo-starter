export const evidenceLevels = {
  standard: {
    label: "Web standard",
    description: "Established web behavior or a published technical standard.",
  },
  practice: {
    label: "Widely adopted practice",
    description: "Common implementation practice with broad operational use.",
  },
  emerging: {
    label: "Emerging convention",
    description: "A developing convention that is not a formal web standard.",
  },
  experiment: {
    label: "Experiment",
    description:
      "A hypothesis that requires measurement in the target environment.",
  },
} as const;

export type EvidenceLevel = keyof typeof evidenceLevels;
