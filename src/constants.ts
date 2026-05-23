// Mainnet Contract Addresses for PactForge Protocol
export const PACTFORGE_DEPLOYER = "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT";

export const CONTRACTS = {
  CORE: "pactcore",
  MILESTONES: "milestone-v2",
  ARBITER_DAO: "arbiter-dao-v4",
  REPUTATION: "reputation-sbt-v2",
  TOKEN: "pactforge",
} as const;

export const PACT_STATES = {
  CREATED: 0,
  FUNDED: 1,
  ACTIVE: 2,
  COMPLETED: 3,
  DISPUTED: 4,
  CANCELLED: 5,
  REFUNDED: 6,
} as const;

export const MILESTONE_STATES = {
  PENDING: 0,
  IN_PROGRESS: 1,
  SUBMITTED: 2,
  APPROVED: 3,
  REJECTED: 4,
  PAID: 5,
} as const;

export const DISPUTE_STATES = {
  OPEN: 0,
  VOTING: 1,
  RESOLVED_CLIENT: 2,
  RESOLVED_PROVIDER: 3,
  RESOLVED_SPLIT: 4,
} as const;
