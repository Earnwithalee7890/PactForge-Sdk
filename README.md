# PactForge SDK

The **PactForge SDK** is a type-safe TypeScript library for interacting with the PactForge Protocol on the Stacks blockchain. It abstracts away the complexity of making Clarity smart contract calls, formatting `ClarityValues`, and handling Stacks network configurations.

---

## 📦 Installation

Since this SDK is currently maintained in a GitHub repository, you can install it directly via Git or by linking it locally:

```bash
npm install github:Earnwithalee7890/PactForge-Sdk
```

*Note: Requires `@stacks/transactions`, `@stacks/network`, and `@stacks/common` as peer dependencies.*

---

## 🚀 Quick Start

Initialize the `PactForgeClient` to get access to all protocol modules. By default, it connects to the Stacks Mainnet.

```typescript
import { PactForgeClient } from 'pactforge-sdk';

const pactforge = new PactForgeClient();

// Fetch total protocol stats
const stats = await pactforge.pacts.getProtocolStats("SP_YOUR_PRINCIPAL...");
console.log(`Total Pacts: ${stats.totalPacts}`);
```

If you need to connect to a different network (e.g., Testnet), you can pass a custom network instance:

```typescript
import { StacksTestnet } from '@stacks/network';

const testnetClient = new PactForgeClient(new StacksTestnet());
```

---

## 📖 Modules

The SDK is divided into 5 core modules matching the protocol's smart contracts:

1. `pacts` (Core Escrow Engine)
2. `milestones` (Milestone Tracking)
3. `arbitration` (Dispute DAO)
4. `reputation` (Soul-Bound Tokens)
5. `token` (PFG Governance Token)

---

### 1. Pacts Module (`pactforge.pacts`)

Manages the lifecycle of an escrow agreement.

#### Read-Only Functions

```typescript
// Fetch details of a specific pact
const pact = await pactforge.pacts.getPact(1n, "SP_SENDER...");
console.log(pact?.state); // e.g., 0 for Created, 1 for Funded, etc.
```

#### Transactions
The SDK generates options objects that can be passed directly to `@stacks/connect-react`'s `doContractCall` method.

```typescript
import { useConnect } from '@stacks/connect-react';

const { doContractCall } = useConnect();

// Generate transaction options
const txOptions = pactforge.pacts.createPactOptions(
  "SP_PROVIDER_ADDRESS...", // Provider
  1000000n,                 // 1 STX (in micro-STX)
  "Website Redesign",       // Title
  "Frontend Development",   // Description
  150000n,                  // Deadline (Stacks block height)
  3n                        // Milestone count
);

// Prompt the wallet
await doContractCall({
  ...txOptions,
  onFinish: data => console.log(data),
});
```

Available transaction methods:
- `createPactOptions(...)`
- `fundPactOptions(...)`
- `acceptPactOptions(...)`
- `releasePaymentOptions(...)`
- `cancelPactOptions(...)`
- `raiseDisputeOptions(...)`

---

### 2. Milestones Module (`pactforge.milestones`)

Manages partial deliverables within a pact.

```typescript
// Provider submits a milestone deliverable with a 32-byte hash
const hash = new Uint8Array([...]); // Generate your hash buffer
const options = pactforge.milestones.submitMilestoneOptions(1n, hash);

// Client approves the submitted milestone
const approveOptions = pactforge.milestones.approveMilestoneOptions(1n);
```

Available transaction methods:
- `addMilestoneOptions(...)`
- `startMilestoneOptions(...)`
- `submitMilestoneOptions(...)`
- `approveMilestoneOptions(...)`
- `rejectMilestoneOptions(...)`

---

### 3. Arbitration Module (`pactforge.arbitration`)

Interacts with the Arbiter DAO for dispute resolution.

```typescript
// Fetch an arbiter's details
const arbiter = await pactforge.arbitration.getArbiter("SP_ARBITER...", "SP_SENDER...");
console.log(`Disputes Resolved: ${arbiter?.disputesResolved}`);

// Register to become an arbiter (requires staking STX)
const registerOptions = pactforge.arbitration.registerArbiterOptions();

// Vote on an active dispute (true = client wins, false = provider wins)
const voteOptions = pactforge.arbitration.voteDisputeOptions(disputeId, true);
```

---

### 4. Reputation Module (`pactforge.reputation`)

Reads soul-bound reputation scores.

```typescript
// Fetch complete reputation profile
const rep = await pactforge.reputation.getReputation("SP_USER...", "SP_SENDER...");
console.log(`Score: ${rep?.score}, Pacts Completed: ${rep?.pactsCompleted}`);

// Fetch just the tier number (0=Unranked, 1=Bronze, 2=Silver, 3=Gold, 4=Diamond)
const tier = await pactforge.reputation.getReputationTier("SP_USER...", "SP_SENDER...");
```

---

### 5. Token Module (`pactforge.token`)

Interacts with the PFG (PactForge Governance) token.

```typescript
// Get token balance
const balance = await pactforge.token.getBalance("SP_USER...", "SP_SENDER...");
```

---

## 🧩 Types and Constants

The SDK exports all necessary TypeScript interfaces representing Clarity tuples, as well as useful state constants.

```typescript
import { 
  PACT_STATES, 
  MILESTONE_STATES, 
  Pact, 
  Milestone 
} from 'pactforge-sdk';

if (pact.state === PACT_STATES.COMPLETED) {
  console.log("Pact is finished!");
}
```

## 🛠️ Building Locally

```bash
# Clone the repository
git clone https://github.com/Earnwithalee7890/PactForge-Sdk.git

# Install dependencies
npm install

# Build the project (outputs to /dist)
npm run build
```

## 📄 License
MIT License
