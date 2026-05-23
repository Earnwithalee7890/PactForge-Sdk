import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  stringUtf8CV,
  uintCV,
  bufferCV,
  ContractCallOptions,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { CONTRACTS, PACTFORGE_DEPLOYER } from '../constants';
import { Milestone } from '../types';

export class MilestonesModule {
  private network: StacksNetwork;

  constructor(network: StacksNetwork) {
    this.network = network;
  }

  // --- Transactions ---

  public addMilestoneOptions(
    pactId: bigint,
    title: string,
    description: string,
    amount: bigint
  ): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.MILESTONES,
      functionName: 'add-milestone',
      functionArgs: [uintCV(pactId), stringUtf8CV(title), stringUtf8CV(description), uintCV(amount)],
      network: this.network,
    };
  }

  public startMilestoneOptions(milestoneId: bigint): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.MILESTONES,
      functionName: 'start-milestone',
      functionArgs: [uintCV(milestoneId)],
      network: this.network,
    };
  }

  public submitMilestoneOptions(milestoneId: bigint, deliverableHash: Uint8Array): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.MILESTONES,
      functionName: 'submit-milestone',
      functionArgs: [uintCV(milestoneId), bufferCV(deliverableHash)],
      network: this.network,
    };
  }

  public approveMilestoneOptions(milestoneId: bigint): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.MILESTONES,
      functionName: 'approve-milestone',
      functionArgs: [uintCV(milestoneId)],
      network: this.network,
    };
  }

  public rejectMilestoneOptions(milestoneId: bigint): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.MILESTONES,
      functionName: 'reject-milestone',
      functionArgs: [uintCV(milestoneId)],
      network: this.network,
    };
  }

  // --- Read-Only ---

  public async getMilestone(milestoneId: bigint, senderAddress: string): Promise<Milestone | null> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.MILESTONES,
      functionName: 'get-milestone',
      functionArgs: [uintCV(milestoneId)],
      network: this.network,
      senderAddress,
    });

    const json = cvToJSON(result);
    if (!json.value) return null;

    const data = json.value.value;
    return {
      pactId: BigInt(data['pact-id'].value),
      index: BigInt(data.index.value),
      title: data.title.value,
      description: data.description.value,
      amount: BigInt(data.amount.value),
      state: parseInt(data.state.value),
      createdAt: BigInt(data['created-at'].value),
      submittedAt: BigInt(data['submitted-at'].value),
      completedAt: BigInt(data['completed-at'].value),
      deliverableHash: data['deliverable-hash'].value ? Buffer.from(data['deliverable-hash'].value.replace('0x', ''), 'hex') : null,
    };
  }

  public async getPactMilestoneCount(pactId: bigint, senderAddress: string): Promise<bigint> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.MILESTONES,
      functionName: 'get-pact-milestone-count',
      functionArgs: [uintCV(pactId)],
      network: this.network,
      senderAddress,
    });
    const data = cvToJSON(result);
    return BigInt(data.value.count.value);
  }
}
