export interface Pact {
  client: string;
  provider: string;
  totalAmount: bigint;
  fundedAmount: bigint;
  releasedAmount: bigint;
  state: number;
  title: string;
  description: string;
  createdAt: bigint;
  deadline: bigint;
  milestoneCount: bigint;
}

export interface Milestone {
  pactId: bigint;
  index: bigint;
  title: string;
  description: string;
  amount: bigint;
  state: number;
  createdAt: bigint;
  submittedAt: bigint;
  completedAt: bigint;
  deliverableHash: Uint8Array | null;
}

export interface Arbiter {
  stake: bigint;
  disputesResolved: bigint;
  registeredAt: bigint;
  active: boolean;
}

export interface Dispute {
  pactId: bigint;
  raisedBy: string;
  reason: string;
  state: number;
  votesClient: bigint;
  votesProvider: bigint;
  totalVotes: bigint;
  createdAt: bigint;
  resolvedAt: bigint;
}

export interface Reputation {
  score: bigint;
  pactsCompleted: bigint;
  milestonesDelivered: bigint;
  disputesWon: bigint;
  disputesLost: bigint;
  joinedAt: bigint;
}

export interface ProtocolStats {
  totalPacts: bigint;
  completedPacts: bigint;
  totalVolume: bigint;
}
